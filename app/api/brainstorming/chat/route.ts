import { streamText, experimental_createMCPClient } from 'ai';
import { groq } from '@ai-sdk/groq';
import { openai } from '@ai-sdk/openai';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { createClient } from '@/lib/supabase/server';
import { brainstormingTools } from '@/lib/ai/brainstorming-tools';
import { BrainstormingDatabaseService } from '@/lib/brainstorming-database';
import { withCreditCheck } from '@/lib/credits';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { 
        status: 401, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const body = await request.json();
    const { messages, context, threadId } = body;
    const { sessionId: contextSessionId, activeMCPTools = [] } = context || {};
    
    console.log('Brainstorming request:', {
      messagesCount: messages?.length,
      sessionId: contextSessionId,
      activeMCPToolsCount: activeMCPTools.length,
      threadId
    });

    // Check and deduct credits for brainstorming
    const creditResult = await withCreditCheck(user.id, 'brainstorming', {
      sessionId: contextSessionId,
      messageCount: messages?.length || 0,
      mcpToolsCount: activeMCPTools.length
    });

    if (!creditResult.success) {
      return new Response(
        JSON.stringify({ 
          error: creditResult.error,
          creditsRequired: 3,
          currentBalance: creditResult.currentBalance
        }),
        { status: 402, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Initialize database service
    const brainstormingDb = new BrainstormingDatabaseService(supabase);
    
    // Get or create session - for brainstorming we auto-create one
    let sessionId = contextSessionId;
    let session = null;
    
    if (sessionId) {
      session = await brainstormingDb.getSession(sessionId, user.id);
    }
    
    if (!session) {
      // Auto-create a brainstorming session
      session = await brainstormingDb.createSession(
        user.id,
        'AI Brainstorming Session',
        'Creative brainstorming with AI assistance',
        'general'
      );
      sessionId = session?.id;
      
      if (!session) {
        return new Response(JSON.stringify({ error: 'Failed to create brainstorming session' }), { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
    }

    // Get or create thread
    let currentThreadId = threadId;
    if (!currentThreadId) {
      const { data: thread, error: threadError } = await supabase
        .from('brainstorming_threads')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          title: 'AI Brainstorming',
          conversation_type: 'ideation',
          status: 'active'
        })
        .select()
        .single();
      
      if (threadError) {
        console.error('Failed to create thread:', threadError);
        return new Response(JSON.stringify({ error: 'Failed to create conversation thread' }), { 
          status: 500, 
          headers: { 'Content-Type': 'application/json' } 
        });
      }
      
      currentThreadId = thread?.id;
      console.log('Created new thread:', currentThreadId);
    } else {
      console.log('Using existing thread:', currentThreadId);
    }

    // Get session ideas for context
    const ideas = await brainstormingDb.getSessionIdeas(sessionId!, user.id);

    // Build system prompt with context
    const modelInfo = activeMCPTools.length > 0 ? 'OpenAI GPT-4o with MCP tools' : 'Groq OpenAI/GPT-OSS-20B';
    const systemMessage = `You are an AI brainstorming assistant helping with creative ideation and idea development.
You are running on ${modelInfo}.

Session: "${session.title}"
Description: ${session.description || 'No description provided'}

Current ideas in the session:
${ideas?.map(idea => `- ${idea.title}: ${idea.description || 'No description'}`).join('\n') || 'No ideas yet'}

Your role is to:
1. Help generate creative ideas related to specific topics and requests
2. Build upon existing ideas when asked
3. Ask thought-provoking questions to guide brainstorming
4. Organize and categorize ideas when requested
5. Suggest connections between different concepts
6. Use external MCP tools when additional data would enhance the brainstorming

IMPORTANT: You MUST use the suggestIdeas tool when the user explicitly requests idea generation, brainstorming, or creative suggestions. 

Use the suggestIdeas tool for:
- "help me generate ideas for..."
- "give me ideas for..."
- "brainstorm ideas about..."
- "suggest ideas for..."
- "create ideas for..."
- Any request for creative suggestions or brainstorming

Do NOT use the suggestIdeas tool for:
- General greetings or small talk
- Simple questions about the interface
- Basic conversation
- Technical support questions

Available tools:
- suggestIdeas: Generate and provide diverse, specific, actionable ideas (REQUIRED for idea generation requests)
- mcpToolCall: External data integration when needed
- enhanceWithExternalData: Market research and industry insights
- generateTags: Organize ideas with relevant tags${activeMCPTools.length > 0 ? `

Active MCP Tools for this session:
${activeMCPTools.map((tool: any) => `- mcp_${tool.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}: ${tool.description || tool.name}`).join('\n')}

When users ask for information or actions that could benefit from these MCP tools, consider using them to enhance your responses.` : ''}

CRITICAL INSTRUCTIONS FOR IDEA GENERATION:

When using the suggestIdeas tool, you MUST generate ideas that are:

1. **SPECIFIC & ACTIONABLE**: Each idea should be immediately implementable, not vague concepts
   ❌ Bad: "Use social media for marketing"
   ✅ Good: "Create 15-second behind-the-scenes TikTok videos showing your product creation process"

2. **DIVERSE & UNIQUE**: Every idea should be genuinely different from the others
   ❌ Bad: "Post on Instagram, Post on Facebook, Post on Twitter"
   ✅ Good: "User-generated content campaigns, Interactive polls, Behind-the-scenes stories"

3. **DETAILED & PRACTICAL**: Include specific tactics, channels, formats, or approaches
   ❌ Bad: "Improve team productivity"
   ✅ Good: "Implement 15-minute daily async video check-ins using Loom to replace morning meetings"

4. **CONTEXTUALLY RELEVANT**: Tailor ideas to the user's specific situation, industry, or constraints

5. **PRIORITIZE VARIETY**: Use different approaches, channels, timeframes, and resource levels

EXAMPLE QUALITY LEVELS:

For "social media content ideas":

❌ TERRIBLE (Generic):
- "Post about your product"
- "Share company updates"
- "Create engaging content"

✅ EXCELLENT (Specific & Actionable):
- "Create 'Mistake Monday' posts sharing common customer errors and how to fix them"
- "Launch a weekly 'Customer Spotlight' featuring real users and their success stories"
- "Develop interactive 'This or That' polls comparing features, with explanations of why each matters"
- "Share time-lapse videos of your team solving complex problems in real-time"
- "Create educational carousel posts breaking down industry jargon into simple terms"

MANDATORY TOOL USAGE:
- When a user requests ideas, brainstorming, or creative suggestions, you MUST use the suggestIdeas tool
- The suggestIdeas tool requires you to provide the actual ideas in the 'ideas' parameter
- Each idea MUST have: title, description, category, and priority (1-5)
- Do NOT provide ideas in plain text format - they must be generated through the suggestIdeas tool
- The tool creates structured, saveable ideas that users can add to their idea bank
- Always provide ideas through the tool, not through regular text responses

TOOL USAGE EXAMPLE:
When user asks "give me 5 marketing ideas for a coffee shop", you must call:
suggestIdeas({
  theme: "marketing ideas for a coffee shop",
  ideas: [
    {
      title: "Create 'Monday Morning Motivation' social series",
      description: "Post weekly inspirational quotes with beautiful latte art photos every Monday at 7 AM to boost engagement",
      category: "social media",
      priority: 4
    },
    // ... 4 more specific, actionable ideas
  ]
})

ALWAYS use the suggestIdeas tool when users ask for ideas, recommendations, or brainstorming help. Focus on creating immediately useful, specific, and diverse suggestions.`;

    // Save user message if present
    if (currentThreadId && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'user') {
        let content: string;
        if (Array.isArray(lastMessage.content)) {
          content = lastMessage.content.map((item: any) => item.text).join(' ');
        } else if (typeof lastMessage.content === 'string') {
          content = lastMessage.content;
        } else {
          content = String(lastMessage.content);
        }
        
        await supabase
          .from('brainstorming_messages')
          .insert({
            thread_id: currentThreadId,
            user_id: user.id,
            role: 'user',
            content
          });
      }
    }

    // Determine model and tools based on MCP tool availability
    let model;
    let allTools = { ...brainstormingTools };
    let mcpClients: any[] = [];

    if (activeMCPTools.length > 0) {
      // Use OpenAI GPT-4 when MCP tools are active
      model = openai('gpt-4o');
      console.log('Using OpenAI GPT-4o with MCP tools');

      // Create MCP clients for each active tool
      for (const mcpTool of activeMCPTools) {
        try {
          const transport = new StdioClientTransport({
            command: mcpTool.server_config.command,
            args: mcpTool.server_config.args || [],
            env: {
              ...process.env,
              ...mcpTool.server_config.env
            }
          });

          const client = await experimental_createMCPClient({
            transport,
          });

          mcpClients.push(client);

          // Get tools from this MCP server
          const mcpTools = await client.tools();
          allTools = { ...allTools, ...mcpTools };
          
          console.log(`Loaded ${Object.keys(mcpTools).length} tools from ${mcpTool.name}`);
        } catch (error) {
          console.error(`Failed to connect to MCP server ${mcpTool.name}:`, error);
          // Continue with other MCP tools if one fails
        }
      }
    } else {
      // Use Groq GPT-OSS when no MCP tools are active
      model = groq('openai/gpt-oss-20b');
      console.log('Using Groq OpenAI/GPT-OSS-20B');
    }

    const result = await streamText({
      model,
      messages: [
        {
          role: 'system',
          content: systemMessage,
        },
        ...messages,
      ],
      tools: allTools,
    });

    // Handle completion after stream ends
    result.text.then(async (text: string) => {
      // Close MCP clients to free resources
      for (const client of mcpClients) {
        try {
          await client.close();
        } catch (error: any) {
          console.error('Error closing MCP client:', error);
        }
      }

      // Save assistant message
      if (currentThreadId && text) {
        const toolCalls = await result.toolCalls;
        await supabase
        .from('brainstorming_messages')
        .insert({
          thread_id: currentThreadId,
          role: 'assistant',
          content: text,
          tool_calls: toolCalls?.length > 0 ? toolCalls.map(call => ({
            ...call,
            status: 'completed',
            timestamp: new Date().toISOString()
          })) : null
        });
      }
    }).catch(async (error: any) => {
      // Close MCP clients on error to prevent resource leaks
      for (const client of mcpClients) {
        try {
          await client.close();
        } catch (closeError) {
          console.error('Error closing MCP client on error:', closeError);
        }
      }
      console.error('Brainstorming chat error:', error);
    });

    return result.toTextStreamResponse({
      headers: {
        'X-Thread-Id': currentThreadId || '',
        'X-Session-Id': sessionId || ''
      }
    });
  } catch (error) {
    console.error('Brainstorming chat error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to process brainstorming chat' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}