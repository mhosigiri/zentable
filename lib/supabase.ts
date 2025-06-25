import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mjdxoifzxshnnqmbipzh.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1qZHhvaWZ6eHNobm5xbWJpcHpoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA3OTU4OTcsImV4cCI6MjA2NjM3MTg5N30.e39TFWXB1eA3GbdEkzvjJ2jB5bc-6vc4JDaljqfWL0c'

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
          subscription_tier: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          subscription_tier?: string
        }
      }
      presentations: {
        Row: {
          id: string
          user_id: string | null
          title: string
          prompt: string
          card_count: number
          style: 'default' | 'modern' | 'minimal' | 'creative' | 'professional' | 'dark'
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
          style?: 'default' | 'modern' | 'minimal' | 'creative' | 'professional' | 'dark'
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
          style?: 'default' | 'modern' | 'minimal' | 'creative' | 'professional' | 'dark'
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
        }
      }
    }
  }
} 