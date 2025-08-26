import { createGroq } from '@ai-sdk/groq';
import { generateObject } from 'ai';
import { z } from 'zod';
import { generateUUID } from '@/lib/uuid';
import { createClient } from '@/lib/supabase/server';
import { withCreditCheck } from '@/lib/credits';

export const dynamic = 'force-dynamic';

// Configure Groq with reasoning model
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const modelName = 'openai/gpt-oss-20b'; // Reasoning model with reasoningFormat support

const OutlineSchema = z.object({
  title: z.string().describe('A compelling, professional title for the presentation'),
  sections: z.array(
    z.object({
      title: z.string().describe('Section title that clearly describes the main topic'),
      bulletPoints: z.array(z.string()).describe('3-4 concise, actionable bullet points that support the section title'),
      templateType: z.enum([
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
      ]).describe('Template type that best fits the content and purpose of this section')
    })
  ).describe('Array of presentation sections with supporting bullet points and template types')
});

// Template selection logic based on content analysis and variety
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

export async function POST(req: Request) {
  try {
    const { prompt, cardCount, style, language, enableBrowserSearch } = await req.json();

    if (!prompt) {
      return Response.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Get user from session
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check and deduct credits for presentation creation
    const creditResult = await withCreditCheck(user.id, 'presentation_create', {
      prompt: prompt.substring(0, 100), // Store first 100 chars for tracking
      cardCount,
      style,
      language
    });

    if (!creditResult.success) {
      return Response.json({ 
        error: creditResult.error,
        creditsRequired: 10,
        currentBalance: creditResult.currentBalance
      }, { status: 402 }); // Payment Required
    }

    // Map style to writing tone
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

    // Combined prompt with reasoning instructions (no system prompt for reasoning models)
    const browserSearchInstruction = enableBrowserSearch ? 
      `\nIMPORTANT: Use browser search to find current, accurate, and relevant information about "${prompt}". Include up-to-date facts, statistics, trends, and developments in your presentation outline. Prioritize recent information and credible sources.\n` : '';

    const userPrompt = `You are an expert presentation designer and content strategist. Create a comprehensive, well-structured presentation outline that is ${writingStyle} in tone and written in ${targetLanguage}.
${browserSearchInstruction}
For each section, think through your template selection step-by-step:
1. Analyze the content type (comparison, list, visual, process, etc.)
2. Consider which templates best match this content structure
3. Ensure visual variety by avoiding recently used templates
4. Select the optimal template and explain why

CRITICAL GUIDELINES FOR PRESENTATION CONTENT:
- Generate exactly ${cardCount} sections for the presentation
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
- First slide should use an accent template (accent-left, or accent-right)
- Balance content-template fit with visual variety

Available templates: blank-card, bullets, paragraph, image-and-text, text-and-image, two-columns, two-column-with-headings, three-columns, three-column-with-headings, four-columns, four-columns-with-headings, title-with-bullets, title-with-bullets-and-image, title-with-text, accent-left, accent-right, accent-top

Remember: This is for SLIDE presentations - content must be scannable and visually digestible, not essay-like.

Create a presentation outline for: "${prompt}"`;

    // Generate with reasoning model - with fallback to regular model
    let response;
    let usedReasoningModel = true;
    
    try {
      const groqOptions: any = {
        // reasoningFormat: 'parsed',
        reasoningEffort: 'low',
        structuredOutputs: true
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

      response = await generateObject({
        model: groq(modelName),
        messages: [{ role: 'user', content: userPrompt }],
        schema: OutlineSchema,
        temperature: 0.6,
        providerOptions: {
          groq: groqOptions
        }
      });
    } catch (error) {
      console.warn('Reasoning model failed, falling back to regular model:', error);
      usedReasoningModel = false;
      
      // Fallback to regular Llama model without reasoning
      const fallbackModel = 'llama-3.3-70b-versatile';
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
      
      response = await generateObject({
        model: groq(fallbackModel),
        messages: [{ role: 'user', content: userPrompt }],
        schema: OutlineSchema,
        temperature: 0.6,
        providerOptions: {
          groq: fallbackOptions
        }
      });
    }

    // Log reasoning output for debugging
    console.log('=== MODEL OUTPUT ===');
    console.log('Model used:', usedReasoningModel ? modelName : 'llama-3.3-70b-versatile (fallback)');
    console.log('Browser Search Enabled:', enableBrowserSearch);
    console.log('Token usage:', response.usage);
    
    // Simple browser search debugging
    if (enableBrowserSearch) {
      console.log('=== BROWSER SEARCH DEBUG ===');
      console.log('Full response keys:', Object.keys(response));
      // Check if response has any tool-related properties
      const responseAny = response as any;
      if (responseAny.toolCalls) {
        console.log('Tool calls found:', responseAny.toolCalls.length);
      }
      if (responseAny.toolResults) {
        console.log('Tool results found:', responseAny.toolResults.length);
      }
      if (responseAny.steps) {
        console.log('Steps found:', responseAny.steps.length);
      }
    }
    
    console.log('Generated object structure:', Object.keys(response.object));
    const object = response.object;

    // Add template types and IDs to sections
    const usedTemplates: string[] = [];
    const sectionsWithTemplates = object.sections.map((section, index) => {
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
          object.sections.length,
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

    const finalObject = {
      ...object,
      sections: sectionsWithTemplates
    };

    // Enhanced logging for debugging template selection reasoning
    console.log('\n=== GENERATED OUTLINE WITH REASONING ===');
    console.log('Title:', finalObject.title);
    console.log('\nSections with template choices:');
    finalObject.sections.forEach((section, index) => {
      console.log(`\n[Section ${index + 1}] ${section.title}`);
      console.log(`  Template: ${section.templateType}`);
      console.log(`  Bullet points: ${section.bulletPoints.length}`);
      console.log(`  Content preview: ${section.bulletPoints[0].substring(0, 50)}...`);
    });
    console.log('\nTemplate usage summary:');
    const templateCounts = usedTemplates.reduce((acc, template) => {
      acc[template] = (acc[template] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    Object.entries(templateCounts).forEach(([template, count]) => {
      console.log(`  ${template}: ${count} time(s)`);
    });
    console.log('\n=== END OUTLINE ===\n');
    
    return Response.json({
      ...finalObject,
      creditsRemaining: creditResult.newBalance
    });

  } catch (error) {
    console.error('Error generating outline:', error);
    return Response.json(
      { error: 'Failed to generate outline' },
      { status: 500 }
    );
  }
}