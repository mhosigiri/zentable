import { replicate } from '@ai-sdk/replicate';
import { experimental_generateImage as generateImage } from 'ai';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    console.log('Generating image with prompt:', prompt);

    // Generate image using Replicate Flux Schnell
    const { image } = await generateImage({
      model: replicate.image('black-forest-labs/flux-schnell'),
      prompt: `${prompt}, professional presentation style, clean, modern, high quality`,
      aspectRatio: '16:9', // Good for presentation slides
    });

    // Convert to data URL for easy use in img tags
    const imageUrl = `data:image/png;base64,${image.base64}`;

    console.log('Image generated successfully');

    return Response.json({ 
      imageUrl,
      prompt 
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return Response.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    );
  }
}