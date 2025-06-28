import { createAzure } from '@ai-sdk/azure';
import { streamText, tool } from 'ai';
import { getSlideById, updateSlideContent, getSlidesByPresentation } from '@/lib/slides';
import { z } from 'zod';
import { DatabaseService } from '@/lib/database';

export const dynamic = 'force-dynamic';

// Configure Azure OpenAI with AI SDK
const azureOpenAI = createAzure({
  apiKey: process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY,
  apiVersion: '2025-01-01-preview',
  resourceName: process.env.AZURE_RESOURCE_NAME,
});

// Define the updateSlideContent tool using the AI SDK tool helper
const updateSlideContentTool = tool({
  description: 'Propose an update to slide content with improved HTML. This will show a preview for user approval.',
  parameters: z.object({
    slideId: z.string().describe('The ID of the slide to update'),
    content: z.string().describe('The new HTML content for the slide'),
  }),
  execute: async ({ slideId, content }) => {
    console.log('🔍 Tool called: updateSlideContent (PREVIEW MODE)');
    console.log('📝 SlideID:', slideId);
    console.log('📄 Content length:', content.length, 'characters');
    console.log('📄 Content preview:', content.substring(0, 100) + '...');
    
    try {
      // Get the current slide to show what we're updating
      console.log('🔍 Fetching slide from database...');
      const currentSlide = await getSlideById(slideId);
      
      if (!currentSlide) {
        console.error('❌ Slide not found with ID:', slideId);
        return {
          success: false,
          error: 'Slide not found',
          slideId
        };
      }
      
      console.log('✅ Found slide - returning proposed changes for approval');
      
      // Return proposed changes without updating database
      return {
        success: true,
        message: 'Slide content update proposed - awaiting approval',
        slideId,
        currentContent: currentSlide.content,
        proposedContent: content,
        contentLength: content.length,
        slideTitle: currentSlide.title,
        requiresApproval: true
      };
    } catch (error) {
      console.error('❌ Exception in updateSlideContent tool:', error);
      return {
        success: false,
        error: "An exception occurred when proposing slide content update",
        slideId
      };
    }
  },
});

// Define a tool to get slide ID by slide number
const getSlideIdByNumberTool = tool({
  description: 'Get the ID of a slide by its number in the presentation',
  parameters: z.object({
    presentationId: z.string().describe('The ID of the presentation'),
    slideNumber: z.number().describe('The number of the slide (1-based index)'),
  }),
  execute: async ({ presentationId, slideNumber }) => {
    console.log(`🔍 Tool called: getSlideIdByNumber`);
    console.log(`📝 PresentationID: ${presentationId}`);
    console.log(`📄 SlideNumber: ${slideNumber}`);

    try {
      // Get all slides for the presentation
      const slides = await getSlidesByPresentation(presentationId);
      
      if (!slides || slides.length === 0) {
        console.warn('⚠️ No slides found for presentation:', presentationId);
        return {
          success: false,
          error: "No slides found for this presentation",
          slideNumber
        };
      }
      
      console.log(`✅ Found ${slides.length} slides in presentation`);
      
      // Slide numbers are 1-based, but array is 0-based
      const index = slideNumber - 1;
      if (index < 0 || index >= slides.length) {
        console.warn(`⚠️ Invalid slide number: ${slideNumber} (total slides: ${slides.length})`);
        return {
          success: false,
          error: `Invalid slide number. Please provide a number between 1 and ${slides.length}`,
          slideNumber
        };
      }
      
      const slide = slides[index];
      console.log(`✅ Found slide at position ${slideNumber}:`);
      console.log(`   - ID: ${slide.id}`);
      console.log(`   - Type: ${slide.template_type}`);
      console.log(`   - Title: ${slide.title || '(no title)'}`);
      
      return {
        success: true,
        slideId: slide.id,
        slideNumber,
        templateType: slide.template_type,
        title: slide.title || null,
      };
    } catch (error) {
      console.error('❌ Exception in getSlideIdByNumber tool:', error);
      return {
        success: false,
        error: "An exception occurred when fetching slide ID",
        slideNumber
      };
    }
  }
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, context, threadId, saveMessage } = body;
    
    console.log('Request body:', {
      messagesCount: messages?.length,
      context,
    });

    const presentationId = context?.presentationId;
    if (!presentationId) {
      return new Response(
        JSON.stringify({ error: 'Missing presentationId in context' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    
    // Fetch all slides for the presentation to provide context
    let presentationContext = '';
    try {
      const slides = await getSlidesByPresentation(presentationId);
      if (slides && slides.length > 0) {
        presentationContext = `Current presentation contains ${slides.length} slides:\n\n`;
        slides.forEach((slide, index) => {
          presentationContext += `Slide ${index + 1}: ${slide.title || '(No title)'} (Template: ${slide.template_type})\n`;
          presentationContext += `Content preview: ${slide.content ? slide.content.substring(0, 100) + '...' : '(Empty)'}\n\n`;
        });
      } else {
        presentationContext = 'No slides found for this presentation.\n\n';
      }
    } catch (error) {
      console.error('Error fetching slides for context:', error);
      presentationContext = 'Error fetching presentation slides.\n\n';
    }

    const systemPrompt = `You are an AI presentation assistant for Cursor for Slides. Your task is to help users improve their presentation slides.

PRESENTATION CONTEXT:
${presentationContext}

PRESENTATION ID: ${presentationId}

AVAILABLE TOOLS:
1. updateSlideContent: Use this to modify a slide's content with improved HTML
2. getSlideIdByNumber: Use this to get a slide ID when the user references a slide by number (when using this tool, always provide the presentationId parameter)

IMPORTANT INSTRUCTIONS:
- ALWAYS explain your plan before using any tools
- Clearly state what you're going to do and why before taking action
- When asked to modify a slide, use getSlideIdByNumber if the user refers to a slide by number 
- Then use updateSlideContent with the retrieved slideId to make the change
- ALWAYS preserve the ENTIRE HTML structure when modifying content
- Be helpful and concise in your responses

WHEN USING TOOLS:
- First, explain what you plan to do. For example: 'I will first get the slide content, and then I will update it with your new points.'
- After completing the action, summarize what you did.

TOOL USAGE RULES:
- CRITICAL: ONLY use the 'updateSlideContent' tool if the user explicitly asks to CHANGE, UPDATE, MODIFY, ADD, or REMOVE content.
- NEVER use 'updateSlideContent' if the user asks to SEE, SHOW, READ, or VIEW a slide. For these requests, simply get the content and display it in the chat.
- Example of incorrect usage:
  * User asks: 'what is the content of the second slide?'
  * BAD: Using 'getSlideIdByNumber' then 'updateSlideContent'.
  * GOOD: Using 'getSlideIdByNumber', then displaying the content in the chat as text.

WHEN DISPLAYING SLIDE CONTENT:
- ALWAYS present slide content with full HTML tags and styling
- When a user asks to read a slide, show the complete HTML content
- Format the HTML nicely with proper indentation for readability

WHEN IMPROVING SLIDE CONTENT:
- Keep bullet points concise and parallel in structure
- Ensure headings are clear and descriptive
- NEVER remove existing content sections or columns when adding new content
- ALWAYS maintain the complete HTML structure of the slide
- Make content more engaging, professional, and impactful
- Fix any grammar or spelling issues
- Don't change the overall meaning or main points

WHEN UPDATING MULTI-COLUMN SLIDES:
- CRITICAL: Preserve ALL columns when updating any single column
- Example: If a slide has two columns and you're asked to add points to the second column:
  * BAD: Returning only the second column's updated content
  * GOOD: Returning the entire slide HTML with both columns, where only the second column is modified

EXAMPLES OF PROPER CONTENT UPDATES:

Example 1 - Adding to a column:
Original: "<div class='columns'><div class='column'><h3>Benefits</h3><ul><li>Cost savings</li></ul></div><div class='column'><h3>Challenges</h3><ul><li>Implementation</li></ul></div></div>"
Request: "Add 'Scalability' to the Benefits column"
Correct: "<div class='columns'><div class='column'><h3>Benefits</h3><ul><li>Cost savings</li><li>Scalability</li></ul></div><div class='column'><h3>Challenges</h3><ul><li>Implementation</li></ul></div></div>"

Example 2 - Modifying a section:
Original: "<h3>Project Timeline</h3><p>Completion expected by Q4</p><ul><li>Phase 1: Research</li><li>Phase 2: Development</li></ul>"
Request: "Update the timeline to show completion by Q3"
Correct: "<h3>Project Timeline</h3><p>Completion expected by Q3</p><ul><li>Phase 1: Research</li><li>Phase 2: Development</li></ul>"

- Provide only the final HTML content when using updateSlideContent (no markdown or explanations in the content)

REMINDERS:
- Slide numbers start at 1 (first slide is 1, second slide is 2, etc.)
- Different slide templates require different HTML structures - maintain them
- Always verify that content was updated successfully
`;

    console.log('Creating AI stream with context and tools');
    
    // Initialize database service for persistence
    const db = new DatabaseService();
    
    // Handle thread creation and message persistence
    let currentThreadId = threadId;
    if (!currentThreadId && messages.length > 0) {
      // Create a new thread for this conversation
      const firstUserMessage = messages.find((m: any) => m.role === 'user');
      const threadTitle = firstUserMessage?.content ? 
        (typeof firstUserMessage.content === 'string' ? 
          firstUserMessage.content.substring(0, 50) + '...' : 
          'New conversation') : 
        'New conversation';
      
      currentThreadId = await db.createThread(presentationId, threadTitle);
      console.log('Created new thread:', currentThreadId);
    }
    
    // Save incoming user messages to database
    if (currentThreadId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        let content: string;
        if (Array.isArray(lastMessage.content)) {
          // Join all .text fields from array
          content = lastMessage.content.map((item: any) => item.text).join(' ');
        } else if (typeof lastMessage.content === 'string') {
          content = lastMessage.content;
        } else {
          content = String(lastMessage.content);
        }
        await db.createMessage(currentThreadId, 'user', content);
        console.log('Saved user message to thread:', currentThreadId);
      }
    }
    
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
        updateSlideContent: updateSlideContentTool,
        getSlideIdByNumber: getSlideIdByNumberTool,
      },
      toolChoice: 'auto',
      maxSteps: 3, // Allow for conversation, getting slide ID, and updating content
      onFinish: async (completion) => {
        // Save assistant's response to database when the stream finishes
        if (currentThreadId && completion.text) {
          try {
            const toolCalls = completion.toolCalls && completion.toolCalls.length > 0 ? 
              completion.toolCalls : null;
            await db.createMessage(currentThreadId, 'assistant', completion.text, toolCalls);
            console.log('Saved assistant message to thread:', currentThreadId, 
              { textLength: completion.text.length, toolCallsCount: toolCalls?.length || 0 });
          } catch (error) {
            console.error('Failed to save assistant message:', error);
          }
        }
      }
    });

    console.log('Stream created successfully, returning response');
    const response = result.toDataStreamResponse({
      // Include threadId in response headers for client-side persistence
      headers: currentThreadId ? { 'X-Thread-Id': currentThreadId } : undefined
    });
    console.log('Response type:', response.constructor.name, 'ThreadId:', currentThreadId);
    return response;
  } catch (error) {
    console.error('Error in assistant chat:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process assistant chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
