import { createAzure } from '@ai-sdk/azure';
import { streamText, tool } from 'ai';
import { getSlideById, updateSlideContent } from '@/lib/slides';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

// Configure Azure OpenAI with AI SDK
const azureOpenAI = createAzure({
  apiKey: process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY,
  apiVersion: '2025-01-01-preview',
  resourceName: process.env.AZURE_RESOURCE_NAME,
});

// Define the updateSlideContent tool using the AI SDK tool helper
const updateSlideContentTool = tool({
  description: 'Update the content of a slide with new HTML content',
  parameters: z.object({
    slideId: z.string().describe('The ID of the slide to update'),
    content: z.string().describe('The new HTML content for the slide'),
  }),
  execute: async ({ slideId, content }) => {
    console.log('🔍 Tool called: updateSlideContent');
    console.log(`📝 SlideID: ${slideId}`);
    console.log(`📄 Content length: ${content.length} characters`);
    console.log(`📄 Content preview: ${content.substring(0, 100)}...`);
    
    try {
      // Get existing slide first
      console.log('🔍 Fetching slide from database...');
      const slide = await getSlideById(slideId);
      
      if (!slide) {
        console.warn('⚠️ Slide not found with ID:', slideId);
        return {
          success: false,
          error: "Slide not found",
          slideId
        };
      }
      
      console.log('✅ Found slide:');
      console.log(`   - ID: ${slide.id}`);
      console.log(`   - Original content length: ${slide.content?.length || 0} chars`);
      console.log(`   - Original content preview: ${slide.content?.substring(0, 100) || '(empty)'}...`);
      
      // Update the slide content
      console.log('🔄 Calling updateSlideContent function...');
      const success = await updateSlideContent(slideId, content);
      
      if (success) {
        console.log('✅ Database update successful!');
        
        // Verify the update by fetching the slide again
        console.log('🔍 Verifying update by fetching slide again...');
        const updatedSlide = await getSlideById(slideId);
        
        if (updatedSlide && updatedSlide.content === content) {
          console.log('✅ Verification successful - content matches update');
        } else if (updatedSlide) {
          console.warn('⚠️ Verification issue - content doesn\'t match update');
          console.log(`   - Updated content length: ${updatedSlide.content?.length || 0}`);
          console.log(`   - Expected content length: ${content.length}`);
        } else {
          console.error('❌ Verification failed - could not fetch updated slide');
        }
        
        return {
          success: true,
          slideId,
          message: "Slide content updated successfully"
        };
      } else {
        console.error('❌ Database update returned false');
        return {
          success: false,
          error: "Failed to update slide content",
          slideId
        };
      }
    } catch (error) {
      console.error('❌ Exception in updateSlideContent tool:', error);
      return {
        success: false,
        error: "An exception occurred when updating slide content",
        slideId: slideId
      };
    }
  },
})

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

IMPORTANT INSTRUCTIONS:
- You MUST use the updateSlideContent tool to modify slide content
- You already have the slide content in your prompt - there's no need to ask
- Preserve HTML styling and tags when generating new content
- Focus on enhancing the message while keeping the structure intact
- Match the style, tone, and type of the existing content
- Don't ask questions, just enhance the content directly

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
        updateSlideContent: updateSlideContentTool
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
