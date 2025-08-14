'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { 
  Brain, 
  ArrowRight, 
  Lightbulb, 
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Users,
  Sparkles,
  Clock,
  Target,
  Workflow,
  FileText,
  PlayCircle,
  BookOpen,
  Loader2,
  Settings,
  Database,
  Zap,
  Monitor,
  Filter,
  BarChart3,
  Search,
  Layers,
  Presentation,
  Shield
} from 'lucide-react';
import { analytics } from '@/lib/analytics';
import { useEffect } from 'react';

export default function BrainstormingPage() {
  useEffect(() => {
    analytics.pageView('brainstorming_guide');
  }, []);

  const brainstormingFeatures = [
    {
      title: 'AI Brainstorming Studio',
      description: 'Collaborate with AI in real-time to generate and refine ideas',
      icon: Brain,
      features: [
        'Two-panel interface with AI chat and idea collection',
        'Real-time idea extraction and organization',
        'Session-based brainstorming with persistent storage',
        'Smart tagging and categorization of ideas'
      ]
    },
    {
      title: 'MCP Integration',
      description: 'Connect with external tools and data sources via MCP',
      icon: Zap,
      features: [
        'Toggle between GPT-4o + MCP and GPT-OSS 20B models',
        'Dynamic tool activation during brainstorming sessions',
        'Access to external APIs and data sources',
        'Enhanced context from connected services'
      ]
    },
    {
      title: 'Intelligent Idea Management',
      description: 'Automatic extraction and organization of brainstormed concepts',
      icon: Lightbulb,
      features: [
        'Real-time idea extraction from chat messages',
        'Automatic categorization and tagging',
        'Priority scoring for ideas',
        'Persistent storage across sessions'
      ]
    },
    {
      title: 'Seamless Presentation Generation',
      description: 'Transform brainstormed ideas directly into presentations',
      icon: Presentation,
      features: [
        'One-click presentation generation from collected ideas',
        'Customizable slide count, style, and language',
        'Content length optimization (brief, medium, detailed)',
        'Direct integration with presentation creation workflow'
      ]
    }
  ];

  const workflowSteps = [
    {
      step: 1,
      title: 'Start Brainstorming Session',
      description: 'Create a new session and begin chatting with the AI assistant',
      details: [
        'Navigate to /create/brainstorm to start',
        'Session automatically created with unique ID',
        'AI assistant ready for collaborative ideation',
        'Choose between different AI models (GPT-4o + MCP or GPT-OSS 20B)'
      ],
      icon: MessageSquare
    },
    {
      step: 2,
      title: 'Activate MCP Tools (Optional)',
      description: 'Connect external tools and data sources for enhanced brainstorming',
      details: [
        'Toggle MCP tools integration in the top-right corner',
        'Access external APIs and databases',
        'Incorporate real-time data into brainstorming',
        'Enhanced AI capabilities with external context'
      ],
      icon: Zap
    },
    {
      step: 3,
      title: 'Collaborative Ideation',
      description: 'Chat with AI to explore topics and generate creative ideas',
      details: [
        'Describe your project, challenge, or topic',
        'AI suggests related concepts and angles',
        'Explore different perspectives and approaches',
        'Ideas automatically extracted and saved in real-time'
      ],
      icon: Brain
    },
    {
      step: 4,
      title: 'Idea Collection & Organization',
      description: 'Watch as ideas are automatically captured and organized',
      details: [
        'Ideas appear in real-time in the right panel',
        'Automatic categorization and tagging',
        'Smart extraction of key concepts from conversation',
        'Ideas persist across browser sessions'
      ],
      icon: Lightbulb
    },
    {
      step: 5,
      title: 'Presentation Customization',
      description: 'Configure presentation settings before generation',
      details: [
        'Choose slide count (1-20 slides)',
        'Select presentation style (Professional, Creative, Minimalist, Playful, Formal)',
        'Pick language (English, Spanish, French, German)',
        'Set content length (Brief, Medium, Detailed)'
      ],
      icon: Settings
    },
    {
      step: 6,
      title: 'Generate Presentation',
      description: 'Transform your brainstormed ideas into a complete presentation',
      details: [
        'One-click generation from collected ideas',
        'AI creates cohesive presentation structure',
        'Ideas integrated into logical slide flow',
        'Direct navigation to presentation editor'
      ],
      icon: Sparkles
    }
  ];

  const useCases = [
    {
      category: 'Business Strategy',
      icon: Target,
      examples: [
        {
          scenario: 'Product Launch Planning',
          description: 'Brainstorm marketing strategies, target audiences, and launch timeline for a new product',
          outcome: 'Comprehensive presentation with go-to-market strategy, messaging framework, and execution plan'
        },
        {
          scenario: 'Market Research Analysis',
          description: 'Explore market trends, competitor analysis, and opportunity identification',
          outcome: 'Data-driven presentation with market insights, competitive landscape, and strategic recommendations'
        }
      ]
    },
    {
      category: 'Creative Projects',
      icon: Lightbulb,
      examples: [
        {
          scenario: 'Campaign Conceptualization',
          description: 'Generate creative concepts, themes, and messaging for marketing campaigns',
          outcome: 'Visual presentation showcasing campaign ideas, creative direction, and execution concepts'
        },
        {
          scenario: 'Content Strategy Development',
          description: 'Brainstorm content themes, formats, and distribution strategies',
          outcome: 'Strategic presentation with content calendar, platform strategies, and engagement tactics'
        }
      ]
    },
    {
      category: 'Technical Innovation',
      icon: Zap,
      examples: [
        {
          scenario: 'Software Architecture Design',
          description: 'Explore system design patterns, technology choices, and implementation approaches',
          outcome: 'Technical presentation with architecture diagrams, technology stack, and implementation roadmap'
        },
        {
          scenario: 'Problem-Solution Mapping',
          description: 'Identify technical challenges and brainstorm innovative solutions',
          outcome: 'Solution-focused presentation with problem analysis, proposed solutions, and implementation strategy'
        }
      ]
    },
    {
      category: 'Educational Content',
      icon: BookOpen,
      examples: [
        {
          scenario: 'Course Development',
          description: 'Design curriculum structure, learning objectives, and teaching methodologies',
          outcome: 'Educational presentation with course outline, learning modules, and assessment strategies'
        },
        {
          scenario: 'Workshop Planning',
          description: 'Create interactive workshop activities, exercises, and discussion topics',
          outcome: 'Workshop presentation with agenda, activities, and participant engagement strategies'
        }
      ]
    }
  ];

  const technicalFeatures = [
    {
      title: 'Session Management',
      description: 'Persistent brainstorming sessions with automatic save',
      icon: Database,
      implementation: [
        'Supabase backend for session storage',
        'Real-time idea synchronization',
        'Cross-browser session persistence',
        'Automatic session creation and management'
      ]
    },
    {
      title: 'AI Model Selection',
      description: 'Choose between different AI capabilities',
      icon: Brain,
      implementation: [
        'GPT-4o with MCP integration for advanced capabilities',
        'GPT-OSS 20B for standard brainstorming',
        'Dynamic model switching during sessions',
        'Performance optimization based on selected model'
      ]
    },
    {
      title: 'Real-time Processing',
      description: 'Live idea extraction and organization',
      icon: Workflow,
      implementation: [
        'WebSocket-based real-time updates',
        '5-second automatic refresh cycle',
        'Instant idea categorization and tagging',
        'Live session state synchronization'
      ]
    },
    {
      title: 'Presentation Integration',
      description: 'Seamless transition from ideas to presentations',
      icon: Presentation,
      implementation: [
        'Direct API integration with presentation generator',
        'Automatic outline creation from ideas',
        'Configurable presentation parameters',
        'Local storage for presentation state management'
      ]
    }
  ];

  const bestPractices = [
    {
      title: 'Effective Brainstorming Techniques',
      icon: Target,
      practices: [
        'Start with broad topics and narrow down focus',
        'Ask open-ended questions to explore different angles',
        'Build on previous ideas to create concept chains',
        'Use "what if" scenarios to push creative boundaries',
        'Combine unrelated concepts for innovative solutions'
      ]
    },
    {
      title: 'AI Collaboration Tips',
      icon: MessageSquare,
      practices: [
        'Provide context about your project or challenge',
        'Ask the AI to suggest alternative perspectives',
        'Request specific types of ideas (technical, creative, practical)',
        'Use follow-up questions to dive deeper into concepts',
        'Experiment with different prompting styles'
      ]
    },
    {
      title: 'Idea Organization',
      icon: Filter,
      practices: [
        'Review collected ideas regularly during the session',
        'Look for patterns and themes across ideas',
        'Group related concepts for stronger presentation flow',
        'Prioritize ideas based on feasibility and impact',
        'Combine complementary ideas for comprehensive solutions'
      ]
    },
    {
      title: 'Presentation Optimization',
      icon: BarChart3,
      practices: [
        'Aim for 5-7 slides for focused presentations',
        'Choose presentation style based on your audience',
        'Use "Brief" content for overview presentations',
        'Select "Detailed" for comprehensive technical presentations',
        'Match language settings to your target audience'
      ]
    }
  ];

  return (
    <div className="space-y-12">
      {/* SEO-Optimized Header */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Complete AI Brainstorming Guide</h1>
            <p className="text-xl text-gray-600 mt-2">
              Master collaborative ideation with AI assistance and transform ideas into professional presentations
            </p>
          </div>
        </div>
        
        {/* SEO Breadcrumbs */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link href="/docs-section" className="hover:text-blue-600">Documentation</Link>
          <ArrowRight className="w-4 h-4" />
          <Link href="/docs-section/features" className="hover:text-blue-600">Features</Link>
          <ArrowRight className="w-4 h-4" />
          <span className="text-gray-900">Brainstorming with AI</span>
        </nav>
      </div>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              AI-Powered Brainstorming Studio
            </h2>
            <p className="text-lg text-gray-700 mb-6">
              Zentable's AI Brainstorming Studio provides a collaborative environment where you can 
              ideate with AI, automatically capture and organize ideas, and transform them into 
              professional presentations in minutes.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">Real-time idea capture</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">MCP tool integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">Smart organization</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-sm">One-click presentations</span>
              </div>
            </div>
            <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700">
              <Link href="/create/brainstorm">
                <Brain className="w-5 h-5 mr-2" />
                Start Brainstorming
              </Link>
            </Button>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="font-bold text-lg mb-4">Key Features</h3>
            <div className="space-y-3">
              {brainstormingFeatures.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div key={index} className="flex items-center space-x-3">
                    <Icon className="w-5 h-5 text-purple-600" />
                    <div>
                      <h4 className="font-medium text-sm">{feature.title}</h4>
                      <p className="text-xs text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Features Overview */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Brainstorming Studio Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {brainstormingFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Step-by-Step Workflow */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Complete Brainstorming Workflow</h2>
        <p className="text-lg text-gray-600">
          Follow this comprehensive guide to maximize your brainstorming sessions and create impactful presentations.
        </p>
        
        <div className="space-y-6">
          {workflowSteps.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.step} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-lg">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl flex items-center space-x-2">
                        <Icon className="w-5 h-5" />
                        <span>{step.title}</span>
                      </CardTitle>
                      <CardDescription className="text-base mt-1">{step.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="ml-16">
                    <ul className="space-y-2">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start space-x-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{detail}</span>
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

      {/* Use Cases */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Real-World Use Cases</h2>
        <p className="text-lg text-gray-600">
          Explore how different industries and roles can leverage AI brainstorming for impactful presentations.
        </p>
        
        <div className="space-y-8">
          {useCases.map((category, index) => {
            const Icon = category.icon;
            return (
              <div key={index} className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">{category.category}</h3>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {category.examples.map((example, i) => (
                    <Card key={i} className="p-6">
                      <h4 className="font-semibold text-gray-900 mb-2">{example.scenario}</h4>
                      <p className="text-sm text-gray-600 mb-3">{example.description}</p>
                      <div className="bg-blue-50 p-3 rounded-lg">
                        <p className="text-xs font-medium text-blue-900 mb-1">Expected Outcome:</p>
                        <p className="text-xs text-blue-800">{example.outcome}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Technical Implementation */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Technical Architecture</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {technicalFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{feature.title}</CardTitle>
                      <CardDescription>{feature.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.implementation.map((item, i) => (
                      <li key={i} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Best Practices */}
      <div className="space-y-6">
        <h2 className="text-3xl font-bold text-gray-900">Best Practices & Tips</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {bestPractices.map((practice, index) => {
            const Icon = practice.icon;
            return (
              <Card key={index} className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-yellow-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">{practice.title}</h3>
                </div>
                <ul className="space-y-2">
                  {practice.practices.map((tip, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{tip}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-8 text-white text-center">
        <h3 className="text-3xl font-bold mb-4">Ready to Start AI-Powered Brainstorming?</h3>
        <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
          Transform your creative process with AI collaboration. Generate, organize, and present 
          your ideas more effectively than ever before.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
          <Button asChild variant="secondary" size="lg">
            <Link href="/create/brainstorm" className="inline-flex items-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Start Brainstorming Now</span>
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white hover:text-purple-600">
            <Link href="/docs-section/features/mcp-integration" className="inline-flex items-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>Learn About MCP Integration</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}