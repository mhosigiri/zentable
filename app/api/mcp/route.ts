import { NextRequest } from 'next/server'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { z } from 'zod'
import { createGroq } from '@ai-sdk/groq'
import { generateObject } from 'ai'
import { hashApiKey, isValidApiKeyFormat, extractApiKeyFromHeader } from '@/lib/mcp-api-keys'
import { mcpDatabase } from '@/lib/mcp-database'
import { generateUUID } from '@/lib/uuid'
import { CREDIT_COSTS } from '@/lib/credits'

// Configure Groq with correct model
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
})
// Use the correct reasoning model that generate-outline uses
const modelName = 'openai/gpt-oss-20b'
const fallbackModel = 'llama-3.3-70b-versatile'

// Outline schema for first step
const OutlineSchema = z.object({
  title: z.string().describe('A compelling, professional title for the presentation'),
  sections: z.array(
    z.object({
      title: z.string().describe('Section title that clearly describes the main topic'),
      bulletPoints: z.array(z.string()).describe('3-4 concise, actionable bullet points that support the section title'),
      templateType: z.enum([
        'blank-card', 'bullets', 'paragraph', 'image-and-text', 'text-and-image', 'two-columns',
        'two-column-with-headings', 'three-columns', 'three-column-with-headings',
        'four-columns', 'four-columns-with-headings', 'title-with-bullets',
        'title-with-bullets-and-image', 'title-with-text', 'accent-left', 'accent-right', 'accent-top'
      ]).describe('Template type that best fits the content and purpose of this section')
    })
  ).describe('Array of presentation sections with supporting bullet points and template types')
})

// Individual slide content schemas (same as generate-slide route)
// Add all schemas including ones with image prompts
const BlankCardSchema = z.object({
  content: z.string().describe('Complete HTML content starting with a heading (h3 for main title, h4 for subtitles) followed by the main content. Use appropriate formatting like <p>, <strong>, <em>, or additional headings. Structure: <h3>Title</h3><p>Content description...</p>'),
})

const ImageAndTextSchema = z.object({
  content: z.string().describe('Complete HTML content with h3 title followed by paragraphs and/or bullet points that complement the image. Structure: <h3>Title</h3><p>Description text...</p><ul><li>Key point 1</li><li>Key point 2</li></ul>'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
})

const TextAndImageSchema = z.object({
  content: z.string().describe('Complete HTML content with h3 title followed by paragraphs and/or bullet points that complement the image. Structure: <h3>Title</h3><p>Description text...</p><ul><li>Point 1</li><li>Point 2</li></ul>'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
})

const TitleWithBulletsAndImageSchema = z.object({
  content: z.string().describe('Complete HTML content starting with h3 title followed by formatted bullet points using <ul> and <li> tags (3-4 points). Include formatting like <strong>, <em> for emphasis. Structure: <h3>Title</h3><ul><li>Point 1</li><li>Point 2</li></ul>'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
})

const AccentLeftSchema = z.object({
  content: z.string().describe('Complete HTML content starting with h3 title followed by short paragraphs and/or bullet points. Choose the format that best fits the content. Structure: <h3>Title</h3><p>Content...</p> or <h3>Title</h3><ul><li>Point 1</li><li>Point 2</li></ul>'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
})

const AccentRightSchema = z.object({
  content: z.string().describe('Complete HTML content starting with h3 title followed by short paragraphs and/or bullet points. Choose the format that best fits the content. Structure: <h3>Title</h3><p>Content...</p> or <h3>Title</h3><ul><li>Point 1</li><li>Point 2</li></ul>'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
})

const AccentTopSchema = z.object({
  content: z.string().describe('Complete HTML content starting with h3 title followed by paragraphs and/or bullet points. Choose the format that best fits the content. Structure: <h3>Title</h3><p>Content...</p> or <h3>Title</h3><ul><li>Point 1</li><li>Point 2</li></ul>'),
  imagePrompt: z.string().describe('Detailed prompt for generating an image that complements the content'),
})

const BulletsSchema = z.object({
  content: z.string().describe('Complete HTML content with h3 title and table-based 2x2 grid layout for exactly 4 numbered bullet points with bold Point Titles. Structure: <h3>Title</h3><table style="width: 100%; border-collapse: collapse; margin-top: 2rem;"><tr><td style="width: 50%; padding: 0 1rem 1rem 0; vertical-align: top;"><h4><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">1</span>Point Title</h4><p>Description</p></td><td style="width: 50%; padding: 0 0 1rem 1rem; vertical-align: top;"><h4><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">2</span>Point Title</h4><p>Description</p></td></tr><tr><td style="width: 50%; padding: 1rem 1rem 0 0; vertical-align: top;"><h4><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">3</span>Point Title</h4><p>Description</p></td><td style="width: 50%; padding: 1rem 0 0 1rem; vertical-align: top;"><h4><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">4</span>Point Title</h4><p>Description</p></td></tr></table><hr style="margin: 2rem 0; border: 1px solid #e5e7eb;" /><p><strong>Conclusion:</strong> Summary content</p>'),
})

const TitleWithBulletsSchema = z.object({
  content: z.string().describe('Complete HTML content starting with a heading (h3 for main title, h4 for subtitles) followed by formatted bullet points using <ul> and <li> tags (3-5 points). Include formatting like <strong>, <em>, or additional heading tags if appropriate for emphasis. Structure: <h3>Title</h3><ul><li><p>Point 1</p></li>...</ul>'),
})

const ParagraphSchema = z.object({
  content: z.string().describe('Complete HTML content with h3 title followed by multiple sections with h4 headings and paragraphs. Structure: <h3>Title</h3><h4>Section 1</h4><p>Paragraph 1</p><p>Paragraph 2</p><h4>Section 2</h4><p>Paragraph 1</p><p>Paragraph 2</p><h4>Conclusion</h4><p>Concluding thoughts</p>'),
})

// Schema selection helper - includes templates with images
function getSchemaForTemplate(templateType: string): z.ZodType<any> {
  switch (templateType) {
    case 'blank-card':
      return BlankCardSchema;
    case 'bullets':
      return BulletsSchema;
    case 'title-with-bullets':
      return TitleWithBulletsSchema;
    case 'paragraph':
      return ParagraphSchema;
    case 'image-and-text':
      return ImageAndTextSchema;
    case 'text-and-image':
      return TextAndImageSchema;
    case 'title-with-bullets-and-image':
      return TitleWithBulletsAndImageSchema;
    case 'accent-left':
      return AccentLeftSchema;
    case 'accent-right':
      return AccentRightSchema;
    case 'accent-top':
      return AccentTopSchema;
    default:
      return BlankCardSchema;
  }
}

// Template selection logic (matches generate-outline route exactly)
function selectTemplateType(title: string, bulletPoints: string[], index: number, totalSections: number, usedTemplates: string[] = []): string {
  const titleLower = title.toLowerCase();
  const contentText = (title + ' ' + bulletPoints.join(' ')).toLowerCase();
  
  // Available templates for variety
  const allTemplates = [
    'blank-card',
    'bullets',
    'paragraph',
    'image-and-text',
    'text-and-image',
    'two-columns',
    'two-column-with-headings',
    'three-columns',
    'three-column-with-headings',
    'four-columns',
    'four-columns-with-headings',
    'title-with-bullets',
    'title-with-bullets-and-image',
    'title-with-text',
    'accent-left',
    'accent-right',
    'accent-top'
  ];
  
  // Enhanced variety logic - prioritize unused templates first
  const templateCounts: { [key: string]: number } = {};
  usedTemplates.forEach(template => {
    templateCounts[template] = (templateCounts[template] || 0) + 1;
  });
  
  // Get unused templates first
  const unusedTemplates = allTemplates.filter(template => !templateCounts[template]);
  
  // Determine suitable templates based on content
  let suitableTemplates: string[] = [];
  
  // Image-heavy content
  if (contentText.includes('image') || contentText.includes('visual') || contentText.includes('photo') || 
      contentText.includes('picture') || contentText.includes('diagram') || contentText.includes('chart') ||
      contentText.includes('example') || contentText.includes('case study') || 
      contentText.includes('demonstration') || contentText.includes('showcase')) {
    suitableTemplates.push('image-and-text', 'text-and-image', 'title-with-bullets-and-image', 'accent-left', 'accent-right', 'accent-top');
  }
  
  // Comparison or contrasting content
  if (contentText.includes('vs') || contentText.includes('versus') || 
      contentText.includes('comparison') || contentText.includes('difference') ||
      contentText.includes('before') || contentText.includes('after') ||
      contentText.includes('pros') || contentText.includes('cons')) {
    suitableTemplates.push('two-column-with-headings', 'two-columns');
  }
  
  // Categorized or structured content
  if (contentText.includes('type') || contentText.includes('category') || 
      contentText.includes('aspect') || contentText.includes('approach') ||
      contentText.includes('step') || contentText.includes('phase') ||
      contentText.includes('component') || contentText.includes('element')) {
    if (bulletPoints.length >= 4) {
      suitableTemplates.push('four-columns-with-headings', 'four-columns');
    } else if (bulletPoints.length === 3) {
      suitableTemplates.push('three-column-with-headings', 'three-columns');
    } else if (bulletPoints.length === 2) {
      suitableTemplates.push('two-column-with-headings', 'two-columns');
    }
  }
  
  // Content that works well as numbered bullets or paragraphs
  if (contentText.includes('benefit') || contentText.includes('advantage') || 
      contentText.includes('reason') || contentText.includes('point') ||
      contentText.includes('key') || contentText.includes('important') ||
      contentText.includes('main') || contentText.includes('primary')) {
    suitableTemplates.push('bullets', 'title-with-bullets');
  }
  
  // Content that works well as short text or paragraphs
  if (contentText.includes('strategy') || contentText.includes('process') || 
      contentText.includes('methodology') || contentText.includes('framework') ||
      contentText.includes('analysis') || contentText.includes('overview') ||
      contentText.includes('summary') || contentText.includes('conclusion') ||
      contentText.includes('explanation') || contentText.includes('description') ||
      contentText.includes('background') || contentText.includes('context') ||
      contentText.includes('definition') || contentText.includes('concept')) {
    suitableTemplates.push('paragraph', 'title-with-bullets', 'title-with-text');
  }
  
  // Multi-item content based on bullet count
  if (bulletPoints.length >= 4) {
    suitableTemplates.push('four-columns', 'four-columns-with-headings', 'bullets', 'title-with-bullets');
  } else if (bulletPoints.length === 3) {
    suitableTemplates.push('three-columns', 'three-column-with-headings', 'bullets', 'title-with-bullets');
  } else if (bulletPoints.length === 2) {
    suitableTemplates.push('two-columns', 'two-column-with-headings', 'title-with-bullets');
  } else if (bulletPoints.length === 1) {
    suitableTemplates.push('paragraph', 'title-with-bullets');
  }
  
  // If no suitable templates found, use all templates
  if (suitableTemplates.length === 0) {
    suitableTemplates = [...allTemplates];
  }
  
  // Remove duplicates
  suitableTemplates = Array.from(new Set(suitableTemplates));
  
  // PRIORITY 1: Use unused templates that are suitable for content
  const unusedSuitableTemplates = suitableTemplates.filter(template => unusedTemplates.includes(template));
  if (unusedSuitableTemplates.length > 0) {
    return unusedSuitableTemplates[Math.floor(Math.random() * unusedSuitableTemplates.length)];
  }
  
  // PRIORITY 2: Use any unused template if no suitable unused ones
  if (unusedTemplates.length > 0) {
    return unusedTemplates[Math.floor(Math.random() * unusedTemplates.length)];
  }
  
  // PRIORITY 3: Apply strict variety logic for used templates
  const availableTemplates = suitableTemplates.filter(template => {
    // Don't use the same template as the previous slide
    if (index > 0 && usedTemplates[index - 1] === template) return false;
    
    // For longer presentations, avoid using the same template too frequently
    if (totalSections > 5) {
      const recentlyUsed = usedTemplates.slice(Math.max(0, index - 3), index);
      if (recentlyUsed.includes(template)) return false;
    }
    
    return true;
  });
  
  // If we filtered out all templates, use the suitable ones
  const finalTemplates = availableTemplates.length > 0 ? availableTemplates : suitableTemplates;
  
  // PRIORITY 4: Strategic selection based on position
  if (index === 0) {
    // First slide - default to a visually striking accent template
    const accentTemplates = ['accent-left', 'accent-right', 'accent-top'];
    const preferred = finalTemplates.filter(t => accentTemplates.includes(t));
    if (preferred.length > 0) {
      return preferred[Math.floor(Math.random() * preferred.length)];
    }
    // If no accent template is in finalTemplates (e.g. filtered out), just pick a random one as a fallback.
    return accentTemplates[Math.floor(Math.random() * accentTemplates.length)];
  }
  
  if (index === totalSections - 1) {
    // Last slide - use only non-image templates for conclusions and summaries
    const imageTemplates = ['image-and-text', 'text-and-image', 'title-with-bullets-and-image', 'accent-left', 'accent-right', 'accent-top', 'accent-background'];
    const lastSlideTemplates = allTemplates.filter(t => !imageTemplates.includes(t));
    const lastSlidePreferred = ['title-with-bullets', 'bullets', 'paragraph', 'two-columns', 'two-column-with-headings', 'three-columns', 'three-column-with-headings', 'title-with-text'];
    
    // Prioritize conclusion-friendly templates first
    const conclusionTemplates = lastSlidePreferred.filter(t => lastSlideTemplates.includes(t));
    if (conclusionTemplates.length > 0) {
      return conclusionTemplates[Math.floor(Math.random() * conclusionTemplates.length)];
    }
    
    // Fallback to any non-image template
    return lastSlideTemplates[Math.floor(Math.random() * lastSlideTemplates.length)];
  }
  
  // PRIORITY 5: For middle slides, prefer least-used templates
  if (totalSections > 3) {
    // Sort templates by usage count (ascending)
    const sortedByUsage = finalTemplates.sort((a, b) => {
      const countA = templateCounts[a] || 0;
      const countB = templateCounts[b] || 0;
      return countA - countB;
    });
    
    // Use the least used template(s)
    const minUsage = templateCounts[sortedByUsage[0]] || 0;
    const leastUsedTemplates = sortedByUsage.filter(template => 
      (templateCounts[template] || 0) === minUsage
    );
    
    if (leastUsedTemplates.length > 0) {
      return leastUsedTemplates[Math.floor(Math.random() * leastUsedTemplates.length)];
    }
  }
  
  // Final fallback - random selection from available templates
  return finalTemplates[Math.floor(Math.random() * finalTemplates.length)];
}

// Authentication middleware
async function validateApiKey(authorization: string | null): Promise<string | null> {
  console.log('--- API Key Validation ---');
  console.log(`Received Authorization header: ${authorization}`);

  if (!authorization || !authorization.startsWith('Bearer ')) {
    console.log('Validation failed: Missing or malformed Bearer token.');
    return null;
  }

  const apiKey = authorization.substring(7);
  console.log(`Extracted API Key: ${apiKey.substring(0, 8)}...`);

  if (!isValidApiKeyFormat(apiKey)) {
    console.log('Validation failed: Invalid API key format.');
    return null;
  }

  const keyHash = hashApiKey(apiKey);
  console.log(`Hashed API Key: ${keyHash}`);

  const validation = await mcpDatabase.validateApiKey(keyHash);
  console.log(`Database validation result: ${JSON.stringify(validation)}`);

  if (validation.isValid) {
    console.log(`Validation successful for user: ${validation.userId}`);
  } else {
    console.log('Validation failed: No matching key found in database.');
  }
  
  return validation.isValid ? validation.userId! : null;
}

// Presentation creation handler with credit checks
async function handleCreatePresentation(userId: string, args: any) {
  try {
    console.log(`🎯 MCP: Creating presentation for user ${userId}`)
    console.log(`📝 Prompt: ${args.prompt}`)
    console.log(`📊 Slides: ${args.slideCount}, Style: ${args.style}, Language: ${args.language}`)
    console.log(`🔍 Browser Search: ${args.enableBrowserSearch}`)

    let { prompt, slideCount = 5, style = 'professional', language = 'en', contentLength = 'medium', enableBrowserSearch = false } = args
    
    // Handle overly detailed prompts by truncating if necessary
    const MAX_PROMPT_LENGTH = 1500; // Characters
    if (prompt.length > MAX_PROMPT_LENGTH) {
      console.warn(`Prompt too long (${prompt.length} chars), truncating to ${MAX_PROMPT_LENGTH} chars`);
      // Try to find a natural break point
      let truncated = prompt.substring(0, MAX_PROMPT_LENGTH);
      const lastSentence = truncated.lastIndexOf('. ');
      if (lastSentence > MAX_PROMPT_LENGTH * 0.7) {
        truncated = truncated.substring(0, lastSentence + 1);
      }
      prompt = truncated + '...';
      console.log('Truncated prompt to:', prompt);
    }
    
    // Check and deduct credits for presentation creation
    const creditCheck = await mcpDatabase.checkCredits(userId, 'presentation_create')
    if (!creditCheck.hasCredits) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Insufficient Credits**\n\nYou need ${CREDIT_COSTS.presentation_create} credits to create a presentation but only have ${creditCheck.currentBalance}.\n\nPlease upgrade your plan or purchase additional credits.`
        }],
        isError: true
      }
    }
    
    // Deduct credits
    const creditResult = await mcpDatabase.deductCredits(userId, 'presentation_create', {
      presentation_prompt: prompt,
      slide_count: slideCount
    })
    
    if (!creditResult.success) {
      return {
        content: [{
          type: 'text',
          text: `❌ **Error Processing Credits**\n\n${creditResult.error || 'Failed to process credit transaction. Please try again.'}`
        }],
        isError: true
      }
    }

    // Map style to writing tone (from generate-outline route)
    const styleMap: Record<string, string> = {
      'professional': 'professional and clear',
      'friendly': 'warm and approachable',
      'fun': 'playful and engaging',
      'casual': 'relaxed and conversational',
      'formal': 'precise and authoritative'
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

    // STEP 1: Generate outline (using same prompt as generate-outline route)
    const browserSearchInstruction = enableBrowserSearch ? 
      `\nIMPORTANT: Use browser search to find current, accurate, and relevant information about "${prompt}". Include up-to-date facts, statistics, trends, and developments in your presentation outline. Prioritize recent information and credible sources.\n` : '';

    const outlineSystemPrompt = `You are an expert presentation designer and content strategist. Create a comprehensive, well-structured presentation outline that is ${writingStyle} in tone and written in ${targetLanguage}.
${browserSearchInstruction}
CRITICAL GUIDELINES FOR PRESENTATION CONTENT:
- Generate exactly ${slideCount} sections for the presentation
- Each section should have a clear, descriptive title (max 8-10 words)
- Include 3-4 bullet points per section that are SUCCINCT and presentation-ready
- Each bullet point should be 1-2 lines maximum - NOT paragraphs
- Focus on key insights that can be quickly read and understood on a slide
- Ensure logical flow and progression between sections
- Make content engaging but CONCISE for visual presentation
- Avoid long sentences or complex explanations in bullet points
- Use active voice and strong, impactful language
- Each bullet should be a complete thought but brief enough for slides
- Prioritize clarity and visual readability over detailed explanations

TEMPLATE VARIETY REQUIREMENTS:
- Maximize template diversity across all slides
- Avoid repeating the same template type when possible
- Use the full range of available templates to create visual interest
- Consider content suitability but prioritize template variety

Remember: This is for SLIDE presentations - content must be scannable and visually digestible, not essay-like.

The outline should create a compelling ${slideCount}-slide presentation with maximum visual variety.`;

    // Try reasoning model first, fallback if needed
    let outline: z.infer<typeof OutlineSchema>;
    let usedReasoningModel = true;
    
    try {
      const groqOptions: any = {
        experimental_telemetry: { isEnabled: true },
      };

      // Add browser search if enabled
      if (enableBrowserSearch) {
        groqOptions.tool_choice = 'required';
        groqOptions.tools = [
          {
            type: 'browser_search'
          }
        ];
      }

      const response = await generateObject({
        model: groq(modelName),
        system: outlineSystemPrompt,
        prompt: `Create a presentation outline for: "${prompt}"`,
        schema: OutlineSchema,
        maxTokens: 4000, // Increased for detailed prompts
        providerOptions: {
          groq: groqOptions
        }
      });
      outline = response.object;
    } catch (reasoningError: any) {
      console.warn('Reasoning model failed, falling back to standard model:', reasoningError);
      console.warn('Error details:', reasoningError?.message || 'Unknown error');
      usedReasoningModel = false;
      
      const fallbackOptions: any = {};
      
      // Add browser search if enabled
      if (enableBrowserSearch) {
        fallbackOptions.tool_choice = 'required';
        fallbackOptions.tools = [
          {
            type: 'browser_search'
          }
        ];
      }
      
      const response = await generateObject({
        model: groq(fallbackModel),
        system: outlineSystemPrompt,
        prompt: `Create a presentation outline for: "${prompt}"`,
        schema: OutlineSchema,
        maxTokens: 4000, // Increased for detailed prompts
        temperature: 0.7,
        providerOptions: {
          groq: fallbackOptions
        }
      });
      outline = response.object;
    }
    
    console.log('Model used:', usedReasoningModel ? modelName : fallbackModel);

    // Add template types and IDs to sections
    const usedTemplates: string[] = [];
    const sectionsWithTemplates = outline.sections.map((section, index) => {
      let templateType;
      if (index === 0) {
        // Force the first slide to be an accent template
        const accentTemplates = ['accent-left', 'accent-right'];
        templateType = accentTemplates[Math.floor(Math.random() * accentTemplates.length)];
      } else {
        templateType = section.templateType || selectTemplateType(
          section.title, 
          section.bulletPoints, 
          index, 
          outline.sections.length,
          usedTemplates
        );
      }
      
      usedTemplates.push(templateType);
      
      return {
        ...section,
        id: generateUUID(),
        templateType
      };
    });

    // STEP 2: Generate individual slides with proper HTML content
    const generatedSlides = [];
    
    for (let i = 0; i < sectionsWithTemplates.length; i++) {
      const section = sectionsWithTemplates[i];
      
      // Map content length to specific guidelines (from generate-slide route)
      const contentLengthMap: Record<string, string> = {
        'brief': 'VERY BRIEF - Bullet points: 1 line max (6-12 words). Paragraphs: 1-2 sentences max.',
        'medium': 'MODERATE - Bullet points: 1-2 lines (12-20 words). Paragraphs: 2-3 sentences max.',
        'detailed': 'COMPREHENSIVE - Bullet points: 2-3 lines (20-30 words). Paragraphs: 3-4 sentences max.'
      };

      const contentGuidelines = contentLengthMap[contentLength] || contentLengthMap['medium'];
      
      const schema = getSchemaForTemplate(section.templateType);
      
      // Generate slide content using same approach as generate-slide route
      const slideSystemPrompt = `You are an expert presentation designer and content creator. Create compelling slide content that is ${writingStyle} in tone and written in ${targetLanguage}.

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

CONTENT LENGTH GUIDELINES:
- Titles: 3-8 words maximum
- Headings: 2-4 words maximum
- Content follows the ${contentLength} guidelines above

Template: ${section.templateType}

Remember: Transform the outline into CONCISE, visually-friendly presentation content that audiences can quickly read and understand! Choose the best format (bullets vs paragraphs) for each piece of content and make content substantial enough to be meaningful while respecting the ${contentLength} length requirements.`;

      const slidePrompt = `Section: "${section.title}"\nKey points: ${section.bulletPoints.join(', ')}`;
      
      let slideContent;
      try {
        const response = await generateObject({
          model: groq(modelName),
          system: slideSystemPrompt,
          prompt: slidePrompt,
          schema,
          maxTokens: 2000, // Increased for more detailed content
          temperature: 0.7,
        });
        slideContent = response.object;
      } catch (slideError: any) {
        console.warn(`Slide generation failed for "${section.title}", trying fallback:`, slideError?.message);
        // Fallback to simpler model for this slide
        try {
          const response = await generateObject({
            model: groq(fallbackModel),
            system: slideSystemPrompt,
            prompt: slidePrompt,
            schema,
            maxTokens: 2000,
            temperature: 0.7,
          });
          slideContent = response.object;
        } catch (fallbackError: any) {
          console.error(`Both models failed for slide "${section.title}":`, fallbackError?.message);
          // Create a basic slide as last resort
          slideContent = {
            content: `<h3>${section.title}</h3><ul>${section.bulletPoints.map(bp => `<li>${bp}</li>`).join('')}</ul>`,
            imagePrompt: null
          };
        }
      }

      // Extract image prompt if the template supports it
      const imagePrompt = (slideContent as any).imagePrompt || null;
      
      generatedSlides.push({
        templateType: section.templateType,
        title: section.title,
        content: slideContent.content,
        position: i,
        bulletPoints: section.bulletPoints,
        imagePrompt: imagePrompt,
        imageUrl: null // Images will be generated asynchronously after slide creation
      });
    }

    // Save to database
    const savedPresentation = await mcpDatabase.createPresentation({
      prompt,
      cardCount: slideCount,
      style,
      language,
      contentLength,
      themeId: 'theme-blue',
      imageStyle: 'professional',
      userId
    })

    await mcpDatabase.saveSlides(savedPresentation.id, generatedSlides)
    
    // Trigger image generation for slides that have image prompts (async, non-blocking)
    const slidesWithImages = generatedSlides.filter(slide => slide.imagePrompt);
    if (slidesWithImages.length > 0) {
      // Fire and forget - images will be generated in the background
      generateImagesForSlides(savedPresentation.id, userId).catch(error => {
        console.error('Background image generation failed:', error);
      });
    }

    console.log(`✅ MCP: Presentation created successfully: ${savedPresentation.id}`)
    console.log(`📸 MCP: ${slidesWithImages.length} slides queued for image generation`)

    return {
      content: [{
        type: 'text',
        text: `✅ **Presentation Created Successfully!**

**Title:** ${outline.title}
**Slides:** ${slideCount}
**ID:** ${savedPresentation.id}

**Slides Overview:**
${sectionsWithTemplates.map((section, i) => `${i + 1}. **${section.title}** (${section.templateType})`).join('\n')}

You can view and edit this presentation in your dashboard at: https://zentableai.com/docs/${savedPresentation.id}

The presentation has been saved to your account and is available for editing, sharing, and exporting.`
      }]
    }
  } catch (error: any) {
    console.error('❌ MCP: Error creating presentation:', error)
    
    // Provide more helpful error messages based on the error type
    let errorMessage = '❌ **Error Creating Presentation**\n\n';
    
    if (error?.message?.includes('JSON') || error?.message?.includes('parse')) {
      errorMessage += '**Issue**: The AI had difficulty processing your detailed prompt.\n\n';
      errorMessage += '**Solutions**:\n';
      errorMessage += '• Try a shorter, more concise prompt (e.g., "Machine Learning Fundamentals" instead of detailed slide-by-slide instructions)\n';
      errorMessage += '• Let the AI handle the content structure - it works best with topic-based prompts\n';
      errorMessage += '• If you need specific content, try breaking it into multiple simpler presentations\n\n';
      errorMessage += '**Example that works well**: "Create a presentation about AI trends with 6 slides"';
    } else if (error?.message?.includes('token') || error?.message?.includes('length')) {
      errorMessage += '**Issue**: Your prompt is too long for processing.\n\n';
      errorMessage += '**Solution**: Please use a shorter, more focused prompt. The tool works best with concise topic descriptions.';
    } else if (error?.message?.includes('credit')) {
      errorMessage += error.message;
    } else {
      errorMessage += `Sorry, there was an error creating your presentation. Please try again with a simpler prompt.\n\n`;
      errorMessage += `**Tip**: The tool works best with concise topic prompts rather than detailed slide-by-slide instructions.\n\n`;
      errorMessage += `Error details: ${error?.message || 'Unknown error'}`;
    }
    
    return {
      content: [{
        type: 'text',
        text: errorMessage
      }],
      isError: true
    }
  }
}

// Background image generation function
async function generateImagesForSlides(presentationId: string, userId: string) {
  try {
    // Fetch the presentation slides with image prompts
    const slides = await mcpDatabase.getSlidesWithImagePrompts(presentationId);
    
    if (!slides || slides.length === 0) {
      console.log('No slides with image prompts found');
      return;
    }
    
    console.log(`🎨 Starting image generation for ${slides.length} slides`);
    
    // Generate images for each slide that has an image prompt
    for (const slide of slides) {
      if (slide.image_prompt && !slide.image_url) {
        try {
          // Call the generate-image API endpoint
          const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'https://zentableai.com'}/api/generate-image`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: slide.image_prompt,
              style: 'professional',
              slideId: slide.id,
              userId: userId
            })
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log(`✅ Image generated for slide ${slide.id}`);
          } else {
            console.error(`Failed to generate image for slide ${slide.id}`);
          }
        } catch (error) {
          console.error(`Error generating image for slide ${slide.id}:`, error);
        }
        
        // Add a small delay between image generations to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log('✅ Image generation completed');
  } catch (error) {
    console.error('Error in generateImagesForSlides:', error);
  }
}

// Create MCP server instance
function createMcpServer(userId: string) {
  const server = new McpServer({
    name: 'slides-ai-mcp-server',
    version: '1.0.0'
  })

  // Register the create_presentation tool
  server.registerTool(
    'create_presentation',
    {
      title: 'Create Presentation',
      description: 'Generate a complete presentation with slides based on a topic or prompt',
      inputSchema: {
        prompt: z.string().describe('The topic or content description for the presentation'),
        slideCount: z.number().min(3).max(20).default(5).describe('Number of slides to generate (3-20)'),
        style: z.enum(['default', 'modern', 'minimal', 'creative', 'professional']).default('professional').describe('Presentation style'),
        language: z.string().default('en').describe('Language for the presentation content'),
        contentLength: z.enum(['brief', 'medium', 'detailed']).default('medium').describe('How detailed the content should be'),
        enableBrowserSearch: z.boolean().default(false).describe('Enable web search to find current, accurate information about the topic')
      }
    },
    async ({ prompt, slideCount, style, language, contentLength, enableBrowserSearch }: {
      prompt: string
      slideCount: number
      style: string
      language: string
      contentLength: string
      enableBrowserSearch: boolean
    }) => {
      try {
        console.log(`🎯 MCP: Creating presentation for user ${userId}`)
        console.log(`📝 Prompt: ${prompt}`)
        console.log(`📊 Slides: ${slideCount}, Style: ${style}, Language: ${language}`)

        // Generate presentation using same approach as handleCreatePresentation but with proper return type
        const result = await handleCreatePresentation(userId, { prompt, slideCount, style, language, contentLength, enableBrowserSearch })
        return {
          content: result.content.map(item => ({
            type: item.type as 'text',
            text: item.text
          })),
          isError: result.isError
        }
      } catch (error) {
        console.error('❌ MCP: Error creating presentation:', error)
        return {
          content: [{
            type: 'text',
            text: `❌ **Error Creating Presentation**

Sorry, there was an error creating your presentation. Please try again with a different prompt or contact support if the issue persists.

Error details: ${error instanceof Error ? error.message : 'Unknown error'}`
          }],
          isError: true
        }
      }
    }
  )

  return server
}

// Main MCP endpoint
export async function POST(req: NextRequest) {
  try {
    console.log('🔄 MCP: Handling POST request')
    
    // Validate API key
    const authorization = req.headers.get('Authorization')
    const userId = await validateApiKey(authorization)
    
    if (!userId) {
      console.log('❌ MCP: Unauthorized request')
      return new Response(JSON.stringify({
        jsonrpc: '2.0',
        error: {
          code: -32001,
          message: 'Invalid or missing API key'
        },
        id: null
      }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log(`✅ MCP: Authorized user: ${userId}`)

    // Create MCP server instance for this user
    const server = createMcpServer(userId)

    // Create transport
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // Stateless mode
    })

    // Handle cleanup
    const cleanup = () => {
      console.log('🧹 MCP: Cleaning up transport and server')
      transport.close()
      server.close()
    }

    req.signal?.addEventListener('abort', cleanup)

    try {
      // Connect server to transport
      await server.connect(transport)
      
      // Get request body
      const body = await req.json()
      console.log('📨 MCP: Request body:', JSON.stringify(body, null, 2))

      // For MCP protocol, we need to handle JSON-RPC directly
      const { method, params, id } = body
      
      if (method === 'tools/list') {
        const response = {
          jsonrpc: '2.0',
          id,
          result: {
            tools: [{
              name: 'create_presentation',
              description: 'Generate a complete presentation with slides based on a topic or prompt',
              inputSchema: {
                type: 'object',
                properties: {
                  prompt: {
                    type: 'string',
                    description: 'The topic or content description for the presentation'
                  },
                  slideCount: {
                    type: 'number',
                    minimum: 3,
                    maximum: 20,
                    default: 5,
                    description: 'Number of slides to generate (3-20)'
                  },
                  style: {
                    type: 'string',
                    enum: ['default', 'modern', 'minimal', 'creative', 'professional'],
                    default: 'professional',
                    description: 'Presentation style'
                  },
                  language: {
                    type: 'string',
                    default: 'en',
                    description: 'Language for the presentation content'
                  },
                  contentLength: {
                    type: 'string',
                    enum: ['brief', 'medium', 'detailed'],
                    default: 'medium',
                    description: 'How detailed the content should be'
                  },
                  enableBrowserSearch: {
                    type: 'boolean',
                    default: false,
                    description: 'Enable web search to find current, accurate information about the topic'
                  }
                },
                required: ['prompt']
              }
            }]
          }
        }
        
        console.log('📤 MCP: Sending tools/list response')
        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      if (method === 'tools/call' && params?.name === 'create_presentation') {
        // Handle the create_presentation tool call directly
        const result = await handleCreatePresentation(userId, params.arguments)
        
        const response = {
          jsonrpc: '2.0',
          id,
          result
        }
        
        console.log('📤 MCP: Sending tools/call response')
        return new Response(JSON.stringify(response), {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        })
      }
      
      // Unknown method
      const errorResponse = {
        jsonrpc: '2.0',
        id,
        error: {
          code: -32601,
          message: `Method not found: ${method}`
        }
      }
      
      return new Response(JSON.stringify(errorResponse), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } catch (error) {
      cleanup()
      throw error
    }

  } catch (error) {
    console.error('❌ MCP: Request handling error:', error)
    return new Response(JSON.stringify({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: 'Internal server error',
        data: error instanceof Error ? error.message : 'Unknown error'
      },
      id: null
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// Handle other HTTP methods for completeness
export async function GET() {
  return new Response(JSON.stringify({
    jsonrpc: '2.0',
    error: {
      code: -32000,
      message: 'Method not allowed. Use POST for MCP requests.'
    },
    id: null
  }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  })
}

export async function DELETE() {
  return new Response(JSON.stringify({
    jsonrpc: '2.0',
    error: {
      code: -32000,
      message: 'Method not allowed. Use POST for MCP requests.'
    },
    id: null
  }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' }
  })
} 