import { NextRequest, NextResponse } from 'next/server'
import { 
  updateSlideImage, 
  deleteSlideImage,
  type SlideImageUpdate
} from '@/lib/slide-images'

export const dynamic = 'force-dynamic'

/**
 * PUT /api/slides/[id]/images/[imageId]
 * Update a specific slide image
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const imageId = params.imageId
    const body = await request.json()
    
    const updates: SlideImageUpdate = {}
    
    if (body.image_url !== undefined) updates.image_url = body.image_url
    if (body.image_prompt !== undefined) updates.image_prompt = body.image_prompt
    if (body.image_type !== undefined) updates.image_type = body.image_type
    if (body.position !== undefined) updates.position = body.position
    if (body.aspect_ratio !== undefined) updates.aspect_ratio = body.aspect_ratio
    if (body.style_metadata !== undefined) updates.style_metadata = body.style_metadata

    const updatedImage = await updateSlideImage(imageId, updates)
    
    return NextResponse.json({ image: updatedImage })
  } catch (error) {
    console.error('Error updating slide image:', error)
    return NextResponse.json(
      { error: 'Failed to update slide image' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/slides/[id]/images/[imageId]
 * Delete a specific slide image
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; imageId: string } }
) {
  try {
    const imageId = params.imageId
    
    await deleteSlideImage(imageId)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting slide image:', error)
    return NextResponse.json(
      { error: 'Failed to delete slide image' },
      { status: 500 }
    )
  }
}
