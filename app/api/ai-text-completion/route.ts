import { createAzure } from '@ai-sdk/azure';
import { streamText } from 'ai';

export const dynamic = 'force-dynamic';

// Configure Azure OpenAI - using resourceName pattern that works with AI SDK
const azureOpenAI = createAzure({
  apiKey: process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY,
  apiVersion: '2025-01-01-preview',
  resourceName: process.env.AZURE_RESOURCE_NAME,
});

export async function POST(req: Request) {
  try {
    const { text, command, option } = await req.json();

    let systemPrompt = '';
    let userPrompt = '';

    switch (command) {
      case 'improve':
        systemPrompt = `You are an expert presentation slide writer. Improve the given text to make it more clear, engaging, and impactful for a presentation slide. Make it brief, visually scannable, and easy to read on a slide. Use concise language, strong verbs, and keep all content presentation-ready.`;
        userPrompt = `Improve this text for a presentation slide: "${text}"`;
        break;
      
      case 'fix':
        systemPrompt = `You are a presentation content editor. Fix any grammar, spelling, punctuation, or style issues in the given text while making it concise and visually clear for a presentation slide. Prioritize clarity, brevity, and readability.`;
        userPrompt = `Fix grammar and style for a presentation slide: "${text}"`;
        break;
      
      case 'shorter':
        systemPrompt = `You are a presentation slide expert. Make the given text as concise and to-the-point as possible for a presentation slide, while preserving all key information. Use short sentences or bullet points, and keep it visually scannable.`;
        userPrompt = `Make this text shorter and more concise for a slide: "${text}"`;
        break;
      
      case 'longer':
        systemPrompt = `You are a presentation slide writer. Expand the given text with relevant sentence or two, not any more.`;
        userPrompt = `Expand this text for a presentation slide: "${text}"`;
        break;
      
      case 'continue':
        systemPrompt = `You are a presentation slide writer. Continue the given text naturally, maintaining a concise, scannable style suitable for a slide. Write 1-2 short sentences or bullet points that logically follow.`;
        userPrompt = `Continue writing for a presentation slide: "${text}"`;
        break;
      
      case 'zap':
        systemPrompt = `You are a helpful presentation slide assistant. Follow the user's specific instructions to modify or work with the given text, always optimizing for presentation slides: brief, impactful, and visually clear.`;
        userPrompt = `Text: "${text}"

Instructions: ${option}`;
        break;
      
      default:
        systemPrompt = `You are a helpful presentation slide assistant. Improve the given text for a presentation slide: make it concise, visually scannable, and impactful.`;
        userPrompt = `${command} (for a presentation slide): "${text}"`;
    }

    const result = await streamText({
      model: azureOpenAI('gpt-4o-mini'),
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