import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Bot, 
  ArrowRight, 
  MessageSquare, 
  Wand2, 
  Edit3,
  Copy,
  Trash2,
  Move,
  Palette,
  Image,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

export default function AIAssistantPage() {
  const assistantFeatures = [
    {
      title: 'Natural Language Editing',
      description: 'Chat with AI to modify slides using everyday language',
      icon: MessageSquare,
      example: '"Make slide 3 more visual" → AI adds relevant images and adjusts layout'
    },
    {
      title: 'Tool-Based Actions',
      description: 'AI can perform specific slide operations with your approval',
      icon: Wand2,
      example: '"Duplicate slide 2 and move it after slide 5" → AI executes the exact operations'
    },
    {
      title: 'Context-Aware Responses',
      description: 'AI understands your entire presentation for relevant suggestions',
      icon: Edit3,
      example: '"Add a conclusion slide" → AI creates content that summarizes your presentation'
    }
  ];

  const availableTools = [
    {
      name: 'Update Slide Content',
      description: 'Modify text, bullet points, and HTML content',
      icon: Edit3,
      usage: '"Change the title of slide 2 to Marketing Strategy"'
    },
    {
      name: 'Create New Slide',
      description: 'Add slides with specific content and templates',
      icon: Copy,
      usage: '"Add a slide about our pricing model"'
    },
    {
      name: 'Delete Slide',
      description: 'Remove slides from your presentation',
      icon: Trash2,
      usage: '&quot;Remove slide 4, it&rsquo;s not needed anymore&quot;'
    },
    {
      name: 'Duplicate Slide',
      description: 'Copy existing slides for reuse',
      icon: Copy,
      usage: '"Duplicate slide 3 and place it after slide 6"'
    },
    {
      name: 'Move Slide',
      description: 'Reorder slides in your presentation',
      icon: Move,
      usage: '"Move slide 2 to the end of the presentation"'
    },
    {
      name: 'Apply Theme',
      description: 'Change visual themes and styling',
      icon: Palette,
      usage: '"Apply the Ocean theme to make it more professional"'
    },
    {
      name: 'Update Slide Image',
      description: 'Generate new images or modify existing ones',
      icon: Image,
      usage: '"Generate a new image for slide 5 showing teamwork"'
    },
    {
      name: 'Change Template',
      description: 'Switch slide layouts and templates',
      icon: Wand2,
      usage: '"Change slide 3 to a two-column layout"'
    }
  ];

  const conversationExamples = [
    {
      user: 'Add more details about our pricing to slide 4',
      assistant: 'I&rsquo;ll add comprehensive pricing details to slide 4, including different tiers and key features for each plan.',
      action: 'Updates slide content with detailed pricing information'
    },
    {
      user: 'The presentation feels too text-heavy. Can you make it more visual?',
      assistant: 'I&rsquo;ll identify text-heavy slides and add relevant images, change some to visual templates, and break up long text blocks.',
      action: 'Generates images and switches templates for better visual balance'
    },
    {
      user: 'Create a summary slide at the end',
      assistant: 'I&rsquo;ll create a conclusion slide that summarizes the key points from your presentation.',
      action: 'Analyzes presentation content and creates a comprehensive summary slide'
    }
  ];

  const tips = [
    {
      type: 'success',
      title: 'Be Specific',
      content: 'Instead of &quot;improve this slide,&quot; try &quot;add bullet points about our key benefits to slide 3&quot;'
    },
    {
      type: 'info',
      title: 'Use Slide Numbers',
      content: 'Reference specific slides by number (e.g., &quot;slide 2&quot;) for precise edits'
    },
    {
      type: 'warning',
      title: 'Review Changes',
      content: 'Always review AI-generated changes before approving them to ensure they match your vision'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Assistant</h1>
            <p className="text-lg text-gray-600">Chat-based slide editing and intelligent presentation assistance</p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Key Features</h2>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {assistantFeatures.map((feature) => (
            <Card key={feature.title} className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 italic">{feature.example}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Available Tools */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Available AI Tools</h2>
        <p className="text-gray-600">The AI assistant can perform these specific actions on your slides:</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {availableTools.map((tool) => (
            <Card key={tool.name} className="bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <tool.icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{tool.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-700 italic">Example: &quot;{tool.usage}&quot;</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Conversation Examples */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Conversation Examples</h2>
        
        <div className="space-y-6">
          {conversationExamples.map((example, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-blue-600">You</span>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-3 flex-1">
                      <p className="text-sm text-gray-800">&quot;{example.user}&quot;</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 flex-1">
                      <p className="text-sm text-gray-800 mb-2">{example.assistant}</p>
                      <div className="text-xs text-purple-600 font-medium">
                        Action: {example.action}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">How It Works</h2>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Chat Request</h4>
                <p className="text-sm text-gray-600">Type your request in natural language</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">AI Analysis</h4>
                <p className="text-sm text-gray-600">AI understands your intent and selects appropriate tools</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Preview Changes</h4>
                <p className="text-sm text-gray-600">Review proposed changes before they're applied</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">4</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Apply Updates</h4>
                <p className="text-sm text-gray-600">Approve changes to update your presentation</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips & Best Practices */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Tips & Best Practices</h2>
        
        <div className="space-y-4">
          {tips.map((tip, index) => (
            <Card key={index} className={`border-l-4 ${
              tip.type === 'success' ? 'border-l-green-500 bg-green-50/50' :
              tip.type === 'info' ? 'border-l-blue-500 bg-blue-50/50' :
              'border-l-yellow-500 bg-yellow-50/50'
            } backdrop-blur-sm`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {tip.type === 'success' && <CheckCircle className="w-5 h-5 text-green-600" />}
                    {tip.type === 'info' && <Lightbulb className="w-5 h-5 text-blue-600" />}
                    {tip.type === 'warning' && <AlertCircle className="w-5 h-5 text-yellow-600" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">{tip.title}</h4>
                    <p className="text-sm text-gray-600">{tip.content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Next Steps</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Try the AI Assistant</h3>
              <p className="text-gray-600 mb-4">Create a presentation and start chatting with the AI assistant</p>
              <Link href="/create">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Create Presentation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Learn About AI Generation</h3>
              <p className="text-gray-600 mb-4">Discover how AI creates presentations from scratch</p>
              <Link href="/docs-section/features/ai-generation">
                <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-white/20">
                  AI Generation Guide
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
