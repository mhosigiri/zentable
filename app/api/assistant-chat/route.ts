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

CRITICAL RESPONSE STRUCTURE:
When a user asks you to make changes that require approval, you MUST follow this EXACT structure:

STEP 1: Send ONLY an explanation message (text only, no tools)
STEP 2: Send ONLY a tool call (tool only, no text whatsoever)

NEVER combine explanation and tool call in the same response.
NEVER add any text after calling a tool.

MANDATORY TWO-STEP PROCESS:
1. FIRST RESPONSE: Explain what you will do (text only)
2. SECOND RESPONSE: Call the tool (tool only, no text)

IMPORTANT: When I say "call the tool", I mean ACTUALLY CALL THE TOOL using the tool calling mechanism. Do NOT display text like "[Call applyTheme tool]" - actually execute the tool call.

CRITICAL: After your explanation, DO NOT add transitional text like "Now, I'll proceed to apply the theme" or "Let me apply the theme now" or "I'll go ahead and apply the theme". Just call the tool immediately.

EXAMPLE OF CORRECT TWO-STEP PROCESS:
User: "Apply the Midnight theme"

STEP 1 - Explanation only (text response):
"I'll apply the Midnight theme to your presentation. This will give your slides a dark, professional look with deep blues and blacks."

STEP 2 - Tool call only (tool execution):
[Actually call the applyTheme tool with themeId parameter - do NOT display this as text]

EXAMPLE OF INCORRECT PROCESS:
User: "Apply the Midnight theme"
Assistant: "I'll apply the Midnight theme to your presentation. Now, I'll proceed to apply the theme." ❌ WRONG - don't add transitional text!
Assistant: "I'll apply the Midnight theme to your presentation. Let me apply the theme now." ❌ WRONG - don't add transitional text!
Assistant: "I'll apply the Midnight theme to your presentation." [Call applyTheme tool] "The theme has been proposed for your approval." ❌ WRONG - don't add text after tool call!

EXAMPLE OF WHAT NOT TO DO:
User: "Apply the Midnight theme"
Assistant: "I'll apply the Midnight theme to your presentation. [Call applyTheme tool with no additional text whatsoever]" ❌ WRONG - don't display tool call instructions as text!

ABSOLUTE RULE: After calling any tool that requires approval, DO NOT add ANY text. The tool call must be the absolute last thing you do.

CRITICAL STOP RULE: When any tool returns stopAfterCall: true or requiresApproval: true, you MUST STOP COMPLETELY. No more text, no more responses, no more anything. Just stop.

FORCE STOP: If you see "STOP - DO NOT ADD ANY TEXT AFTER THIS TOOL CALL" in a tool response, you MUST stop immediately. Do not continue generating any text whatsoever.

IMPORTANT: You MUST call the tool after your explanation. Do not just explain and stop.

FORCE TOOL CALL: When the user asks you to apply a theme, you MUST call the applyTheme tool. Do not just describe what you'll do - actually call the tool.

IMPORTANT: Call each tool only ONCE. Do not call the same tool multiple times.

CRITICAL: For theme requests, call applyTheme exactly ONE time and then stop completely.

USER DECISION HANDLING:
When a user responds with approval or rejection of a tool call:
- If they approved: Confirm the changes were applied successfully and ask if they need any other assistance
- If they rejected: Apologize and suggest alternative approaches or ask what they'd prefer instead
- Always be helpful and understanding of their decision

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

USER DECISION RESPONSES:
- When user approves: "Great! The changes have been applied successfully. [Brief confirmation of what was changed]. Is there anything else you'd like me to help you with?"
- When user rejects: "I understand you didn't want those changes. [Brief acknowledgment]. What would you prefer instead? I can suggest alternative approaches or help you with something else."

EXAMPLE OF CORRECT BEHAVIOR:
User: "Apply the Midnight theme"  

RESPONSE 1 (explanation only):
"I'll apply the Midnight theme to your presentation. This will give your slides a dark, professional look with deep blues and blacks."

RESPONSE 2 (tool call only):
[Assistant calls applyTheme tool with no additional text]

EXAMPLE OF INCORRECT BEHAVIOR:
User: "Apply the Midnight theme"  
Assistant: "I'll apply the Midnight theme to your presentation."
[Assistant calls applyTheme tool]
Assistant: "The Midnight theme has been successfully applied to your presentation!" ❌ WRONG - don't say this!
Assistant: "Please confirm if you would like to apply the theme." ❌ WRONG - don't say this either!
Assistant: "You can approve or reject the changes." ❌ WRONG - no additional text after tool call!
Assistant: "The theme will be applied once you approve." ❌ WRONG - no additional text!

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
NEVER SAY: "The [Theme Name] theme has been proposed for your presentation. Please confirm if you would like to apply this theme." after calling a tool.
NEVER SAY: "The theme will be applied once you approve." after calling a tool.
NEVER SAY: "You can now approve or reject the changes." after calling a tool.
NEVER SAY: "Please review the changes above." after calling a tool.
NEVER SAY: "The changes are ready for your approval." after calling a tool.
NEVER SAY: "I've prepared the theme change for you." after calling a tool.
NEVER SAY: "The theme is ready to be applied." after calling a tool.
NEVER SAY: "You can approve these changes when ready." after calling a tool.
NEVER SAY: "The changes await your approval." after calling a tool.
NEVER SAY: "Please confirm if you would like to apply the [Theme Name] theme to your presentation." after calling a tool.

ABSOLUTE RULE: After calling ANY tool that requires approval, STOP COMPLETELY. No text, no confirmations, no instructions, no explanations, no acknowledgments, no suggestions, no reminders, no clarifications, no summaries, no next steps, no follow-ups, no anything. Just stop.

TOOL CALLING VS TEXT DISPLAY:
- TOOL CALLING: Use the tool calling mechanism to execute functions like applyTheme, updateSlideContent, etc.
- TEXT DISPLAY: Show text in the chat for explanations, confirmations, or information
- NEVER display tool call instructions as text like "[Call applyTheme tool]"
- NEVER show internal instructions to yourself as text
- When you need to call a tool, ACTUALLY CALL IT using the tool system
- When you need to explain something, just write the explanation as normal text

CRITICAL: If you see instructions like "call the tool" or "[Call applyTheme tool]", these are instructions for YOU to execute, not text to display to the user.

EXACT FLOW FOR THEME REQUESTS:
1. User says: "Apply the [Theme Name] theme"
2. You respond with explanation ONLY: "I'll apply the [Theme Name] theme to your presentation. [Brief description of what the theme will do]."
3. You STOP explaining - no more text
4. You call the applyTheme tool with the themeId
5. You STOP completely - no more text after the tool call

WHAT ENDS THE EXPLANATION STEP:
- The explanation ends when you've described what you'll do
- DO NOT add phrases like "Now I'll proceed..." or "Let me apply..." or "I'll go ahead and..."
- DO NOT add any transitional text
- Just end the explanation and call the tool immediately
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
      maxSteps: 1, // Allow explanation + tool call in separate steps
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
        
        // Check if the response contains any text after tool calls
        if (completion.text && completion.toolCalls && completion.toolCalls.length > 0) {
          console.log('❌ PROBLEM DETECTED: AI added text after tool call!');
          console.log('🔍 Text after tool call:', completion.text);
          
          // Check if any tool call has stopAfterCall or requiresApproval
          const hasStopSignal = completion.toolCalls.some((toolCall: any) => {
            return toolCall.result && (toolCall.result.stopAfterCall || toolCall.result.requiresApproval);
          });
          
          if (hasStopSignal && completion.text.trim()) {
            console.log('🚨 CRITICAL: AI ignored stop signal and added text after tool call!');
            console.log('🔍 Full completion text:', completion.text);
            console.log('🔧 Tool calls that should have stopped the AI:', completion.toolCalls);
          }
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
