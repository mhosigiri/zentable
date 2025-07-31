import { replicate } from '@ai-sdk/replicate';
import { experimental_generateImage as generateImage } from 'ai';
import { createClient } from '@/lib/supabase/server';
import { withCreditCheck } from '@/lib/credits';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    console.log('🎨 Image generation request received');
    
    const { prompt, templateType, theme, imageStyle } = await req.json();
    console.log('📝 Prompt:', prompt);
    console.log('🎯 Template Type:', templateType);
    console.log('🎨 Theme:', theme);
    console.log('🖌️ Image Style:', imageStyle);

    if (!prompt) {
      console.log('❌ No prompt provided');
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Get user from session
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check and deduct credits for image generation
    const creditResult = await withCreditCheck(user.id, 'image_generate', {
      prompt: prompt.substring(0, 100),
      templateType,
      theme,
      imageStyle
    });

    if (!creditResult.success) {
      return Response.json({ 
        error: creditResult.error,
        creditsRequired: 2,
        currentBalance: creditResult.currentBalance
      }, { status: 402 }); // Payment Required
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

    // Generate theme-based style description
    let themeStylePrompt = '';
    if (theme) {
      const themeColorMap: Record<string, string> = {
        'gradient-sunset': 'warm sunset colors, orange pink red yellow gradients, vibrant warm tones',
        'gradient-ocean': 'ocean blue teal colors, cool blue cyan gradients, oceanic tones',
        'gradient-forest': 'forest green teal colors, natural green gradients, earthy tones',
        'gradient-fire': 'fire orange red colors, hot pink orange gradients, energetic warm tones',
        'gradient-aurora': 'aurora purple pink colors, mystical purple gradients, ethereal tones',
        'gradient-cosmic': 'cosmic deep blue purple colors, space-like dark gradients, mysterious tones',
        'gradient-tropical': 'tropical pink blue colors, vibrant tropical gradients, bright cheerful tones',
        'gradient-neon': 'neon green cyan colors, electric bright gradients, high-energy tones',
        'gradient-volcano': 'volcano red orange colors, lava-like red gradients, intense warm tones',
        'gradient-electric': 'electric purple blue colors, lightning-like gradients, dynamic tones',
        'gradient-rainbow': 'rainbow multicolor, all spectrum colors, vibrant diverse tones',
        'solid-midnight': 'dark midnight navy colors, deep blue black tones, elegant dark colors',
        'solid-snow': 'clean white light colors, minimal bright tones, pure fresh colors',
        'solid-emerald': 'emerald green colors, rich forest green tones, luxurious green colors',
        'solid-ruby': 'ruby red colors, deep crimson red tones, rich red colors',
        'solid-amber': 'amber orange colors, warm golden orange tones, rich amber colors'
      };
      
      themeStylePrompt = themeColorMap[theme] || 'modern contemporary colors';
    }

    // Build enhanced prompt with theme and style
    let enhancedPrompt = '';
    
    // Always start with the original prompt
    if (prompt && prompt.trim()) {
      enhancedPrompt = prompt.trim();
    }
    
    // Always add theme styling if available - make it prominent
    if (themeStylePrompt) {
      if (enhancedPrompt) {
        enhancedPrompt += `, styled with ${themeStylePrompt}`;
      } else {
        enhancedPrompt = `Image styled with ${themeStylePrompt}`;
      }
    }
    
    // Add custom image style if provided
    if (imageStyle && imageStyle.trim()) {
      if (enhancedPrompt) {
        enhancedPrompt += `, ${imageStyle.trim()}`;
      } else {
        enhancedPrompt = imageStyle.trim();
      }
    }
    
    // Add base styling - always include
    enhancedPrompt += ', professional presentation style, clean, modern, high quality';
    
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
      prompt: enhancedPrompt,
      creditsRemaining: creditResult.newBalance
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