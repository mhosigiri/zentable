import { openai } from '@ai-sdk/openai';
import { 
  streamText, 
  UIMessage, 
  convertToModelMessages, 
  tool,
  stepCountIs,
  createUIMessageStream,
  createUIMessageStreamResponse
} from 'ai';

import { getSlidesByPresentation } from '@/lib/slides';
import { DatabaseService } from '@/lib/database';
import { slideTools } from '@/lib/ai/slide-tools';
import { processToolCalls, slideExecuteFunctions } from '@/lib/ai/hitl-utils';

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

FINAL RESPONSE EXAMPLES:
✅ GOOD: "Perfect! I've successfully applied the gradient-sunset theme to your presentation. Your slides now have a beautiful sunset gradient look. Is there anything else you'd like me to help you with?"

❌ BAD: [Tool call only, no final response]

✅ GOOD: "I've prepared updated content for Slide 3. You can see a preview above - please approve if you like the changes, or let me know if you'd like any adjustments."

❌ BAD: [Tool call with preview, but no explanation of what to do next]

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

5. MULTIPLE TOOL EXECUTIONS:
   - After completing multiple tools, provide a comprehensive summary
   - Connect the actions to the user's original request
   - Example: "Great! I've completed all the requested changes: updated the title on Slide 1, added bullet points to Slide 3, and applied the modern theme to your entire presentation. Your slides now have a more professional and engaging look."

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

    console.log('[assistant-chat] About to call convertToModelMessages with:', {
      messages: messages,
      messagesType: typeof messages,
      messagesLength: messages?.length,
      messagesIsArray: Array.isArray(messages),
      tools: tools,
      toolsType: typeof tools
    });
    
    let convertedMessages;
    try {
      // Convert UIMessages to ModelMessages for AI SDK v5
      convertedMessages = convertToModelMessages(messages || []);
      console.log('[assistant-chat] Successfully converted messages:', {
        convertedLength: convertedMessages?.length,
        convertedType: typeof convertedMessages
      });
    } catch (convertError) {
      console.error('[assistant-chat] Error converting messages:', convertError);
      throw convertError;
    }
    

    
    // For HITL to work properly, we need to use createUIMessageStream with processToolCalls
    const stream = createUIMessageStream({
      originalMessages: messages,
      execute: async ({ writer }) => {
        const result = streamText({
          model: openai('gpt-4o-mini'),
          system: system || systemPrompt,
          messages: convertToModelMessages(messages),
          temperature: 0.7,
          tools: {
            // Tools with execute functions run automatically
            getSlideContent: slideTools.getSlideContent,
            getSlideIdByNumber: slideTools.getSlideIdByNumber,
            
            // Tools WITHOUT execute functions require human approval
            updateSlideContent: slideTools.updateSlideContent,
            createSlide: slideTools.createSlide,
            deleteSlide: slideTools.deleteSlide,
            duplicateSlide: slideTools.duplicateSlide,
            moveSlide: slideTools.moveSlide,
            applyTheme: slideTools.applyTheme,
            updateSlideImage: slideTools.updateSlideImage,
            changeSlideTemplate: slideTools.changeSlideTemplate,
          },
          stopWhen: stepCountIs(5),
        });

        // Process the result through HITL system
        const processedMessages = await processToolCalls(
          {
            tools: slideTools,
            writer,
            messages,
          },
          slideExecuteFunctions
        );

        writer.merge(result.toUIMessageStream({ originalMessages: processedMessages }));
      },
    });

    // Return the UI message stream response
    return createUIMessageStreamResponse({
      stream,
      headers: currentThreadId ? { 'X-Thread-Id': currentThreadId } : undefined
    });
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
