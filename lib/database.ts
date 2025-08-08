import { supabase, Database } from './supabase'
import { generateUUID, isValidUUID, ensureUUID } from './uuid'
import { getAllPriceIds, getCreditAllocation } from './stripe-config'
import type { SupabaseClient } from '@supabase/supabase-js'

// Type aliases for easier use
export type Presentation = Database['public']['Tables']['presentations']['Row']
export type PresentationInsert = Database['public']['Tables']['presentations']['Insert']
export type PresentationUpdate = Database['public']['Tables']['presentations']['Update']

export type Slide = Database['public']['Tables']['slides']['Row']
export type SlideInsert = Database['public']['Tables']['slides']['Insert']
export type SlideUpdate = Database['public']['Tables']['slides']['Update']

export type Profile = Database['public']['Tables']['profiles']['Row']
export type CreditTransaction = Database['public']['Tables']['credit_transactions']['Row']
export type CreditTransactionInsert = Database['public']['Tables']['credit_transactions']['Insert']

// Assistant UI / Copilot types
export type CopilotThread = Database['public']['Tables']['copilot_threads']['Row']
export type CopilotThreadInsert = Database['public']['Tables']['copilot_threads']['Insert']
export type CopilotThreadUpdate = Database['public']['Tables']['copilot_threads']['Update']

export type CopilotMessage = Database['public']['Tables']['copilot_messages']['Row']
export type CopilotMessageInsert = Database['public']['Tables']['copilot_messages']['Insert']
export type CopilotMessageUpdate = Database['public']['Tables']['copilot_messages']['Update']

// Legacy interface for compatibility with existing code
export interface DocumentData {
  id: string
  databaseId?: string // UUID for database operations
  userId?: string | null
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
  enableBrowserSearch?: boolean
}

// Sync status for hybrid approach
export interface SyncStatus {
  lastSyncedAt: string
  hasLocalChanges: boolean
  isOnline: boolean
}

export class DatabaseService {
  private syncInterval: NodeJS.Timeout | null = null
  private pendingSyncs = new Set<string>()
  private supabaseClient: SupabaseClient<Database>

  constructor(supabaseClient?: SupabaseClient<Database>) {
    this.supabaseClient = supabaseClient || supabase
  }

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

  // ============ ASSISTANT UI / COPILOT METHODS ============

  // Create a new thread for a presentation
  async createThread(
    presentationId: string,
    title: string | null | undefined,
    userId: string
  ): Promise<string | null> {
    try {
      const threadId = generateUUID()
      const { error } = await this.supabaseClient
        .from('copilot_threads')
        .insert({
          id: threadId,
          presentation_id: presentationId,
          title: title || 'New conversation',
          user_id: userId
        })

      if (error) {
        console.error('Error creating thread:', error)
        return null
      }

      return threadId
    } catch (error) {
      console.error('Exception creating thread:', error)
      return null
    }
  }

  // Get all threads for a presentation
  async getThreads(
    presentationId: string,
    userId: string
  ): Promise<CopilotThread[] | null> {
    try {
      const { data, error } = await this.supabaseClient
        .from('copilot_threads')
        .select('*')
        .eq('presentation_id', presentationId)
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error getting threads:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Exception getting threads:', error)
      return null
    }
  }

  // Get a thread by ID
  async getThread(threadId: string): Promise<CopilotThread | null> {
    try {
      const { data, error } = await this.supabaseClient
        .from('copilot_threads')
        .select('*')
        .eq('id', threadId)
        .single()

      if (error) {
        console.error('Error getting thread:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Exception getting thread:', error)
      return null
    }
  }

  // Update a thread
  async updateThread(threadId: string, updates: CopilotThreadUpdate): Promise<boolean> {
    try {
      const { error } = await this.supabaseClient
        .from('copilot_threads')
        .update(updates)
        .eq('id', threadId)

      if (error) {
        console.error('Error updating thread:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Exception updating thread:', error)
      return false
    }
  }

  // Delete a thread and all its messages
  async deleteThread(threadId: string): Promise<boolean> {
    try {
      // First delete all messages in the thread
      const { error: messagesError } = await this.supabaseClient
        .from('copilot_messages')
        .delete()
        .eq('thread_id', threadId)

      if (messagesError) {
        console.error('Error deleting thread messages:', messagesError)
        return false
      }

      // Then delete the thread itself
      const { error } = await this.supabaseClient
        .from('copilot_threads')
        .delete()
        .eq('id', threadId)

      if (error) {
        console.error('Error deleting thread:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Exception deleting thread:', error)
      return false
    }
  }

  // Create a new message in a thread
  async createMessage(
    threadId: string,
    role: string,
    content: string,
    toolCalls?: any
  ): Promise<string | null> {
    try {
      const messageId = generateUUID()
      const { error } = await this.supabaseClient
        .from('copilot_messages')
        .insert({
          id: messageId,
          thread_id: threadId,
          role,
          content,
          tool_calls: toolCalls
        })

      if (error) {
        console.error('Error creating message:', error)
        return null
      }

      return messageId
    } catch (error) {
      console.error('Exception creating message:', error)
      return null
    }
  }

  // Get all messages for a thread
  async getMessages(threadId: string): Promise<CopilotMessage[] | null> {
    try {
      const { data, error } = await this.supabaseClient
        .from('copilot_messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error getting messages:', error)
        return null
      }

      return data
    } catch (error) {
      console.error('Exception getting messages:', error)
      return null
    }
  }

  // Update a message
  async updateMessage(messageId: string, updates: CopilotMessageUpdate): Promise<boolean> {
    try {
      const { error } = await this.supabaseClient
        .from('copilot_messages')
        .update(updates)
        .eq('id', messageId)

      if (error) {
        console.error('Error updating message:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Exception updating message:', error)
      return false
    }
  }

  // Delete a message
  async deleteMessage(messageId: string): Promise<boolean> {
    try {
      const { error } = await this.supabaseClient
        .from('copilot_messages')
        .delete()
        .eq('id', messageId)

      if (error) {
        console.error('Error deleting message:', error)
        return false
      }

      return true
    } catch (error) {
      console.error('Exception deleting message:', error)
      return false
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
    userId?: string | null  // Add optional userId parameter
    enableBrowserSearch?: boolean  // Add browser search parameter
  }): Promise<Presentation> {
    const id = data.id || generateUUID(); // Ensure ID is defined

    const presentationData: PresentationInsert = {
      id: id,
      user_id: data.userId || null, // Use provided userId
      prompt: data.prompt,
      card_count: data.cardCount || 8,
      style: (data.style as any) || 'default',
      language: data.language || 'en',
      content_length: (data.contentLength as any) || 'medium',
      theme_id: data.themeId || 'default',
      image_style: data.imageStyle || null,
      status: 'draft',
      enable_browser_search: data.enableBrowserSearch || false
    }

    // Try to save to Supabase first
    try {
      console.log('📝 Creating presentation in Supabase:', presentationData)

      const { data: presentation, error } = await this.supabaseClient
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
      const { data: presentation, error } = await this.supabaseClient
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
      const { error } = await this.supabaseClient.from('slides').upsert(slideDataToUpsert, {
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
      const { data: presentation, error } = await this.supabaseClient
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
      const { error } = await this.supabaseClient
        .from('presentations')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Remove from localStorage
      localStorage.removeItem(id)
      this.removeSyncMark(id)

      return true
    } catch (error) {
      console.warn('Failed to delete from Supabase:', error)

      // Mark as deleted locally (for sync later)
      localStorage.removeItem(id)
      localStorage.setItem(`deleted_${id}`, 'true')

      return false
    }
  }

  // ============ SLIDE METHODS ============

  async createSlide(slideData: SlideInsert): Promise<Slide | null> {
    try {
      const { data: slide, error } = await this.supabaseClient
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
      const { data: slide, error } = await this.supabaseClient
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
      const { error } = await this.supabaseClient
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
      localStorage.setItem(id, JSON.stringify(data))
    } catch (error) {
      console.warn('Failed to save to localStorage:', error)
    }
  }

  private getFromLocalStorage(id: string): DocumentData | null {
    try {
      const stored = localStorage.getItem(id)
      return stored ? JSON.parse(stored) : null
    } catch (error) {
      console.warn('Failed to load from localStorage:', error)
      return null
    }
  }

  private convertToDocumentData(presentation: Presentation & { slides?: Slide[] }): DocumentData {
    return {
      id: presentation.id,
      databaseId: presentation.id, // for consistency
      userId: presentation.user_id, // Add userId
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
      user_id: documentData.userId || null, // Use userId from local data
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
      enable_browser_search: documentData.enableBrowserSearch || false,
      created_at: documentData.createdAt,
      updated_at: new Date().toISOString(),
      last_synced_at: new Date().toISOString()
    }
  }

  // ============ SUBSCRIPTION CREDIT METHODS ============
  
  /**
   * Handle plan changes - allocate credits for upgrades
   */
  async handlePlanChange(userId: string, oldPriceId: string, newPriceId: string): Promise<boolean> {
    try {
      const oldCredits = getCreditAllocation(oldPriceId)
      const newCredits = getCreditAllocation(newPriceId)
      const isUpgrade = newCredits > oldCredits
      
      console.log('🔄 Processing plan change:', {
        userId,
        oldPriceId,
        newPriceId,
        oldCredits,
        newCredits,
        isUpgrade
      })
      
      if (isUpgrade) {
        // For upgrades, immediately allocate the credit difference
        const creditDifference = newCredits - oldCredits
        
        // Get current balance
        const { data: profile } = await this.supabaseClient
          .from('profiles')
          .select('credits_balance')
          .eq('id', userId)
          .single()
          
        if (profile) {
          const newBalance = (profile.credits_balance || 0) + creditDifference
          
          // Update credits
          const { error: updateError } = await this.supabaseClient
            .from('profiles')
            .update({
              credits_balance: newBalance,
              updated_at: new Date().toISOString()
            })
            .eq('id', userId)
            
          if (updateError) throw updateError
          
          // Record transaction
          const { error: transactionError } = await this.supabaseClient
            .from('credit_transactions')
            .insert({
              user_id: userId,
              action_type: 'plan_upgrade',
              credits_used: -creditDifference, // Negative = added credits
              credits_before: profile.credits_balance || 0,
              credits_after: newBalance,
              metadata: {
                old_price_id: oldPriceId,
                new_price_id: newPriceId,
                credit_difference: creditDifference
              }
            })
            
          if (transactionError) throw transactionError
          
          console.log(`✅ Added ${creditDifference} credits for plan upgrade`)
        }
      } else {
        console.log('⬇️ Downgrade detected - no immediate credit change')
      }
      
      return true
    } catch (error) {
      console.error('Failed to handle plan change:', error)
      return false
    }
  }

  async allocateSubscriptionCredits(userId: string, priceId: string, isRenewal: boolean = false): Promise<boolean> {
    try {
      // Get current profile
      const profile = await this.getProfile(userId)
      if (!profile) {
        console.error('Profile not found for user:', userId)
        return false
      }

      // Get credit allocation for this price ID (environment-aware)
      const creditsToAdd = getCreditAllocation(priceId)
      if (creditsToAdd === 0) {
        console.error('Unknown price ID:', priceId)
        return false
      }

      const currentBalance = profile.credits_balance || 0
      const newBalance = currentBalance + creditsToAdd

      // Update profile with new credits
      const { error: updateError } = await this.supabaseClient
        .from('profiles')
        .update({
          credits_balance: newBalance,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) {
        console.error('Error updating profile credits:', updateError)
        return false
      }

      // Create credit transaction record
      const { error: transactionError } = await this.supabaseClient
        .from('credit_transactions')
        .insert({
          user_id: userId,
          action_type: isRenewal ? 'subscription_renewal' : 'subscription_create',
          credits_used: -creditsToAdd, // Negative for credits added
          credits_before: currentBalance,
          credits_after: newBalance,
          metadata: {
            price_id: priceId,
            is_renewal: isRenewal
          }
        })

      if (transactionError) {
        console.error('Error creating credit transaction:', transactionError)
        // Don't fail the whole operation for transaction logging
      }

      console.log(`✅ Allocated ${creditsToAdd} credits to user ${userId} (${isRenewal ? 'renewal' : 'initial'})`)
      return true
    } catch (error) {
      console.error('Exception in allocateSubscriptionCredits:', error)
      return false
    }
  }

  async handleSubscriptionCancellation(userId: string): Promise<boolean> {
    try {
      // Get current profile
      const profile = await this.getProfile(userId)
      if (!profile) {
        console.error('Profile not found for user:', userId)
        return false
      }

      // Calculate remaining free credits (500 - used)
      const freeCreditsUsed = profile.free_credits_used || 0
      const remainingFreeCredits = Math.max(0, 500 - freeCreditsUsed)

      const currentBalance = profile.credits_balance || 0

      // Update profile to free plan with remaining free credits
      const { error: updateError } = await this.supabaseClient
        .from('profiles')
        .update({
          credits_balance: remainingFreeCredits,
          subscription_tier: 'free',
          subscription_status: 'canceled',
          stripe_customer_id: null,
          stripe_subscription_id: null,
          stripe_price_id: null,
          current_period_end: null,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

      if (updateError) {
        console.error('Error updating profile for cancellation:', updateError)
        return false
      }

      // Create credit transaction record
      const creditsDifference = remainingFreeCredits - currentBalance
      if (creditsDifference !== 0) {
        const { error: transactionError } = await this.supabaseClient
          .from('credit_transactions')
          .insert({
            user_id: userId,
            action_type: 'subscription_cancelled',
            credits_used: -creditsDifference, // Negative if credits were added, positive if removed
            credits_before: currentBalance,
            credits_after: remainingFreeCredits,
            metadata: {
              free_credits_used: freeCreditsUsed,
              remaining_free_credits: remainingFreeCredits
            }
          })

        if (transactionError) {
          console.error('Error creating cancellation transaction:', transactionError)
          // Don't fail the whole operation for transaction logging
        }
      }

      console.log(`✅ Handled cancellation for user ${userId}, reset to ${remainingFreeCredits} free credits`)
      return true
    } catch (error) {
      console.error('Exception in handleSubscriptionCancellation:', error)
      return false
    }
  }

  // Map Stripe price IDs to our internal subscription tier
  private getSubscriptionTierFromPriceId(priceId: string): string {
    const allPriceIds = getAllPriceIds()
    return allPriceIds[priceId] || 'free'
  }

  async updateSubscriptionStatus(userId: string, updates: {
    stripeCustomerId?: string
    stripeSubscriptionId?: string
    stripePriceId?: string
    subscriptionStatus?: string
    subscriptionTier?: string
    currentPeriodEnd?: string
    cancelAt?: string | null
  }): Promise<boolean> {
    try {
      const updateData: any = {
        updated_at: new Date().toISOString()
      }

      if (updates.stripeCustomerId !== undefined) updateData.stripe_customer_id = updates.stripeCustomerId
      if (updates.stripeSubscriptionId !== undefined) updateData.stripe_subscription_id = updates.stripeSubscriptionId
      if (updates.stripePriceId !== undefined) {
        updateData.stripe_price_id = updates.stripePriceId
        // Set the subscription tier based on the price ID
        updateData.subscription_tier = this.getSubscriptionTierFromPriceId(updates.stripePriceId)
      }
      if (updates.subscriptionStatus !== undefined) {
        // This is the Stripe subscription status (active, canceled, etc.)
        updateData.subscription_status = updates.subscriptionStatus
      }
      if (updates.subscriptionTier !== undefined) {
        // This allows manual override of the tier if needed
        updateData.subscription_tier = updates.subscriptionTier
      }
      if (updates.currentPeriodEnd !== undefined) updateData.current_period_end = updates.currentPeriodEnd
      if (updates.cancelAt !== undefined) updateData.cancel_at = updates.cancelAt

      const { error } = await this.supabaseClient
        .from('profiles')
        .update(updateData)
        .eq('id', userId)

      if (error) {
        console.error('Error updating subscription status:', error)
        return false
      }

      console.log('✅ Updated subscription status for user:', userId)
      return true
    } catch (error) {
      console.error('Exception in updateSubscriptionStatus:', error)
      return false
    }
  }

  // ============ USER PROFILE METHODS ============

  async createProfile(user: { id: string; email: string; full_name?: string }): Promise<Profile | null> {
    try {
      const { data: profile, error } = await this.supabaseClient
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
      const { data: profile, error } = await this.supabaseClient
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
      const { data: presentations, error } = await this.supabaseClient
        .from('presentations')
        .select(`
          *,
          slides!inner(count)
        `)
        .eq('user_id', userId)
        .eq('status', 'completed')
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
