import { openai } from '@ai-sdk/openai';
import { streamText, convertToModelMessages } from 'ai';
import { frontendTools } from "@assistant-ui/react-ai-sdk";
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
      console.error('[assistant-chat-simple] Unauthorized: No user found in session.');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const body = await req.json();
    const { 
      messages: reqMessages, 
      system, 
      tools, 
      context: reqContext, 
      threadId, 
      saveMessage 
    } = body;
    messages = reqMessages || [];
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
2. updateSlideContent: Use this to modify a slide's content with improved HTML. This requires user approval.
3. getSlideIdByNumber: Use this to get a slide ID when the user references a slide by number.
4. createSlide: Use this to create a new slide. This requires user approval.
5. deleteSlide: Use this to delete a slide. This requires user approval.
6. duplicateSlide: Use this to duplicate a slide. This requires user approval.
7. moveSlide: Use this to move a slide. This requires user approval.
8. changeSlideTemplate: Use this to change a slide's template. This requires user approval.
9. updateSlideImage: Use this to update a slide's image. This requires user approval.
10. applyTheme: Use this to apply a theme to the presentation. This requires user approval.

CRITICAL: YOU MUST ALWAYS CONTINUE AFTER TOOL EXECUTION
- After ANY tool call completes, you MUST provide a final response to the user
- NEVER stop after showing a tool call - always continue with a response
- The tool result will be available to you automatically
- Use the tool result to form your final response
- IMPORTANT: Do not end your response after calling a tool - you must continue and provide a final message

WORKFLOW FOR TOOL USAGE:
1. Explain what you plan to do
2. Call the appropriate tool(s)
3. Wait for tool result(s)
4. Provide a final response based on the tool result(s)
5. Offer next steps or additional assistance

EXAMPLE WORKFLOW:
User: "Change the theme to sunset"
AI: "I'll apply the Sunset theme to your presentation to give it a vibrant and warm look."
[Tool call: applyTheme]
[Tool result: success]
AI: "Perfect! I've successfully applied the gradient-sunset theme to your presentation. Your slides now have a beautiful sunset gradient look. Is there anything else you'd like me to help you with?"

RESPONSE FORMAT REQUIREMENTS:
- Every response must end with a final message to the user
- After tool execution, always provide a summary of what was accomplished
- Include specific details from tool results in your final response
- End with a helpful next step or offer additional assistance
- Never leave the user hanging after a tool call

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

TOOL USAGE RULES:
- Use 'getSlideContent' when a user asks to SEE, SHOW, READ, or VIEW a slide's content.
- CRITICAL: ONLY use the 'updateSlideContent' tool if the user explicitly asks to CHANGE, UPDATE, MODIFY, ADD, or REMOVE content.
- NEVER use 'updateSlideContent' if the user asks to SEE, SHOW, READ, or VIEW a slide. For these requests, simply get the content and display it in the chat.

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

READING TOOL RESULTS AND FORMING FINAL RESPONSES:
CRITICAL: AFTER EVERY TOOL EXECUTION, YOU MUST PROVIDE A FINAL RESPONSE TO THE USER.

After any tool execution, you MUST read the tool result and provide a meaningful response to the user. Here's how to handle different types of tool results:

1. SUCCESSFUL TOOL EXECUTIONS:
   - Acknowledge the successful completion
   - Provide a brief summary of what was accomplished
   - Offer next steps or additional assistance if relevant
   - Example: "Perfect! I've successfully updated Slide 2 with your new content. The changes include improved bullet points and a more engaging title. Is there anything else you'd like me to help you with?"

2. TOOL RESULTS WITH PREVIEWS:
   - For tools that show previews (like updateSlideContent), acknowledge the preview is available
   - Explain what the user should do next (approve/reject)
   - Example: "I've prepared the updated content for Slide 3. You can see a preview above - please approve if you like the changes, or let me know if you'd like any adjustments."

3. TOOL RESULTS WITH DATA:
   - Summarize the key information from the result
   - Highlight important details the user should know
   - Example: "I found your presentation has 5 slides total. Slide 2 contains information about market analysis, and Slide 4 covers implementation strategies."

4. TOOL RESULTS WITH ERRORS:
   - Clearly explain what went wrong
   - Suggest alternative approaches
   - Ask for clarification if needed
   - Example: "I wasn't able to find Slide 7 - your presentation only has 5 slides. Would you like me to help you with one of the existing slides instead?"

RESPONSE STRUCTURE GUIDELINES:
- Always start with a brief acknowledgment of what was accomplished
- Include specific details from the tool results when relevant
- End with a helpful next step or offer additional assistance
- Keep responses conversational and user-friendly
- Avoid technical jargon unless the user specifically asks for it

REMINDERS:
- Slide numbers start at 1 (first slide is 1, second slide is 2, etc.)
- Different slide templates require different HTML structures - maintain them
- Always verify that content was updated successfully
- After any tool execution, provide a clear, helpful response to the user
- NEVER stop after a tool call - always continue with a final response`;

    // Convert messages to the format expected by the AI SDK
    const convertedMessages = convertToModelMessages(messages);
    
    // Initialize database service
    const db = new DatabaseService();
    
    // Create or get thread for this conversation
    if (!currentThreadId) {
      try {
        currentThreadId = await db.createThread(presentationId, 'New conversation', user.id);
        console.log('[assistant-chat-simple] Created new thread:', currentThreadId);
      } catch (error) {
        console.error('[assistant-chat-simple] Error creating thread:', error);
      }
    }
    
    // Save user message to database
    if (currentThreadId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        try {
          await db.createMessage(currentThreadId, 'user', lastMessage.content);
          console.log('Saved user message to thread:', currentThreadId);
        } catch (error: any) {
          console.error('Failed to save user message:', error);
        }
      }
    }
    
    let frontendToolsResult;
    try {
      frontendToolsResult = frontendTools(tools || []);
      console.log('[assistant-chat-simple] Successfully created frontendTools:', {
        frontendToolsLength: frontendToolsResult?.length,
        frontendToolsType: typeof frontendToolsResult
      });
    } catch (frontendToolsError) {
      console.error('[assistant-chat-simple] Error creating frontendTools:', frontendToolsError);
      frontendToolsResult = {};
    }
    
    const result = await streamText({
      model: openai('gpt-4o-mini'),
      system: system || systemPrompt,
      messages: convertedMessages,
      temperature: 0.7,
      tools: {
        ...frontendToolsResult,
        getSlideContent: slideTools.getSlideContent,
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
    });

    // Handle completion after stream ends
    result.text.then(async (completion: string) => {
      // Log the completion details
      console.log('[assistant-chat-simple] OpenAI stream completed:', {
        threadId: currentThreadId,
        responseLength: completion?.length || 0,
        usage: result.usage,
        finishReason: result.finishReason,
      });
      
      // Save assistant's response to database when the stream finishes
      if (currentThreadId && completion) {
        try {
          const toolCalls = await result.toolCalls;
          const toolCallsArray = toolCalls && toolCalls.length > 0 ? toolCalls : null;
          await db.createMessage(currentThreadId, 'assistant', completion, toolCallsArray);
          console.log('Saved assistant message to thread:', currentThreadId, 
            { textLength: completion.length, toolCallsCount: toolCallsArray?.length || 0 });
        } catch (error: any) {
          console.error('Failed to save assistant message:', error);
        }
      }
    }).catch((error: any) => {
      console.error('Error in text promise:', error);
    });

    console.log('[assistant-chat-simple] Stream created successfully, returning response');
    const response = result.toUIMessageStreamResponse({
      // Include threadId in response headers for client-side persistence
      headers: currentThreadId ? { 'X-Thread-Id': currentThreadId } : undefined
    });
    console.log('[assistant-chat-simple] Response prepared:', {
      responseType: response.constructor.name,
      threadId: currentThreadId,
      hasHeaders: !!response.headers
    });
    return response;
  } catch (error: any) {
    console.error('[assistant-chat-simple] Error occurred:', {
      error: error?.message || String(error),
      stack: error?.stack,
      presentationId: context?.presentationId,
      threadId: currentThreadId,
      messageCount: messages?.length || 0
    });
    
    // Check if it's an OpenAI API error
    if (error?.name === 'APIError' || error?.type === 'openai_api_error') {
      console.error('[assistant-chat-simple] OpenAI API Error:', {
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
