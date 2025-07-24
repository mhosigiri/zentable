import { createAzure } from '@ai-sdk/azure';
import { streamText } from 'ai';
import { getSlidesByPresentation } from '@/lib/slides';
import { DatabaseService } from '@/lib/database';
import { slideTools } from '@/lib/ai/slide-tools';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// Configure Azure OpenAI with AI SDK
const azureOpenAI = createAzure({
  apiKey: process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY,
  apiVersion: '2025-01-01-preview',
  resourceName: process.env.AZURE_RESOURCE_NAME,
});

export async function POST(req: Request) {
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
    const { messages, context, threadId, saveMessage } = body;
    
    console.log('📨 REQUEST DEBUG:');
    console.log('Request body:', {
      messagesCount: messages?.length,
      context,
    });
    console.log('📝 Last user message:', messages?.[messages.length - 1]);

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

CRITICAL RULE: When you need to call a tool that requires approval, FIRST send a message explaining what you're going to do, THEN call the tool in a separate response.

ABSOLUTE RULE: If you call applyTheme, updateSlideContent, createSlide, deleteSlide, duplicateSlide, moveSlide, changeSlideTemplate, or updateSlideImage, DO NOT say ANYTHING after calling the tool. Stop immediately. No additional text, no confirmations, no instructions.

PRESENTATION CONTEXT:
${presentationContext}

PRESENTATION ID: ${presentationId}

AVAILABLE TOOLS:
1. getSlideContent: Use to get a slide's content for viewing. NEVER use for updates.
2. updateSlideContent: Use this to modify a slide's content with improved HTML. (Requires approval)
3. getSlideIdByNumber: Use this to get a slide ID when the user references a slide by number (when using this tool, always provide the presentationId parameter)
4. createSlide: Use this to create a new slide (Requires approval)
5. createSlideWithAI: Use this to create a new slide with AI-generated content (Requires approval)
6. deleteSlide: Use this to delete a slide (Requires approval)
7. duplicateSlide: Use this to duplicate a slide (Requires approval)
8. moveSlide: Use this to move a slide (Requires approval)
9. applyTheme: Use this to apply a theme to a slide (Requires approval)
10. updateSlideImage: Use this to update a slide's image (Requires approval)
11. changeSlideTemplate: Use this to change a slide's template (Requires approval)

IMPORTANT INSTRUCTIONS:
- ALWAYS explain your plan before using any tools. DO NOT include code or HTML in your explanations.
- Clearly state what you're going to do and why before taking action
- When asked to modify a slide, use getSlideIdByNumber if the user refers to a slide by number 
- Then use updateSlideContent with the retrieved slideId to make the change
- ALWAYS preserve the ENTIRE HTML structure when modifying content
- Be helpful and concise in your responses

APPROVAL WORKFLOW:
- Most tools require user approval before changes are applied
- After calling a tool that requires approval, DO NOT provide any follow-up messages
- DO NOT say anything after calling the tool - just call it and stop
- The user will see an approval interface with "Apply Changes" and "Reject" buttons
- Wait for the user to make their decision before providing any additional response
- Only respond to the user's next message after they have approved or rejected the changes
- Never prematurely confirm that changes have been applied

EXAMPLE OF CORRECT BEHAVIOR:
User: "Apply the Midnight theme"
Assistant: "I'll apply the Midnight theme to your presentation. This will update the background colors, text styling, and overall visual appearance to give your slides a sleek, dark aesthetic with better contrast and readability."

[Assistant then calls applyTheme tool and STOPS COMPLETELY - no additional text, no confirmations, no instructions]

EXAMPLE OF INCORRECT BEHAVIOR:
User: "Apply the Midnight theme"  
Assistant: "I'll apply the Midnight theme to your presentation."
[Assistant calls applyTheme tool]
Assistant: "The Midnight theme has been successfully applied to your presentation!" ❌ WRONG - don't say this!
Assistant: "Please confirm if you would like to apply the theme." ❌ WRONG - don't say this either!
Assistant: "You can approve or reject the changes." ❌ WRONG - no additional text after tool call!

WHEN USING TOOLS:
- FIRST send a message explaining what you plan to do, THEN call the tool that requires approval in a separate response.
- For themes: Explain what visual changes the theme will make (colors, styling, appearance)
- For content updates: Explain what improvements you'll make (clarity, grammar, structure)
- For slide operations: Explain what will happen (creation, deletion, movement)
- CRITICAL: After calling tools that require approval (like updateSlideContent, applyTheme, etc.), DO NOT provide any follow-up messages, confirmations, or additional text.
- DO NOT say anything after calling a tool that requires approval - just call the tool and stop completely.
- NO additional instructions, confirmations, or explanations after the tool call.
- The user will see an approval interface with "Apply Changes" and "Reject" buttons.
- Only respond to the user's next message after they have made their decision.
- Never prematurely confirm that changes have been applied.

TOOL USAGE RULES:
- Use 'getSlideContent' when a user asks to SEE, SHOW, READ, or VIEW a slide's content.
- CRITICAL: ONLY use the 'updateSlideContent' tool if the user explicitly asks to CHANGE, UPDATE, MODIFY, ADD, or REMOVE content.
- NEVER use 'updateSlideContent' if the user asks to SEE, SHOW, READ, or VIEW a slide. For these requests, simply get the content and display it in the chat.
- CRITICAL: When using 'applyTheme', FIRST send a message explaining what the theme will change, THEN call the tool in a separate response.
- DO NOT say "The [Theme Name] theme has been successfully applied to your presentation!" after calling the tool
- DO NOT provide any follow-up messages after calling applyTheme - just call the tool and stop completely
- DO NOT say "Please confirm" or "You can approve or reject" after calling the tool
- The user will see an approval interface - let them decide whether to apply or reject
- Example of correct usage for viewing:
  * User asks: 'what is the content of the second slide?'
  * GOOD: Use 'getSlideIdByNumber' then 'getSlideContent'. Then display the result in the chat.
- Example of incorrect usage:
  * User asks: 'what is the content of the second slide?'
  * BAD: Using 'getSlideIdByNumber' then 'updateSlideContent'.

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
- NEVER prematurely confirm that changes have been applied - wait for user approval
- Tools that return requiresApproval: true need user confirmation before being applied
- CRITICAL: After calling any tool with requiresApproval: true, DO NOT provide any additional text or confirmation messages
- Simply call the tool and stop - let the approval interface handle the user interaction

FINAL REMINDER: If you call a tool that requires approval, DO NOT say ANYTHING after calling it. Just stop completely and wait for the user's next message.

ALWAYS EXPLAIN BEFORE CALLING: FIRST send a message explaining what you're going to do, THEN call the tool that requires approval in a separate response.

NEVER SAY: "The [Theme Name] theme has been successfully applied to your presentation!" or any similar success message after calling a tool.
NEVER SAY: "Please confirm" or "You can approve or reject" after calling a tool.
`;

    console.log('🤖 CREATING AI STREAM:');
    console.log('📋 System prompt length:', systemPrompt.length);
    console.log('🔧 Available tools:', Object.keys({
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
    }));
    
    // Initialize database service for persistence with authenticated client
    const db = new DatabaseService(supabase);
    
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
    
    console.log('🚀 Starting AI stream...');
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
      maxSteps: 2,
      onFinish: async (completion) => {
        console.log('🎯 onFinish callback triggered!');
        // Log the complete AI response for debugging
        console.log('🤖 AI RESPONSE DEBUG:');
        console.log('📝 Full completion text:', completion.text);
        console.log('🔧 Tool calls:', completion.toolCalls);
        console.log('📊 Response length:', completion.text?.length || 0);
        
        // Check if the response contains the problematic success message
        if (completion.text && completion.text.includes('has been successfully applied')) {
          console.log('❌ PROBLEM DETECTED: AI provided premature success message!');
          console.log('🔍 Problematic text found:', completion.text);
        }
        
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
    console.log('✅ AI stream created successfully');

    console.log('📤 Creating data stream response...');
    const response = result.toDataStreamResponse({
      // Include threadId in response headers for client-side persistence
      headers: currentThreadId ? { 'X-Thread-Id': currentThreadId } : undefined
    });
    console.log('📤 Response created, type:', response.constructor.name, 'ThreadId:', currentThreadId);
    return response;
  } catch (error) {
    console.error('Error in assistant chat:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process assistant chat request' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
