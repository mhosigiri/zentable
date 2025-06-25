import { NextRequest, NextResponse } from 'next/server'
import { generateSlideImages, getSlideWithImages } from '@/lib/slide-images'

export const dynamic = 'force-dynamic'

/**
 * POST /api/slides/[id]/generate-images
 * Generate multiple images for a slide based on prompts
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const slideId = params.id
    const body = await request.json()
    
    // Validate request body
    if (!body.imagePrompts || !Array.isArray(body.imagePrompts)) {
      return NextResponse.json(
        { error: 'imagePrompts array is required' },
        { status: 400 }
      )
    }

    // Validate each prompt object
    for (const prompt of body.imagePrompts) {
      if (!prompt.prompt || typeof prompt.position !== 'number') {
        return NextResponse.json(
          { error: 'Each image prompt must have a prompt string and position number' },
          { status: 400 }
        )
      }
    }

    // Generate the images
    const generatedImages = await generateSlideImages(slideId, body.imagePrompts)
    
    // Get the updated slide with all images
    const slideWithImages = await getSlideWithImages(slideId)
    
    return NextResponse.json({ 
      images: generatedImages,
      slide: slideWithImages
    })
  } catch (error) {
    console.error('Error generating slide images:', error)
    return NextResponse.json(
      { error: 'Failed to generate slide images' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/slides/[id]/generate-images
 * Get the current generation status and images for a slide
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const slideId = params.id
    const slideWithImages = await getSlideWithImages(slideId)
    
    if (!slideWithImages) {
      return NextResponse.json(
        { error: 'Slide not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({ slide: slideWithImages })
  } catch (error) {
    console.error('Error fetching slide generation status:', error)
    return NextResponse.json(
      { error: 'Failed to fetch slide generation status' },
      { status: 500 }
    )
  }
}
