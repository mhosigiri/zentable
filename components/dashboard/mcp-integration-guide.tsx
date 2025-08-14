"use client"

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Copy, ExternalLink, CheckCircle, Lightbulb } from 'lucide-react'
import { toast } from 'sonner'

interface McpIntegrationGuideProps {
  serverUrl: string
  sampleApiKey?: string
}

export function McpIntegrationGuide({ serverUrl, sampleApiKey }: McpIntegrationGuideProps) {
  const [copiedConfig, setCopiedConfig] = useState<string | null>(null)

  const copyToClipboard = async (text: string, configName: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedConfig(configName)
      toast.success(`${configName} configuration copied`)
      setTimeout(() => setCopiedConfig(null), 2000)
    } catch (error) {
      toast.error('Failed to copy configuration')
    }
  }

  const getConfig = (tool: string) => {
    const baseConfig = {
      mcpServers: {
        "zentable": {
          command: "npx",
          args: [
            "-y",
            "@menlopark/zentable-mcp@latest"
          ],
          env: {
            ZENTABLE_API_KEY: sampleApiKey || 'YOUR_API_KEY',
            ZENTABLE_SERVER_URL: serverUrl.replace('/api/mcp', '')
          }
        }
      }
    }

    // Tool-specific configurations
    switch (tool) {
      case 'cursor':
        return JSON.stringify(baseConfig, null, 2)
      case 'windsurf':
        return JSON.stringify(baseConfig, null, 2)
      case 'claude-desktop':
        return JSON.stringify(baseConfig, null, 2)
      case 'vscode':
        return JSON.stringify({
          inputs: [
            {
              type: "promptString",
              id: "zentable-api-key",
              description: "Zentable API Key",
              password: true
            }
          ],
          servers: {
            "zentable": {
              command: "npx",
              args: [
                "-y",
                "@menlopark/zentable-mcp@latest"
              ],
              env: {
                ZENTABLE_API_KEY: "${input:zentable-api-key}",
                ZENTABLE_SERVER_URL: serverUrl.replace('/api/mcp', '')
              }
            }
          }
        }, null, 2)
      default:
        return JSON.stringify(baseConfig, null, 2)
    }
  }

  const integrationSteps = [
    {
      id: 'claude-code',
      name: 'Claude Code',
      icon: '🔧',
      description: 'Anthropic\'s official CLI for Claude',
      steps: [
        'Install Claude Code CLI: npm install -g @anthropic/claude-cli',
        'Run: claude auth login to authenticate',
        'Create a .claude/mcp.json file in your project root',
        'Add the configuration below',
        'Run: claude mcp connect to verify the connection'
      ],
      configFile: '.claude/mcp.json'
    },
    {
      id: 'cursor',
      name: 'Cursor',
      icon: '⚡',
      description: 'AI-powered code editor',
      steps: [
        'Open Cursor and create a \'.cursor\' directory in your project root',
        'Create a \'.cursor/mcp.json\' file',
        'Add the configuration below',
        'Save and restart Cursor',
        'Navigate to Settings → MCP to verify the connection'
      ],
      configFile: '.cursor/mcp.json'
    },
    {
      id: 'windsurf',
      name: 'Windsurf',
      icon: '🌊',
      description: 'Codeium\'s AI development environment',
      steps: [
        'Open Windsurf and navigate to the Cascade assistant',
        'Click the hammer (MCP) icon, then Configure',
        'Add the configuration below',
        'Save and click Refresh in the Cascade assistant',
        'Look for green active status'
      ],
      configFile: 'mcp.json'
    },
    {
      id: 'claude-desktop',
      name: 'Claude Desktop',
      icon: '🤖',
      description: 'Anthropic\'s desktop AI assistant',
      steps: [
        'Open Claude Desktop and go to Settings',
        'Under the Developer tab, click Edit Config',
        'Add the configuration below',
        'Save and restart Claude Desktop',
        'Look for the hammer (MCP) icon in new chats'
      ],
      configFile: 'claude_desktop_config.json'
    },
    {
      id: 'vscode',
      name: 'VS Code Copilot',
      icon: '📝',
      description: 'GitHub Copilot with MCP support',
      steps: [
        'Create a \'.vscode\' directory in your project root',
        'Create a \'.vscode/mcp.json\' file',
        'Add the configuration below',
        'Open Copilot chat and switch to Agent mode',
        'You\'ll be prompted to enter your API key when first used'
      ],
      configFile: '.vscode/mcp.json'
    }
  ]

  const usageExamples = [
    {
      tool: 'Claude Code',
      example: 'Create a presentation about "Machine Learning Fundamentals" with 8 slides in professional style',
      description: 'Use natural language to generate presentations'
    },
    {
      tool: 'Cursor/Windsurf',
      example: 'Create a presentation about "Machine Learning Fundamentals" with 8 slides in professional style',
      description: 'Use natural language to generate presentations'
    },
    {
      tool: 'Claude Desktop',
      example: '@zentable generate a presentation on "Sustainable Energy" with 6 slides',
      description: 'Use the @zentable mention to access tools'
    },
    {
      tool: 'VS Code Copilot',
      example: 'Use MCP tools to create a detailed presentation about "Web Development Best Practices"',
      description: 'Access via Agent mode in Copilot chat'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5" />
            MCP Integration Guide
          </CardTitle>
          <CardDescription>
            Connect your presentation generator to AI development tools using the Model Context Protocol (MCP).
            Once connected, you can generate presentations directly from your favorite AI tools.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <CheckCircle className="w-4 h-4" />
            <AlertDescription>
              <strong>What you can do:</strong> Generate complete presentations with multiple slides, 
              choose from 15+ templates, specify slide count, style, and content detail level - all from your AI tool.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Tool-specific configurations */}
      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
          <CardDescription>
            Choose your AI tool and follow the setup instructions. You'll need an API key from the section above.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="claude-code" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              {integrationSteps.map((tool) => (
                <TabsTrigger key={tool.id} value={tool.id} className="text-xs">
                  <span className="mr-1">{tool.icon}</span>
                  {tool.name}
                </TabsTrigger>
              ))}
            </TabsList>

            {integrationSteps.map((tool) => (
              <TabsContent key={tool.id} value={tool.id} className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <span>{tool.icon}</span>
                      {tool.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                  <Badge variant="outline">{tool.configFile}</Badge>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  {/* Steps */}
                  <div className="space-y-2">
                    <h4 className="font-medium">Setup Steps:</h4>
                    <ol className="space-y-2">
                      {tool.steps.map((step, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Badge variant="secondary" className="w-5 h-5 p-0 flex items-center justify-center text-xs">
                            {index + 1}
                          </Badge>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Configuration */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">Configuration:</h4>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(getConfig(tool.id), tool.name)}
                        className="h-8"
                      >
                        <Copy className="w-3 h-3 mr-1" />
                        {copiedConfig === tool.name ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                    <pre className="bg-muted p-3 rounded-md text-xs overflow-auto max-h-48 border">
                      <code>{getConfig(tool.id)}</code>
                    </pre>
                    <p className="text-xs text-muted-foreground">
                      Replace <code>YOUR_API_KEY</code> with your actual API key from above.
                    </p>
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Usage Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Usage Examples</CardTitle>
          <CardDescription>
            Here's how to use the presentation generator once connected to your AI tool.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {usageExamples.map((example, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline">{example.tool}</Badge>
                </div>
                <blockquote className="bg-muted/50 p-3 rounded italic text-sm">
                  "{example.example}"
                </blockquote>
                <p className="text-xs text-muted-foreground mt-2">{example.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tool Parameters */}
      <Card>
        <CardHeader>
          <CardTitle>Available Parameters</CardTitle>
          <CardDescription>
            The <code>create_presentation</code> tool accepts these parameters to customize your presentations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="border rounded p-3">
                <code className="font-medium">prompt</code> <Badge variant="destructive" className="text-xs">Required</Badge>
                <p className="text-sm text-muted-foreground mt-1">
                  The topic or content description for the presentation
                </p>
              </div>
              <div className="border rounded p-3">
                <code className="font-medium">slideCount</code> <span className="text-sm text-muted-foreground">(3-20, default: 5)</span>
                <p className="text-sm text-muted-foreground mt-1">
                  Number of slides to generate
                </p>
              </div>
              <div className="border rounded p-3">
                <code className="font-medium">style</code> <span className="text-sm text-muted-foreground">(default: professional)</span>
                <p className="text-sm text-muted-foreground mt-1">
                  Options: default, modern, minimal, creative, professional
                </p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="border rounded p-3">
                <code className="font-medium">language</code> <span className="text-sm text-muted-foreground">(default: en)</span>
                <p className="text-sm text-muted-foreground mt-1">
                  Language for the presentation content
                </p>
              </div>
              <div className="border rounded p-3">
                <code className="font-medium">contentLength</code> <span className="text-sm text-muted-foreground">(default: medium)</span>
                <p className="text-sm text-muted-foreground mt-1">
                  Options: brief, medium, detailed
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Troubleshooting */}
      <Card>
        <CardHeader>
          <CardTitle>Troubleshooting</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border-l-4 border-yellow-500 pl-4">
              <h4 className="font-medium">Connection Issues</h4>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Verify your API key is correct and active</li>
                <li>• Check the server URL: <code className="bg-muted px-1 rounded">{serverUrl}</code></li>
                <li>• Restart your AI tool after configuration changes</li>
              </ul>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-medium">Tool Not Working</h4>
              <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                <li>• Ensure you're calling <code className="bg-muted px-1 rounded">create_presentation</code> exactly</li>
                <li>• Check that the MCP server shows as "active" or "connected"</li>
                <li>• Try a simple test: "Create a 3-slide presentation about cats"</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Additional Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <Button variant="outline" className="justify-start" asChild>
              <a href="https://modelcontextprotocol.io/" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Model Context Protocol Docs
              </a>
            </Button>
            <Button variant="outline" className="justify-start" asChild>
              <a href="/docs/MCP_INTEGRATION.md" target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Developer Documentation
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 