"use client"

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { McpApiKey } from '@/lib/mcp-database'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Trash2, Plus, Copy, Eye, EyeOff, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'

export function ApiKeysSection() {
  const [apiKeys, setApiKeys] = useState<McpApiKey[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [keyName, setKeyName] = useState('')
  const [creating, setCreating] = useState(false)
  const [newApiKey, setNewApiKey] = useState<string | null>(null)
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState<string | null>(null)

  useEffect(() => {
    fetchApiKeys()
  }, [])

  const fetchApiKeys = async () => {
    try {
      const response = await fetch('/api/api-keys')
      if (response.ok) {
        const data = await response.json()
        setApiKeys(data.apiKeys)
      }
    } catch (error) {
      console.error('Error fetching API keys:', error)
      toast.error('Failed to load API keys')
    } finally {
      setLoading(false)
    }
  }

  const createApiKey = async () => {
    if (!keyName.trim()) {
      toast.error('Please enter a name for the API key')
      return
    }

    setCreating(true)
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyName: keyName.trim() })
      })

      if (response.ok) {
        const data = await response.json()
        setNewApiKey(data.apiKey.key)
        setKeyName('')
        fetchApiKeys()
        toast.success('API key created successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to create API key')
      }
    } catch (error) {
      console.error('Error creating API key:', error)
      toast.error('Failed to create API key')
    } finally {
      setCreating(false)
    }
  }

  const deleteApiKey = async (keyId: string) => {
    try {
      const response = await fetch('/api/api-keys', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyId })
      })

      if (response.ok) {
        fetchApiKeys()
        toast.success('API key deleted successfully')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Failed to delete API key')
      }
    } catch (error) {
      console.error('Error deleting API key:', error)
      toast.error('Failed to delete API key')
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const testApiKey = async (apiKey: McpApiKey) => {
    setTesting(apiKey.key_prefix)
    try {
      const response = await fetch('/api/mcp/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey.key_prefix}` // This is just for demo, won't work with partial key
        }
      })

      if (response.ok) {
        toast.success('API key test successful!')
      } else {
        const error = await response.json()
        toast.error(`Test failed: ${error.error || 'Unknown error'}`)
      }
    } catch (error) {
      toast.error('Test failed: Network error')
    } finally {
      setTesting(null)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>API Keys</CardTitle>
          <CardDescription>
            Manage API keys for MCP integration. Use these to connect your presentation generator to other tools.
          </CardDescription>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create API Key
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Create a new API key to use with MCP clients like Claude Desktop, Cursor, or other tools.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="keyName">Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="e.g., Claude Desktop, My App"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                />
              </div>
              {newApiKey && (
                <Alert>
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium">Your new API key:</p>
                      <div className="flex items-center space-x-2">
                        <code className="flex-1 p-2 bg-muted rounded text-sm font-mono">
                          {showKey ? newApiKey : '•'.repeat(newApiKey.length)}
                        </code>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setShowKey(!showKey)}
                        >
                          {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => copyToClipboard(newApiKey)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        ⚠️ Save this key now - you won&apos;t be able to see it again!
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>
              )}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreateDialogOpen(false)
                    setNewApiKey(null)
                    setKeyName('')
                  }}
                >
                  {newApiKey ? 'Done' : 'Cancel'}
                </Button>
                {!newApiKey && (
                  <Button onClick={createApiKey} disabled={creating}>
                    {creating ? 'Creating...' : 'Create Key'}
                  </Button>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {apiKeys.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No API keys created yet.</p>
            <p className="text-sm mt-1">Create your first API key to get started with MCP integration.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {apiKeys.map((key) => (
              <div
                key={key.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{key.key_name}</span>
                    <Badge variant="secondary">{key.key_prefix}...</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Created: {formatDate(key.created_at)}
                    {key.last_used_at && (
                      <span className="ml-4">
                        Last used: {formatDate(key.last_used_at)}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteApiKey(key.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Quick Integration Info */}
        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2 flex items-center">
            <ExternalLink className="w-4 h-4 mr-2" />
            Quick Setup Info
          </h4>
          <div className="text-sm text-muted-foreground space-y-2">
            <div className="bg-background p-3 rounded border">
              <p className="font-mono text-xs">
                <strong>Server URL:</strong> {typeof window !== 'undefined' ? window.location.origin : 'https://your-domain.com'}/api/mcp<br/>
                <strong>Authorization:</strong> Bearer YOUR_API_KEY
              </p>
            </div>
            <p className="text-xs">
              📖 See the detailed integration guide below for step-by-step setup instructions for Cursor, Windsurf, Claude Desktop, and VS Code.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 