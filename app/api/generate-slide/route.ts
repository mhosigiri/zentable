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
  leftBullets: z.array(z.string()).describe('Array of bullet points for the left column (2-4 points)'),
  rightBullets: z.array(z.string()).describe('Array of bullet points for the right column (2-4 points)'),
});

const TwoColumnWithHeadingsSchema = z.object({
  title: z.string().describe('Main title for the slide'),
  leftHeading: z.string().describe('Heading for the left column'),
  leftBullets: z.array(z.string()).describe('Array of bullet points for the left column (2-4 points)'),
  rightHeading: z.string().describe('Heading for the right column'),
  rightBullets: z.array(z.string()).describe('Array of bullet points for the right column (2-4 points)'),
});

const ThreeColumnsSchema = z.object({
  title: z.string().describe('Main title for the slide'),
  leftBullets: z.array(z.string()).describe('Array of bullet points for the left column (2-3 points)'),
  centerBullets: z.array(z.string()).describe('Array of bullet points for the center column (2-3 points)'),
  rightBullets: z.array(z.string()).describe('Array of bullet points for the right column (2-3 points)'),
});

const ThreeColumnWithHeadingsSchema = z.object({
  title: z.string().describe('Main title for the slide'),
  leftHeading: z.string().describe('Heading for the left column'),
  leftBullets: z.array(z.string()).describe('Array of bullet points for the left column (2-3 points)'),
  centerHeading: z.string().describe('Heading for the center column'),
  centerBullets: z.array(z.string()).describe('Array of bullet points for the center column (2-3 points)'),
  rightHeading: z.string().describe('Heading for the right column'),
  rightBullets: z.array(z.string()).describe('Array of bullet points for the right column (2-3 points)'),
});

const FourColumnsSchema = z.object({
  title: z.string().describe('Main title for the slide'),
  column1Bullets: z.array(z.string()).describe('Array of bullet points for the first column (2-3 points)'),
  column2Bullets: z.array(z.string()).describe('Array of bullet points for the second column (2-3 points)'),
  column3Bullets: z.array(z.string()).describe('Array of bullet points for the third column (2-3 points)'),
  column4Bullets: z.array(z.string()).describe('Array of bullet points for the fourth column (2-3 points)'),
});

const FourColumnsWithHeadingsSchema = z.object({
  title: z.string().describe('Main title for the slide'),
  column1Heading: z.string().describe('Heading for the first column'),
  column1Bullets: z.array(z.string()).describe('Array of bullet points for the first column (2-3 points)'),
  column2Heading: z.string().describe('Heading for the second column'),
  column2Bullets: z.array(z.string()).describe('Array of bullet points for the second column (2-3 points)'),
  column3Heading: z.string().describe('Heading for the third column'),
  column3Bullets: z.array(z.string()).describe('Array of bullet points for the third column (2-3 points)'),
  column4Heading: z.string().describe('Heading for the fourth column'),
  column4Bullets: z.array(z.string()).describe('Array of bullet points for the fourth column (2-3 points)'),
});

const BulletsSchema = z.object({
  title: z.string().describe('Main title for the slide'),
  bullets: z.array(z.object({
    title: z.string().describe('Title for the bullet point'),
    description: z.string().describe('Description for the bullet point'),
  })).describe('Array of 4 numbered bullet points with titles and descriptions'),
  conclusion: z.string().describe('Concluding paragraph that summarizes the key points'),
});

const ParagraphSchema = z.object({
  title: z.string().describe('Main title for the slide'),
  sections: z.array(z.object({
    heading: z.string().describe('Section heading'),
    paragraphs: z.array(z.string()).describe('Array of paragraphs for this section (1-2 paragraphs)'),
  })).describe('Array of 2-3 sections with headings and paragraphs'),
  conclusion: z.string().describe('Concluding paragraph that summarizes the content'),
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

function getSchemaForTemplate(templateType: string): z.ZodType<any> {
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
    case 'four-columns-with-headings':
      return FourColumnsWithHeadingsSchema;
    case 'title-with-bullets':
      return TitleWithBulletsSchema;
    case 'title-with-bullets-and-image':
      return TitleWithBulletsAndImageSchema;
    case 'bullets':
      return BulletsSchema;
    case 'paragraph':
      return ParagraphSchema;
    default:
      return BlankCardSchema;
  }
}

function getPromptForTemplate(templateType: string, sectionTitle: string, bulletPoints: string[]) {
  const baseContent = `Section: "${sectionTitle}"\nKey points: ${bulletPoints.join(', ')}`;
  
  switch (templateType) {
    case 'blank-card':
      return `Create a clean slide with a clear title and concise, impactful content. Keep text brief and scannable - max 2-3 short sentences or key phrases. Base it on: ${baseContent}`;
    
    case 'image-and-text':
      return `Create a slide with compelling but brief text content (2-3 short sentences max) and describe a specific, professional image. Keep text scannable and presentation-ready. Base it on: ${baseContent}`;
    
    case 'text-and-image':
      return `Create a slide with concise, impactful text content (2-3 short sentences max) and describe a relevant professional image. Focus on key insights, not detailed explanations. Base it on: ${baseContent}`;
    
    case 'two-columns':
      return `Create a two-column slide with balanced, brief bullet points (2-4 per column). Each bullet should be 1 line maximum - clear, actionable, and scannable. Base it on: ${baseContent}`;
    
    case 'two-column-with-headings':
      return `Create a two-column slide with clear headings (3-4 words max) and brief bullet points (2-4 per column, 1 line each). Keep content scannable and presentation-ready. Base it on: ${baseContent}`;
    
    case 'three-columns':
      return `Create a three-column slide with concise bullet points (2-3 per column, 1 line each). Focus on key insights that can be quickly scanned and understood. Base it on: ${baseContent}`;
    
    case 'three-column-with-headings':
      return `Create a three-column slide with short headings (2-3 words max) and brief bullet points (2-3 per column, 1 line each). Prioritize clarity and visual readability. Base it on: ${baseContent}`;
    
    case 'four-columns':
      return `Create a four-column slide with concise bullet points (2-3 per column, 1 line each). Each bullet should be a key insight, not a detailed explanation. Base it on: ${baseContent}`;
    
    case 'four-columns-with-headings':
      return `Create a four-column slide with short, descriptive headings (2-3 words max) and brief bullet points (2-3 per column, 1 line each). Keep all text scannable. Base it on: ${baseContent}`;
    
    case 'bullets':
      return `Create a slide with 4 numbered bullet points in a 2x2 grid. Each bullet needs a short title (3-5 words) and brief description (1-2 lines max). Add a concise conclusion (1-2 sentences). Base it on: ${baseContent}`;
    
    case 'paragraph':
      return `Create a slide with 2-3 sections, each with a short heading (3-4 words) and 1-2 brief paragraphs (2-3 sentences each, not long blocks of text). Include a concise conclusion (1-2 sentences). Base it on: ${baseContent}`;
    
    case 'title-with-bullets':
      return `Create a slide with a strong title and 3-5 clear, concise bullet points. Each bullet should be 1 line maximum - impactful and easy to read on a slide. Base it on: ${baseContent}`;
    
    case 'title-with-bullets-and-image':
      return `Create a slide with a compelling title, 3-4 brief bullet points (1 line each), and describe a relevant professional image. Keep all text scannable and presentation-ready. Base it on: ${baseContent}`;
    
    default:
      return `Create concise slide content with brief, impactful text that can be easily read and understood on a presentation slide. Avoid long paragraphs. Base it on: ${baseContent}`;
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

CRITICAL INSTRUCTIONS FOR PRESENTATION SLIDES:
- DO NOT use the outline bullet points directly - they are reference points only
- CREATE concise, presentation-ready content that expands meaningfully on the topic
- Keep ALL text brief and scannable - this is for VISUAL presentation slides
- Each bullet point should be 1 line maximum (8-12 words ideal)
- Paragraphs should be 2-3 sentences maximum, not long blocks of text
- Use active voice, strong verbs, and impactful language
- Make content immediately understandable when viewed on a slide
- Prioritize clarity and visual readability over comprehensive detail
- For image prompts, be specific and professional (include style, mood, composition)
- Ensure content flows logically and supports the main message
- Each piece of content should be presentation-ready and appropriately sized for slides

CONTENT LENGTH GUIDELINES:
- Titles: 3-8 words maximum
- Bullet points: 1 line, 8-12 words ideal
- Paragraphs: 2-3 sentences maximum
- Headings: 2-4 words maximum
- Descriptions: Brief and impactful, not explanatory essays

Template: ${templateType}

Remember: Transform the outline into CONCISE, visually-friendly presentation content that audiences can quickly read and understand!`;

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
            const chunk = encoder.encode(`data: ${JSON.stringify(partialObject)}\n\n`);
            controller.enqueue(chunk);
          }
          
          controller.close();
        } catch (error) {
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
    return Response.json(
      { error: 'Failed to generate slide' },
      { status: 500 }
    );
  }
}