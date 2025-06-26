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
