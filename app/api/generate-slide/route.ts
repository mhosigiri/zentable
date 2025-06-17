import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Define schemas for different slide templates
const BlankCardSchema = z.object({
  title: z.string().describe('Main title for the slide'),
  content: z.string().describe('Main content or description'),
});

const ImageAndTextSchema = z.object({
  title: z.string().describe('Main title for the slide'),
  content: z.string().describe('Text content to accompany the image'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
});

const TextAndImageSchema = z.object({
  title: z.string().describe('Main title for the slide'),
  content: z.string().describe('Text content to accompany the image'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
});

const TwoColumnsSchema = z.object({
  title: z.string().describe('Main title for the slide'),
  leftContent: z.string().describe('Content for the left column'),
  rightContent: z.string().describe('Content for the right column'),
});

const TwoColumnWithHeadingsSchema = z.object({
  title: z.string().describe('Main title for the slide'),
  leftHeading: z.string().describe('Heading for the left column'),
  leftContent: z.string().describe('Content for the left column'),
  rightHeading: z.string().describe('Heading for the right column'),
  rightContent: z.string().describe('Content for the right column'),
});

const ThreeColumnsSchema = z.object({
  title: z.string().describe('Main title for the slide'),
  leftContent: z.string().describe('Content for the left column'),
  centerContent: z.string().describe('Content for the center column'),
  rightContent: z.string().describe('Content for the right column'),
});

const ThreeColumnWithHeadingsSchema = z.object({
  title: z.string().describe('Main title for the slide'),
  leftHeading: z.string().describe('Heading for the left column'),
  leftContent: z.string().describe('Content for the left column'),
  centerHeading: z.string().describe('Heading for the center column'),
  centerContent: z.string().describe('Content for the center column'),
  rightHeading: z.string().describe('Heading for the right column'),
  rightContent: z.string().describe('Content for the right column'),
});

const FourColumnsSchema = z.object({
  title: z.string().describe('Main title for the slide'),
  column1Content: z.string().describe('Content for the first column'),
  column2Content: z.string().describe('Content for the second column'),
  column3Content: z.string().describe('Content for the third column'),
  column4Content: z.string().describe('Content for the fourth column'),
});

const TitleWithBulletsSchema = z.object({
  title: z.string().describe('Main title for the slide'),
  bulletPoints: z.array(z.string()).describe('Array of bullet points (3-5 points)'),
});

const TitleWithBulletsAndImageSchema = z.object({
  title: z.string().describe('Main title for the slide'),
  bulletPoints: z.array(z.string()).describe('Array of bullet points (3-4 points)'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
});

function getSchemaForTemplate(templateType: string) {
  switch (templateType) {
    case 'blank-card':
      return BlankCardSchema;
    case 'image-and-text':
      return ImageAndTextSchema;
    case 'text-and-image':
      return TextAndImageSchema;
    case 'two-columns':
      return TwoColumnsSchema;
    case 'two-column-with-headings':
      return TwoColumnWithHeadingsSchema;
    case 'three-columns':
      return ThreeColumnsSchema;
    case 'three-column-with-headings':
      return ThreeColumnWithHeadingsSchema;
    case 'four-columns':
      return FourColumnsSchema;
    case 'title-with-bullets':
      return TitleWithBulletsSchema;
    case 'title-with-bullets-and-image':
      return TitleWithBulletsAndImageSchema;
    default:
      return BlankCardSchema;
  }
}

function getPromptForTemplate(templateType: string, sectionTitle: string, bulletPoints: string[]) {
  const baseContent = `Section: "${sectionTitle}"\nKey points: ${bulletPoints.join(', ')}`;
  
  switch (templateType) {
    case 'blank-card':
      return `Create a clean, focused slide with a clear title and comprehensive content. Expand on the topic with detailed explanations. Base it on: ${baseContent}`;
    
    case 'image-and-text':
      return `Create a slide with compelling text content and describe an image that would visually represent the concept. Provide detailed, engaging content that expands on the topic. Base it on: ${baseContent}`;
    
    case 'text-and-image':
      return `Create a slide with detailed text content and describe an image that would complement the information. Provide comprehensive explanations and insights. Base it on: ${baseContent}`;
    
    case 'two-columns':
      return `Create a two-column slide layout with balanced content distribution. Split the information logically and provide detailed content for each column. Base it on: ${baseContent}`;
    
    case 'two-column-with-headings':
      return `Create a two-column slide with clear headings and comprehensive supporting content for each column. Organize the information with detailed explanations. Base it on: ${baseContent}`;
    
    case 'three-columns':
      return `Create a three-column slide layout with evenly distributed content. Break down the information into three logical parts with detailed explanations. Base it on: ${baseContent}`;
    
    case 'three-column-with-headings':
      return `Create a three-column slide with descriptive headings and comprehensive supporting content for each column. Provide detailed insights for each section. Base it on: ${baseContent}`;
    
    case 'four-columns':
      return `Create a four-column slide layout with detailed content for each column. Break down the information into four key aspects with comprehensive explanations. Base it on: ${baseContent}`;
    
    case 'title-with-bullets':
      return `Create a slide with a strong title and 3-5 clear, detailed bullet points. Each bullet point should be comprehensive and actionable. Expand significantly on the original points. Base it on: ${baseContent}`;
    
    case 'title-with-bullets-and-image':
      return `Create a slide with a compelling title, 3-4 detailed bullet points, and describe an image that would enhance the message. Provide comprehensive content that expands on the topic. Base it on: ${baseContent}`;
    
    default:
      return `Create comprehensive slide content that expands significantly on the topic with detailed explanations and insights. Base it on: ${baseContent}`;
  }
}

export async function POST(req: Request) {
  try {
    const { sectionTitle, bulletPoints, templateType, style = 'default', language = 'en' } = await req.json();

    if (!sectionTitle || !bulletPoints || !templateType) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Map style to writing tone
    const styleMap: Record<string, string> = {
      'default': 'professional and clear',
      'modern': 'contemporary and engaging',
      'minimal': 'concise and focused',
      'creative': 'innovative and inspiring'
    };

    // Map language to instruction
    const languageMap: Record<string, string> = {
      'en': 'English',
      'es': 'Spanish',
      'fr': 'French',
      'de': 'German'
    };

    const writingStyle = styleMap[style] || 'professional and clear';
    const targetLanguage = languageMap[language] || 'English';

    const schema = getSchemaForTemplate(templateType);
    const prompt = getPromptForTemplate(templateType, sectionTitle, bulletPoints);

    const systemPrompt = `You are an expert presentation designer and content creator. Create compelling slide content that is ${writingStyle} in tone and written in ${targetLanguage}.

CRITICAL INSTRUCTIONS:
- DO NOT use the outline bullet points directly - they are just reference points
- CREATE consice content that explains significantly on the topic
- Make content engaging, professional, and much more detailed than the outline
- Ensure all text is clear, actionable, and provides real value
- For image prompts, be specific and descriptive (include style, mood, colors, composition)
- Keep content focused but comprehensive - avoid superficial information
- Use active voice and strong verbs
- Make bullet points parallel in structure and detailed
- Ensure content flows logically and supports the main message
- Each piece of content should be presentation-ready and professional, so make sure it fits a slide's length

Template: ${templateType}

Remember: Transform the basic outline into rich, detailed presentation content!`;

    console.log('Generating slide with:', {
      templateType,
      sectionTitle,
      bulletPoints,
      style,
      language
    });

    const { partialObjectStream } = streamObject({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      prompt,
      schema,
    });

    // Create a readable stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const partialObject of partialObjectStream) {
            console.log('Streaming slide data:', JSON.stringify(partialObject, null, 2));
            
            const chunk = encoder.encode(`data: ${JSON.stringify(partialObject)}\n\n`);
            controller.enqueue(chunk);
          }
          
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      }
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error generating slide:', error);
    return Response.json(
      { error: 'Failed to generate slide' },
      { status: 500 }
    );
  }
}