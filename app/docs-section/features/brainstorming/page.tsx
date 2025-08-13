'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Lightbulb, 
  ArrowRight, 
  MessageSquare, 
  Zap, 
  Target,
  CheckCircle,
  AlertCircle,
  Users,
  Brain,
  Sparkles
} from 'lucide-react';

export default function BrainstormingPage() {
  const brainstormingCapabilities = [
    {
      title: 'Idea Generation',
      description: 'Start with broad topics and explore specific angles',
      icon: Lightbulb,
      features: [
        'AI suggests related concepts and themes',
        'Generate multiple presentation directions',
        'Explore unexpected angles and perspectives',
        'Build on initial ideas with follow-up suggestions'
      ]
    },
    {
      title: 'Conversational Exploration',
      description: 'Chat naturally about your presentation ideas',
      icon: MessageSquare,
      features: [
        'Ask "what if" questions and explore alternatives',
        'Get suggestions for slide structure and content flow',
        'Discuss different approaches and methodologies',
        'Receive clarifying questions to refine your thinking'
      ]
    },
    {
      title: 'Topic Refinement',
      description: 'Narrow down broad concepts into focused themes',
      icon: Target,
      features: [
        'Identify key messages and supporting points',
        'Develop clear narrative structures',
        'Focus on the most compelling aspects',
        'Eliminate unnecessary or confusing elements'
      ]
    },
    {
      title: 'Content Direction',
      description: 'Explore different presentation styles and approaches',
      icon: Brain,
      features: [
        'Test audience-specific messaging',
        'Identify the most compelling angles',
        'Consider different presentation formats',
        'Explore various storytelling approaches'
      ]
    }
  ];

  const workflowSteps = [
    {
      step: 1,
      title: 'Access Brainstorming Mode',
      description: 'Start your ideation session',
      icon: Zap,
      details: [
        'Go to Create → Brainstorm from main navigation',
        'Or click "Brainstorm Ideas" from the dashboard',
        'Choose between guided or free-form brainstorming',
        'Set your session preferences and goals'
      ]
    },
    {
      step: 2,
      title: 'Start the Conversation',
      description: 'Enter your general topic or challenge',
      icon: MessageSquare,
      details: [
        'Begin with broad topics or specific challenges',
        'Example: "I need to present our Q4 marketing strategy"',
        'Share context about your audience and goals',
        'Don\'t worry about structure at this stage'
      ]
    },
    {
      step: 3,
      title: 'Explore Ideas',
      description: 'Engage in dynamic conversation with AI',
      icon: Brain,
      details: [
        'AI will ask clarifying questions to understand your needs',
        'Discuss different angles and approaches openly',
        'Explore "what if" scenarios and alternatives',
        'Refine your focus through iterative conversation'
      ]
    },
    {
      step: 4,
      title: 'Generate Presentations',
      description: 'Transform refined ideas into presentations',
      icon: Sparkles,
      details: [
        'Choose from multiple suggested presentation directions',
        'Maintain conversation context for consistent messaging',
        'Create presentations directly from brainstorming insights',
        'Save successful brainstorming sessions for future reference'
      ]
    }
  ];

  const useCases = [
    {
      title: 'Strategic Planning',
      description: 'Develop comprehensive business strategies and roadmaps',
      icon: Target,
      example: 'Brainstorm approaches for entering new markets, competitive positioning, or growth strategies'
    },
    {
      title: 'Problem Solving',
      description: 'Work through complex challenges and identify solutions',
      icon: Lightbulb,
      example: 'Explore different solutions to operational challenges or technical problems'
    },
    {
      title: 'Creative Projects',
      description: 'Generate innovative ideas for marketing campaigns or projects',
      icon: Sparkles,
      example: 'Develop creative concepts for product launches or brand campaigns'
    },
    {
      title: 'Educational Content',
      description: 'Structure learning materials and training programs',
      icon: Brain,
      example: 'Create engaging training presentations or educational workshop content'
    },
    {
      title: 'Team Presentations',
      description: 'Prepare for team meetings, retrospectives, and planning sessions',
      icon: Users,
      example: 'Plan sprint reviews, team building sessions, or organizational updates'
    },
    {
      title: 'Client Pitches',
      description: 'Develop compelling proposals and client presentations',
      icon: Zap,
      example: 'Create persuasive sales presentations or project proposals'
    }
  ];

  const conversationExamples = [
    {
      user: 'I need to present our new product features to stakeholders',
      ai: 'That sounds important! Let me help you explore different angles. First, who are your main stakeholders - executives, technical teams, or customers? And what\'s the primary goal - approval, feedback, or buy-in?',
      outcome: 'Leads to audience-specific presentation structure'
    },
    {
      user: 'I want to explain why our team should adopt agile methodologies',
      ai: 'Great topic! Are you facing resistance to change, or is this more about education? And what specific agile practices are you most excited about implementing?',
      outcome: 'Develops change management approach'
    },
    {
      user: 'Our Q3 results were mixed - some wins, some challenges',
      ai: 'Mixed results can actually make for compelling presentations. Would you like to focus on lessons learned, future improvements, or celebrating the wins while addressing challenges?',
      outcome: 'Creates balanced, honest narrative'
    }
  ];

  const bestPractices = [
    {
      category: 'Getting Started',
      tips: [
        'Start broad and narrow down through conversation',
        'Don\'t worry about perfect phrasing initially',
        'Be honest about your challenges and constraints',
        'Share context about your audience and goals'
      ]
    },
    {
      category: 'During Brainstorming',
      tips: [
        'Ask open-ended questions to explore possibilities',
        'Use the AI to challenge your assumptions',
        'Explore multiple directions before settling on one',
        'Take notes on interesting tangents for future use'
      ]
    },
    {
      category: 'Moving to Creation',
      tips: [
        'Choose the most compelling angle that emerged',
        'Use specific insights from brainstorming in your prompt',
        'Reference audience insights discovered during brainstorming',
        'Save successful brainstorming approaches for similar topics'
      ]
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Brainstorming</h1>
            <p className="text-lg text-gray-600">Explore ideas and refine your presentation concepts with AI</p>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Interactive Brainstorming Mode</h2>
        <p className="text-gray-700 text-lg leading-relaxed mb-4">
          Zentable's brainstorming feature provides a dedicated space to explore ideas before creating formal presentations. 
          Through conversational AI, you can refine concepts, explore different angles, and develop clear direction for your presentations.
        </p>
        <div className="flex items-center space-x-2 text-sm text-orange-700">
          <CheckCircle className="w-4 h-4" />
          <span>Idea exploration</span>
          <CheckCircle className="w-4 h-4 ml-4" />
          <span>Conversational refinement</span>
          <CheckCircle className="w-4 h-4 ml-4" />
          <span>Direct presentation creation</span>
        </div>
      </div>

      {/* Capabilities */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Brainstorming Capabilities</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {brainstormingCapabilities.map((capability, index) => {
            const Icon = capability.icon;
            return (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{capability.title}</CardTitle>
                      <CardDescription>{capability.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {capability.features.map((feature, i) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start space-x-2">
                        <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Workflow */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">How Brainstorming Works</h2>
        <div className="space-y-6">
          {workflowSteps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                      {step.step}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="flex items-center space-x-2">
                        <Icon className="w-5 h-5" />
                        <span>{step.title}</span>
                      </CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {step.details.map((detail, i) => (
                      <div key={i} className="flex items-start space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{detail}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Use Cases */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Common Use Cases</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {useCases.map((useCase, index) => {
            const Icon = useCase.icon;
            return (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">{useCase.title}</CardTitle>
                  </div>
                  <CardDescription>{useCase.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">
                      <strong>Example:</strong> {useCase.example}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Conversation Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Conversation Examples</h2>
        <p className="text-gray-600">See how brainstorming conversations typically develop:</p>
        <div className="space-y-6">
          {conversationExamples.map((example, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        U
                      </div>
                      <p className="text-sm text-blue-800">{example.user}</p>
                    </div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        AI
                      </div>
                      <p className="text-sm text-green-800">{example.ai}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 font-medium">{example.outcome}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Best Practices</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {bestPractices.map((section, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">{section.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {section.tips.map((tip, i) => (
                    <li key={i} className="text-sm text-gray-600 flex items-start space-x-2">
                      <Lightbulb className="w-3 h-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Integration with Other Features */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50">
        <CardHeader>
          <CardTitle className="text-xl">Integration with Other Features</CardTitle>
          <CardDescription>Brainstorming works seamlessly with Zentable's other capabilities</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>AI Generation</span>
              </h4>
              <p className="text-sm text-gray-600">
                Refined ideas from brainstorming feed directly into AI presentation generation for better results.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                <MessageSquare className="w-4 h-4 text-blue-500" />
                <span>AI Assistant</span>
              </h4>
              <p className="text-sm text-gray-600">
                Insights from brainstorming sessions inform the AI assistant's suggestions during editing.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                <Target className="w-4 h-4 text-green-500" />
                <span>Template Selection</span>
              </h4>
              <p className="text-sm text-gray-600">
                Brainstorming helps identify the most appropriate slide templates and visual approaches.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-gray-900 flex items-center space-x-2">
                <Brain className="w-4 h-4 text-orange-500" />
                <span>MCP Integration</span>
              </h4>
              <p className="text-sm text-gray-600">
                Brainstorming sessions can be initiated from your development environment via MCP integration.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-600 rounded-lg p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">Start Brainstorming Your Next Presentation</h3>
        <p className="text-lg opacity-90 mb-6">
          Explore ideas, refine concepts, and develop compelling presentations through conversational AI.
        </p>
        <Button asChild variant="secondary" size="lg">
          <Link href="/create/brainstorm" className="inline-flex items-center space-x-2">
            <Lightbulb className="w-4 h-4" />
            <span>Start Brainstorming</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}