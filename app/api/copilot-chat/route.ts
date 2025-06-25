import { NextRequest, NextResponse } from 'next/server'
import { createAzure } from '@ai-sdk/azure'
import { streamText, tool } from 'ai'
import { supabase } from '@/lib/supabase'
import { z } from 'zod'

// Configure Azure OpenAI
const azureOpenAI = createAzure({
  apiKey: process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY,
  apiVersion: '2025-01-01-preview',
  resourceName: process.env.AZURE_RESOURCE_NAME,
})

// Tool definitions using AI SDK format
const tools = {
  updateSlideContent: tool({
    description: 'Update the full HTML content of a slide. This is the preferred method for modifying slide content.',
    parameters: z.object({
      slideId: z.string().describe('The ID of the slide to update'),
      content: z.string().describe('The full HTML content to replace the current content with. Maintain the original HTML structure with appropriate tags.')
    }),
    execute: async ({ slideId, content }) => {
      // Log for debugging
      console.log(`Updating content for slide ${slideId}`)
      console.log(`New content: ${content.substring(0, 100)}...`)
      
      const { data, error } = await supabase
        .from('slides')
        .update({ content: content })
        .eq('id', slideId)
        .select()
        .single()
      
      if (error) {
        console.error('Error updating slide content:', error)
        return { error: error.message, success: false }
      }
      
      return { success: true, message: `Updated content for slide ${slideId}`, data }
    },
  }),
  updateSlideProperty: tool({
    description: 'Update any property on a slide',
    parameters: z.object({
      slideId: z.string().describe('The ID of the slide to update'),
      property: z.string().describe('The property to update (title, content, etc.)'),
      value: z.string().describe('The new value for the property'),
    }),
    execute: async ({ slideId, property, value }) => {
      const { data, error } = await supabase
        .from('slides')
        .update({ [property]: value } as any)
        .eq('id', slideId)
        .select()
        .single()
      
      if (error) return { error: error.message }
      return { success: true, message: `Updated ${property} for slide ${slideId}`, data }
    },
  }),

  addBulletToProperty: tool({
    description: 'Add a bullet point to a slide property',
    parameters: z.object({
      slideId: z.string().describe('The ID of the slide to update'),
      property: z.string().describe('The property to add bullet to (usually bullet_points)'),
      bullet: z.string().describe('The bullet point text to add'),
      position: z.number().optional().describe('Position to insert bullet (default: end)'),
    }),
    execute: async ({ slideId, property, bullet, position }) => {
      // Get current slide data
      const { data: slide, error: fetchError } = await supabase
        .from('slides')
        .select('*')
        .eq('id', slideId)
        .single()
      
      if (fetchError) return { error: fetchError.message }
      
      // Handle bullet points array
      let currentBullets: string[] = []
      const propertyValue = (slide as any)?.[property]
      
      if (Array.isArray(propertyValue)) {
        currentBullets = propertyValue
      } else if (typeof propertyValue === 'string' && propertyValue) {
        currentBullets = [propertyValue]
      }
      
      // Insert bullet at specified position or at end
      if (position !== undefined && position >= 0 && position <= currentBullets.length) {
        currentBullets.splice(position, 0, bullet)
      } else {
        currentBullets.push(bullet)
      }
      
      // Update slide
      const { data, error } = await supabase
        .from('slides')
        .update({ [property]: currentBullets } as any)
        .eq('id', slideId)
        .select()
        .single()
      
      if (error) return { error: error.message }
      return { success: true, message: `Added bullet point to ${property} for slide ${slideId}`, data }
    },
  }),

  deleteSlide: tool({
    description: 'Delete a slide from the presentation',
    parameters: z.object({
      slideId: z.string().describe('The ID of the slide to delete'),
      confirmDelete: z.boolean().describe('Confirmation that user wants to delete'),
    }),
    execute: async ({ slideId, confirmDelete }) => {
      if (!confirmDelete) {
        return { error: 'Delete operation cancelled - confirmation required' }
      }
      
      const { data, error } = await supabase
        .from('slides')
        .delete()
        .eq('id', slideId)
        .select()
        .single()
      
      if (error) return { error: error.message }
      return { success: true, message: `Deleted slide ${slideId}`, data }
    },
  }),
}

// Request schema
const ChatRequest = z.object({
  message: z.string(),
  presentationId: z.string(),
  threadId: z.string().nullable().optional(),
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant']),
    content: z.string(),
  })).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, presentationId, threadId, messages } = ChatRequest.parse(body)

    // Get presentation context for better responses
    // Handle document ID to presentation UUID mapping
    let presentationUuid: string;
    
    // Check if ID is already a UUID or needs to be looked up
    if (presentationId.startsWith('doc_')) {
      // This is a document ID, need to look up the UUID
      const { data: presentationData, error: lookupError } = await supabase
        .from('presentations')
        .select('id')
        .eq('doc_id', presentationId)
        .single();
      
      if (lookupError || !presentationData) {
        // If lookup fails, try to find by title format
        const docIdParts = presentationId.split('_');
        const timestamp = docIdParts[1];
        
        if (timestamp) {
          // Search by created_at timestamp
          const { data: timeData } = await supabase
            .from('presentations')
            .select('id')
            .gte('created_at', new Date(parseInt(timestamp)).toISOString())
            .order('created_at')
            .limit(1);
            
          if (timeData && timeData.length > 0) {
            presentationUuid = timeData[0].id;
            console.log(`Found presentation by timestamp: ${presentationUuid}`);
          } else {
            console.error('Error resolving document ID:', presentationId);
            return NextResponse.json({ error: 'Presentation not found' }, { status: 404 });
          }
        } else {
          console.error('Error resolving document ID:', presentationId);
          return NextResponse.json({ error: 'Presentation not found' }, { status: 404 });
        }
      } else {
        presentationUuid = presentationData.id;
        console.log(`Found presentation UUID: ${presentationUuid}`);
      }
    } else {
      // Already a UUID
      presentationUuid = presentationId;
    }
    
    // Get presentation data with error handling
    const { data: presentation, error: presentationError } = await supabase
      .from('presentations')
      .select('id, title, prompt, card_count, style, language, content_length, theme_id, image_style, status, outline')
      .eq('id', presentationUuid)
      .single()
    
    if (presentationError) {
      console.error('Error fetching presentation:', presentationError)
      return NextResponse.json({ error: 'Failed to get presentation data' }, { status: 500 })
    }

    // Get detailed slide data with error handling
    const { data: slides, error: slidesError } = await supabase
      .from('slides')
      .select('*')
      .eq('presentation_id', presentationUuid)
      .order('position')
      
    if (slidesError) {
      console.error('Error fetching slides:', slidesError)
      return NextResponse.json({ error: 'Failed to get slide data' }, { status: 500 })
    }
    
    // Log the data for debugging
    console.log(`Found presentation: ${presentation.title} with ${slides.length} slides`)

    let context = `
Presentation: "${presentation.title || 'Untitled'}"
ID: ${presentation.id}
Prompt: ${presentation.prompt || 'No prompt'}
Theme: ${presentation.theme_id || 'Default'}
Style: ${presentation.style || 'Default'}
Language: ${presentation.language || 'English'}
Image Style: ${presentation.image_style || 'None'}
Content Length: ${presentation.content_length || 'Medium'}
Card Count: ${presentation.card_count || 0}
Status: ${presentation.status || 'draft'}
Slides (${slides.length || 0} total):
`

    if (slides.length === 0) {
      context += 'No slides in this presentation yet.'
    } else {
      slides.forEach((slide, index) => {
        // Start with basic slide info including ID (crucial for tool calls)
        let slideDetails = `${index + 1}. ID: ${slide.id} - "${slide.title || 'Untitled slide'}"`
        
        // Add template type if available
        if (slide.template_type) {
          slideDetails += ` - Template: ${slide.template_type}`
        }
        
        // Add position if available
        if (slide.position !== undefined && slide.position !== null) {
          slideDetails += ` - Slide #${slide.position}`
        }
        
        // Start a new line for content details
        slideDetails += '\n   '
        
        // Add content with clear formatting
        if (slide.content) {
          slideDetails += `Content: ${slide.content.slice(0, 150)}${slide.content.length > 150 ? '...' : ''}`
        } else {
          slideDetails += 'Content: None'
        }
        
        // Add bullet points with proper formatting
        if (slide.bullet_points && Array.isArray(slide.bullet_points) && slide.bullet_points.length > 0) {
          slideDetails += '\n   Bullet points:'
          slide.bullet_points.forEach((bullet: any, i: number) => {
            if (typeof bullet === 'string') {
              slideDetails += `\n     • ${bullet}`
            } else if (bullet && typeof bullet === 'object' && bullet.text) {
              slideDetails += `\n     • ${bullet.text}`
            }
          })
        }
        
        context += '\n' + slideDetails
      })
    }

    context = context.trim()

    // Get or create thread
    let currentThreadId = threadId
    if (!currentThreadId) {
      const { data: newThread, error: threadError } = await supabase
        .from('copilot_threads')
        .insert({
          presentation_id: presentationUuid,
          title: `Chat for ${presentation.title || 'Untitled'}`
        })
        .select('id')
        .single()
      
      if (threadError) {
        console.error('Error creating thread:', threadError)
        return NextResponse.json({ error: 'Failed to create chat thread' }, { status: 500 })
      }
      
      if (!newThread?.id) {
        console.error('No thread ID returned after creation')
        return NextResponse.json({ error: 'Failed to create chat thread' }, { status: 500 })
      }
      
      currentThreadId = newThread.id
      console.log(`Created new thread: ${currentThreadId}`)
    }

    // Save user message
    if (currentThreadId) {
      await supabase
        .from('copilot_messages')
        .insert({
          thread_id: currentThreadId,
          role: 'user',
          content: message,
        })
    }

    const chatHistory = messages || []

    // Create Azure OpenAI chat with tools
    const result = streamText({
      model: azureOpenAI('gpt-4o'),
      system: `You are an AI copilot for Cursor for Slides. Help users edit and improve their presentations through conversation.

Available tools:
- updateSlideContent: PREFERRED METHOD - Update a slide's full HTML content while maintaining structure
- updateSlideProperty: Update simple slide properties (title only)
- addBulletToProperty: Add bullet points to slide properties
- deleteSlide: Delete slides (requires confirmation)

When updating slide content:
1. Always use the updateSlideContent tool for modifying slide content
2. Maintain the same HTML structure with proper tags (<h3>, <h4>, <ul>, <li>, <table>, etc.)
3. Only change the text content within the tags, not the structure itself
4. Send the complete HTML content in your response

Current context:
${context}

Be helpful, concise, and action-oriented. When making changes, explain what you're doing and why. Always confirm destructive actions like deleting slides.`,
      messages: [
        ...chatHistory.map(msg => ({ role: msg.role as 'user' | 'assistant', content: msg.content })),
        { role: 'user', content: message }
      ],
      tools,
      temperature: 0.7,
      maxTokens: 1000,
      maxSteps: 3,
    })

    const encoder = new TextEncoder()

    const stream = new ReadableStream({
      async start(controller) {
        let assistantMessage = ''

        try {
          // Stream the text response
          for await (const delta of result.textStream) {
            assistantMessage += delta
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'content', content: delta })}\n\n`))
          }

          // Get steps from the result after completion
          const fullResult = await result.response
          const steps = (fullResult as any).steps

          // Process all steps for tool calls
          if (steps && steps.length > 0) {
            console.log('Processing steps with tool calls:', steps.length)
            
            // Wait a moment before sending tool calls to ensure content is rendered first
            await new Promise(resolve => setTimeout(resolve, 500))
            
            for (const step of steps) {
              if (step.toolCalls) {
                for (const toolCall of step.toolCalls) {
                  console.log('Sending tool call:', toolCall.toolName)
                  
                  const toolCallData = {
                    type: 'tool_call',
                    tool_call: {
                      name: toolCall.toolName,
                      args: toolCall.args,
                      id: toolCall.toolCallId
                    }
                  }
                  
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(toolCallData)}\n\n`))
                  
                  // Wait a moment between tool calls
                  await new Promise(resolve => setTimeout(resolve, 100))
                }
              }
              
              // Wait a moment before sending results
              await new Promise(resolve => setTimeout(resolve, 300))
              
              if (step.toolResults) {
                for (const toolResult of step.toolResults) {
                  console.log('Sending tool result:', toolResult.toolName)
                  
                  const toolResultData = {
                    type: 'tool_result',
                    tool_result: {
                      name: toolResult.toolName,
                      result: toolResult.result,
                      id: toolResult.toolCallId
                    }
                  }
                  
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify(toolResultData)}\n\n`))
                  
                  // Wait a moment between tool results
                  await new Promise(resolve => setTimeout(resolve, 100))
                }
              }
            }
          }

          // Save assistant message
          if (currentThreadId) {
            await supabase
              .from('copilot_messages')
              .insert({
                thread_id: currentThreadId,
                role: 'assistant',
                content: assistantMessage,
                tool_calls: steps?.[0]?.toolCalls || null,
              })
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'thread_id', thread_id: currentThreadId })}\n\n`))
          controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        } catch (error) {
          console.error('Chat error:', error)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'error', error: 'Failed to process chat message' })}\n\n`))
        } finally {
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json({ error: 'Failed to process chat request' }, { status: 500 })
  }
}
