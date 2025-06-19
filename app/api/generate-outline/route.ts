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
    // First slide - prefer visually striking templates
    const firstSlidePreferred = finalTemplates.filter(t => 
      ['title-with-bullets-and-image', 'image-and-text', 'text-and-image', 'bullets', 'accent-left', 'accent-right', 'accent-top'].includes(t)
    );
    if (firstSlidePreferred.length > 0) {
      return firstSlidePreferred[Math.floor(Math.random() * firstSlidePreferred.length)];
    }
  }
  
  if (index === totalSections - 1) {
    // Last slide - prefer summary-friendly templates
    const lastSlidePreferred = finalTemplates.filter(t => 
      ['title-with-bullets', 'bullets', 'paragraph', 'two-columns', 'three-columns'].includes(t)
    );
    if (lastSlidePreferred.length > 0) {
      return lastSlidePreferred[Math.floor(Math.random() * lastSlidePreferred.length)];
    }
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

Remember: This is for SLIDE presentations - content must be scannable and visually digestible, not essay-like.

The outline should create a compelling ${cardCount}-slide presentation with maximum visual variety.`;

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
              const usedTemplates: string[] = [];
              const sectionsWithTemplates = partialObject.sections.map((section, index) => {
                if (!section) return section;
                
                const templateType = section.templateType || selectTemplateType(
                  section.title || '', 
                  (section.bulletPoints || []).filter((bp): bp is string => typeof bp === 'string'), 
                  index, 
                  partialObject.sections?.length || 0,
                  usedTemplates
                );
                
                usedTemplates.push(templateType);
                
                return {
                  ...section,
                  id: `section-${index + 1}`,
                  templateType
                };
              });

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