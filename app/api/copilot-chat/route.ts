import { createAzure } from '@ai-sdk/azure';
import { streamText } from 'ai';
import { getSlideById } from '@/lib/slides';
import { slideTools } from '@/lib/ai/slide-tools';

export const dynamic = 'force-dynamic';

// Configure Azure OpenAI with AI SDK
const azureOpenAI = createAzure({
  apiKey: process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY,
  apiVersion: '2025-01-01-preview',
  resourceName: process.env.AZURE_RESOURCE_NAME,
});

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    console.log('Raw request body:', bodyText);

    const { messages, slideId } = JSON.parse(bodyText);
    console.log('Parsed request:', { messages, slideId });

    let slideContext = '';
    let currentSlide = null;
    
    try {
      currentSlide = await getSlideById(slideId);
      if (currentSlide) {
        console.log('Successfully fetched slide with ID:', slideId);
        slideContext = `Current slide content (HTML):\n${currentSlide.content}\n\n`;
      } else {
        console.warn('No slide found with ID:', slideId);
        slideContext = 'No slide found with that ID.\n\n';
      }
    } catch (error) {
      console.error('Error fetching slide for context:', error);
      slideContext = 'Error fetching slide content.\n\n';
    }

    const systemPrompt = `You are an AI presentation assistant for Cursor for Slides. Your task is to help users improve their slide content.

CRITICAL RULE: When you need to call a tool that requires approval, FIRST send a message explaining what you're going to do, THEN call the tool in a separate response.

ABSOLUTE RULE: After calling any tool that requires approval, DO NOT say ANYTHING. Stop completely. No additional text, no confirmations, no instructions.

IMPORTANT INSTRUCTIONS:
- You MUST use the updateSlideContent tool to modify slide content
- You already have the slide content in your prompt - there's no need to ask
- Preserve HTML styling and tags when generating new content
- Focus on enhancing the message while keeping the structure intact
- Match the style, tone, and type of the existing content
- Don't ask questions, just enhance the content directly
- CRITICAL: After calling updateSlideContent, DO NOT provide any follow-up messages, confirmations, or additional text
- FIRST send a message explaining what improvements you'll make, THEN call updateSlideContent in a separate response
- NO additional instructions or confirmations after the tool call

${slideContext}

When improving slide content:
- Keep bullet points concise and parallel in structure
- Ensure headings are clear and descriptive
- Maintain existing HTML formatting, tags, and styling
- Remove unnecessary content or distracting elements
- Strengthen weak points or clarify confusing sections
- Fix any grammar or spelling issues
- Make content more engaging, professional, and impactful
- Don't change the overall meaning or main points
- Don't add excessive technical jargon unless appropriate
- Consider the following improvements when asked:
- Fix any grammar or spelling issues
- Make content more concise and impactful parameters. DO NOT include explanations or markdown formatting in the content parameter. - use proper HTML only

When modifying content:
- Make text more concise and impactful
- Improve clarity and readability
- Fix any grammar or spelling issues
- Optimize for presentation format (brief, scannable)
- Use strong, active language
- Maintain the user's original message intent

Important: When returning content through the updateSlideContent tool, provide ONLY the final HTML content without any additional explanation text or formatting.

FINAL REMINDER: If you call a tool that requires approval, DO NOT say ANYTHING after calling it. Just stop completely and wait for the user's next message.

ALWAYS EXPLAIN BEFORE CALLING: FIRST send a message explaining what you're going to do, THEN call the tool that requires approval in a separate response.

NEVER SAY: "Please confirm" or "You can approve or reject" after calling a tool.
`;

    // Create a result with AI SDK streaming and tool calling
    console.log('Fetching slide data for slideId:', slideId);
    
    const result = await streamText({
      model: azureOpenAI(process.env.AZURE_GPT4_DEPLOYMENT || 'gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages,
      ],
      temperature: 0.7,
      tools: {
        updateSlideContent: slideTools.updateSlideContent,
        getSlideIdByNumber: slideTools.getSlideIdByNumber,
        createSlide: slideTools.createSlide,
        deleteSlide: slideTools.deleteSlide,
        duplicateSlide: slideTools.duplicateSlide,
        moveSlide: slideTools.moveSlide,
        applyTheme: slideTools.applyTheme,
        updateSlideImage: slideTools.updateSlideImage,
        changeSlideTemplate: slideTools.changeSlideTemplate,
      },
      toolChoice: 'auto',
      maxSteps: 2, // Allow initial response and tool execution
    });

    console.log('Stream created successfully, returning response');
    const response = result.toDataStreamResponse();
    console.log('Response type:', response.constructor.name);
    return response;
  } catch (error) {
    console.error('Error in copilot chat:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process copilot chat request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
