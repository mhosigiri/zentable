import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { getSlidesByPresentation } from '@/lib/slides';
import { DatabaseService } from '@/lib/database';
import { slideTools } from '@/lib/ai/slide-tools';
import { createClient } from '@/lib/supabase/server';
import { withCreditCheck } from '@/lib/credits';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  let context: any;
  let currentThreadId: string | undefined | null;
  let messages: any[] = [];
  
  try {
    // Authenticate user first
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error('[assistant-chat] Unauthorized: No user found in session.');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const body = await req.json();
    const { messages: reqMessages, context: reqContext, threadId, saveMessage } = body;
    messages = reqMessages;
    context = reqContext;
    currentThreadId = threadId;
    
    console.log('Request body:', {
      messagesCount: messages?.length,
      context,
    });

    // Check and deduct credits for chat message
    const creditResult = await withCreditCheck(user.id, 'chat_message', {
      presentationId: context?.presentationId,
      messageCount: messages?.length || 0
    });

    if (!creditResult.success) {
      return new Response(
        JSON.stringify({ 
          error: creditResult.error,
          creditsRequired: 2,
          currentBalance: creditResult.currentBalance
        }),
        { status: 402, headers: { 'Content-Type': 'application/json' } }
      );
    }

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
1. getSlideContent: Use to get a slide's content for viewing. NEVER use for updates.
2. updateSlideContent: Use this to modify a slide's content with improved HTML.
3. getSlideIdByNumber: Use this to get a slide ID when the user references a slide by number (when using this tool, always provide the presentationId parameter)
4. createSlide: Use this to create a new slide
5. createSlideWithAI: Use this to create a new slide with AI-generated content
6. deleteSlide: Use this to delete a slide
7. duplicateSlide: Use this to duplicate a slide
8. moveSlide: Use this to move a slide
9. applyTheme: Use this to apply a theme to a slide
10. updateSlideImage: Use this to update a slide's image
11. changeSlideTemplate: Use this to change a slide's template

IMPORTANT INSTRUCTIONS:
- ALWAYS explain your plan before using any tools. DO NOT include code or HTML in your explanations.
- Clearly state what you're going to do and why before taking action
- When asked to modify a slide, use getSlideIdByNumber if the user refers to a slide by number 
- Then use updateSlideContent with the retrieved slideId to make the change
- ALWAYS preserve the ENTIRE HTML structure when modifying content
- Be helpful and concise in your responses
- NEVER repeat content that's already displayed in tool results - the user can see it in the interactive tool display

WHEN USING TOOLS:
- First, explain what you plan to do. For example: 'I will first get the slide content, and then I will update it with your new points.'
- When using tools that require approval (like updateSlideContent, createSlide, etc.), the tool will show a preview and wait for your approval before proceeding.
- After tool approval and execution, you can continue the conversation based on the results.

APPROVAL PROMPT GUIDELINES:
- When requesting approval for changes, use natural, conversational language
- Instead of "Would you like to approve this image update?", say something like "Please approve if you like the changes, or reject if you'd prefer something different"
- Keep approval requests brief and friendly
- Don't use formal question structures like "Would you like to..."

TOOL USAGE RULES:
- Use 'getSlideContent' when a user asks to SEE, SHOW, READ, or VIEW a slide's content.
- CRITICAL: ONLY use the 'updateSlideContent' tool if the user explicitly asks to CHANGE, UPDATE, MODIFY, ADD, or REMOVE content.
- NEVER use 'updateSlideContent' if the user asks to SEE, SHOW, READ, or VIEW a slide. For these requests, simply get the content and display it in the chat.
- Example of correct usage for viewing:
  * User asks: 'what is the content of the second slide?'
  * GOOD: Use 'getSlideIdByNumber' then 'getSlideContent'. Then display the result in the chat.
- Example of incorrect usage:
  * User asks: 'what is the content of the second slide?'
  * BAD: Using 'getSlideIdByNumber' then 'updateSlideContent'.

WHEN DISPLAYING SLIDE CONTENT:
- After using getSlideContent tool, DO NOT show the HTML content again in your response
- The slide preview is already displayed in the tool result - no need to repeat it
- Simply acknowledge what you found: "Here's the content of Slide X:" (the tool will show the preview automatically)
- NEVER duplicate slide content that's already shown in the tool result

WHEN IMPROVING SLIDE CONTENT:
- Keep bullet points concise and parallel in structure
- Ensure headings are clear and descriptive
- NEVER remove existing content sections or columns when adding new content
- ALWAYS maintain the complete HTML structure of the slide
- Make content more engaging, professional, and impactful
- Fix any grammar or spelling issues
- Don't change the overall meaning or main points
- After updating content, do NOT show the HTML again - the tool result will display the preview automatically

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
    
    // Initialize database service for persistence with authenticated client
    const db = new DatabaseService(supabase);
    
    // Handle thread creation and message persistence
    if (!currentThreadId && messages.length > 0) {
      // Create a new thread for this conversation
      const firstUserMessage = messages.find((m: any) => m.role === 'user');
      const threadTitle = firstUserMessage?.content ? 
        (typeof firstUserMessage.content === 'string' ? 
          firstUserMessage.content.substring(0, 50) + '...' : 
          'New conversation') : 
        'New conversation';
      
      console.log(`[assistant-chat] Creating new thread for user: ${user.id} with title: "${threadTitle}"`);
      currentThreadId = await db.createThread(presentationId, threadTitle, user.id);
      console.log('[assistant-chat] Created new thread with ID:', currentThreadId);
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
    
    // Log the request details
    console.log('[assistant-chat] Starting OpenAI stream with:', {
      model: 'gpt-5-nano',
      messageCount: messages.length,
      presentationId,
      threadId: currentThreadId,
      temperature: 0.7,
      maxSteps: 20
    });

    const result = await streamText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        ...messages,
      ],
      temperature: 0.7,
      tools: {
        getSlideContent: slideTools.getSlideContent,
        updateSlideContent: slideTools.proposeSlideUpdate,
        getSlideIdByNumber: slideTools.getSlideIdByNumber,
        createSlide: slideTools.createSlide,
        createSlideWithAI: slideTools.createSlideWithAI,
        deleteSlide: slideTools.deleteSlide,
        duplicateSlide: slideTools.duplicateSlide,
        moveSlide: slideTools.moveSlide,
        applyTheme: slideTools.applyTheme,
        updateSlideImage: slideTools.updateSlideImage,
        changeSlideTemplate: slideTools.changeSlideTemplate,
      },
      toolChoice: 'auto',
      maxSteps: 20,
      onFinish: async (completion) => {
        // Log the completion details
        console.log('[assistant-chat] OpenAI stream completed:', {
          threadId: currentThreadId,
          responseLength: completion.text?.length || 0,
          toolCallsCount: completion.toolCalls?.length || 0,
          usage: completion.usage,
          finishReason: completion.finishReason,
          modelId: completion.providerMetadata?.openai?.modelId || 'unknown'
        });
        
        console.log('[assistant-chat] Full completion object keys:', Object.keys(completion));
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

    console.log('[assistant-chat] Stream created successfully, returning response');
    const response = result.toDataStreamResponse({
      // Include threadId in response headers for client-side persistence
      headers: currentThreadId ? { 'X-Thread-Id': currentThreadId } : undefined
    });
    console.log('[assistant-chat] Response prepared:', {
      responseType: response.constructor.name,
      threadId: currentThreadId,
      hasHeaders: !!response.headers
    });
    return response;
  } catch (error: any) {
    console.error('[assistant-chat] Error occurred:', {
      error: error?.message || String(error),
      stack: error?.stack,
      presentationId: context?.presentationId,
      threadId: currentThreadId,
      messageCount: messages?.length || 0
    });
    
    // Check if it's an OpenAI API error
    if (error?.name === 'APIError' || error?.type === 'openai_api_error') {
      console.error('[assistant-chat] OpenAI API Error:', {
        status: error?.status,
        code: error?.code,
        type: error?.type,
        message: error?.message
      });
    }
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to process assistant chat request',
        details: process.env.NODE_ENV === 'development' ? error?.message : undefined
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
