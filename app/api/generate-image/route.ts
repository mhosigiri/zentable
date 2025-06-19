import { replicate } from '@ai-sdk/replicate';
import { experimental_generateImage as generateImage } from 'ai';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log('🎨 Image generation request received');
    
    const { prompt, templateType } = await req.json();
    console.log('📝 Prompt:', prompt);
    console.log('🎯 Template Type:', templateType);

    if (!prompt) {
      console.log('❌ No prompt provided');
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Check if REPLICATE_API_TOKEN is configured
    if (!process.env.REPLICATE_API_TOKEN) {
      console.log('❌ REPLICATE_API_TOKEN not configured');
      return Response.json(
        { error: 'REPLICATE_API_TOKEN environment variable is not configured' },
        { status: 500 }
      );
    }

    console.log('✅ REPLICATE_API_TOKEN is configured');
    
    // Determine aspect ratio based on template type
    let aspectRatio: '16:9' | '9:16' | '1:1' | '3:2' | '2:3' = '16:9';
    
    if (templateType === 'accent-left' || templateType === 'accent-right') {
      aspectRatio = '2:3'; // Vertical aspect ratio for side images
    } else if (templateType === 'accent-top') {
      aspectRatio = '16:9'; // Wide aspect ratio for top images
    } else if (templateType === 'accent-background') {
      aspectRatio = '16:9'; // Wide aspect ratio for background images
    }
    
    console.log('📐 Using aspect ratio:', aspectRatio);

    const enhancedPrompt = `${prompt}, professional presentation style, clean, modern, high quality`;
    console.log('🚀 Enhanced prompt:', enhancedPrompt);

    // Generate image using Replicate Flux Schnell
    console.log('🔄 Starting image generation...');
    const { image } = await generateImage({
      model: replicate.image('black-forest-labs/flux-schnell'),
      prompt: enhancedPrompt,
      aspectRatio: aspectRatio,
    });

    console.log('✅ Image generated successfully');
    console.log('📊 Image details:', {
      hasBase64: !!image.base64,
      base64Length: image.base64?.length || 0,
      hasUint8Array: !!image.uint8Array,
      uint8ArrayLength: image.uint8Array?.length || 0
    });

    // Convert to data URL for easy use in img tags
    const imageUrl = `data:image/png;base64,${image.base64}`;
    console.log('🖼️ Image URL created, length:', imageUrl.length);

    const response = { 
      imageUrl,
      prompt: enhancedPrompt
    };

    console.log('✅ Sending successful response');
    return Response.json(response);

  } catch (error) {
    console.error('❌ Image generation failed:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return Response.json(
      { error: 'Failed to generate image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}