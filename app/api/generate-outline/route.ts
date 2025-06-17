import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const OutlineSchema = z.object({
  title: z.string().describe('A compelling, professional title for the presentation'),
  sections: z.array(
    z.object({
      title: z.string().describe('Section title that clearly describes the main topic'),
      bulletPoints: z.array(z.string()).describe('3-4 concise, actionable bullet points that support the section title'),
      templateType: z.enum([
        'blank-card',
        'image-and-text',
        'text-and-image',
        'two-columns',
        'two-column-with-headings',
        'three-columns',
        'three-column-with-headings',
        'four-columns',
        'title-with-bullets',
        'title-with-bullets-and-image'
      ]).describe('Template type that best fits the content and purpose of this section')
    })
  ).describe('Array of presentation sections with supporting bullet points and template types')
});

// Template selection logic based on content analysis
function selectTemplateType(title: string, bulletPoints: string[], index: number): string {
  const titleLower = title.toLowerCase();
  const contentText = (title + ' ' + bulletPoints.join(' ')).toLowerCase();
  
  // Check for image-related content
  if (contentText.includes('image') || contentText.includes('visual') || contentText.includes('photo') || 
      contentText.includes('picture') || contentText.includes('diagram') || contentText.includes('chart')) {
    // Randomly choose between image layouts
    return Math.random() > 0.5 ? 'image-and-text' : 'text-and-image';
  }
  
  // Multi-column layouts based on bullet point count and content structure
  if (bulletPoints.length >= 4) {
    return 'four-columns';
  } else if (bulletPoints.length === 3) {
    // Check if content suggests headings/categories
    if (contentText.includes('type') || contentText.includes('category') || 
        contentText.includes('aspect') || contentText.includes('approach')) {
      return 'three-column-with-headings';
    }
    return 'three-columns';
  } else if (bulletPoints.length === 2) {
    // Check if content suggests comparison or two distinct topics
    if (contentText.includes('vs') || contentText.includes('versus') || 
        contentText.includes('comparison') || contentText.includes('difference') ||
        contentText.includes('before') || contentText.includes('after')) {
      return 'two-column-with-headings';
    }
    return 'two-columns';
  }
  
  // Check for content that would benefit from images
  if (contentText.includes('example') || contentText.includes('case study') || 
      contentText.includes('demonstration') || contentText.includes('showcase')) {
    return 'title-with-bullets-and-image';
  }
  
  // Default to title with bullets for most content
  if (bulletPoints.length > 0) {
    return 'title-with-bullets';
  }
  
  // Fallback to blank card for minimal content
  return 'blank-card';
}

export async function POST(req: Request) {
  try {
    const { prompt, cardCount, style, language } = await req.json();

    if (!prompt) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
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

    const systemPrompt = `You are an expert presentation designer and content strategist. Create a comprehensive, well-structured presentation outline that is ${writingStyle} in tone and written in ${targetLanguage}.

Guidelines:
- Generate exactly ${cardCount} sections for the presentation
- Each section should have a clear, descriptive title
- Include 3-4 bullet points per section that are specific, actionable, and valuable
- Ensure logical flow and progression between sections
- Make content engaging and suitable for a professional presentation
- Focus on practical insights and key takeaways
- Avoid generic or vague statements
- Tailor the depth and complexity to the topic

The outline should be comprehensive enough to create a compelling ${cardCount}-slide presentation.`;

    const { partialObjectStream } = streamObject({
      model: openai('gpt-4o-mini'),
      system: systemPrompt,
      prompt: `Create a presentation outline for: "${prompt}"`,
      schema: OutlineSchema,
    });

    // Create a readable stream
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const partialObject of partialObjectStream) {
            // Add template types and IDs to sections if they exist
            if (partialObject.sections) {
              const sectionsWithTemplates = partialObject.sections.map((section, index) => ({
                ...section,
                id: `section-${index + 1}`,
                templateType: section.templateType || selectTemplateType(section.title || '', section.bulletPoints || [], index)
              }));

              const processedObject = {
                ...partialObject,
                sections: sectionsWithTemplates
              };

              console.log('Streaming partial object:', JSON.stringify(processedObject, null, 2));
              
              const chunk = encoder.encode(`data: ${JSON.stringify(processedObject)}\n\n`);
              controller.enqueue(chunk);
            }
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
    console.error('Error generating outline:', error);
    return Response.json(
      { error: 'Failed to generate outline' },
      { status: 500 }
    );
  }
}