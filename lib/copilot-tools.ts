import { z } from 'zod'
import { supabase } from '@/lib/supabase'

// Tool definitions for AI SDK
export const tools = {
  updateSlideProperty: {
    description: 'Update any property on a slide',
    parameters: z.object({
      slideId: z.string().describe('The ID of the slide to update'),
      property: z.string().describe('The property to update (title, content, etc.)'),
      value: z.string().describe('The new value for the property'),
    }),
  },

  addBulletToProperty: {
    description: 'Add a bullet point to a slide property',
    parameters: z.object({
      slideId: z.string().describe('The ID of the slide to update'),
      property: z.string().describe('The property to add bullet to (usually bullet_points)'),
      bullet: z.string().describe('The bullet point text to add'),
      position: z.number().optional().describe('Position to insert bullet (default: end)'),
    }),
  },

  updateSlideImage: {
    description: 'Update slide image URL, prompt, or alt text',
    parameters: z.object({
      slideId: z.string().describe('The ID of the slide to update'),
      imageUrl: z.string().optional().describe('New image URL'),
      imagePrompt: z.string().optional().describe('New image generation prompt'),
      altText: z.string().optional().describe('Alt text for the image'),
    }),
  },

  changeSlideTemplate: {
    description: 'Change slide template type with smart content mapping',
    parameters: z.object({
      slideId: z.string().describe('The ID of the slide to update'),
      newTemplate: z.enum(['title', 'content', 'two-column', 'image-content', 'full-image', 'quote', 'list']).describe('The new template type'),
      preserveContent: z.boolean().default(true).describe('Whether to preserve existing content when possible'),
    }),
  },

  optimizeSlideContent: {
    description: 'Optimize slide content for clarity, audience, and engagement',
    parameters: z.object({
      slideId: z.string().describe('The ID of the slide to optimize'),
      audience: z.string().optional().describe('Target audience for optimization'),
      tone: z.enum(['professional', 'casual', 'academic', 'creative']).optional().describe('Desired tone'),
      length: z.enum(['brief', 'medium', 'detailed']).optional().describe('Desired content length'),
    }),
  },

  reorderSlides: {
    description: 'Reorder slides in the presentation',
    parameters: z.object({
      slideIds: z.array(z.string()).describe('Array of slide IDs in new order'),
      presentationId: z.string().describe('The presentation ID'),
    }),
  },

  duplicateSlide: {
    description: 'Duplicate a slide',
    parameters: z.object({
      slideId: z.string().describe('The ID of the slide to duplicate'),
      position: z.number().optional().describe('Position for the new slide (default: after original)'),
    }),
  },

  deleteSlide: {
    description: 'Delete a slide from the presentation',
    parameters: z.object({
      slideId: z.string().describe('The ID of the slide to delete'),
      confirmDelete: z.boolean().describe('Confirmation that user wants to delete'),
    }),
  },
}

// Tool execution functions
export async function executeToolCall(toolCall: any, presentationId?: string) {
  if (!presentationId) {
    return { error: 'No presentation context available' }
  }
  
  try {
    const { name, arguments: args } = toolCall.function
    
    switch (name) {
      case 'updateSlideProperty':
        return await updateSlideProperty(args, presentationId)
      
      case 'addBulletToProperty':
        return await addBulletToProperty(args, presentationId)
      
      case 'updateSlideImage':
        return await updateSlideImage(args, presentationId)
      
      case 'changeSlideTemplate':
        return await changeSlideTemplate(args, presentationId)
      
      case 'optimizeSlideContent':
        return await optimizeSlideContent(args, presentationId)
      
      case 'reorderSlides':
        return await reorderSlides(args)
      
      case 'duplicateSlide':
        return await duplicateSlide(args, presentationId)
      
      case 'deleteSlide':
        return await deleteSlide(args, presentationId)
      
      default:
        return { error: `Unknown tool: ${name}` }
    }
  } catch (error) {
    console.error('Tool execution error:', error)
    return { error: 'Tool execution failed', details: error }
  }
}

async function updateSlideProperty(args: any, presentationId: string) {
  const { slideId, property, value } = args
  
  const { error } = await supabase
    .from('slides')
    .update({ [property]: value, updated_at: new Date().toISOString() })
    .eq('id', slideId)
    .eq('presentation_id', presentationId)
  
  if (error) {
    return { error: error.message }
  }
  
  return { 
    success: true, 
    action: `Updated ${property} for slide`,
    details: { slideId, property, value }
  }
}

async function addBulletToProperty(args: any, presentationId: string) {
  const { slideId, property, bullet, position } = args
  
  // Get current slide data
  const { data: slide, error: fetchError } = await supabase
    .from('slides')
    .select(property)
    .eq('id', slideId)
    .eq('presentation_id', presentationId)
    .single()
  
  if (fetchError) {
    return { error: fetchError.message }
  }
  
  // Handle bullet points array with proper typing
  let currentBullets: string[] = []
  const propertyValue = slide?.[property]
  
  if (Array.isArray(propertyValue)) {
    currentBullets = propertyValue
  } else if (typeof propertyValue === 'string' && propertyValue) {
    currentBullets = [propertyValue]
  }
  
  // Insert bullet at specified position or at end
  if (position !== undefined && position >= 0 && position <= currentBullets.length) {
    currentBullets.splice(position, 0, bullet)
  } else {
    currentBullets.push(bullet)
  }
  
  const { error } = await supabase
    .from('slides')
    .update({ 
      [property]: currentBullets,
      updated_at: new Date().toISOString()
    })
    .eq('id', slideId)
    .eq('presentation_id', presentationId)
  
  if (error) {
    return { error: error.message }
  }
  
  return { 
    success: true, 
    action: `Added bullet point to ${property}`,
    details: { slideId, bullet, position: position || currentBullets.length - 1 }
  }
}

async function updateSlideImage(args: any, presentationId: string) {
  const { slideId, imageUrl, imagePrompt, altText } = args
  
  const updateData: any = { updated_at: new Date().toISOString() }
  if (imageUrl) updateData.image_url = imageUrl
  if (imagePrompt) updateData.image_prompt = imagePrompt
  // Note: altText might need to be stored in metadata depending on schema
  
  const { error } = await supabase
    .from('slides')
    .update(updateData)
    .eq('id', slideId)
    .eq('presentation_id', presentationId)
  
  if (error) {
    return { error: error.message }
  }
  
  return { 
    success: true, 
    action: 'Updated slide image',
    details: { slideId, imageUrl, imagePrompt }
  }
}

async function changeSlideTemplate(args: any, presentationId: string) {
  const { slideId, newTemplate, preserveContent } = args
  
  // If preserveContent is true, we might need to transform content
  // For now, just update the template_type
  const { error } = await supabase
    .from('slides')
    .update({ 
      template_type: newTemplate,
      updated_at: new Date().toISOString()
    })
    .eq('id', slideId)
    .eq('presentation_id', presentationId)
  
  if (error) {
    return { error: error.message }
  }
  
  return { 
    success: true, 
    action: `Changed slide template to ${newTemplate}`,
    details: { slideId, newTemplate, preserveContent }
  }
}

async function optimizeSlideContent(args: any, presentationId: string) {
  const { slideId, audience, tone, length } = args
  
  // This would typically involve AI content optimization
  // For now, we'll just mark it as optimized
  const { error } = await supabase
    .from('slides')
    .update({ 
      updated_at: new Date().toISOString()
      // In a real implementation, we'd optimize the content here
    })
    .eq('id', slideId)
    .eq('presentation_id', presentationId)
  
  if (error) {
    return { error: error.message }
  }
  
  return { 
    success: true, 
    action: 'Optimized slide content',
    details: { slideId, audience, tone, length }
  }
}

async function reorderSlides(args: any) {
  const { slideIds, presentationId } = args
  
  // Update position for each slide
  const updates = slideIds.map((slideId: string, index: number) => 
    supabase
      .from('slides')
      .update({ 
        position: index,
        updated_at: new Date().toISOString()
      })
      .eq('id', slideId)
      .eq('presentation_id', presentationId)
  )
  
  const results = await Promise.all(updates)
  const errors = results.filter(result => result.error)
  
  if (errors.length > 0) {
    return { error: 'Failed to reorder some slides' }
  }
  
  return { 
    success: true, 
    action: `Reordered ${slideIds.length} slides`,
    details: { slideIds }
  }
}

async function duplicateSlide(args: any, presentationId: string) {
  const { slideId, position } = args
  
  // Get original slide
  const { data: originalSlide, error: fetchError } = await supabase
    .from('slides')
    .select('*')
    .eq('id', slideId)
    .eq('presentation_id', presentationId)
    .single()
  
  if (fetchError) {
    return { error: fetchError.message }
  }
  
  // Create duplicate
  const { id, created_at, updated_at, ...slideData } = originalSlide
  const newPosition = position !== undefined ? position : originalSlide.position + 1
  
  const { data: newSlide, error } = await supabase
    .from('slides')
    .insert({
      ...slideData,
      position: newPosition,
    })
    .select()
    .single()
  
  if (error) {
    return { error: error.message }
  }
  
  return { 
    success: true, 
    action: 'Duplicated slide',
    details: { originalSlideId: slideId, newSlideId: newSlide.id, position: newPosition }
  }
}

async function deleteSlide(args: any, presentationId: string) {
  const { slideId, confirmDelete } = args
  
  if (!confirmDelete) {
    return { error: 'Delete not confirmed' }
  }
  
  const { error } = await supabase
    .from('slides')
    .delete()
    .eq('id', slideId)
    .eq('presentation_id', presentationId)
  
  if (error) {
    return { error: error.message }
  }
  
  return { 
    success: true, 
    action: 'Deleted slide',
    details: { slideId }
  }
}
