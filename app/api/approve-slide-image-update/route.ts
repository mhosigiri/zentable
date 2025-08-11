import { NextRequest, NextResponse } from 'next/server';
import { updateSlideImage } from '@/lib/slides';

export async function POST(req: NextRequest) {
  try {
    const { slideId, imageUrl, imagePrompt, isGeneratingImage } = await req.json();
    
    if (!slideId) {
      return NextResponse.json(
        { success: false, error: 'Missing slideId' },
        { status: 400 }
      );
    }

    console.log('🔄 Applying approved slide image update:', slideId);
    
    // Update the slide image data in the database
    const success = await updateSlideImage(slideId, imageUrl, imagePrompt, isGeneratingImage);
    
    if (!success) {
      console.error('❌ Database image update failed');
      return NextResponse.json({
        success: false,
        error: 'Failed to update slide image data',
        slideId
      });
    }
    
    console.log('✅ Approved slide image update applied successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Slide image updated successfully',
      slideId
    });
    
  } catch (error) {
    console.error('❌ Exception in approve-slide-image-update:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}