import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  PlayCircle, 
  ArrowRight, 
  Zap,
  FileText,
  Upload,
  Settings,
  CheckCircle,
  Clock
} from 'lucide-react';

export default function CreatingPresentationsPage() {
  const creationMethods = [
    {
      title: 'AI Generation',
      description: 'Create presentations from simple prompts using artificial intelligence',
      icon: Zap,
      difficulty: 'Beginner',
      time: '2-5 minutes',
      popular: true,
      steps: [
        'Click "Create Presentation" from dashboard',
        'Choose "Generate with AI" option',
        'Enter a descriptive prompt (e.g., "Digital marketing for restaurants")',
        'Select number of slides (3, 5, 8, 10, or 15)',
        'Choose presentation style (Professional, Friendly, Fun, etc.)',
        'Pick your preferred language',
        'Click "Generate" and wait for AI to create your outline',
        'Review and edit the generated outline',
        'Generate slides one by one with AI content'
      ],
      tips: [
        'Be specific in your prompts for better results',
        'Use the "Professional" style for business presentations',
        'You can edit the outline before generating slides'
      ]
    },
    {
      title: 'Paste Content',
      description: 'Transform existing text, notes, or outlines into presentations',
      icon: FileText,
      difficulty: 'Beginner',
      time: '3-7 minutes',
      steps: [
        'Click "Create Presentation" from dashboard',
        'Choose "Paste Content" option',
        'Paste your existing text into the text area',
        'Choose "Generate or Summarize" to let AI restructure content',
        'Or choose "Preserve exact text" to maintain your formatting',
        'Use "---" separators to create specific slide breaks',
        'Configure slide count and style preferences',
        'Generate your presentation with AI assistance'
      ],
      tips: [
        'Use "---" to manually separate slides',
        'Choose "Generate or Summarize" for better structure',
        'Works great with meeting notes and outlines'
      ]
    },
    {
      title: 'Import Files',
      description: 'Import presentations from various file formats and sources',
      icon: Upload,
      difficulty: 'Intermediate',
      time: '5-10 minutes',
      status: 'Coming Soon',
      steps: [
        'Click "Create Presentation" from dashboard',
        'Choose "Import" option',
        'Select import source (File upload, Google Drive, URL)',
        'Upload PPTX, Word documents, or PDFs',
        'AI will analyze and convert content',
        'Review imported slides and make adjustments',
        'Apply themes and templates as needed'
      ],
      tips: [
        'Supported formats: PPTX, DOCX, PDF',
        'Google Drive integration available',
        'Import from URLs for web content'
      ]
    }
  ];

  const workflowSteps = [
    {
      phase: 'Planning',
      title: 'Define Your Presentation',
      description: 'Clarify your message, audience, and objectives',
      icon: Settings,
      tasks: [
        'Identify your target audience',
        'Define key messages and objectives',
        'Gather content and supporting materials',
        'Choose appropriate tone and style'
      ]
    },
    {
      phase: 'Creation',
      title: 'Generate Your Slides',
      description: 'Use AI to create your initial presentation structure',
      icon: Zap,
      tasks: [
        'Select creation method (Generate, Paste, or Import)',
        'Provide clear, specific prompts or content',
        'Configure settings (slides, style, language)',
        'Review and refine the generated outline'
      ]
    },
    {
      phase: 'Customization',
      title: 'Refine and Personalize',
      description: 'Edit content, apply themes, and adjust layouts',
      icon: FileText,
      tasks: [
        'Edit slide content using rich text editor',
        'Apply themes and visual styling',
        'Adjust slide templates and layouts',
        'Add or generate relevant images'
      ]
    },
    {
      phase: 'Finalization',
      title: 'Review and Export',
      description: 'Final review, testing, and preparation for sharing',
      icon: CheckCircle,
      tasks: [
        'Review all slides for accuracy and flow',
        'Test presentation mode and navigation',
        'Export to PDF or prepare for live presentation',
        'Share with collaborators or audience'
      ]
    }
  ];

  const bestPractices = [
    {
      category: 'Content Strategy',
      practices: [
        'Start with a clear objective and key message',
        'Know your audience and tailor content accordingly',
        'Use the "rule of three" - limit key points per slide',
        'Tell a story with logical flow and progression'
      ]
    },
    {
      category: 'Visual Design',
      practices: [
        'Choose themes that match your content and audience',
        'Maintain consistency in fonts, colors, and layouts',
        'Use high-quality images that support your message',
        'Avoid cluttered slides - embrace white space'
      ]
    },
    {
      category: 'AI Optimization',
      practices: [
        'Write specific, detailed prompts for better AI results',
        'Use the AI assistant to refine and improve content',
        'Experiment with different styles and approaches',
        'Review and edit AI-generated content for accuracy'
      ]
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <PlayCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Creating Presentations</h1>
            <p className="text-lg text-gray-600">Complete guide to creating stunning AI-powered presentations</p>
          </div>
        </div>
      </div>

      {/* Creation Methods */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Creation Methods</h2>
        
        <div className="space-y-8">
          {creationMethods.map((method) => (
            <Card key={method.title} className="bg-white/80 backdrop-blur-sm border-0 relative">
              <div className="absolute -top-2 left-4 flex space-x-2">
                {method.popular && (
                  <Badge className="bg-blue-100 text-blue-800">Most Popular</Badge>
                )}
                {method.status && (
                  <Badge className="bg-yellow-100 text-yellow-800">{method.status}</Badge>
                )}
              </div>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <method.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{method.title}</CardTitle>
                      <CardDescription>{method.description}</CardDescription>
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <div className="flex items-center space-x-1 mb-1">
                      <Clock className="w-4 h-4" />
                      <span>{method.time}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {method.difficulty}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <h4 className="font-semibold text-gray-900 mb-3">Step-by-Step Process:</h4>
                    <ol className="space-y-2">
                      {method.steps.map((step, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                          </div>
                          <span className="text-sm text-gray-600">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Pro Tips:</h4>
                    <ul className="space-y-2">
                      {method.tips.map((tip, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Workflow Overview */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Complete Workflow</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {workflowSteps.map((step) => (
            <Card key={step.phase} className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <Badge variant="outline" className="text-xs mb-2">{step.phase}</Badge>
                    <CardTitle className="text-lg">{step.title}</CardTitle>
                  </div>
                </div>
                <CardDescription>{step.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {step.tasks.map((task, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{task}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Best Practices */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Best Practices</h2>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {bestPractices.map((category) => (
            <Card key={category.category} className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {category.practices.map((practice, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{practice}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Ready to Start?</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">AI Generation</h3>
              <p className="text-gray-600 mb-4">Start with a simple prompt</p>
              <Link href="/create/generate">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Generate Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-6 text-center">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Paste Content</h3>
              <p className="text-gray-600 mb-4">Transform existing text</p>
              <Link href="/create/paste">
                <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-white/20">
                  Paste Content
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-6 text-center">
              <Upload className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Import Files</h3>
              <p className="text-gray-600 mb-4">Upload existing presentations</p>
              <Button variant="outline" disabled className="bg-gray-100 text-gray-400">
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
