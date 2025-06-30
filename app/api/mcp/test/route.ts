import { NextRequest } from 'next/server'
import { hashApiKey, isValidApiKeyFormat } from '@/lib/mcp-api-keys'
import { mcpDatabase } from '@/lib/mcp-database'

export async function GET(req: NextRequest) {
  return Response.json({
    status: 'ok',
    message: 'MCP server is running',
    endpoints: {
      main: '/api/mcp',
      test: '/api/mcp/test'
    },
    tools: ['create_presentation']
  })
}

export async function POST(req: NextRequest) {
  try {
    // Validate API key
    const authorization = req.headers.get('authorization')
    if (!authorization || !authorization.startsWith('Bearer ')) {
      return Response.json({
        error: 'Missing or invalid authorization header',
        expected: 'Bearer YOUR_API_KEY'
      }, { status: 401 })
    }

    const apiKey = authorization.substring(7)
    if (!isValidApiKeyFormat(apiKey)) {
      return Response.json({
        error: 'Invalid API key format',
        expected: 'slai_[64-character-hex-string]'
      }, { status: 401 })
    }

    const keyHash = hashApiKey(apiKey)
    const validation = await mcpDatabase.validateApiKey(keyHash)

    if (!validation.isValid) {
      return Response.json({
        error: 'Invalid or inactive API key',
        hint: 'Check your API key in Dashboard Settings'
      }, { status: 401 })
    }

    return Response.json({
      status: 'authenticated',
      message: 'API key is valid',
      userId: validation.userId,
      server: {
        name: 'slides-ai-mcp-server',
        version: '1.0.0',
        tools: ['create_presentation']
      }
    })

  } catch (error) {
    console.error('MCP Test Error:', error)
    return Response.json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 