import { NextRequest, NextResponse } from 'next/server';
import { updateSlideContent } from '@/lib/slides';

export async function POST(req: NextRequest) {
  try {
    const { slideId, content } = await req.json();
    
    if (!slideId || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing slideId or content' },
        { status: 400 }
      );
    }

    console.log('🔄 Applying approved slide update:', slideId);
    
    // Update the slide content in the database
    const success = await updateSlideContent(slideId, content);
    
    if (!success) {
      console.error('❌ Database update failed');
      return NextResponse.json({
        success: false,
        error: 'Failed to update slide content',
        slideId
      });
    }
    
    console.log('✅ Approved slide update applied successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Slide content updated successfully',
      slideId
    });
    
  } catch (error) {
    console.error('❌ Exception in approve-slide-update:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
