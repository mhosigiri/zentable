#!/usr/bin/env node

/**
 * Zentable MCP Server
 * A Model Context Protocol server for generating presentations
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js'
import { z } from 'zod'

// Dynamic import for node-fetch (CommonJS module)
const fetch = (await import('node-fetch')).default

// Server configuration
const SERVER_URL = process.env.ZENTABLE_SERVER_URL || 'https://zentableai.com'
const API_KEY = process.env.ZENTABLE_API_KEY

if (!API_KEY) {
  console.error('❌ Error: ZENTABLE_API_KEY environment variable is required')
  console.error('Get your API key from: ' + SERVER_URL + '/dashboard/settings')
  process.exit(1)
}

// Presentation schema
const PresentationSchema = z.object({
  prompt: z.string().describe('The topic or content description for the presentation'),
  slideCount: z.number().min(3).max(20).default(5).describe('Number of slides to generate (3-20)'),
  style: z.enum(['default', 'modern', 'minimal', 'creative', 'professional']).default('professional').describe('Presentation style'),
  language: z.string().default('en').describe('Language for the presentation content'),
  contentLength: z.enum(['brief', 'medium', 'detailed']).default('medium').describe('How detailed the content should be')
})

// Create MCP server
const server = new Server({
  name: 'zentable-mcp-server',
  version: '1.0.0'
}, {
  capabilities: {
    tools: {}
  }
})

// Register the list tools handler
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [{
      name: 'create_presentation',
      description: 'Generate a complete presentation with slides based on a topic or prompt',
      inputSchema: {
        type: 'object',
        properties: {
          prompt: {
            type: 'string',
            description: 'The topic or content description for the presentation'
          },
          slideCount: {
            type: 'number',
            minimum: 3,
            maximum: 20,
            default: 5,
            description: 'Number of slides to generate (3-20)'
          },
          style: {
            type: 'string',
            enum: ['default', 'modern', 'minimal', 'creative', 'professional'],
            default: 'professional',
            description: 'Presentation style'
          },
          language: {
            type: 'string',
            default: 'en',
            description: 'Language for the presentation content'
          },
          contentLength: {
            type: 'string',
            enum: ['brief', 'medium', 'detailed'],
            default: 'medium',
            description: 'How detailed the content should be'
          }
        },
        required: ['prompt']
      }
    }]
  }
})

// Register the call tool handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params

  if (name !== 'create_presentation') {
    throw new Error(`Unknown tool: ${name}`)
  }

  try {
    console.error(`🎯 Creating presentation: "${args.prompt}"`)
    
    // Validate arguments
    const validatedArgs = PresentationSchema.parse(args)
    
    // Call the Zentable MCP API
    console.error('Relaying call to backend API:', `${SERVER_URL}/api/mcp`);
    console.error('Using API Key:', `${API_KEY.substring(0, 8)}...`);

    const response = await fetch(`${SERVER_URL}/api/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: request.id, // Forward the original request ID
        method: 'tools/call',
        params: {
          name: 'create_presentation',
          arguments: validatedArgs
        }
      })
    })

    console.error(`Backend API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed (${response.status}): ${errorText}`)
    }

    const result = await response.json()
    
    if (result.error) {
      throw new Error(`API error: ${result.error.message}`)
    }

    console.error(`✅ Presentation created successfully!`)
    
    return {
      content: result.result.content || [{
        type: 'text',
        text: '✅ Presentation created successfully! Check your dashboard to view and edit it.'
      }]
    }

  } catch (error) {
    console.error(`❌ Error creating presentation: ${error.message}`)
    return {
      content: [{
        type: 'text',
        text: `❌ Error creating presentation: ${error.message}`
      }],
      isError: true
    }
  }
})

// Start the server
async function main() {
  const transport = new StdioServerTransport()
  await server.connect(transport)
  console.error('Zentable MCP Server running on stdio')
}

main().catch((error) => {
  console.error('Fatal error:', error)
  process.exit(1)
}) 