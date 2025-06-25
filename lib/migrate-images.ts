import { supabase } from './supabase'
import { migrateLegacySlideImage } from './slide-images'

/**
 * Migrate all slides with legacy single images to the new multiple images system
 */
export async function migrateAllLegacyImages(): Promise<void> {
  console.log('Starting migration of legacy slide images...')
  
  try {
    // Find all slides that have image_url or image_prompt but no corresponding slide_images
    const { data: legacySlides, error } = await supabase
      .from('slides')
      .select('id, image_url, image_prompt')
      .or('image_url.not.is.null,image_prompt.not.is.null')
    
    if (error) {
      console.error('Error fetching legacy slides:', error)
      throw error
    }

    if (!legacySlides || legacySlides.length === 0) {
      console.log('No legacy slides found to migrate.')
      return
    }

    console.log(`Found ${legacySlides.length} slides with legacy images to migrate.`)

    let migratedCount = 0
    let errorCount = 0

    for (const slide of legacySlides) {
      try {
        await migrateLegacySlideImage(slide.id)
        migratedCount++
        console.log(`Migrated slide ${slide.id}`)
      } catch (error) {
        console.error(`Error migrating slide ${slide.id}:`, error)
        errorCount++
      }
    }

    console.log(`Migration completed: ${migratedCount} successful, ${errorCount} errors`)
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

/**
 * Validate the integrity of the multiple images system
 */
export async function validateImageSystemIntegrity(): Promise<{
  valid: boolean
  issues: string[]
}> {
  const issues: string[] = []

  try {
    // Check for slides with has_multiple_images = true but only one or no images
    const { data: incorrectFlags } = await supabase
      .from('slides_with_images')
      .select('id, has_multiple_images, images')
    
    if (incorrectFlags) {
      for (const slide of incorrectFlags) {
        const imageCount = Array.isArray(slide.images) ? slide.images.length : 0
        
        if (slide.has_multiple_images && imageCount <= 1) {
          issues.push(`Slide ${slide.id} has has_multiple_images=true but only ${imageCount} images`)
        }
        
        if (!slide.has_multiple_images && imageCount > 1) {
          issues.push(`Slide ${slide.id} has has_multiple_images=false but ${imageCount} images`)
        }
      }
    }

    // Check for orphaned slide_images (slides that don't exist)
    const { data: orphanedImages } = await supabase
      .from('slide_images')
      .select('id, slide_id')
      .not('slide_id', 'in', `(SELECT id FROM slides)`)
    
    if (orphanedImages && orphanedImages.length > 0) {
      issues.push(`Found ${orphanedImages.length} orphaned slide images`)
    }

    // Check for slides with primary_image_id pointing to non-existent images
    const { data: invalidPrimaryImages } = await supabase
      .from('slides')
      .select('id, primary_image_id')
      .not('primary_image_id', 'is', null)
      .not('primary_image_id', 'in', `(SELECT id FROM slide_images)`)
    
    if (invalidPrimaryImages && invalidPrimaryImages.length > 0) {
      issues.push(`Found ${invalidPrimaryImages.length} slides with invalid primary_image_id`)
    }

    return {
      valid: issues.length === 0,
      issues
    }
  } catch (error) {
    console.error('Error validating image system integrity:', error)
    return {
      valid: false,
      issues: [`Validation failed: ${error}`]
    }
  }
}

/**
 * Fix common integrity issues in the image system
 */
export async function fixImageSystemIntegrity(): Promise<void> {
  console.log('Fixing image system integrity issues...')

  try {
    // Fix has_multiple_images flags
    const { data: slides } = await supabase
      .from('slides_with_images')
      .select('id, has_multiple_images, images')
    
    if (slides) {
      for (const slide of slides) {
        const imageCount = Array.isArray(slide.images) ? slide.images.length : 0
        const shouldHaveMultiple = imageCount > 1
        
        if (slide.has_multiple_images !== shouldHaveMultiple) {
          await supabase
            .from('slides')
            .update({ has_multiple_images: shouldHaveMultiple })
            .eq('id', slide.id)
          
          console.log(`Fixed has_multiple_images flag for slide ${slide.id}`)
        }
      }
    }

    // Remove orphaned slide_images
    const { error: deleteOrphansError } = await supabase
      .from('slide_images')
      .delete()
      .not('slide_id', 'in', `(SELECT id FROM slides)`)
    
    if (deleteOrphansError) {
      console.error('Error deleting orphaned images:', deleteOrphansError)
    } else {
      console.log('Removed orphaned slide images')
    }

    // Clear invalid primary_image_id references
    const { error: clearInvalidError } = await supabase
      .from('slides')
      .update({ primary_image_id: null })
      .not('primary_image_id', 'is', null)
      .not('primary_image_id', 'in', `(SELECT id FROM slide_images)`)
    
    if (clearInvalidError) {
      console.error('Error clearing invalid primary image IDs:', clearInvalidError)
    } else {
      console.log('Cleared invalid primary_image_id references')
    }

    console.log('Image system integrity fixes completed')
  } catch (error) {
    console.error('Error fixing image system integrity:', error)
    throw error
  }
}
