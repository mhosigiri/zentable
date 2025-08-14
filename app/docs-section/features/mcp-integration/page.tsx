'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Copy,
  Download,
  PlayCircle,
  BookOpen,
  Users,
  Clock,
  Star,
  GitBranch,
  Database,
  Workflow,
  Shield,
  Monitor
} from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { useEffect } from 'react';

export default function MCPIntegrationPage() {
  useEffect(() => {
    analytics.pageView('mcp_integration_guide');
  }, []);

  const supportedTools = [
    {
      title: 'Claude Code',
      description: 'Anthropic\'s official CLI for Claude AI integration',
      icon: Terminal,
      configFile: '.claude/mcp.json',
      popularity: 'Most Popular',
      features: [
        'Native Claude AI integration',
        'Command-line presentation generation',
        'Code context-aware presentations',
        'Seamless authentication flow',
        'Real-time collaboration'
      ],
      setupTime: '2 minutes',
      difficulty: 'Easy'
    },
    {
      title: 'Cursor IDE',
      description: 'AI-powered code editor with MCP support',
      icon: Code2,
      configFile: '.cursor/mcp.json',
      popularity: 'Developer Favorite',
      features: [
        'Integrated AI code assistance',
        'Project context presentations',
        'Code documentation slides',
        'Git integration for version control',
        'Multi-language support'
      ],
      setupTime: '3 minutes',
      difficulty: 'Easy'
    },
    {
      title: 'Windsurf',
      description: 'Codeium\'s AI development environment',
      icon: Zap,
      configFile: 'windsurf.json',
      popularity: 'Rising Star',
      features: [
        'Advanced AI code completion',
        'Technical presentation templates',
        'Architecture diagram integration',
        'Performance optimization slides',
        'Team collaboration features'
      ],
      setupTime: '4 minutes',
      difficulty: 'Medium'
    },
    {
      title: 'VS Code with Copilot',
      description: 'Microsoft\'s VS Code with GitHub Copilot MCP extension',
      icon: Settings,
      configFile: '.vscode/mcp.json',
      popularity: 'Enterprise Ready',
      features: [
        'GitHub Copilot integration',
        'Extension marketplace access',
        'Enterprise security features',
        'Custom workflow automation',
        'Extensive plugin ecosystem'
      ],
      setupTime: '5 minutes',
      difficulty: 'Medium'
    }
  ];

  const detailedSetupGuides = [
    {
      id: 'claude-code',
      name: 'Claude Code',
      icon: Terminal,
      steps: [
        {
          title: 'Install Claude Code CLI',
          content: 'Download and install the official Claude Code CLI from Anthropic',
          commands: [
            'npm install -g @anthropic/claude-cli',
            'claude auth login'
          ],
          note: 'Requires Node.js 16+ and npm'
        },
        {
          title: 'Create MCP Configuration',
          content: 'Set up the MCP configuration in your project directory',
          commands: [
            'mkdir -p .claude',
            'touch .claude/mcp.json'
          ],
          note: 'Configuration file must be in project root'
        },
        {
          title: 'Add Zentable Configuration',
          content: 'Configure Zentable MCP server in your Claude Code setup',
          config: `{
  "mcpServers": {
    "zentable": {
      "command": "npx",
      "args": ["-y", "@menlopark/zentable-mcp@latest"],
      "env": {
        "ZENTABLE_API_KEY": "slai_your_api_key_here",
        "ZENTABLE_SERVER_URL": "https://zentableai.com"
      }
    }
  }
}`,
          note: 'Replace slai_your_api_key_here with your actual API key'
        },
        {
          title: 'Test Integration',
          content: 'Verify the integration is working correctly',
          commands: [
            'claude mcp connect',
            'claude chat "Create a 5-slide presentation about AI trends"'
          ],
          note: 'Check your Zentable dashboard for the created presentation'
        }
      ]
    },
    {
      id: 'cursor',
      name: 'Cursor IDE',
      icon: Code2,
      steps: [
        {
          title: 'Install Cursor IDE',
          content: 'Download Cursor IDE from the official website',
          commands: [
            'Download from: https://cursor.sh',
            'Install the application for your OS'
          ],
          note: 'Available for Windows, macOS, and Linux'
        },
        {
          title: 'Create Project Configuration',
          content: 'Set up MCP configuration in your project',
          commands: [
            'mkdir -p .cursor',
            'touch .cursor/mcp.json'
          ],
          note: 'Must be in your project root directory'
        },
        {
          title: 'Configure Zentable MCP',
          content: 'Add Zentable server configuration',
          config: `{
  "mcpServers": {
    "zentable": {
      "command": "npx",
      "args": ["-y", "@menlopark/zentable-mcp@latest"],
      "env": {
        "ZENTABLE_API_KEY": "slai_your_api_key_here",
        "ZENTABLE_SERVER_URL": "https://zentableai.com"
      }
    }
  }
}`,
          note: 'Restart Cursor after configuration changes'
        },
        {
          title: 'Enable MCP in Cursor',
          content: 'Activate MCP integration in Cursor settings',
          commands: [
            'Open Cursor Settings',
            'Navigate to Extensions > MCP',
            'Enable Zentable MCP server'
          ],
          note: 'Look for green status indicator'
        }
      ]
    },
    {
      id: 'windsurf',
      name: 'Windsurf',
      icon: Zap,
      steps: [
        {
          title: 'Install Windsurf',
          content: 'Download and install Windsurf from Codeium',
          commands: [
            'Download from: https://codeium.com/windsurf',
            'Follow installation wizard'
          ],
          note: 'Requires Codeium account for full features'
        },
        {
          title: 'Access Cascade Assistant',
          content: 'Open the Cascade AI assistant in Windsurf',
          commands: [
            'Click the Cascade icon in sidebar',
            'Navigate to MCP configuration'
          ],
          note: 'Cascade is Windsurf\'s AI assistant interface'
        },
        {
          title: 'Configure MCP Server',
          content: 'Add Zentable MCP server configuration',
          config: `{
  "mcpServers": {
    "zentable": {
      "command": "npx",
      "args": ["-y", "@menlopark/zentable-mcp@latest"],
      "env": {
        "ZENTABLE_API_KEY": "slai_your_api_key_here",
        "ZENTABLE_SERVER_URL": "https://zentableai.com"
      }
    }
  }
}`,
          note: 'Use the hammer (MCP) icon to configure'
        },
        {
          title: 'Activate and Test',
          content: 'Enable the MCP server and test functionality',
          commands: [
            'Click "Refresh" in Cascade assistant',
            'Look for active status indicator',
            'Test with: "Create a technical presentation about our API"'
          ],
          note: 'Green status means MCP server is active'
        }
      ]
    },
    {
      id: 'vscode',
      name: 'VS Code + Copilot',
      icon: Settings,
      steps: [
        {
          title: 'Install Required Extensions',
          content: 'Install VS Code and necessary MCP extensions',
          commands: [
            'Install GitHub Copilot extension',
            'Install MCP for VS Code extension',
            'Reload VS Code window'
          ],
          note: 'GitHub Copilot requires active subscription'
        },
        {
          title: 'Create MCP Configuration',
          content: 'Set up MCP configuration in VS Code workspace',
          commands: [
            'mkdir -p .vscode',
            'touch .vscode/mcp.json'
          ],
          note: 'Configuration applies to current workspace'
        },
        {
          title: 'Configure Zentable Integration',
          content: 'Add Zentable MCP server with input prompts',
          config: `{
  "inputs": [
    {
      "type": "promptString",
      "id": "zentable-api-key",
      "description": "Zentable API Key",
      "password": true
    }
  ],
  "servers": {
    "zentable": {
      "command": "npx",
      "args": ["-y", "@menlopark/zentable-mcp@latest"],
      "env": {
        "ZENTABLE_API_KEY": "\${input:zentable-api-key}",
        "ZENTABLE_SERVER_URL": "https://zentableai.com"
      }
    }
  }
}`,
          note: 'You\'ll be prompted for API key when first used'
        },
        {
          title: 'Test in Copilot Chat',
          content: 'Use Copilot Chat with MCP tools',
          commands: [
            'Open Copilot Chat panel',
            'Switch to Agent mode',
            'Try: "Use MCP tools to create a presentation about our project"'
          ],
          note: 'Enter API key when prompted'
        }
      ]
    }
  ];

  const usageExamples = [
    {
      category: 'Software Development',
      icon: Code2,
      examples: [
        {
          prompt: 'Create a technical presentation explaining our microservices architecture with 8 slides',
          description: 'Generate architecture overview slides for stakeholder meetings',
          useCase: 'Technical Documentation'
        },
        {
          prompt: 'Generate a code review presentation highlighting performance improvements in our latest sprint',
          description: 'Showcase development progress and optimizations',
          useCase: 'Sprint Reviews'
        },
        {
          prompt: 'Create an API documentation presentation for our REST endpoints with examples',
          description: 'Developer onboarding and API training materials',
          useCase: 'Developer Training'
        }
      ]
    },
    {
      category: 'Project Management',
      icon: Users,
      examples: [
        {
          prompt: 'Create a project retrospective presentation analyzing our last quarter\'s deliverables',
          description: 'Team reflection and continuous improvement planning',
          useCase: 'Retrospectives'
        },
        {
          prompt: 'Generate a roadmap presentation showing our product development timeline for Q2',
          description: 'Strategic planning and stakeholder communication',
          useCase: 'Roadmap Planning'
        },
        {
          prompt: 'Create a presentation about our team\'s achievements and upcoming challenges',
          description: 'Team updates and milestone celebrations',
          useCase: 'Team Updates'
        }
      ]
    },
    {
      category: 'Technical Training',
      icon: BookOpen,
      examples: [
        {
          prompt: 'Create a comprehensive presentation about Docker containerization best practices',
          description: 'Educational content for team skill development',
          useCase: 'Technical Training'
        },
        {
          prompt: 'Generate a security presentation covering our latest penetration testing results',
          description: 'Security awareness and compliance training',
          useCase: 'Security Training'
        },
        {
          prompt: 'Create an onboarding presentation for new developers joining our team',
          description: 'Streamlined developer onboarding process',
          useCase: 'Onboarding'
        }
      ]
    }
  ];

  const advancedFeatures = [
    {
      title: 'Multi-Tool Integration',
      description: 'Combine multiple MCP servers for enhanced functionality',
      icon: Workflow,
      features: [
        'Connect multiple MCP providers simultaneously',
        'Cross-tool data sharing and collaboration',
        'Unified command interface across tools',
        'Seamless workflow automation'
      ]
    },
    {
      title: 'Security & Authentication',
      description: 'Enterprise-grade security features',
      icon: Shield,
      features: [
        'API key rotation and management',
        'Role-based access control',
        'Audit logging and compliance',
        'Secure credential storage'
      ]
    },
    {
      title: 'Performance Optimization',
      description: 'Optimized for large-scale development teams',
      icon: Monitor,
      features: [
        'Caching for faster response times',
        'Batch processing capabilities',
        'Load balancing and scaling',
        'Performance monitoring'
      ]
    }
  ];

  const troubleshooting = [
    {
      issue: 'MCP Server Not Connecting',
      solutions: [
        'Verify API key is correct and active',
        'Check internet connection and firewall settings',
        'Restart your AI development tool',
        'Validate JSON configuration syntax',
        'Check server URL accessibility'
      ]
    },
    {
      issue: 'Presentations Not Generating',
      solutions: [
        'Ensure prompt is clear and specific',
        'Check API rate limits and quotas',
        'Verify account has sufficient credits',
        'Try simpler prompts first',
        'Check server status and connectivity'
      ]
    },
    {
      issue: 'Configuration Errors',
      solutions: [
        'Validate JSON syntax in config file',
        'Check file permissions and locations',
        'Ensure environment variables are set',
        'Restart tool after configuration changes',
        'Check logs for specific error messages'
      ]
    }
  ];

  return (
    <div className="space-y-12">
      {/* SEO-Optimized Header */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Terminal className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Complete MCP Integration Guide for AI Development Tools</h1>
            <p className="text-xl text-gray-600 mt-2">
              Connect Zentable with Claude Code, Cursor, Windsurf, VS Code & More - Create AI Presentations Directly in Your IDE
            </p>
          </div>
        </div>
        
        {/* SEO Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/docs-section" className="hover:text-blue-600">Documentation</Link>
          <ArrowRight className="w-4 h-4" />
          <Link href="/docs-section/features" className="hover:text-blue-600">Features</Link>
          <ArrowRight className="w-4 h-4" />
          <span className="text-gray-900">MCP Integration</span>
        </nav>
      </div>

      {/* Hero Section with Value Proposition */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Revolutionize Your Development Workflow
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Generate professional presentations directly from your favorite AI development tools. 
              No context switching, no manual exports - just seamless presentation creation integrated 
              into your existing workflow.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">Zero context switching</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-500" />
                <span className="text-sm">5-minute setup</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-500" />
                <span className="text-sm">Team collaboration</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-red-500" />
                <span className="text-sm">Enterprise security</span>
              </div>
            </div>
            <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Link href="#setup-guide">
                <PlayCircle className="w-5 h-5 mr-2" />
                Start Setup Guide
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {supportedTools.slice(0, 4).map((tool, index) => {
              const Icon = tool.icon;
              return (
                <Card key={index} className="text-center p-4">
                  <Icon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <h4 className="font-semibold text-sm">{tool.title}</h4>
                  <Badge variant="secondary" className="text-xs mt-1">
                    {tool.setupTime}
                  </Badge>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* What is MCP Section */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">What is Model Context Protocol (MCP)?</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-lg text-gray-700">
              Model Context Protocol (MCP) is an open standard that enables AI applications to 
              securely connect with external data sources and tools. In the context of Zentable, 
              MCP allows your AI development tools to directly create presentations without 
              leaving your coding environment.
            </p>
            <Alert>
              <Lightbulb className="w-4 h-4" />
              <AlertDescription>
                <strong>Key Benefit:</strong> MCP integration eliminates the need to manually copy 
                content between tools, saving hours of work and ensuring consistency in your 
                technical presentations.
              </AlertDescription>
            </Alert>
          </div>
          <Card className="p-6">
            <h3 className="font-bold text-lg mb-4">MCP Advantages</h3>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-sm">Secure, standardized communication protocol</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-sm">Real-time data access and tool integration</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-sm">No manual data transfer or copy-paste workflows</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-sm">Maintains context and improves AI responses</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Supported Tools with Detailed Comparison */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Supported AI Development Tools</h2>
        <p className="text-lg text-gray-600">
          Choose from the most popular AI-powered development environments. Each tool offers unique features 
          and integration capabilities optimized for different workflows.
        </p>
        
        <div className="grid gap-6">
          {supportedTools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <Card key={index} className="relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700">
                    {tool.popularity}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl">{tool.title}</CardTitle>
                      <CardDescription className="text-base mt-1">{tool.description}</CardDescription>
                      <div className="flex items-center space-x-4 mt-3">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{tool.setupTime} setup</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">{tool.difficulty}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Settings className="w-4 h-4 text-gray-500" />
                          <span className="text-sm text-gray-600">{tool.configFile}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Key Features</h4>
                      <ul className="space-y-2">
                        {tool.features.map((feature, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Quick Start</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Get started with {tool.title} in under {tool.setupTime}
                      </p>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`#setup-${tool.title.toLowerCase().replace(/\s+/g, '-')}`}>
                          View Setup Guide
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Detailed Setup Guide */}
      <div id="setup-guide" className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Complete Setup Guide</h2>
        <p className="text-lg text-gray-600">
          Follow these step-by-step instructions to integrate Zentable with your preferred AI development tool. 
          Each guide is optimized for the specific tool's workflow and requirements.
        </p>

        <Tabs defaultValue="claude-code" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            {detailedSetupGuides.map((guide) => {
              const Icon = guide.icon;
              return (
                <TabsTrigger key={guide.id} value={guide.id} className="flex items-center space-x-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{guide.name}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {detailedSetupGuides.map((guide) => (
            <TabsContent key={guide.id} value={guide.id} className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Setting up {guide.name} with Zentable MCP
                </h3>
                <p className="text-gray-700">
                  Complete integration guide for {guide.name}. Follow each step carefully to ensure 
                  proper configuration and optimal performance.
                </p>
              </div>

              <div className="space-y-6">
                {guide.steps.map((step, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <CardTitle className="text-lg">{step.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-gray-600">{step.content}</p>
                      
                      {step.commands && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">Commands:</h4>
                          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg">
                            {step.commands.map((command, i) => (
                              <div key={i} className="flex items-center justify-between">
                                <code className="text-sm">{command}</code>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-white"
                                  onClick={() => navigator.clipboard.writeText(command)}
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {step.config && (
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">Configuration:</h4>
                          <div className="relative">
                            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
                              <code>{step.config}</code>
                            </pre>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="absolute top-2 right-2 text-gray-400 hover:text-white"
                              onClick={() => navigator.clipboard.writeText(step.config)}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {step.note && (
                        <Alert>
                          <AlertCircle className="w-4 h-4" />
                          <AlertDescription>{step.note}</AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>

      {/* Usage Examples by Category */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Real-World Usage Examples</h2>
        <p className="text-lg text-gray-600">
          Discover how development teams use Zentable MCP integration to streamline their presentation workflows. 
          These examples showcase practical applications across different scenarios.
        </p>

        <div className="space-y-8">
          {usageExamples.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={index} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
                </div>
                
                <div className="grid gap-4">
                  {category.examples.map((example, i) => (
                    <Card key={i} className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <Badge variant="outline">{example.useCase}</Badge>
                        </div>
                        <blockquote className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                          <p className="font-medium text-gray-900">"{example.prompt}"</p>
                        </blockquote>
                        <p className="text-sm text-gray-600">{example.description}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Advanced Features */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Advanced Features & Enterprise Capabilities</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {advancedFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index} className="p-6">
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-sm mt-1">{feature.description}</p>
                  </div>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Troubleshooting Guide */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Troubleshooting & Common Issues</h2>
        <div className="space-y-4">
          {troubleshooting.map((item, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-red-700">
                  <AlertCircle className="w-5 h-5" />
                  <span>{item.issue}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-900">Solutions:</p>
                  <ul className="space-y-2">
                    {item.solutions.map((solution, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{solution}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">Ready to Transform Your Development Workflow?</h3>
        <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
          Join thousands of developers who have streamlined their presentation creation process with 
          Zentable MCP integration. Start creating professional presentations directly from your AI development tools.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild variant="secondary" size="lg">
            <Link href="/dashboard/settings" className="inline-flex items-center space-x-2">
              <Terminal className="w-5 h-5" />
              <span>Generate API Key</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600">
            <Link href="/docs-section/features/ai-generation" className="inline-flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>View AI Generation Guide</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}