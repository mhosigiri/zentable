import { openai } from '@ai-sdk/openai';
import { streamObject } from 'ai';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Define schemas for different slide templates
const BlankCardSchema = z.object({
  content: z.string().describe('Complete HTML content starting with a heading (h1, h2, or h3) followed by the main content. Use appropriate formatting like <p>, <strong>, <em>, or additional headings. Structure: <h1>Title</h1><p>Content description...</p>'),
});

const ImageAndTextSchema = z.object({
  content: z.string().describe('Complete HTML content with h1 title followed by paragraphs and/or bullet points that complement the image. Structure: <h1>Title</h1><p>Description text...</p><ul><li>Key point 1</li><li>Key point 2</li></ul>'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
});

const TextAndImageSchema = z.object({
  content: z.string().describe('Complete HTML content with h1 title followed by paragraphs and/or bullet points that complement the image. Structure: <h1>Title</h1><p>Description text...</p><ul><li>Key point 1</li><li>Key point 2</li></ul>'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
});

const TwoColumnsSchema = z.object({
  content: z.string().describe('Complete HTML content with h1 title and table-based two-column layout. Structure: <h1>Title</h1><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 50%; padding: 0 1.5rem 0 0; vertical-align: top;"><h3>Left Column</h3><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 50%; padding: 0 0 0 1.5rem; vertical-align: top;"><h3>Right Column</h3><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>'),
});

const TwoColumnWithHeadingsSchema = z.object({
  content: z.string().describe('Complete HTML content with h1 title and table-based two-column layout with styled headings. Structure: <h1>Title</h1><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 50%; padding: 0 1.5rem 0 0; vertical-align: top;"><h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Left Heading</h2><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 50%; padding: 0 0 0 1.5rem; vertical-align: top;"><h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Right Heading</h2><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>'),
});

const ThreeColumnsSchema = z.object({
  content: z.string().describe('Complete HTML content with h1 title and table-based three-column layout. Structure: <h1>Title</h1><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 33.33%; padding: 0 1rem 0 0; vertical-align: top;"><h3>Column 1</h3><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 33.33%; padding: 0 0.5rem; vertical-align: top;"><h3>Column 2</h3><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 33.33%; padding: 0 0 0 1rem; vertical-align: top;"><h3>Column 3</h3><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>'),
});

const ThreeColumnWithHeadingsSchema = z.object({
  content: z.string().describe('Complete HTML content with h1 title and table-based three-column layout with styled headings. Structure: <h1>Title</h1><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 33.33%; padding: 0 1rem 0 0; vertical-align: top;"><h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Column 1 Heading</h2><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 33.33%; padding: 0 0.5rem; vertical-align: top;"><h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Column 2 Heading</h2><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 33.33%; padding: 0 0 0 1rem; vertical-align: top;"><h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Column 3 Heading</h2><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>'),
});

const FourColumnsSchema = z.object({
  content: z.string().describe('Complete HTML content with h1 title and table-based four-column layout. Structure: <h1>Title</h1><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 25%; padding: 0 0.75rem 0 0; vertical-align: top;"><h3>Column 1</h3><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 25%; padding: 0 0.375rem; vertical-align: top;"><h3>Column 2</h3><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 25%; padding: 0 0.375rem; vertical-align: top;"><h3>Column 3</h3><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 25%; padding: 0 0 0 0.75rem; vertical-align: top;"><h3>Column 4</h3><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>'),
});

const FourColumnsWithHeadingsSchema = z.object({
  content: z.string().describe('Complete HTML content with h1 title and table-based four-column layout with styled headings. Structure: <h1>Title</h1><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 25%; padding: 0 0.75rem 0 0; vertical-align: top;"><h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Column 1</h2><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 25%; padding: 0 0.375rem; vertical-align: top;"><h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Column 2</h2><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 25%; padding: 0 0.375rem; vertical-align: top;"><h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Column 3</h2><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 25%; padding: 0 0 0 0.75rem; vertical-align: top;"><h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Column 4</h2><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>'),
});

const BulletsSchema = z.object({
  content: z.string().describe('Complete HTML content with h1 title and table-based 2x2 grid layout for numbered bullet points. Structure: <h1>Title</h1><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 50%; padding: 0 1rem 1rem 0; vertical-align: top;"><h3><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">1</span>Point Title</h3><p>Description</p></td><td style="width: 50%; padding: 0 0 1rem 1rem; vertical-align: top;"><h3><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">2</span>Point Title</h3><p>Description</p></td></tr><tr><td style="width: 50%; padding: 1rem 1rem 0 0; vertical-align: top;"><h3><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">3</span>Point Title</h3><p>Description</p></td><td style="width: 50%; padding: 1rem 0 0 1rem; vertical-align: top;"><h3><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">4</span>Point Title</h3><p>Description</p></td></tr></table><hr style="margin: 2rem 0; border: 1px solid #e5e7eb;" /><p><strong>Conclusion:</strong> Summary content</p>'),
});

const ParagraphSchema = z.object({
  content: z.string().describe('Complete HTML content with h1 title followed by multiple sections with h2 headings and paragraphs. Structure: <h1>Title</h1><h2>Section 1</h2><p>Paragraph 1</p><p>Paragraph 2</p><h2>Section 2</h2><p>Paragraph 1</p><p>Paragraph 2</p><h2>Conclusion</h2><p>Concluding thoughts</p>'),
});

const TitleWithBulletsSchema = z.object({
  content: z.string().describe('Complete HTML content starting with a heading (h1, h2, or h3) followed by formatted bullet points using <ul> and <li> tags (3-5 points). Include formatting like <strong>, <em>, or additional heading tags if appropriate for emphasis. Structure: <h1>Title</h1><ul><li><p>Point 1</p></li>...</ul>'),
});

const TitleWithBulletsAndImageSchema = z.object({
  content: z.string().describe('Complete HTML content starting with h1 title followed by formatted bullet points using <ul> and <li> tags (3-4 points). Include formatting like <strong>, <em> for emphasis. Structure: <h1>Title</h1><ul><li>Point 1</li><li>Point 2</li></ul>'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
});

const TitleWithTextSchema = z.object({
  content: z.string().describe('Complete HTML content starting with h1 title followed by paragraph content (3-5 sentences maximum). Structure: <h1>Title</h1><p>Short paragraph content...</p>'),
});

const AccentLeftSchema = z.object({
  content: z.string().describe('Complete HTML content starting with h1 title followed by paragraphs and/or bullet points. Choose the format that best fits the content. Structure: <h1>Title</h1><p>Content...</p> or <h1>Title</h1><ul><li>Point 1</li><li>Point 2</li></ul>'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
});

const AccentRightSchema = z.object({
  content: z.string().describe('Complete HTML content starting with h1 title followed by paragraphs and/or bullet points. Choose the format that best fits the content. Structure: <h1>Title</h1><p>Content...</p> or <h1>Title</h1><ul><li>Point 1</li><li>Point 2</li></ul>'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
});

const AccentTopSchema = z.object({
  content: z.string().describe('Complete HTML content starting with h1 title followed by paragraphs and/or bullet points. Choose the format that best fits the content. Structure: <h1>Title</h1><p>Content...</p> or <h1>Title</h1><ul><li>Point 1</li><li>Point 2</li></ul>'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
});

const AccentBackgroundSchema = z.object({
  content: z.string().describe('Complete HTML content starting with h1 title followed by paragraphs and/or bullet points. Choose the format that best fits the content. Structure: <h1>Title</h1><p>Content...</p> or <h1>Title</h1><ul><li>Point 1</li><li>Point 2</li></ul>'),
  imagePrompt: z.string().describe('Detailed prompt for generating a background image that complements the content'),
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
    case 'title-with-text':
      return TitleWithTextSchema;
    case 'bullets':
      return BulletsSchema;
    case 'paragraph':
      return ParagraphSchema;
    case 'accent-left':
      return AccentLeftSchema;
    case 'accent-right':
      return AccentRightSchema;
    case 'accent-top':
      return AccentTopSchema;
    case 'accent-background':
      return AccentBackgroundSchema;
    default:
      return BlankCardSchema;
  }
}

function getPromptForTemplate(templateType: string, sectionTitle: string, bulletPoints: string[]) {
  const baseContent = `Section: "${sectionTitle}"\nKey points: ${bulletPoints.join(', ')}`;
  
  switch (templateType) {
    case 'blank-card':
      return `Create complete HTML content starting with a heading (h1, h2, or h3) for the title, followed by concise, impactful content. Choose the most appropriate format - either brief bullet points using <ul><li> or short paragraphs using <p>. Use HTML formatting like <strong> for emphasis. Keep all text scannable and presentation-ready. Structure: <h1>Your Title</h1><p>Your content...</p> or with bullets. Base it on: ${baseContent}`;
    
    case 'image-and-text':
      return `Create complete HTML content with h1 title followed by paragraphs and/or bullet points that complement the image. Structure: <h1>Title</h1><p>Description text...</p><ul><li>Key point 1</li><li>Key point 2</li></ul>. Also create a detailed, professional image prompt. Keep text scannable (max 2-3 sentences if paragraphs, 1-2 lines if bullets). Base it on: ${baseContent}`;
    
    case 'text-and-image':
      return `Create complete HTML content with h1 title followed by paragraphs and/or bullet points that complement the image. Structure: <h1>Title</h1><p>Description text...</p><ul><li>Key point 1</li><li>Key point 2</li></ul>. Also create a detailed, professional image prompt. Make bullet points substantial (1-2 lines) and keep all text scannable. Base it on: ${baseContent}`;
    
    case 'two-columns':
      return `Create complete HTML content with h1 title and table-based two-column layout. Structure: <h1>Title</h1><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 50%; padding: 0 1.5rem 0 0; vertical-align: top;"><h3>Left Column</h3><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 50%; padding: 0 0 0 1.5rem; vertical-align: top;"><h3>Right Column</h3><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>. Use 2-4 points per column. Base it on: ${baseContent}`;
    
    case 'two-column-with-headings':
      return `Create complete HTML content with h1 title and table-based two-column layout with styled headings. Structure: <h1>Title</h1><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 50%; padding: 0 1.5rem 0 0; vertical-align: top;"><h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Left Heading</h2><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 50%; padding: 0 0 0 1.5rem; vertical-align: top;"><h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Right Heading</h2><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>. Use clear headings (3-4 words max) and 2-4 points per column. Base it on: ${baseContent}`;
    
    case 'three-columns':
      return `Create complete HTML content with h1 title and table-based three-column layout. Structure: <h1>Title</h1><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 33.33%; padding: 0 1rem 0 0; vertical-align: top;"><h3>Column 1</h3><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 33.33%; padding: 0 0.5rem; vertical-align: top;"><h3>Column 2</h3><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 33.33%; padding: 0 0 0 1rem; vertical-align: top;"><h3>Column 3</h3><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>. Use 2-3 points per column. Base it on: ${baseContent}`;
    
    case 'three-column-with-headings':
      return `Create complete HTML content with h1 title and table-based three-column layout with styled headings. Use the exact structure from the schema with purple headings and borders. Use short headings (2-3 words max) and 2-3 points per column. Base it on: ${baseContent}`;
    
    case 'four-columns':
      return `Create complete HTML content with h1 title and table-based four-column layout. Structure: <h1>Title</h1><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 25%; padding: 0 0.75rem 0 0; vertical-align: top;"><h3>Column 1</h3><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 25%; padding: 0 0.375rem; vertical-align: top;"><h3>Column 2</h3><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 25%; padding: 0 0.375rem; vertical-align: top;"><h3>Column 3</h3><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 25%; padding: 0 0 0 0.75rem; vertical-align: top;"><h3>Column 4</h3><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>. Use 2-3 points per column. Base it on: ${baseContent}`;
    
    case 'four-columns-with-headings':
      return `Create complete HTML content with h1 title and table-based four-column layout with styled headings. Use the exact structure from the schema with purple headings and borders. Use short headings (2-3 words max) and 2-3 points per column. Base it on: ${baseContent}`;
    
    case 'bullets':
      return `Create complete HTML content with h1 title and table-based 2x2 grid layout for numbered bullet points. Use the exact structure from the schema with numbered circles and conclusion. Each bullet needs a short title (3-5 words) and brief description (1-2 lines max). Add a concise conclusion. Base it on: ${baseContent}`;
    
    case 'paragraph':
      return `Create complete HTML content with h1 title followed by multiple sections with h2 headings and paragraphs. Structure: <h1>Title</h1><h2>Section 1</h2><p>Paragraph 1</p><p>Paragraph 2</p><h2>Section 2</h2><p>Paragraph 1</p><p>Paragraph 2</p><h2>Conclusion</h2><p>Concluding thoughts</p>. Use 2-3 sections with short headings and brief paragraphs. Base it on: ${baseContent}`;
    
    case 'title-with-bullets':
      return `Create complete HTML content starting with a heading (h1, h2, or h3) for the title, followed by 3-5 formatted bullet points using <ul> and <li> tags. Each bullet should be 1-2 lines maximum - impactful and comprehensive enough to be meaningful. Use HTML formatting like <strong> for emphasis, <em> for italic, and additional heading tags if needed. Structure as: <h1>Your Title Here</h1><ul><li>First formatted point</li><li>Second point with emphasis</li>...</ul>. Choose appropriate heading level (h1 for main titles, h2 for subtitles). Base it on: ${baseContent}`;
    
    case 'title-with-bullets-and-image':
      return `Create complete HTML content starting with h1 title followed by formatted bullet points using <ul> and <li> tags (3-4 points, 1-2 lines each), and describe a relevant professional image. Use HTML formatting like <strong> for emphasis. Structure: <h1>Title</h1><ul><li>Point 1</li><li>Point 2</li></ul>. Also create a detailed image prompt. Base it on: ${baseContent}`;
    
    case 'title-with-text':
      return `Create complete HTML content starting with h1 title followed by paragraph content (3-5 sentences maximum). Structure: <h1>Title</h1><p>Short paragraph content...</p>. Use a single, well-written paragraph that captures the key message clearly and concisely. Base it on: ${baseContent}`;
    
    case 'accent-left':
    case 'accent-right':
    case 'accent-top':
    case 'accent-background':
      return `Create complete HTML content starting with h1 title followed by paragraphs and/or bullet points. Choose the format that best fits the content. Structure: <h1>Title</h1><p>Content...</p> or <h1>Title</h1><ul><li>Point 1</li><li>Point 2</li></ul>. Also create a detailed, professional image prompt that complements and enhances the content. Content should be concise and impactful (3-4 bullet points or brief paragraph). Base it on: ${baseContent}`;
    
    default:
      return `Create complete HTML content starting with a heading for the title, followed by concise, impactful content. Choose between bullet points or short paragraphs based on what's most appropriate for the content. Ensure all text can be easily read and understood on a presentation slide. Base it on: ${baseContent}`;
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
- CHOOSE the most appropriate format: bullet points for lists/key points, paragraphs for explanations
- Keep ALL text brief and scannable - this is for VISUAL presentation slides
- If using bullet points: 1-2 lines maximum (12-20 words ideal for impactful content)
- If using paragraphs: 2-3 sentences maximum, not long blocks of text
- Use active voice, strong verbs, and impactful language
- Make content immediately understandable when viewed on a slide
- Prioritize clarity and visual readability over comprehensive detail
- For image prompts, be specific and professional (include style, mood, composition)
- Ensure content flows logically and supports the main message
- Each piece of content should be presentation-ready and appropriately sized for slides

CONTENT FORMAT FLEXIBILITY:
- Use bullet points when listing key points, features, benefits, or steps
- Use short paragraphs when explaining concepts, providing context, or telling a story
- Choose the format that best serves the content and audience understanding
- Mix formats within a slide if appropriate (e.g., intro paragraph + bullet list)

CONTENT LENGTH GUIDELINES:
- Titles: 3-8 words maximum
- Bullet points: 1-2 lines, 12-20 words ideal (substantive but scannable)
- Paragraphs: 2-3 sentences maximum
- Headings: 2-4 words maximum
- Descriptions: Brief and impactful, not explanatory essays

Template: ${templateType}

Remember: Transform the outline into CONCISE, visually-friendly presentation content that audiences can quickly read and understand! Choose the best format (bullets vs paragraphs) for each piece of content and make bullet points substantial enough to be meaningful.`;

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