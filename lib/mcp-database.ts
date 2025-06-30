import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { generateUUID } from './uuid'

// Database types specific to MCP
export interface McpApiKey {
  id: string
  user_id: string
  key_name: string
  key_hash: string
  key_prefix: string
  created_at: string
  last_used_at: string | null
  is_active: boolean
}

export interface McpApiKeyInsert {
  id?: string
  user_id: string
  key_name: string
  key_hash: string
  key_prefix: string
  created_at?: string
  last_used_at?: string | null
  is_active?: boolean
}

export interface Database {
  public: {
    Tables: {
      api_keys: {
        Row: McpApiKey
        Insert: McpApiKeyInsert
        Update: Partial<McpApiKey>
      }
      presentations: {
        Row: {
          id: string
          user_id: string | null
          title: string
          prompt: string
          card_count: number
          style: string
          language: string
          content_length: string
          theme_id: string
          image_style: string | null
          status: string
          outline: any | null
          created_at: string
          updated_at: string
          last_synced_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title?: string
          prompt: string
          card_count?: number
          style?: string
          language?: string
          content_length?: string
          theme_id?: string
          image_style?: string | null
          status?: string
          outline?: any | null
        }
        Update: Partial<{
          id: string
          user_id: string | null
          title: string
          prompt: string
          card_count: number
          style: string
          language: string
          content_length: string
          theme_id: string
          image_style: string | null
          status: string
          outline: any | null
          last_synced_at: string
        }>
      }
      slides: {
        Row: {
          id: string
          presentation_id: string
          template_type: string
          title: string | null
          content: string | null
          bullet_points: string[] | null
          image_url: string | null
          image_prompt: string | null
          position: number
          is_hidden: boolean
          is_generating: boolean
          is_generating_image: boolean
          created_at: string
          updated_at: string
          images_metadata: any | null
          has_multiple_images: boolean
          primary_image_id: string | null
        }
        Insert: {
          id?: string
          presentation_id: string
          template_type: string
          title?: string | null
          content?: string | null
          bullet_points?: string[] | null
          image_url?: string | null
          image_prompt?: string | null
          position: number
          is_hidden?: boolean
          is_generating?: boolean
          is_generating_image?: boolean
          images_metadata?: any | null
          has_multiple_images?: boolean
          primary_image_id?: string | null
        }
        Update: Partial<{
          id: string
          presentation_id: string
          template_type: string
          title: string | null
          content: string | null
          bullet_points: string[] | null
          image_url: string | null
          image_prompt: string | null
          position: number
          is_hidden: boolean
          is_generating: boolean
          is_generating_image: boolean
          images_metadata: any | null
          has_multiple_images: boolean
          primary_image_id: string | null
        }>
      }
    }
  }
}

export class McpDatabaseService {
  private supabaseClient: SupabaseClient<Database>

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
    
    // Use service role client for MCP operations to bypass RLS
    this.supabaseClient = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }

  // ============ API KEY MANAGEMENT ============

  async createApiKey(userId: string, keyName: string, keyHash: string, keyPrefix: string): Promise<McpApiKey | null> {
    try {
      console.log('=== MCP Database: Creating API Key ===')
      console.log('User ID:', userId)
      console.log('Key Name:', keyName)
      console.log('Key Prefix:', keyPrefix)
      console.log('Key Hash:', keyHash)

      const { data, error } = await this.supabaseClient
        .from('api_keys')
        .insert({
          user_id: userId,
          key_name: keyName,
          key_hash: keyHash,
          key_prefix: keyPrefix,
          is_active: true
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating API key:', error)
        return null
      }

      console.log('API key created successfully:', data)
      return data
    } catch (error) {
      console.error('Exception creating API key:', error)
      return null
    }
  }

  async getUserApiKeys(userId: string): Promise<McpApiKey[]> {
    try {
      console.log('=== MCP Database: Getting user API keys ===')
      console.log('User ID:', userId)

      const { data, error } = await this.supabaseClient
        .from('api_keys')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error getting API keys:', error)
        return []
      }

      console.log('Found API keys:', data?.length || 0)
      return data || []
    } catch (error) {
      console.error('Exception getting API keys:', error)
      return []
    }
  }

  async validateApiKey(keyHash: string): Promise<{ isValid: boolean; userId?: string }> {
    try {
      console.log('=== MCP Database: Validating API Key ===')
      console.log('Key Hash:', keyHash)

      const { data, error } = await this.supabaseClient
        .from('api_keys')
        .select('user_id, is_active')
        .eq('key_hash', keyHash)
        .eq('is_active', true)
        .maybeSingle()

      if (error) {
        console.error('Error validating API key:', error)
        return { isValid: false }
      }

      if (!data) {
        console.log('No matching API key found')
        return { isValid: false }
      }

      console.log('API key validation successful, user:', data.user_id)

      // Update last_used_at
      await this.supabaseClient
        .from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('key_hash', keyHash)

      return { isValid: true, userId: data.user_id }
    } catch (error) {
      console.error('Exception validating API key:', error)
      return { isValid: false }
    }
  }

  async deleteApiKey(keyId: string, userId: string): Promise<boolean> {
    try {
      console.log('=== MCP Database: Deleting API Key ===')
      console.log('Key ID:', keyId)
      console.log('User ID:', userId)

      const { error } = await this.supabaseClient
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', keyId)
        .eq('user_id', userId)

      if (error) {
        console.error('Error deleting API key:', error)
        return false
      }

      console.log('API key deleted successfully')
      return true
    } catch (error) {
      console.error('Exception deleting API key:', error)
      return false
    }
  }

  // ============ PRESENTATION MANAGEMENT FOR MCP ============

  async createPresentation(data: {
    prompt: string
    cardCount?: number
    style?: string
    language?: string
    contentLength?: string
    themeId?: string
    imageStyle?: string
    userId: string
  }): Promise<any> {
    try {
      console.log('=== MCP Database: Creating Presentation ===')
      console.log('User ID:', data.userId)
      console.log('Prompt:', data.prompt.substring(0, 100) + '...')

      const presentationId = generateUUID()
      
      const presentationData = {
        id: presentationId,
        user_id: data.userId,
        title: data.prompt.substring(0, 100),
        prompt: data.prompt,
        card_count: data.cardCount || 8,
        style: data.style || 'modern',
        language: data.language || 'English',
        content_length: data.contentLength || 'medium',
        theme_id: data.themeId || 'theme-blue',
        image_style: data.imageStyle || 'professional',
        status: 'draft',
        outline: null
      }

      const { data: presentation, error } = await this.supabaseClient
        .from('presentations')
        .insert(presentationData)
        .select()
        .single()

      if (error) {
        console.error('Error creating presentation:', error)
        throw error
      }

      console.log('Presentation created successfully:', presentation.id)
      return presentation
    } catch (error) {
      console.error('Exception creating presentation:', error)
      throw error
    }
  }

  async saveSlides(presentationId: string, slides: any[]): Promise<boolean> {
    try {
      console.log('=== MCP Database: Saving Slides ===')
      console.log('Presentation ID:', presentationId)
      console.log('Number of slides:', slides.length)

      // First, delete existing slides for this presentation
      await this.supabaseClient
        .from('slides')
        .delete()
        .eq('presentation_id', presentationId)

      // Insert new slides
      const slideData = slides.map((slide, index) => ({
        id: generateUUID(),
        presentation_id: presentationId,
        template_type: slide.templateType || 'TitleWithText',
        title: slide.title || null,
        content: slide.content || null,
        bullet_points: slide.bulletPoints || null,
        image_url: slide.imageUrl || null,
        image_prompt: slide.imagePrompt || null,
        position: index,
        is_hidden: false,
        is_generating: false,
        is_generating_image: false
      }))

      const { error } = await this.supabaseClient
        .from('slides')
        .insert(slideData)

      if (error) {
        console.error('Error saving slides:', error)
        return false
      }

      // Update presentation status
      await this.supabaseClient
        .from('presentations')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString(),
          last_synced_at: new Date().toISOString()
        })
        .eq('id', presentationId)

      console.log('Slides saved successfully')
      return true
    } catch (error) {
      console.error('Exception saving slides:', error)
      return false
    }
  }

  async updatePresentationStatus(presentationId: string, status: string): Promise<boolean> {
    try {
      console.log('=== MCP Database: Updating Presentation Status ===')
      console.log('Presentation ID:', presentationId)
      console.log('Status:', status)

      const { error } = await this.supabaseClient
        .from('presentations')
        .update({ 
          status,
          updated_at: new Date().toISOString(),
          last_synced_at: new Date().toISOString()
        })
        .eq('id', presentationId)

      if (error) {
        console.error('Error updating presentation status:', error)
        return false
      }

      console.log('Presentation status updated successfully')
      return true
    } catch (error) {
      console.error('Exception updating presentation status:', error)
      return false
    }
  }
}

// Create singleton instance
export const mcpDatabase = new McpDatabaseService() 