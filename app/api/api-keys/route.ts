import { createClient } from '@/lib/supabase/server'
import { generateApiKey } from '@/lib/mcp-api-keys'
import { mcpDatabase } from '@/lib/mcp-database'
import { NextRequest } from 'next/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const apiKeys = await mcpDatabase.getUserApiKeys(user.id)

    return Response.json({ apiKeys })
  } catch (error) {
    console.error('Error fetching API keys:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { keyName } = await req.json()

    if (!keyName || typeof keyName !== 'string' || keyName.trim().length === 0) {
      return Response.json({ error: 'Key name is required' }, { status: 400 })
    }

    // Generate new API key
    const { fullKey, hash, prefix } = generateApiKey()

    const apiKey = await mcpDatabase.createApiKey(user.id, keyName.trim(), hash, prefix)

    if (!apiKey) {
      return Response.json({ error: 'Failed to create API key' }, { status: 500 })
    }

    // Return the actual key only once (never stored in database)
    return Response.json({ 
      apiKey: {
        ...apiKey,
        key: fullKey // Include the actual key in response
      }
    })
  } catch (error) {
    console.error('Error creating API key:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { keyId } = await req.json()

    if (!keyId || typeof keyId !== 'string') {
      return Response.json({ error: 'Key ID is required' }, { status: 400 })
    }

    const success = await mcpDatabase.deleteApiKey(keyId, user.id)

    if (!success) {
      return Response.json({ error: 'Failed to delete API key' }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    console.error('Error deleting API key:', error)
    return Response.json({ error: 'Internal server error' }, { status: 500 })
  }
} 