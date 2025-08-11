'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Terminal, 
  ArrowRight, 
  Code2, 
  Zap, 
  Settings,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  ExternalLink,
  Copy
} from 'lucide-react';

export default function MCPIntegrationPage() {
  const supportedTools = [
    {
      title: 'Claude Code',
      description: 'Create presentations directly within Claude Code interface',
      icon: Terminal,
      configFile: 'claude_desktop_config.json',
      benefits: [
        'Generate presentations from code documentation',
        'Create technical presentations without context switching',
        'Leverage your existing Claude Code workflow'
      ]
    },
    {
      title: 'Cursor IDE',
      description: 'Generate presentations for project demos and code reviews',
      icon: Code2,
      configFile: '.cursor/mcp.json',
      benefits: [
        'Create slides directly from your codebase context',
        'Perfect for project showcases and demos',
        'Integrated into your development workflow'
      ]
    },
    {
      title: 'Windsurf',
      description: 'AI-powered presentation generation in your development environment',
      icon: Zap,
      configFile: 'windsurf.json',
      benefits: [
        'Technical presentations and project overviews',
        'Seamless AI integration',
        'Enhanced development productivity'
      ]
    },
    {
      title: 'VS Code Copilot',
      description: 'Extension support for MCP protocol',
      icon: Settings,
      configFile: '.vscode/mcp.json',
      benefits: [
        'Code documentation presentations',
        'Project presentation templates',
        'Familiar VS Code environment'
      ]
    }
  ];

  const useCases = [
    {
      title: 'Code Documentation',
      description: 'Create presentations explaining complex codebases',
      icon: CheckCircle,
      example: 'Generate slides explaining your API architecture or system design'
    },
    {
      title: 'Project Demos',
      description: 'Build slides for project showcases and demonstrations',
      icon: Zap,
      example: 'Create demo presentations for sprint reviews or stakeholder meetings'
    },
    {
      title: 'Technical Presentations',
      description: 'Present architectural decisions and technical concepts',
      icon: Settings,
      example: 'Explain migration strategies, performance improvements, or new technologies'
    },
    {
      title: 'Team Meetings',
      description: 'Generate slides for sprint reviews and planning sessions',
      icon: Terminal,
      example: 'Create retrospective slides, planning presentations, or team updates'
    }
  ];

  const configExamples = [
    {
      tool: 'Claude Code',
      config: `{
  "mcpServers": {
    "zentable": {
      "command": "npx",
      "args": ["-y", "@zentable/mcp-server@latest"],
      "env": {
        "ZENTABLE_API_KEY": "your_api_key_here",
        "ZENTABLE_SERVER_URL": "https://zentable.ai"
      }
    }
  }
}`
    },
    {
      tool: 'Cursor',
      config: `{
  "mcpServers": {
    "zentable-presentations": {
      "command": "curl",
      "args": [
        "-X", "POST",
        "-H", "Content-Type: application/json",
        "-H", "Authorization: Bearer YOUR_API_KEY",
        "-d", "@-",
        "https://zentable.ai/api/mcp"
      ]
    }
  }
}`
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">MCP Integration</h1>
            <p className="text-lg text-gray-600">Create presentations directly from your AI development tools</p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What is MCP Integration?</h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          Model Context Protocol (MCP) integration allows you to create presentations directly from AI development tools 
          like Claude Code, Cursor, Windsurf, and VS Code Copilot. This brings presentation creation capabilities directly 
          into your coding workflow, eliminating the need to switch between tools.
        </p>
        <div className="flex items-center space-x-2 text-sm text-blue-700">
          <CheckCircle className="w-4 h-4" />
          <span>No context switching required</span>
          <CheckCircle className="w-4 h-4 ml-4" />
          <span>Generate from code context</span>
          <CheckCircle className="w-4 h-4 ml-4" />
          <span>Seamless workflow integration</span>
        </div>
      </div>

      {/* Supported Tools */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Supported AI Development Tools</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {supportedTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Card key={index} className="relative">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tool.title}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Settings className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Config: {tool.configFile}</span>
                    </div>
                    <ul className="space-y-1">
                      {tool.benefits.map((benefit, i) => (
                        <li key={i} className="text-sm text-gray-600 flex items-start space-x-2">
                          <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Setup Guide */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Setup Guide</h2>
        
        {/* Step 1 */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                1
              </div>
              <CardTitle>Generate API Key</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              First, you'll need to generate an API key to authenticate with Zentable's MCP server.
            </p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-yellow-800">Important Security Note</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    API keys are shown only once when created. Store them securely as they cannot be retrieved later.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Navigate to Dashboard → Settings → API Keys</li>
                <li>Click "Create API Key" button</li>
                <li>Copy the generated key (format: slai_...)</li>
                <li>Store the key securely in your password manager</li>
              </ol>
            </div>
            <Button asChild>
              <Link href="/dashboard/settings" className="inline-flex items-center space-x-2">
                <span>Go to Settings</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Step 2 */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                2
              </div>
              <CardTitle>Configure Your AI Tool</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-600">
              Each AI tool requires specific configuration in their respective MCP settings file:
            </p>
            
            {configExamples.map((example, index) => (
              <div key={index} className="space-y-3">
                <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                  <Code2 className="w-4 h-4" />
                  <span>{example.tool} Configuration</span>
                </h4>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                    <code>{example.config}</code>
                  </pre>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 text-gray-400 hover:text-white"
                    onClick={() => navigator.clipboard.writeText(example.config)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Step 3 */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                3
              </div>
              <CardTitle>Test Your Integration</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Verify your MCP integration is working correctly:
            </p>
            <div className="bg-gray-50 rounded-lg p-4">
              <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                <li>Restart your AI development tool</li>
                <li>Look for "zentable" or "zentable-presentations" in available tools</li>
                <li>Try creating a test presentation with a simple prompt</li>
                <li>Check your Zentable dashboard for the new presentation</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Available Tools */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Available MCP Tools</h2>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Terminal className="w-5 h-5" />
              <span>create_presentation</span>
            </CardTitle>
            <CardDescription>Generate complete presentations from prompts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left font-medium">Parameter</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-medium">Type</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-medium">Default</th>
                    <th className="border border-gray-200 px-4 py-2 text-left font-medium">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-mono text-sm">prompt</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">string</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">required</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">Topic or content description</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-mono text-sm">slideCount</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">number</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">5</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">Number of slides (3-20)</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-mono text-sm">style</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">enum</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">professional</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">Presentation style</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-mono text-sm">language</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">string</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">en</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">Content language</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-200 px-4 py-2 font-mono text-sm">contentLength</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">enum</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">medium</td>
                    <td className="border border-gray-200 px-4 py-2 text-sm">Detail level (brief/medium/detailed)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Use Cases */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Common Use Cases</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">{useCase.title}</CardTitle>
                  </div>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-blue-800">
                      <strong>Example:</strong> {useCase.example}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tips and Best Practices */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Tips & Best Practices</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-700">
                <CheckCircle className="w-5 h-5" />
                <span>Best Practices</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">• Be specific in your prompts for better results</p>
                <p className="text-sm text-gray-600">• Include context about your audience and purpose</p>
                <p className="text-sm text-gray-600">• Use consistent naming for multiple presentations</p>
                <p className="text-sm text-gray-600">• Test with simple prompts before complex ones</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-700">
                <Lightbulb className="w-5 h-5" />
                <span>Pro Tips</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="text-sm text-gray-600">• Presentations are automatically saved to your dashboard</p>
                <p className="text-sm text-gray-600">• You can edit presentations after creation in the web interface</p>
                <p className="text-sm text-gray-600">• Use the brainstorming feature for complex topics</p>
                <p className="text-sm text-gray-600">• API keys can be managed and rotated in settings</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
        <p className="text-lg opacity-90 mb-6">
          Set up MCP integration and start creating presentations directly from your AI development tools.
        </p>
        <Button asChild variant="secondary" size="lg">
          <Link href="/dashboard/settings" className="inline-flex items-center space-x-2">
            <span>Generate API Key</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}