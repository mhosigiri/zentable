import { createGroq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';
import { withCreditCheck } from '@/lib/credits';

export const dynamic = 'force-dynamic';

// Configure Groq with Llama 4 Scout
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const modelName = 'openai/gpt-oss-20b';

// Define schemas for different slide templates
const BlankCardSchema = z.object({
  content: z.string().describe('Complete HTML content starting with a heading (h3 for main title, h4 for subtitles) followed by the main content. Use appropriate formatting like <p>, <strong>, <em>, or additional headings. Structure: <h3>Title</h3><p>Content description...</p>'),
});

const ImageAndTextSchema = z.object({
  content: z.string().describe('Complete HTML content with h3 title followed by paragraphs and/or bullet points that complement the image. Structure: <h3>Title</h3><p>Description text...</p><ul><li>Key point 1</li><li>Key point 2</li></ul>'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
});

const TextAndImageSchema = z.object({
  content: z.string().describe('Complete HTML content with h3 title followed by paragraphs and/or bullet points that complement the image. Structure: <h3>Title</h3><p>Description text...</p><ul><li>Point 1</li><li>Point 2</li></ul>'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
});

const TwoColumnsSchema = z.object({
  content: z.string().describe('Complete HTML content with h3 title and table-based two-column layout. Structure: <h3>Title</h3><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 50%; padding: 0 1.5rem 0 0; vertical-align: top;"><h4>Meaningful Left Heading</h4><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 50%; padding: 0 0 0 1.5rem; vertical-align: top;"><h4>Meaningful Right Heading</h4><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>'),
});

const TwoColumnWithHeadingsSchema = z.object({
  content: z.string().describe('Complete HTML content with h3 title and table-based two-column layout with styled headings. Structure: <h3>Title</h3><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 50%; padding: 0 1.5rem 0 0; vertical-align: top;"><h4 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Meaningful Left Heading</h4><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 50%; padding: 0 0 0 1.5rem; vertical-align: top;"><h4 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Meaningful Right Heading</h4><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>'),
});

const ThreeColumnsSchema = z.object({
  content: z.string().describe('Complete HTML content with h3 title and table-based three-column layout. Structure: <h3>Title</h3><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 33.33%; padding: 0 1rem 0 0; vertical-align: top;"><h4>Meaningful Heading 1</h4><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 33.33%; padding: 0 0.5rem; vertical-align: top;"><h4>Meaningful Heading 2</h4><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 33.33%; padding: 0 0 0 1rem; vertical-align: top;"><h4>Meaningful Heading 3</h4><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>'),
});

const ThreeColumnWithHeadingsSchema = z.object({
  content: z.string().describe('Complete HTML content with h3 title and table-based three-column layout with styled headings. Structure: <h3>Title</h3><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 33.33%; padding: 0 1rem 0 0; vertical-align: top;"><h4 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Meaningful Heading 1</h4><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 33.33%; padding: 0 0.5rem; vertical-align: top;"><h4 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Meaningful Heading 2</h4><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 33.33%; padding: 0 0 0 1rem; vertical-align: top;"><h4 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Meaningful Heading 3</h4><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>'),
});

const FourColumnsSchema = z.object({
  content: z.string().describe('Complete HTML content with h3 title and table-based four-column layout. Structure: <h3>Title</h3><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 25%; padding: 0 0.75rem 0 0; vertical-align: top;"><h4>Meaningful Heading 1</h4><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 25%; padding: 0 0.375rem; vertical-align: top;"><h4>Meaningful Heading 2</h4><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 25%; padding: 0 0.375rem; vertical-align: top;"><h4>Meaningful Heading 3</h4><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 25%; padding: 0 0 0 0.75rem; vertical-align: top;"><h4>Meaningful Heading 4</h4><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>'),
});

const FourColumnsWithHeadingsSchema = z.object({
  content: z.string().describe('Complete HTML content with h3 title and table-based four-column layout with styled headings. Structure: <h3>Title</h3><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 25%; padding: 0 0.75rem 0 0; vertical-align: top;"><h4 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Meaningful Heading 1</h4><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 25%; padding: 0 0.375rem; vertical-align: top;"><h4 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Meaningful Heading 2</h4><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 25%; padding: 0 0.375rem; vertical-align: top;"><h4 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Meaningful Heading 3</h4><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 25%; padding: 0 0 0 0.75rem; vertical-align: top;"><h4 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Meaningful Heading 4</h4><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>'),
});

const BulletsSchema = z.object({
  content: z.string().describe('Complete HTML content with h3 title and table-based 2x2 grid layout for exactly 4 numbered bullet points with bold Point Titles. Structure: <h3>Title</h3><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 50%; padding: 0 1rem 1rem 0; vertical-align: top;"><h4><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">1</span>Point Title</h4><p>Description</p></td><td style="width: 50%; padding: 0 0 1rem 1rem; vertical-align: top;"><h4><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">2</span>Point Title</h4><p>Description</p></td></tr><tr><td style="width: 50%; padding: 1rem 1rem 0 0; vertical-align: top;"><h4><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">3</span>Point Title</h4><p>Description</p></td><td style="width: 50%; padding: 1rem 0 0 1rem; vertical-align: top;"><h4><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">4</span>Point Title</h4><p>Description</p></td></tr></table><hr style="margin: 2rem 0; border: 1px solid #e5e7eb;" /><p><strong>Conclusion:</strong> Summary content</p>'),
});

const ParagraphSchema = z.object({
  content: z.string().describe('Complete HTML content with h3 title followed by multiple sections with h4 headings and paragraphs. Structure: <h3>Title</h3><h4>Section 1</h4><p>Paragraph 1</p><p>Paragraph 2</p><h4>Section 2</h4><p>Paragraph 1</p><p>Paragraph 2</p><h4>Conclusion</h4><p>Concluding thoughts</p>'),
});

const TitleWithBulletsSchema = z.object({
  content: z.string().describe('Complete HTML content starting with a heading (h3 for main title, h4 for subtitles) followed by formatted bullet points using <ul> and <li> tags (3-5 points). Include formatting like <strong>, <em>, or additional heading tags if appropriate for emphasis. Structure: <h3>Title</h3><ul><li><p>Point 1</p></li>...</ul>'),
});

const TitleWithBulletsAndImageSchema = z.object({
  content: z.string().describe('Complete HTML content starting with h3 title followed by formatted bullet points using <ul> and <li> tags (3-4 points). Include formatting like <strong>, <em> for emphasis. Structure: <h3>Title</h3><ul><li>Point 1</li><li>Point 2</li></ul>'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
});

const TitleWithTextSchema = z.object({
  content: z.string().describe('Complete HTML content starting with h3 title followed by paragraph content (3-5 sentences maximum). Structure: <h3>Title</h3><p>Short paragraph content...</p>'),
});

const AccentLeftSchema = z.object({
  content: z.string().describe('Complete HTML content starting with h3 title followed by short paragraphs and/or bullet points. Choose the format that best fits the content. Structure: <h3>Title</h3><p>Content...</p> or <h3>Title</h3><ul><li>Point 1</li><li>Point 2</li></ul>'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
});

const AccentRightSchema = z.object({
  content: z.string().describe('Complete HTML content starting with h3 title followed by short paragraphs and/or bullet points. Choose the format that best fits the content. Structure: <h3>Title</h3><p>Content...</p> or <h3>Title</h3><ul><li>Point 1</li><li>Point 2</li></ul>'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
});

const AccentTopSchema = z.object({
  content: z.string().describe('Complete HTML content starting with h3 title followed by paragraphs and/or bullet points. Choose the format that best fits the content. Structure: <h3>Title</h3><p>Content...</p> or <h3>Title</h3><ul><li>Point 1</li><li>Point 2</li></ul>'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
});

const AccentBackgroundSchema = z.object({
  content: z.string().describe('Complete HTML content starting with h3 title followed by paragraphs and/or bullet points. Choose the format that best fits the content. Structure: <h3>Title</h3><p>Content...</p> or <h3>Title</h3><ul><li>Point 1</li><li>Point 2</li></ul>'),
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
      return `Create complete HTML content starting with a heading (h3 for title, h4 for subtitles) for the title, followed by concise, impactful content. Choose the most appropriate format - either brief bullet points using <ul><li> or short paragraphs using <p>. Use HTML formatting like <strong> for emphasis. Keep all text scannable and presentation-ready. Structure: <h3>Your Title</h3><p>Your content...</p> or with bullets. Base it on: ${baseContent}`;
    
    case 'image-and-text':
      return `Create complete HTML content with h3 title followed by paragraphs and/or bullet points that complement the image. Structure: <h3>Title</h3><p>Description text...</p><ul><li>Key point 1</li><li>Key point 2</li></ul>. Also create a detailed, professional image prompt. Keep text scannable (max 2-3 sentences if paragraphs, 1-2 lines if bullets). Base it on: ${baseContent}`;
    
    case 'text-and-image':
      return `Create complete HTML content with h3 title followed by paragraphs and/or bullet points that complement the image. Structure: <h3>Title</h3><p>Description text...</p><ul><li>Key point 1</li><li>Key point 2</li></ul>. Also create a detailed, professional image prompt. Make bullet points substantial (1-2 lines) and keep all text scannable. Base it on: ${baseContent}`;
    
    case 'two-columns':
      return `Create complete HTML content with h3 title and table-based two-column layout. Create meaningful column headings (2-4 words each) that relate to the content. Structure: <h3>Title</h3><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 50%; padding: 0 1.5rem 0 0; vertical-align: top;"><h4>Meaningful Left Heading</h4><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 50%; padding: 0 0 0 1.5rem; vertical-align: top;"><h4>Meaningful Right Heading</h4><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>. Use 2-4 points per column with descriptive, content-specific column headings. Base it on: ${baseContent}`;
    
    case 'two-column-with-headings':
      return `Create complete HTML content with h3 title and table-based two-column layout with styled headings. Create meaningful column headings (2-4 words each) that relate to the content. Structure: <h3>Title</h3><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 50%; padding: 0 1.5rem 0 0; vertical-align: top;"><h4 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Meaningful Left Heading</h4><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 50%; padding: 0 0 0 1.5rem; vertical-align: top;"><h4 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Meaningful Right Heading</h4><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>. Use descriptive, content-specific column headings (2-4 words max) and 2-4 points per column. Base it on: ${baseContent}`;
    
    case 'three-columns':
      return `Create complete HTML content with h3 title and table-based three-column layout. Create meaningful column headings (2-3 words each) that relate to the content. Structure: <h3>Title</h3><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 33.33%; padding: 0 1rem 0 0; vertical-align: top;"><h4>Meaningful Heading 1</h4><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 33.33%; padding: 0 0.5rem; vertical-align: top;"><h4>Meaningful Heading 2</h4><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 33.33%; padding: 0 0 0 1rem; vertical-align: top;"><h4>Meaningful Heading 3</h4><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>. Use 2-3 points per column with descriptive, content-specific column headings. Base it on: ${baseContent}`;
    
    case 'three-column-with-headings':
      return `Create complete HTML content with h3 title and table-based three-column layout with styled headings. Create meaningful column headings (2-3 words each) that relate to the content. Use h4 tags for column headings with purple styling. Use descriptive, content-specific headings (2-3 words max) and 2-3 points per column. Base it on: ${baseContent}`;
    
    case 'four-columns':
      return `Create complete HTML content with h3 title and table-based four-column layout. Create meaningful column headings (2-3 words each) that relate to the content. Structure: <h3>Title</h3><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 25%; padding: 0 0.75rem 0 0; vertical-align: top;"><h4>Meaningful Heading 1</h4><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 25%; padding: 0 0.375rem; vertical-align: top;"><h4>Meaningful Heading 2</h4><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 25%; padding: 0 0.375rem; vertical-align: top;"><h4>Meaningful Heading 3</h4><ul><li>Point 1</li><li>Point 2</li></ul></td><td style="width: 25%; padding: 0 0 0 0.75rem; vertical-align: top;"><h4>Meaningful Heading 4</h4><ul><li>Point 1</li><li>Point 2</li></ul></td></tr></table>. Use 2-3 points per column with descriptive, content-specific column headings. Base it on: ${baseContent}`;
    
    case 'four-columns-with-headings':
      return `Create complete HTML content with h3 title and table-based four-column layout with styled headings. Create meaningful column headings (2-3 words each) that relate to the content. Use the exact structure from the schema with purple headings and borders. Use descriptive, content-specific headings (2-3 words max) and 2-3 points per column. Base it on: ${baseContent}`;
    
    case 'bullets':
      return `Create complete HTML content with h3 title and table-based 2x2 grid layout for exactly 4 numbered bullet points with bold Point Titles. Structure: <h3>Title</h3><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 50%; padding: 0 1rem 1rem 0; vertical-align: top;"><h4><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">1</span>Point Title</h4><p>Description</p></td><td style="width: 50%; padding: 0 0 1rem 1rem; vertical-align: top;"><h4><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">2</span>Point Title</h4><p>Description</p></td></tr><tr><td style="width: 50%; padding: 1rem 1rem 0 0; vertical-align: top;"><h4><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">3</span>Point Title</h4><p>Description</p></td><td style="width: 50%; padding: 1rem 0 0 1rem; vertical-align: top;"><h4><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">4</span>Point Title</h4><p>Description</p></td></tr></table><hr style="margin: 2rem 0; border: 1px solid #e5e7eb;" /><p><strong>Conclusion:</strong> Summary content</p>. Keep each point concise (3-8 words for Point Title, 1-2 sentences for Description). Add a brief, strong conclusion. Base it on: ${baseContent}`;
    
    case 'paragraph':
      return `Create complete HTML content with h3 title followed by multiple sections with h4 headings and paragraphs. Structure must include at least 2 sections with descriptive h4 headings and 1-2 paragraphs per section. End with a conclusion section. Structure: <h3>Title</h3><h4>Section 1</h4><p>Paragraph content</p><h4>Section 2</h4><p>Paragraph content</p><h4>Conclusion</h4><p>Concluding thoughts</p>. Keep paragraphs scannable (2-3 sentences each). Base it on: ${baseContent}`;
    
    case 'title-with-bullets':
      return `Create complete HTML content starting with a heading (h3 for main title, h4 for subtitles) followed by 3-5 formatted bullet points using <ul> and <li> tags. Each bullet should be 1-2 lines maximum - impactful and comprehensive enough to be meaningful. Use HTML formatting like <strong> for emphasis, <em> for italic, and additional heading tags if needed. Structure as: <h3>Your Title Here</h3><ul><li>First formatted point</li><li>Second point with emphasis</li>...</ul>. Choose appropriate heading level (h3 for main titles). Base it on: ${baseContent}`;
    
    case 'title-with-bullets-and-image':
      return `Create complete HTML content starting with h3 title followed by 3-4 bullet points. Also create a detailed image prompt. Structure: <h3>Title</h3><ul><li>Point 1</li><li>Point 2</li>...</ul>. Make bullet points substantial (1-2 lines each). Ensure image prompt creates visualization that supports the content. Base it on: ${baseContent}`;
    
    case 'title-with-text':
      return `Create complete HTML content starting with h3 title followed by paragraph content (3-5 sentences maximum). Structure: <h3>Title</h3><p>Short paragraph content...</p>. Use a single, well-written paragraph that captures the key message clearly and concisely. Base it on: ${baseContent}`;
    
    case 'accent-left':
    case 'accent-right':
    case 'accent-top':
    case 'accent-background':
      return `Create complete HTML content starting with h3 title followed by short paragraphs and/or bullet points. Choose the format that best fits the content. Structure: <h3>Title</h3><p>Content...</p> or <h3>Title</h3><ul><li>Point 1</li><li>Point 2</li></ul>. Also create a detailed, professional image prompt that complements and enhances the content. Content should be concise and impactful (3-4 bullet points or brief paragraph). Base it on: ${baseContent}`;
    
    default:
      return `Create complete HTML content starting with a heading for the title, followed by concise, impactful content. Choose between bullet points or short paragraphs based on what's most appropriate for the content. Ensure all text can be easily read and understood on a presentation slide. Base it on: ${baseContent}`;
  }
}

export async function POST(req: Request) {
  try {
    console.log('🔄 Generate-slide API called');
    const { sectionTitle, bulletPoints, templateType, style = 'default', language = 'en', contentLength = 'medium', imageStyle = 'professional' } = await req.json();

    console.log('📥 Request data:', { sectionTitle, bulletPoints, templateType, style, language, contentLength, imageStyle });

    if (!sectionTitle || !bulletPoints || !templateType) {
      console.log('❌ Missing required fields');
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user from session
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check and deduct credits for slide generation
    const creditResult = await withCreditCheck(user.id, 'slide_generate', {
      sectionTitle: sectionTitle.substring(0, 50),
      templateType,
      style,
      language
    });

    if (!creditResult.success) {
      return Response.json({ 
        error: creditResult.error,
        creditsRequired: 5,
        currentBalance: creditResult.currentBalance
      }, { status: 402 }); // Payment Required
    }

    // Check if GROQ_API_KEY is available
    if (!process.env.GROQ_API_KEY) {
      console.log('❌ GROQ_API_KEY not found');
      return Response.json({ error: 'GROQ_API_KEY not configured' }, { status: 500 });
    }

    console.log('✅ GROQ_API_KEY found');

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

    // Map content length to specific word count guidelines
    const contentLengthMap: Record<string, string> = {
      'brief': 'VERY BRIEF - Bullet points: 1 line max (4-8 words). Paragraphs: 1-2 sentences max. Maximum 100 words total across all content.',
      'medium': 'MODERATE - Bullet points: 1-2 lines (8-16 words). Paragraphs: 2-3 sentences max. Maximum 150 words total across all content.',
      'detailed': 'COMPREHENSIVE - Bullet points: 2-3 lines (16-24 words). Paragraphs: 3-4 sentences max. Maximum 200 words total across all content.'
    };

    const writingStyle = styleMap[style] || 'professional and clear';
    const targetLanguage = languageMap[language] || 'English';
    const contentGuidelines = contentLengthMap[contentLength] || contentLengthMap['medium'];

    const schema = getSchemaForTemplate(templateType);
    const prompt = getPromptForTemplate(templateType, sectionTitle, bulletPoints);

    console.log('📋 Schema and prompt ready, template:', templateType);

    const systemPrompt = `You are an expert presentation designer and content creator. Create compelling slide content that is ${writingStyle} in tone and written in ${targetLanguage}.

IMPORTANT: You must respond with valid JSON only. Do not include any text outside the JSON structure.

CRITICAL INSTRUCTIONS FOR PRESENTATION SLIDES:
- DO NOT use the outline bullet points directly - they are reference points only
- CREATE concise, presentation-ready content that expands meaningfully on the topic
- CHOOSE the most appropriate format: bullet points for lists/key points, paragraphs for explanations
- Keep ALL text brief and scannable - this is for VISUAL presentation slides
- Use active voice, strong verbs, and impactful language
- Make content immediately understandable when viewed on a slide
- Prioritize clarity and visual readability over comprehensive detail
- Ensure content flows logically and supports the main message
- Each piece of content should be presentation-ready and appropriately sized for slides

CONTENT LENGTH REQUIREMENTS: ${contentGuidelines}

CONTENT FORMAT FLEXIBILITY:
- Use bullet points when listing key points, features, benefits, or steps
- Use short paragraphs when explaining concepts, providing context, or telling a story
- Choose the format that best serves the content and audience understanding
- Mix formats within a slide if appropriate (e.g., intro paragraph + bullet list)

IMAGE STYLE REQUIREMENTS:
- For image prompts, be specific and professional
- Image style context: ${imageStyle}
- Include composition, mood, and visual elements that match this style
- Ensure images complement and enhance the text content

CONTENT LENGTH GUIDELINES:
- Titles: 3-8 words maximum
- Headings: 2-4 words maximum
- Total content word count: ${contentLength} (Brief: <100 words, Medium: 150 words, Detailed: 200 words)
- Be concise and impactful - every word must earn its place on the slide

Example of brief slide that is less than 100 words (without formatting):
Effective Student Assessments

Assessments are vital. Key principles include:
Clear learning objectives.
Formative and summative assessments.
Incorporate technology.
Offer timely feedback.

Example of medium slide that is less than 150 words (without formatting):
Effective Student Assessments

Assessments are vital for measuring learning and guiding instruction. Key principles include:
Align with clear learning objectives.
Use both formative and summative assessments.
Incorporate technology to enhance engagement.
Offer timely feedback for student growth.

Template: ${templateType}

Remember: Transform the outline into CONCISE, visually-friendly presentation content that audiences can quickly read and understand! Choose the best format (bullets vs paragraphs) for each piece of content and make content substantial enough to be meaningful while respecting the ${contentLength} length requirements.`;

        console.log('🚀 Starting generateObject call with Groq...');

    try {
      const result = await generateObject({
        model: groq(modelName),
        system: systemPrompt,
        prompt,
        schema,
        temperature: 0.7,
      });

      console.log('✅ generateObject completed successfully');
      console.log('📊 Usage:', result.usage);

      return Response.json({
        success: true,
        data: result.object,
        usage: result.usage,
        creditsRemaining: creditResult.newBalance
      });

    } catch (generateError) {
      console.error('❌ Error with generateObject:', generateError);
      console.error('Error details:', generateError instanceof Error ? generateError.message : String(generateError));
      console.error('Error stack:', generateError instanceof Error ? generateError.stack : 'No stack trace');
      
      // Try fallback with different model
      console.log('🔄 Attempting fallback with llama-3.3-70b-versatile...');
      try {
        const fallbackResult = await generateObject({
          model: groq('llama-3.3-70b-versatile'),
          system: systemPrompt,
          prompt,
          schema,
          temperature: 0.7,
        });

        console.log('✅ Fallback generation successful');
        return Response.json({
          success: true,
          data: fallbackResult.object,
          usage: fallbackResult.usage,
          creditsRemaining: creditResult.newBalance,
          usedFallback: true
        });

      } catch (fallbackError) {
        console.error('❌ Fallback also failed:', fallbackError);
        return Response.json(
          { error: 'Failed to generate slide content with both models', details: generateError instanceof Error ? generateError.message : String(generateError) },
          { status: 500 }
        );
      }
    }

  } catch (error) {
    console.error('❌ General error in generate-slide:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return Response.json(
      { error: 'Failed to generate slide', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}