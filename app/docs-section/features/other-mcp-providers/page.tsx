'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { 
  Database, 
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
  Terminal,
  Workflow,
  Shield,
  Monitor,
  Package,
  Globe,
  Cpu,
  FileText,
  Search,
  Cloud,
  Server,
  Key,
  Plug,
  MessageSquare,
  Brain,
  Slack,
  Bot,
  Chrome,
  Smartphone
} from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { useEffect } from 'react';

export default function OtherMCPProvidersPage() {
  useEffect(() => {
    analytics.pageView('other_mcp_providers_guide');
  }, []);

  // Popular MCP clients based on the .cursor/rules/mcp.txt data
  const popularMCPClients = [
    {
      name: 'Claude Desktop',
      description: 'Comprehensive support for MCP with local tools and data sources',
      icon: Terminal,
      category: 'AI Assistant',
      features: ['Full support for resources', 'Support for prompt templates', 'Tool integration', 'Local server connections'],
      popularity: 'Most Popular',
      mcpSupport: ['Resources', 'Prompts', 'Tools'],
      link: 'https://claude.ai/download'
    },
    {
      name: 'Claude.ai',
      description: 'Web-based AI assistant with remote MCP server support',
      icon: Globe,
      category: 'AI Assistant',
      features: ['Remote MCP servers', 'Tools, prompts, and resources', 'Enterprise security', 'Conversational interface'],
      popularity: 'Web Platform',
      mcpSupport: ['Resources', 'Prompts', 'Tools'],
      link: 'https://claude.ai'
    },
    {
      name: 'VS Code GitHub Copilot',
      description: 'Full MCP integration with agent mode and dynamic discovery',
      icon: Code2,
      category: 'Code Editor',
      features: ['Dynamic tool discovery', 'Secure secret configuration', 'Tool prompting', 'Multi-transport support'],
      popularity: 'Developer Choice',
      mcpSupport: ['Resources', 'Prompts', 'Tools', 'Discovery', 'Sampling', 'Roots'],
      link: 'https://code.visualstudio.com/'
    },
    {
      name: 'Cursor',
      description: 'AI code editor with MCP tools support in Composer',
      icon: Cpu,
      category: 'Code Editor',
      features: ['Composer integration', 'STDIO and SSE support', 'AI code assistance', 'Project context'],
      popularity: 'AI-First',
      mcpSupport: ['Tools'],
      link: 'https://cursor.com'
    },
    {
      name: 'Windsurf Editor',
      description: 'Agentic IDE with AI Flow and MCP tool discovery',
      icon: Zap,
      category: 'Code Editor',
      features: ['AI Flow paradigm', 'Tool discovery', 'Collaborative development', 'Multi-model support'],
      popularity: 'Innovative',
      mcpSupport: ['Tools', 'Discovery'],
      link: 'https://codeium.com/windsurf'
    },
    {
      name: 'Continue',
      description: 'Open-source AI code assistant with built-in MCP support',
      icon: GitBranch,
      category: 'Code Editor',
      features: ['Type "@" to mention resources', 'Slash commands for prompts', 'VS Code & JetBrains support'],
      popularity: 'Open Source',
      mcpSupport: ['Resources', 'Prompts', 'Tools'],
      link: 'https://github.com/continuedev/continue'
    },
    {
      name: 'Cline',
      description: 'Autonomous coding agent in VS Code with natural language MCP creation',
      icon: Bot,
      category: 'AI Agent',
      features: ['Natural language tool creation', 'Custom MCP servers', 'File operations', 'Error logging'],
      popularity: 'Autonomous',
      mcpSupport: ['Resources', 'Tools', 'Discovery'],
      link: 'https://github.com/cline/cline'
    },
    {
      name: 'Warp',
      description: 'Intelligent terminal with built-in AI and MCP support',
      icon: Terminal,
      category: 'Terminal',
      features: ['Agent mode with MCP', 'Flexible server management', 'Live discovery', 'Auto-startup'],
      popularity: 'Terminal AI',
      mcpSupport: ['Resources', 'Tools', 'Discovery'],
      link: 'https://www.warp.dev/'
    }
  ];

  const mcpServerCategories = [
    {
      category: 'Code Management',
      icon: GitBranch,
      description: 'Source control, repositories, and development workflow tools',
      servers: [
        {
          name: 'GitHub MCP',
          description: 'Official GitHub server for repository management and code analysis',
          features: ['Repository browsing', 'Issue tracking', 'Pull requests', 'Code review'],
          installation: 'npm install -g @github/mcp-server'
        },
        {
          name: 'GitLab MCP',
          description: 'Comprehensive GitLab integration for DevOps workflows',
          features: ['CI/CD pipelines', 'Merge requests', 'Issue boards', 'Project management'],
          installation: 'npm install -g @gitlab/mcp-server'
        }
      ]
    },
    {
      category: 'Database & Storage',
      icon: Database,
      description: 'Database connectivity and data storage solutions',
      servers: [
        {
          name: 'PostgreSQL MCP',
          description: 'Direct database connectivity for PostgreSQL databases',
          features: ['SQL query execution', 'Schema exploration', 'Performance monitoring', 'Migration management'],
          installation: 'npm install -g @anthropic/mcp-server-postgres'
        },
        {
          name: 'MySQL MCP',
          description: 'MySQL database integration with query optimization',
          features: ['Database operations', 'Query analysis', 'Index optimization', 'Backup management'],
          installation: 'npm install -g @mysql/mcp-server'
        },
        {
          name: 'MongoDB MCP',
          description: 'NoSQL database integration for modern applications',
          features: ['Document operations', 'Aggregation queries', 'Index management', 'Schema validation'],
          installation: 'npm install -g @mongodb/mcp-server'
        }
      ]
    },
    {
      category: 'Cloud Storage',
      icon: Cloud,
      description: 'Cloud-based file storage and collaboration platforms',
      servers: [
        {
          name: 'Google Drive MCP',
          description: 'Cloud storage integration with Google Drive services',
          features: ['File operations', 'Folder management', 'Sharing permissions', 'Version history'],
          installation: 'npm install -g @google/mcp-server-drive'
        },
        {
          name: 'Dropbox MCP',
          description: 'File synchronization and sharing via Dropbox',
          features: ['File sync', 'Link sharing', 'Team folders', 'File recovery'],
          installation: 'npm install -g @dropbox/mcp-server'
        },
        {
          name: 'OneDrive MCP',
          description: 'Microsoft OneDrive integration for Office 365',
          features: ['Office integration', 'File sharing', 'Collaboration', 'Version control'],
          installation: 'npm install -g @microsoft/mcp-server-onedrive'
        }
      ]
    },
    {
      category: 'Communication',
      icon: MessageSquare,
      description: 'Team communication and notification systems',
      servers: [
        {
          name: 'Slack MCP',
          description: 'Team communication and notification management',
          features: ['Message sending', 'Channel management', 'User info', 'Bot integrations'],
          installation: 'npm install -g @slack/mcp-server'
        },
        {
          name: 'Discord MCP',
          description: 'Community and team communication via Discord',
          features: ['Server management', 'Channel operations', 'User roles', 'Voice integration'],
          installation: 'npm install -g @discord/mcp-server'
        },
        {
          name: 'Microsoft Teams MCP',
          description: 'Enterprise communication and collaboration',
          features: ['Team messaging', 'Meeting integration', 'File sharing', 'App integration'],
          installation: 'npm install -g @microsoft/mcp-server-teams'
        }
      ]
    },
    {
      category: 'DevOps & Infrastructure',
      icon: Server,
      description: 'Development operations and infrastructure management',
      servers: [
        {
          name: 'Docker MCP',
          description: 'Container management and deployment automation',
          features: ['Container lifecycle', 'Image building', 'Network config', 'Volume management'],
          installation: 'npm install -g @docker/mcp-server'
        },
        {
          name: 'Kubernetes MCP',
          description: 'Container orchestration and cluster management',
          features: ['Pod management', 'Service discovery', 'Deployment automation', 'Resource monitoring'],
          installation: 'npm install -g @kubernetes/mcp-server'
        },
        {
          name: 'AWS MCP',
          description: 'Amazon Web Services cloud infrastructure management',
          features: ['EC2 instances', 'S3 operations', 'Lambda functions', 'CloudFormation'],
          installation: 'npm install -g @aws/mcp-server'
        }
      ]
    },
    {
      category: 'Search & Information',
      icon: Search,
      description: 'Web search and information retrieval services',
      servers: [
        {
          name: 'Brave Search MCP',
          description: 'Privacy-focused web search capabilities',
          features: ['Web search', 'News search', 'Image search', 'Privacy protection'],
          installation: 'npm install -g @brave/mcp-server-search'
        },
        {
          name: 'Google Search MCP',
          description: 'Comprehensive web search via Google APIs',
          features: ['Web results', 'Knowledge graph', 'Image search', 'Custom search'],
          installation: 'npm install -g @google/mcp-server-search'
        },
        {
          name: 'Wikipedia MCP',
          description: 'Access to Wikipedia knowledge base',
          features: ['Article search', 'Content extraction', 'Multi-language', 'Link resolution'],
          installation: 'npm install -g @wikipedia/mcp-server'
        }
      ]
    }
  ];

  const enterpriseFeatures = [
    {
      title: 'Advanced Authentication',
      description: 'Enterprise-grade security and access control',
      icon: Shield,
      features: [
        'OAuth 2.0 and SAML integration',
        'Multi-factor authentication support',
        'Role-based access control (RBAC)',
        'API key rotation and management',
        'Single sign-on (SSO) integration'
      ]
    },
    {
      title: 'Scalability & Performance',
      description: 'Built for large-scale enterprise deployments',
      icon: Monitor,
      features: [
        'Horizontal scaling capabilities',
        'Load balancing and failover',
        'Connection pooling optimization',
        'Caching and performance tuning',
        'Resource usage monitoring'
      ]
    },
    {
      title: 'Compliance & Governance',
      description: 'Meet enterprise compliance requirements',
      icon: FileText,
      features: [
        'Audit logging and compliance tracking',
        'Data residency and sovereignty',
        'GDPR and SOC 2 compliance',
        'Security vulnerability scanning',
        'Regular penetration testing'
      ]
    },
    {
      title: 'Integration Ecosystem',
      description: 'Seamless integration with existing tools',
      icon: Workflow,
      features: [
        'REST API for custom integrations',
        'Webhook support for real-time updates',
        'SDK support for multiple languages',
        'Legacy system compatibility',
        'Custom connector development'
      ]
    }
  ];

  const implementationGuide = [
    {
      phase: 'Discovery & Planning',
      duration: '1-2 weeks',
      description: 'Assess requirements and plan MCP integration strategy',
      tasks: [
        'Inventory existing tools and data sources',
        'Identify MCP integration opportunities',
        'Define security and compliance requirements',
        'Create integration architecture plan',
        'Establish success metrics and KPIs'
      ]
    },
    {
      phase: 'Pilot Implementation',
      duration: '2-4 weeks',
      description: 'Deploy MCP servers for selected use cases',
      tasks: [
        'Set up development environment',
        'Install and configure priority MCP servers',
        'Implement authentication and security',
        'Create pilot workflows and test cases',
        'Train pilot user group'
      ]
    },
    {
      phase: 'Production Deployment',
      duration: '4-6 weeks',
      description: 'Scale to full production environment',
      tasks: [
        'Deploy production infrastructure',
        'Implement monitoring and alerting',
        'Configure backup and disaster recovery',
        'Roll out to broader user base',
        'Establish support procedures'
      ]
    },
    {
      phase: 'Optimization & Expansion',
      duration: 'Ongoing',
      description: 'Continuous improvement and additional integrations',
      tasks: [
        'Monitor performance and usage metrics',
        'Optimize configurations and workflows',
        'Add new MCP servers and capabilities',
        'Gather user feedback and iterate',
        'Expand to additional use cases'
      ]
    }
  ];

  return (
    <div className="space-y-12">
      {/* SEO-Optimized Header */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
            <Plug className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Complete MCP Ecosystem Guide</h1>
            <p className="text-xl text-gray-600 mt-2">
              Discover 70+ MCP clients and servers to supercharge your AI development workflow
            </p>
          </div>
        </div>
        
        {/* SEO Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/docs-section" className="hover:text-blue-600">Documentation</Link>
          <ArrowRight className="w-4 h-4" />
          <Link href="/docs-section/features" className="hover:text-blue-600">Features</Link>
          <ArrowRight className="w-4 h-4" />
          <span className="text-gray-900">MCP Ecosystem</span>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Expand Your MCP Ecosystem
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              The Model Context Protocol ecosystem includes 70+ clients and servers spanning 
              AI assistants, code editors, databases, cloud services, and communication tools. 
              Build powerful multi-provider workflows that revolutionize your development process.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">70+ Available Clients</span>
              </div>
              <div className="flex items-center space-x-2">
                <Workflow className="w-5 h-5 text-blue-500" />
                <span className="text-sm">Multi-provider Workflows</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-purple-500" />
                <span className="text-sm">Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <Plug className="w-5 h-5 text-red-500" />
                <span className="text-sm">Easy Integration</span>
              </div>
            </div>
            <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
              <Link href="#mcp-clients">
                <Database className="w-5 h-5 mr-2" />
                Explore Ecosystem
              </Link>
            </Button>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-4">Ecosystem Overview</h3>
            <div className="space-y-3">
              {[
                { category: 'AI Assistants', count: '8+', color: 'bg-purple-100 text-purple-800' },
                { category: 'Code Editors', count: '15+', color: 'bg-blue-100 text-blue-800' },
                { category: 'Databases', count: '12+', color: 'bg-green-100 text-green-800' },
                { category: 'Cloud Services', count: '20+', color: 'bg-orange-100 text-orange-800' },
                { category: 'Communication', count: '10+', color: 'bg-pink-100 text-pink-800' },
                { category: 'Specialized Tools', count: '15+', color: 'bg-indigo-100 text-indigo-800' }
              ].map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{category.category}</span>
                  <Badge className={`text-xs ${category.color}`}>
                    {category.count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Popular MCP Clients */}
      <div id="mcp-clients" className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Popular MCP Clients</h2>
        <p className="text-lg text-gray-600">
          Discover the most popular applications that support MCP integration, each offering unique 
          capabilities and integration patterns for different use cases.
        </p>
        
        <div className="grid gap-6">
          {popularMCPClients.map((client, index) => {
            const Icon = client.icon;
            return (
              <Card key={index} className="relative overflow-hidden">
                <div className="absolute top-4 right-4">
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {client.popularity}
                  </Badge>
                </div>
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-600 rounded-xl flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <CardTitle className="text-xl">{client.name}</CardTitle>
                        <Badge variant="secondary" className="text-xs">
                          {client.category}
                        </Badge>
                      </div>
                      <CardDescription className="text-base">{client.description}</CardDescription>
                      <div className="flex items-center space-x-4 mt-3">
                        <div className="flex flex-wrap gap-1">
                          {client.mcpSupport.map((support, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {support}
                            </Badge>
                          ))}
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
                        {client.features.map((feature, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Get Started</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Explore {client.name} and its MCP capabilities
                      </p>
                      <Button asChild variant="outline" size="sm">
                        <Link href={client.link} target="_blank" rel="noopener noreferrer">
                          Visit Website <ExternalLink className="w-3 h-3 ml-1" />
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

      {/* MCP Server Categories */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">MCP Server Ecosystem</h2>
        <p className="text-lg text-gray-600">
          Comprehensive catalog of MCP servers organized by category. Each server extends your 
          AI development tools with specialized functionality.
        </p>
        
        <div className="space-y-8">
          {mcpServerCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={index} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.servers.map((server, i) => (
                    <Card key={i} className="p-4">
                      <h4 className="font-semibold text-gray-900 mb-2">{server.name}</h4>
                      <p className="text-sm text-gray-600 mb-3">{server.description}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <h5 className="text-xs font-medium text-gray-700 mb-1">Features:</h5>
                          <div className="flex flex-wrap gap-1">
                            {server.features.map((feature, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div>
                          <h5 className="text-xs font-medium text-gray-700 mb-1">Installation:</h5>
                          <div className="bg-gray-900 text-gray-100 p-2 rounded text-xs">
                            <code>{server.installation}</code>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="ml-2 h-4 w-4 p-0 text-gray-400 hover:text-white"
                              onClick={() => navigator.clipboard.writeText(server.installation)}
                            >
                              <Copy className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Enterprise Features */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Enterprise Capabilities</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {enterpriseFeatures.map((feature, index) => {
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

      {/* Implementation Guide */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Enterprise Implementation Guide</h2>
        <p className="text-lg text-gray-600">
          Step-by-step approach to implementing MCP at enterprise scale with proper planning, 
          security, and governance considerations.
        </p>
        
        <div className="space-y-6">
          {implementationGuide.map((phase, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl">{phase.phase}</CardTitle>
                    <CardDescription className="text-base mt-1">{phase.description}</CardDescription>
                    <Badge variant="outline" className="mt-2">{phase.duration}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="ml-16">
                  <h4 className="font-medium text-gray-900 mb-3">Key Tasks:</h4>
                  <ul className="space-y-2">
                    {phase.tasks.map((task, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{task}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Community Resources */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold text-gray-900">MCP Community & Resources</h3>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Join the growing MCP community to discover new providers, share workflows, and get help with integrations.
          </p>
          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <Card className="p-4 text-center">
              <Globe className="w-8 h-8 mx-auto mb-2 text-blue-600" />
              <h4 className="font-semibold text-sm">Official MCP Registry</h4>
              <p className="text-xs text-gray-600 mt-1">Browse all available providers</p>
            </Card>
            <Card className="p-4 text-center">
              <GitBranch className="w-8 h-8 mx-auto mb-2 text-green-600" />
              <h4 className="font-semibold text-sm">GitHub Discussions</h4>
              <p className="text-xs text-gray-600 mt-1">Community support and Q&A</p>
            </Card>
            <Card className="p-4 text-center">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-purple-600" />
              <h4 className="font-semibold text-sm">Provider Documentation</h4>
              <p className="text-xs text-gray-600 mt-1">Comprehensive integration guides</p>
            </Card>
            <Card className="p-4 text-center">
              <Users className="w-8 h-8 mx-auto mb-2 text-orange-600" />
              <h4 className="font-semibold text-sm">Developer Discord</h4>
              <p className="text-xs text-gray-600 mt-1">Real-time chat and support</p>
            </Card>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-8 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">Ready to Build Multi-Provider Workflows?</h3>
        <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
          Combine Zentable with the powerful MCP ecosystem to create sophisticated AI development workflows. 
          Start with the providers that match your tech stack and gradually expand your capabilities.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild variant="secondary" size="lg">
            <Link href="/docs-section/features/mcp-integration" className="inline-flex items-center space-x-2">
              <Terminal className="w-5 h-5" />
              <span>Setup Zentable MCP</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600">
            <Link href="/docs-section/features/brainstorming" className="inline-flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>View Brainstorming Guide</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}