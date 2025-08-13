import { supabase, SlideImageData, SlideWithImages } from './supabase'
import type { Tables, Inserts, Updates } from './supabase'
import { createClient } from '@/lib/supabase/client'

// Type aliases for cleaner code
export type SlideImage = Tables<'slide_images'>
export type SlideImageInsert = Inserts<'slide_images'>
export type SlideImageUpdate = Updates<'slide_images'>

/**
 * Get all images for a specific slide
 */
export async function getSlideImages(slideId: string): Promise<SlideImage[]> {
  const { data, error } = await supabase
    .from('slide_images')
    .select('*')
    .eq('slide_id', slideId)
    .order('position', { ascending: true })

  if (error) {
    console.error('Error fetching slide images:', error)
    throw error
  }

  return data || []
}

/**
 * Get a slide with all its images using the view
 */
export async function getSlideWithImages(slideId: string): Promise<SlideWithImages | null> {
  const { data, error } = await supabase
    .from('slides_with_images')
    .select('*')
    .eq('id', slideId)
    .single()

  if (error) {
    console.error('Error fetching slide with images:', error)
    throw error
  }

  return data
}

/**
 * Get all slides with images for a presentation
 */
export async function getPresentationSlidesWithImages(presentationId: string): Promise<SlideWithImages[]> {
  const { data, error } = await supabase
    .from('slides_with_images')
    .select('*')
    .eq('presentation_id', presentationId)
    .order('position', { ascending: true })

  if (error) {
    console.error('Error fetching presentation slides with images:', error)
    throw error
  }

  return data || []
}

/**
 * Add a new image to a slide
 */
export async function addSlideImage(slideImage: SlideImageInsert): Promise<SlideImage> {
  const { data, error } = await supabase
    .from('slide_images')
    .insert(slideImage)
    .select()
    .single()

  if (error) {
    console.error('Error adding slide image:', error)
    throw error
  }

  // Update the slide to indicate it has multiple images
  await updateSlideMultipleImagesFlag(slideImage.slide_id)

  return data
}

/**
 * Update an existing slide image
 */
export async function updateSlideImage(id: string, updates: SlideImageUpdate): Promise<SlideImage> {
  const { data, error } = await supabase
    .from('slide_images')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating slide image:', error)
    throw error
  }

  return data
}

/**
 * Delete a slide image
 */
export async function deleteSlideImage(id: string): Promise<void> {
  const { error } = await supabase
    .from('slide_images')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting slide image:', error)
    throw error
  }

  // Check if this was the last image and update the flag
  const { data: slideImage } = await supabase
    .from('slide_images')
    .select('slide_id')
    .eq('id', id)
    .single()

  if (slideImage) {
    await updateSlideMultipleImagesFlag(slideImage.slide_id)
  }
}

/**
 * Reorder slide images by updating their positions
 */
export async function reorderSlideImages(slideId: string, imageIds: string[]): Promise<void> {
  const updates = imageIds.map((id, index) => ({
    id,
    position: index + 1
  }))

  for (const update of updates) {
    await updateSlideImage(update.id, { position: update.position })
  }
}

/**
 * Set the primary image for a slide
 */
export async function setPrimaryImage(slideId: string, imageId: string): Promise<void> {
  const { error } = await supabase
    .from('slides')
    .update({ primary_image_id: imageId })
    .eq('id', slideId)

  if (error) {
    console.error('Error setting primary image:', error)
    throw error
  }
}

/**
 * Update the has_multiple_images flag for a slide based on its current images
 */
async function updateSlideMultipleImagesFlag(slideId: string): Promise<void> {
  const { data: images } = await supabase
    .from('slide_images')
    .select('id')
    .eq('slide_id', slideId)

  const hasMultipleImages = (images?.length || 0) > 1

  const { error } = await supabase
    .from('slides')
    .update({ has_multiple_images: hasMultipleImages })
    .eq('id', slideId)

  if (error) {
    console.error('Error updating multiple images flag:', error)
    throw error
  }
}

/**
 * Generate multiple images for a slide based on prompts
 */
export async function generateSlideImages(
  slideId: string, 
  imagePrompts: Array<{
    prompt: string
    type?: string
    aspectRatio?: string
    position: number
  }>
): Promise<SlideImage[]> {
  const results: SlideImage[] = []

  for (const promptData of imagePrompts) {
    const slideImage: SlideImageInsert = {
      slide_id: slideId,
      image_prompt: promptData.prompt,
      image_type: promptData.type || 'generated',
      aspect_ratio: promptData.aspectRatio || '16:9',
      position: promptData.position,
      style_metadata: null
    }

    try {
      const result = await addSlideImage(slideImage)
      results.push(result)
    } catch (error) {
      console.error(`Error generating image for position ${promptData.position}:`, error)
    }
  }

  return results
}

/**
 * Get the primary image for a slide
 */
export async function getPrimarySlideImage(slideId: string): Promise<SlideImage | null> {
  // First try to get the designated primary image
  const { data: slide } = await supabase
    .from('slides')
    .select('primary_image_id')
    .eq('id', slideId)
    .single()

  if (slide?.primary_image_id) {
    const { data: primaryImage } = await supabase
      .from('slide_images')
      .select('*')
      .eq('id', slide.primary_image_id)
      .single()

    if (primaryImage) {
      return primaryImage
    }
  }

  // Fallback to the first image by position
  const { data: firstImage } = await supabase
    .from('slide_images')
    .select('*')
    .eq('slide_id', slideId)
    .order('position', { ascending: true })
    .limit(1)
    .single()

  return firstImage || null
}

/**
 * Migrate legacy single image to multiple images system
 */
export async function migrateLegacySlideImage(slideId: string): Promise<void> {
  const { data: slide } = await supabase
    .from('slides')
    .select('image_url, image_prompt')
    .eq('id', slideId)
    .single()

  if (slide?.image_url || slide?.image_prompt) {
    const slideImage: SlideImageInsert = {
      slide_id: slideId,
      image_url: slide.image_url,
      image_prompt: slide.image_prompt,
      image_type: 'legacy',
      position: 1,
      aspect_ratio: '16:9'
    }

    const newImage = await addSlideImage(slideImage)
    
    // Set as primary image and clear legacy fields
    await supabase
      .from('slides')
      .update({
        primary_image_id: newImage.id,
        image_url: null,
        image_prompt: null
      })
      .eq('id', slideId)
  }
}

/**
 * Get all images for a user across all their presentations
 */
export async function getUserImages(userId: string): Promise<Array<{
  id: string;
  image_url: string | null;
  image_prompt: string | null;
  image_type: string | null;
  aspect_ratio: string | null;
  created_at: string;
  updated_at: string | null;
  slide_id: string;
  slide_title: string | null;
  presentation_id: string;
  presentation_title: string;
  slide_position: number;
}>> {
  console.log('Fetching images for user:', userId);
  
  // Use client-side Supabase client for user-scoped queries
  const clientSupabase = createClient();
  
  // First get all presentations for the user
  const { data: presentations, error: presError } = await clientSupabase
    .from('presentations')
    .select('id, title')
    .eq('user_id', userId)

  if (presError) {
    console.error('Error fetching user presentations:', presError)
    throw presError
  }

  console.log('User presentations:', presentations);

  if (!presentations || presentations.length === 0) {
    console.log('No presentations found for user');
    return []
  }

  const presentationIds = presentations.map(p => p.id)
  const presentationMap = new Map(presentations.map(p => [p.id, p.title]))

  // Then get all slides with images for those presentations
  const { data: slides, error } = await clientSupabase
    .from('slides')
    .select(`
      id,
      title,
      position,
      presentation_id,
      image_url,
      image_prompt,
      created_at,
      updated_at
    `)
    .in('presentation_id', presentationIds)
    .not('image_url', 'is', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching slides with images:', error)
    throw error
  }

  console.log('Slides with images:', slides);

  // Also check for images in slide_images table
  const { data: slideImages, error: slideImagesError } = await clientSupabase
    .from('slide_images')
    .select(`
      id,
      slide_id,
      image_url,
      image_prompt,
      image_type,
      aspect_ratio,
      created_at,
      updated_at,
      position,
      slides!slide_images_slide_id_fkey(
        id,
        title,
        position,
        presentation_id
      )
    `)
    .not('image_url', 'is', null)
    .order('created_at', { ascending: false })

  if (slideImagesError) {
    console.error('Error fetching slide_images:', slideImagesError)
  }

  console.log('Slide images from slide_images table:', slideImages);

  const results = [];

  // Add images from slides table
  if (slides) {
    for (const slide of slides) {
      results.push({
        id: slide.id,
        image_url: slide.image_url,
        image_prompt: slide.image_prompt,
        image_type: 'legacy',
        aspect_ratio: '16:9',
        created_at: slide.created_at,
        updated_at: slide.updated_at,
        slide_id: slide.id,
        slide_title: slide.title || null,
        presentation_id: slide.presentation_id || '',
        presentation_title: presentationMap.get(slide.presentation_id) || 'Untitled Presentation',
        slide_position: slide.position || 0
      });
    }
  }

  // Add images from slide_images table (for slides that belong to user's presentations)
  if (slideImages) {
    for (const image of slideImages) {
      const slideData = image.slides ? (Array.isArray(image.slides) ? image.slides[0] : image.slides) : null;
      if (slideData && presentationIds.includes(slideData.presentation_id)) {
        results.push({
          id: image.id,
          image_url: image.image_url,
          image_prompt: image.image_prompt,
          image_type: image.image_type || 'generated',
          aspect_ratio: image.aspect_ratio || '16:9',
          created_at: image.created_at,
          updated_at: image.updated_at,
          slide_id: image.slide_id,
          slide_title: slideData.title || null,
          presentation_id: slideData.presentation_id || '',
          presentation_title: presentationMap.get(slideData.presentation_id) || 'Untitled Presentation',
          slide_position: slideData.position || 0
        });
      }
    }
  }

  console.log('Total images found:', results.length);
  return results;
}
