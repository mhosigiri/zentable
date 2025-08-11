import { createGroq } from '@ai-sdk/groq';
import { streamText } from 'ai';
import { getSlideById } from '@/lib/slides';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// Configure Groq with reasoning model
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const modelName = 'openai/gpt-oss-20b'; // Same model as generate-outline and generate-slide

// Get template-specific context for better AI understanding
const getTemplateContext = (templateType: string): string => {
  const templates: Record<string, string> = {
    'bullets': 'Use <ul> and <li> tags for bullet points. Keep each point concise and impactful.',
    'two-columns': 'Maintain <div class="column"> structure for two-column layout. Balance content between columns.',
    'image-and-text': 'Content should complement an image. Use descriptive, engaging text that works with visuals.',
    'text-and-image': 'Content leads into an image. Build anticipation and context for the visual.',
    'paragraph': 'Use <p> tags for paragraphs. Keep paragraphs readable and well-structured.',
    'blank-card': 'Use <h3> for main title, <h4> for subtitles, <p> for content. Flexible structure.',
    'two-column-with-headings': 'Each column needs <h4> heading followed by content. Maintain parallel structure.',
    'titleWithBulletsAndImage': 'Use <h3> for title, <ul> with <li> for bullets. Content should work with an image.',
    'imageLeft': 'Text content on the right side. Keep concise to balance with left image.',
    'imageRight': 'Text content on the left side. Keep concise to balance with right image.',
  };
  
  return templates[templateType] || 'Maintain proper HTML structure for the slide.';
};

// Get system prompt based on command and template
const getSystemPrompt = (command: string, templateType: string): string => {
  const basePrompt = `You are an expert presentation slide content editor working with HTML-formatted slides.
You MUST return ONLY the improved HTML content that should replace the selected text.
Current slide template: ${templateType}

CRITICAL RULES:
- Return ONLY HTML content, no explanations or markdown
- Preserve all HTML tags, classes, and styling
- Maintain slide-appropriate formatting
- Keep content concise and impactful for presentations
- Match the existing HTML structure and style`;

  switch (command) {
    case 'improve':
      return `${basePrompt}

Improve the selected HTML content to be more clear, engaging, and impactful.
Use strong, active language while maintaining HTML structure.
Make it more professional and presentation-ready.`;

    case 'fix':
      return `${basePrompt}

Fix grammar, spelling, punctuation, and style issues in the HTML content.
Ensure proper HTML tag usage and structure.
Make the content error-free and polished.`;

    case 'shorter':
      return `${basePrompt}

Make the HTML content more concise while preserving all key information.
Use shorter sentences or convert to bullet points if appropriate.
Remove redundancy and unnecessary words.`;

    case 'longer':
      return `${basePrompt}

Expand the HTML content with 1-2 relevant sentences maximum.
Add valuable details or examples while maintaining HTML structure.
Keep additions relevant and impactful.`;

    case 'continue':
      return `${basePrompt}

Continue the HTML content naturally with 1-2 sentences or bullet points.
Match the existing HTML structure, style, and tone.
Provide a logical continuation of the thought.`;

    case 'zap':
      return `${basePrompt}

Follow the user's specific instructions while maintaining HTML structure.
Apply the requested changes precisely.`;

    default:
      return basePrompt;
  }
};

export async function POST(req: Request) {
  try {
    const { 
      text, 
      command, 
      option,
      slideId,
      presentationId,
      templateType,
      fullContent,
      selectedHtml
    } = await req.json();

    // Fetch slide context if slideId is provided
    let slideHtml = fullContent || '';
    let actualTemplate = templateType || 'blank-card';
    
    if (slideId && !fullContent) {
      try {
        const slide = await getSlideById(slideId);
        if (slide) {
          slideHtml = slide.content || '';
          actualTemplate = slide.template_type || actualTemplate;
        }
      } catch (error) {
        console.error('Error fetching slide:', error);
        // Continue with provided context or defaults
      }
    }

    // Get the appropriate system prompt and template context
    const systemPrompt = getSystemPrompt(command, actualTemplate);
    const templateContext = getTemplateContext(actualTemplate);
    
    // Build the user prompt with full context
    const userPrompt = `${slideHtml ? `Current slide HTML context:
\`\`\`html
${slideHtml}
\`\`\`

` : ''}Template-specific guidance: ${templateContext}

Selected text to ${command}: "${text}"
${option && command === 'zap' ? `
Additional instructions: ${option}` : ''}

IMPORTANT: Return ONLY the HTML that should replace the selected text. No explanations, no markdown formatting, just the raw HTML.`;

    const result = await streamText({
      model: groq(modelName),
      system: systemPrompt,
      prompt: userPrompt,
      temperature: 0.7,
      maxTokens: 1000,
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.error('Error in AI text completion:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to generate completion' }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
} 