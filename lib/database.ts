import { supabase, Database } from './supabase'
import { generateUUID, isValidUUID, ensureUUID } from './uuid'

// Type aliases for easier use
export type Presentation = Database['public']['Tables']['presentations']['Row']
export type PresentationInsert = Database['public']['Tables']['presentations']['Insert']
export type PresentationUpdate = Database['public']['Tables']['presentations']['Update']

export type Slide = Database['public']['Tables']['slides']['Row']
export type SlideInsert = Database['public']['Tables']['slides']['Insert']
export type SlideUpdate = Database['public']['Tables']['slides']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']

// Legacy interface for compatibility with existing code
export interface DocumentData {
  id: string
  databaseId?: string // UUID for database operations
  prompt: string
  cardCount: number
  style: string
  language: string
  createdAt: string
  status: string
  outline?: any
  generatedSlides?: any[]
  contentLength?: string
  theme?: string
  imageStyle?: string
}

// Sync status for hybrid approach
export interface SyncStatus {
  lastSyncedAt: string
  hasLocalChanges: boolean
  isOnline: boolean
}

class DatabaseService {
  private syncInterval: NodeJS.Timeout | null = null
  private pendingSyncs = new Set<string>()

  // Start auto-sync every 30 seconds
  startAutoSync() {
    if (this.syncInterval) return
    
    this.syncInterval = setInterval(() => {
      this.syncAllPresentations()
    }, 30000) // 30 seconds
  }

  stopAutoSync() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval)
      this.syncInterval = null
    }
  }

  // ============ PRESENTATION METHODS ============

  async createPresentation(data: {
    id?: string  // Make ID optional
    prompt: string
    cardCount?: number
    style?: string
    language?: string
    contentLength?: string
    themeId?: string
    imageStyle?: string
  }): Promise<Presentation> {
    const id = data.id || generateUUID(); // Ensure ID is defined
    const presentationData: PresentationInsert = {
      id: id,
      user_id: null, // No auth yet, so set to null
      prompt: data.prompt,
      card_count: data.cardCount || 8,
      style: (data.style as any) || 'default',
      language: data.language || 'en',
      content_length: (data.contentLength as any) || 'medium',
      theme_id: data.themeId || 'default',
      image_style: data.imageStyle || null,
      status: 'draft'
    }

    // Try to save to Supabase first
    try {
      console.log('📝 Creating presentation in Supabase:', presentationData)
      
      const { data: presentation, error } = await supabase
        .from('presentations')
        .insert(presentationData)
        .select()
        .single()

      if (error) {
        console.error('❌ Supabase insert error:', error)
        throw error
      }

      console.log('✅ Successfully created presentation:', presentation)
      
      // Also save to localStorage as backup
      this.saveToLocalStorage(id, this.convertToDocumentData(presentation))
      
      return presentation
    } catch (error) {
      console.warn('Failed to save to Supabase, saving locally:', error)
      
      // Fallback to localStorage
      const documentData = this.convertToDocumentData({
        ...presentationData,
        id: id,
        user_id: null,
        title: 'Untitled Presentation',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        last_synced_at: new Date().toISOString()
      } as Presentation)
      
      this.saveToLocalStorage(id, documentData)
      this.markForSync(id)
      
      return presentationData as Presentation
    }
  }

  async getPresentation(id: string): Promise<Presentation | null> {
    try {
      // Try Supabase first
      const { data: presentation, error } = await supabase
        .from('presentations')
        .select(`
          *,
          slides (*)
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      if (presentation) {
        // Update localStorage with fresh data
        this.saveToLocalStorage(id, this.convertToDocumentData(presentation))
        return presentation
      }
    } catch (error) {
      console.warn('Failed to load from Supabase, trying localStorage:', error)
    }

    // Fallback to localStorage
    const localData = this.getFromLocalStorage(id)
    if (localData) {
      this.markForSync(id)
      return this.convertFromDocumentData(localData)
    }

    return null
  }

  async saveSlides(presentationId: string, slides: any[]): Promise<boolean> {
    if (!slides || slides.length === 0) {
      console.log('No slides to save for presentation:', presentationId)
      return true
    }

    // Filter out slides with non-UUID IDs and assign new UUIDs where needed
    const validSlides = slides.filter(slide => {
      // Keep slides that have content or other important properties
      return slide.content || slide.title || slide.bulletPoints || slide.imageUrl;
    });

    const slideDataToUpsert = validSlides.map((slide, index) => {
      // Ensure ID is a valid UUID, generate a new one if not
      const slideId = ensureUUID(slide.id);
      
      return {
        id: slideId,
        presentation_id: presentationId,
        content: slide.content || null,
        template_type: slide.templateType || 'default',
        position: index,
        title: slide.title || null,
        bullet_points: slide.bulletPoints || null,
        image_prompt: slide.imagePrompt || null,
        image_url: slide.imageUrl || null,
        is_generating_image: slide.isGeneratingImage || false,
        is_hidden: slide.isHidden || false,
        is_generating: slide.isGenerating || false,
        has_multiple_images: slide.hasMultipleImages || false,
        images_metadata: slide.imagesMetadata || null,
        primary_image_id: slide.primaryImageId || null
      };
    })

    try {
      const { error } = await supabase.from('slides').upsert(slideDataToUpsert, {
        onConflict: 'id',
      })

      if (error) {
        console.error('❌ Supabase slide upsert error:', error)
        throw error
      }

      console.log('✅ Successfully saved', slideDataToUpsert.length, 'slides for presentation:', presentationId)
      return true
    } catch (error) {
      console.warn('Failed to save slides to Supabase:', error)
      this.markForSync(presentationId)
      return false
    }
  }

  async updatePresentation(id: string, updates: PresentationUpdate): Promise<Presentation | null> {
    try {
      const { data: presentation, error } = await supabase
        .from('presentations')
        .update({
          ...updates,
          last_synced_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      // Re-fetch to get full data with slides and update localStorage correctly
      return this.getPresentation(id)
    } catch (error) {
      console.warn('Failed to update in Supabase, updating locally:', error)
      
      // Update localStorage
      const localData = this.getFromLocalStorage(id)
      if (localData) {
        const updatedData = { ...localData, ...updates }
        this.saveToLocalStorage(id, updatedData)
        this.markForSync(id)
      }
      
      return null
    }
  }

  async deletePresentation(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('presentations')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Remove from localStorage
      localStorage.removeItem(`document_${id}`)
      this.removeSyncMark(id)
      
      return true
    } catch (error) {
      console.warn('Failed to delete from Supabase:', error)
      
      // Mark as deleted locally (for sync later)
      localStorage.removeItem(`document_${id}`)
      localStorage.setItem(`deleted_${id}`, 'true')
      
      return false
    }
  }

  // ============ SLIDE METHODS ============

  async createSlide(slideData: SlideInsert): Promise<Slide | null> {
    try {
      const { data: slide, error } = await supabase
        .from('slides')
        .insert(slideData)
        .select()
        .single()

      if (error) throw error
      
      return slide
    } catch (error) {
      console.warn('Failed to create slide in Supabase:', error)
      this.markForSync(slideData.presentation_id)
      return null
    }
  }

  async updateSlide(id: string, updates: SlideUpdate): Promise<Slide | null> {
    try {
      const { data: slide, error } = await supabase
        .from('slides')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      return slide
    } catch (error) {
      console.warn('Failed to update slide in Supabase:', error)
      if (updates.presentation_id) {
        this.markForSync(updates.presentation_id)
      }
      return null
    }
  }

  async deleteSlide(id: string, presentationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('slides')
        .delete()
        .eq('id', id)

      if (error) throw error
      
      return true
    } catch (error) {
      console.warn('Failed to delete slide from Supabase:', error)
      this.markForSync(presentationId)
      return false
    }
  }

  // ============ SYNC METHODS ============

  private markForSync(presentationId: string) {
    this.pendingSyncs.add(presentationId)
    localStorage.setItem(`sync_pending_${presentationId}`, 'true')
  }

  private removeSyncMark(presentationId: string) {
    this.pendingSyncs.delete(presentationId)
    localStorage.removeItem(`sync_pending_${presentationId}`)
  }

  async syncPresentation(id: string): Promise<boolean> {
    if (!this.pendingSyncs.has(id)) {
      return true
    }

    const localData = this.getFromLocalStorage(id)
    if (!localData) {
      this.removeSyncMark(id)
      return true
    }

    console.log('🔄 Starting sync for presentation:', id)

    try {
      // 1. Sync presentation metadata
      await this.updatePresentation(id, this.convertFromDocumentData(localData))
      console.log('✅ Synced presentation metadata for:', id)

      // 2. Sync slides
      if (localData.generatedSlides) {
        await this.saveSlides(id, localData.generatedSlides)
        console.log('✅ Synced slides for:', id)
      }

      // 3. Fetch latest state to refresh localStorage
      await this.getPresentation(id)
      console.log('✅ Refreshed local data for:', id)

      this.removeSyncMark(id)
      console.log('🎉 Sync completed for presentation:', id)
      return true
    } catch (error) {
      console.error('❌ Sync failed for presentation:', id, error)
      return false
    }
  }

  async syncAllPresentations(): Promise<void> {
    const pendingIds = Array.from(this.pendingSyncs)
    await Promise.all(pendingIds.map(id => this.syncPresentation(id)))
  }

  // ============ HELPER METHODS ============

  private saveToLocalStorage(id: string, data: any) {
    try {
      localStorage.setItem(`document_${id}`, JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }

  private getFromLocalStorage(id: string): DocumentData | null {
    try {
      const stored = localStorage.getItem(`document_${id}`)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.warn('Failed to load from localStorage:', error)
      return null
    }
  }

  private convertToDocumentData(presentation: Presentation & { slides?: Slide[] }): DocumentData {
    return {
      id: presentation.id,
      prompt: presentation.prompt,
      cardCount: presentation.card_count,
      style: presentation.style,
      language: presentation.language,
      createdAt: presentation.created_at,
      status: presentation.status,
      outline: presentation.outline,
      generatedSlides: presentation.slides ? presentation.slides.map(s => ({
        id: s.id,
        templateType: s.template_type,
        title: s.title,
        content: s.content,
        bulletPoints: s.bullet_points,
        imagePrompt: s.image_prompt,
        imageUrl: s.image_url,
        isGeneratingImage: s.is_generating_image,
        isHidden: s.is_hidden,
        isGenerating: s.is_generating,
        hasMultipleImages: s.has_multiple_images,
        imagesMetadata: s.images_metadata,
        primaryImageId: s.primary_image_id,
        position: s.position
      })).sort((a, b) => (a.position ?? 0) - (b.position ?? 0)) : [],
      contentLength: presentation.content_length,
      theme: presentation.theme_id,
      imageStyle: presentation.image_style || undefined
    }
  }

  private convertFromDocumentData(documentData: DocumentData): Presentation {
    return {
      id: documentData.id,
      user_id: null,
      title: 'Untitled Presentation',
      prompt: documentData.prompt,
      card_count: documentData.cardCount,
      style: documentData.style as any,
      language: documentData.language,
      content_length: documentData.contentLength as any || 'medium',
      theme_id: documentData.theme || 'default',
      image_style: documentData.imageStyle || null,
      status: documentData.status as any,
      outline: documentData.outline,
      created_at: documentData.createdAt,
      updated_at: new Date().toISOString(),
      last_synced_at: new Date().toISOString()
    }
  }

  // ============ USER PROFILE METHODS ============

  async createProfile(user: { id: string; email: string; full_name?: string }): Promise<Profile | null> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email,
          full_name: user.full_name || null
        })
        .select()
        .single()

      if (error) throw error
      
      return profile
    } catch (error) {
      console.warn('Failed to create profile:', error)
      return null
    }
  }

  async getProfile(userId: string): Promise<Profile | null> {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', userId)
        .single()

      if (error) throw error
      
      return profile
    } catch (error) {
      console.warn('Failed to get profile:', error)
      return null
    }
  }

  async getUserPresentations(userId: string): Promise<Presentation[]> {
    try {
      const { data: presentations, error } = await supabase
        .from('presentations')
        .select(`
          *,
          slides!inner(count)
        `)
        .eq('user_id', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error
      
      return presentations || []
    } catch (error) {
      console.warn('Failed to get user presentations:', error)
      return []
    }
  }
}

// Export singleton instance
export const db = new DatabaseService()

// Auto-start sync when module loads
if (typeof window !== 'undefined') {
  db.startAutoSync()
  
  // Sync on page visibility change
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      db.syncAllPresentations()
    }
  })
  
  // Sync before page unload
  window.addEventListener('beforeunload', () => {
    db.syncAllPresentations()
  })
} 