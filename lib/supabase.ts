import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          subscription_status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_status?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_status?: string
        }
      }
      presentations: {
        Row: {
          id: string
          user_id: string | null
          title: string
          prompt: string
          card_count: number
          style: 'default' | 'modern' | 'minimal' | 'creative' | 'professional' | 'dark' | 'fun' | 'friendly' | 'casual' | 'formal'
          language: string
          content_length: 'brief' | 'medium' | 'detailed'
          theme_id: string
          image_style: string | null
          status: 'draft' | 'generating' | 'completed' | 'error'
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
          style?: 'default' | 'modern' | 'minimal' | 'creative' | 'professional' | 'dark' | 'fun' | 'friendly' | 'casual' | 'formal'
          language?: string
          content_length?: 'brief' | 'medium' | 'detailed'
          theme_id?: string
          image_style?: string | null
          status?: 'draft' | 'generating' | 'completed' | 'error'
          outline?: any | null
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          prompt?: string
          card_count?: number
          style?: 'default' | 'modern' | 'minimal' | 'creative' | 'professional' | 'dark' | 'fun' | 'friendly' | 'casual' | 'formal'
          language?: string
          content_length?: 'brief' | 'medium' | 'detailed'
          theme_id?: string
          image_style?: string | null
          status?: 'draft' | 'generating' | 'completed' | 'error'
          outline?: any | null
          last_synced_at?: string
        }
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
        Update: {
          id?: string
          presentation_id?: string
          template_type?: string
          title?: string | null
          content?: string | null
          bullet_points?: string[] | null
          image_url?: string | null
          image_prompt?: string | null
          position?: number
          is_hidden?: boolean
          is_generating?: boolean
          is_generating_image?: boolean
          images_metadata?: any | null
          has_multiple_images?: boolean
          primary_image_id?: string | null
        }
      }
      slide_images: {
        Row: {
          id: string
          slide_id: string
          image_url: string | null
          image_prompt: string | null
          image_type: string | null
          position: number
          aspect_ratio: string | null
          style_metadata: any | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          slide_id: string
          image_url?: string | null
          image_prompt?: string | null
          image_type?: string | null
          position: number
          aspect_ratio?: string | null
          style_metadata?: any | null
        }
        Update: {
          id?: string
          slide_id?: string
          image_url?: string | null
          image_prompt?: string | null
          image_type?: string | null
          position?: number
          aspect_ratio?: string | null
          style_metadata?: any | null
        }
      }
      copilot_threads: {
        Row: {
          id: string
          presentation_id: string
          title: string | null
          created_at: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          presentation_id: string
          title?: string | null
          user_id: string
        }
        Update: {
          id?: string
          presentation_id?: string
          title?: string | null
          user_id?: string
        }
      }
      copilot_messages: {
        Row: {
          id: string
          thread_id: string
          role: string
          content: string
          tool_calls: any | null
          created_at: string
        }
        Insert: {
          id?: string
          thread_id: string
          role: string
          content: string
          tool_calls?: any | null
        }
        Update: {
          id?: string
          thread_id?: string
          role?: string
          content?: string
          tool_calls?: any | null
        }
      }
    }
    Views: {
      slides_with_images: {
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
          images: SlideImageData[]
        }
      }
    }
  }
}

// Helper types for working with slide images
export interface SlideImageData {
  id: string
  image_url: string | null
  image_prompt: string | null
  image_type: string | null
  position: number
  aspect_ratio: string | null
  style_metadata: any | null
}

export interface SlideWithImages {
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
  images: SlideImageData[]
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']