import { supabase, Tables } from '@/lib/supabase';

/**
 * Fetches a slide by its ID from the database
 * @param slideId The ID of the slide to fetch
 * @returns The slide data or null if not found
 */
export async function getSlideById(slideId: string): Promise<Tables<'slides'> | null> {
  try {
    const { data, error } = await supabase
      .from('slides')
      .select('*')
      .eq('id', slideId)
      .single();
    
    if (error) {
      console.error('Error fetching slide:', error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception when fetching slide:', error);
    return null;
  }
}

/**
 * Updates the content of a slide
 * @param slideId The ID of the slide to update
 * @param content The new content for the slide
 * @returns Boolean indicating success or failure
 */
export async function updateSlideContent(slideId: string, content: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('slides')
      .update({ content })
      .eq('id', slideId);
    
    if (error) {
      console.error('Error updating slide content:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception when updating slide content:', error);
    return false;
  }
}

/**
 * Updates the image-related fields of a slide
 * @param slideId The ID of the slide to update
 * @param imageUrl The new image URL
 * @param imagePrompt The image prompt used
 * @param isGeneratingImage Whether the slide is still generating an image
 * @returns Boolean indicating success or failure
 */
export async function updateSlideImage(
  slideId: string, 
  imageUrl?: string, 
  imagePrompt?: string, 
  isGeneratingImage?: boolean
): Promise<boolean> {
  try {
    const updateData: Partial<Tables<'slides'>> = {};
    if (imageUrl !== undefined) updateData.image_url = imageUrl;
    if (imagePrompt !== undefined) updateData.image_prompt = imagePrompt;
    if (isGeneratingImage !== undefined) updateData.is_generating_image = isGeneratingImage;
    
    const { error } = await supabase
      .from('slides')
      .update(updateData)
      .eq('id', slideId);
    
    if (error) {
      console.error('Error updating slide image:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Exception when updating slide image:', error);
    return false;
  }
}

/**
 * Fetches all slides for a specific presentation
 * @param presentationId The ID of the presentation
 * @returns Array of slides or empty array if not found
 */
export async function getSlidesByPresentation(presentationId: string): Promise<Tables<'slides'>[]> {
  try {
    const { data, error } = await supabase
      .from('slides')
      .select('*')
      .eq('presentation_id', presentationId)
      .order('position', { ascending: true });
    
    if (error) {
      console.error('Error fetching slides by presentation:', error);
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception when fetching slides by presentation:', error);
    return [];
  }
}
