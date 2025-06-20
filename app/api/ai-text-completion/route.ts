import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { text, command, option } = await req.json();

    let systemPrompt = '';
    let userPrompt = '';

    switch (command) {
      case 'improve':
        systemPrompt = 'You are a professional writing assistant. Improve the given text to make it more clear, engaging, and impactful while maintaining the original meaning and tone.';
        userPrompt = `Improve this text: "${text}"`;
        break;
      
      case 'fix':
        systemPrompt = 'You are a grammar and language expert. Fix any grammar, spelling, punctuation, or style issues in the given text while maintaining the original meaning.';
        userPrompt = `Fix the grammar and language issues in this text: "${text}"`;
        break;
      
      case 'shorter':
        systemPrompt = 'You are a professional editor. Make the given text more concise and to-the-point while preserving all key information and meaning.';
        userPrompt = `Make this text shorter and more concise: "${text}"`;
        break;
      
      case 'longer':
        systemPrompt = 'You are a professional writer. Expand the given text with relevant details, examples, or explanations to make it more comprehensive and engaging.';
        userPrompt = `Expand this text with more detail and context: "${text}"`;
        break;
      
      case 'continue':
        systemPrompt = 'You are a professional writer. Continue the given text naturally, maintaining the same tone, style, and context. Write 1-3 sentences that logically follow.';
        userPrompt = `Continue writing from where this text left off: "${text}"`;
        break;
      
      case 'zap':
        systemPrompt = 'You are a helpful writing assistant. Follow the user\'s specific instructions to modify or work with the given text.';
        userPrompt = `Text: "${text}"\n\nInstructions: ${option}`;
        break;
      
      default:
        systemPrompt = 'You are a helpful writing assistant. Improve the given text based on the user\'s request.';
        userPrompt = `${command}: "${text}"`;
    }

    const result = await streamText({
      model: openai('gpt-4o'),
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