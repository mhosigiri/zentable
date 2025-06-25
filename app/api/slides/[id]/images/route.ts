import { NextRequest, NextResponse } from 'next/server'
import { 
  getSlideImages, 
  addSlideImage, 
  updateSlideImage, 
  deleteSlideImage,
  reorderSlideImages,
  setPrimaryImage,
  type SlideImageInsert,
  type SlideImageUpdate
} from '@/lib/slide-images'

export const dynamic = 'force-dynamic'

/**
 * GET /api/slides/[id]/images
 * Get all images for a slide
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const slideId = params.id
    const images = await getSlideImages(slideId)
    
    return NextResponse.json({ images })
  } catch (error) {
    console.error('Error fetching slide images:', error)
    return NextResponse.json(
      { error: 'Failed to fetch slide images' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/slides/[id]/images
 * Add a new image to a slide
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const slideId = params.id
    const body = await request.json()
    
    const slideImageData: SlideImageInsert = {
      slide_id: slideId,
      image_url: body.image_url || null,
      image_prompt: body.image_prompt || null,
      image_type: body.image_type || 'generated',
      position: body.position || 1,
      aspect_ratio: body.aspect_ratio || '16:9',
      style_metadata: body.style_metadata || null
    }

    const newImage = await addSlideImage(slideImageData)
    
    return NextResponse.json({ image: newImage })
  } catch (error) {
    console.error('Error adding slide image:', error)
    return NextResponse.json(
      { error: 'Failed to add slide image' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/slides/[id]/images
 * Bulk operations: reorder images or set primary image
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const slideId = params.id
    const body = await request.json()
    
    if (body.action === 'reorder' && body.imageIds) {
      await reorderSlideImages(slideId, body.imageIds)
      return NextResponse.json({ success: true })
    }
    
    if (body.action === 'setPrimary' && body.imageId) {
      await setPrimaryImage(slideId, body.imageId)
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json(
      { error: 'Invalid action or missing parameters' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error performing bulk image operation:', error)
    return NextResponse.json(
      { error: 'Failed to perform image operation' },
      { status: 500 }
    )
  }
}
