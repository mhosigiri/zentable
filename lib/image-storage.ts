import { createClient } from '@/lib/supabase/client'
import { addSlideImage } from './slide-images'

export interface ImageUploadResult {
  success: boolean
  imageUrl?: string
  error?: string
}

export class ImageStorageService {
  private supabase = createClient()

  async uploadAndSaveImage(
    base64Image: string,
    slideId: string,
    imagePrompt: string,
    userId: string,
    presentationId: string
  ): Promise<ImageUploadResult> {
    try {
      const base64Data = base64Image.replace(/^data:image\/[a-z]+;base64,/, '')
      const byteCharacters = atob(base64Data)
      const byteNumbers = new Array(byteCharacters.length)
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: 'image/png' })

      const timestamp = Date.now()
      const fileName = `${slideId}_${timestamp}.png`
      const filePath = `${userId}/${presentationId}/${fileName}`

      const { data: uploadData, error: uploadError } = await this.supabase.storage
        .from('user-generated-images')
        .upload(filePath, blob, {
          contentType: 'image/png',
          upsert: false
        })

      if (uploadError) {
        console.error('Storage upload error:', uploadError)
        return { success: false, error: uploadError.message }
      }

      const { data: { publicUrl } } = this.supabase.storage
        .from('user-generated-images')
        .getPublicUrl(filePath)

      await addSlideImage({
        slide_id: slideId,
        image_url: publicUrl,
        image_prompt: imagePrompt,
        image_type: 'generated',
        position: 1,
        aspect_ratio: '16:9',
        style_metadata: {
          storage_path: filePath,
          uploaded_at: new Date().toISOString()
        }
      })

      return { success: true, imageUrl: publicUrl }
    } catch (error) {
      console.error('Image upload and save error:', error)
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }
    }
  }

  async getUserImages(userId: string) {
    const { data, error } = await this.supabase
      .from('slide_images')
      .select(`
        *,
        slides!inner(
          presentation_id,
          presentations!inner(
            user_id,
            title
          )
        )
      `)
      .eq('slides.presentations.user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching user images:', error)
      return []
    }

    return data || []
  }
}

export const imageStorage = new ImageStorageService()
