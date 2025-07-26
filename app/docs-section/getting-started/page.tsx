import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  Zap, 
  FileText, 
  Upload,
  ArrowRight,
  CheckCircle,
  Clock,
  Users,
  Sparkles
} from 'lucide-react';

export default function GettingStartedPage() {
  const onboardingSteps = [
    {
      title: 'Choose Your Creation Method',
      description: 'Pick the best way to start your presentation',
      icon: Zap,
      options: [
        {
          name: 'AI Generation',
          description: 'Start with a prompt like "Digital marketing for restaurants"',
          recommended: true,
          time: '2-5 min'
        },
        {
          name: 'Paste Content',
          description: 'Transform existing notes or outlines into slides',
          time: '3-7 min'
        },
        {
          name: 'Import Files',
          description: 'Upload PPTX, Word docs, or PDFs (Coming Soon)',
          time: '5-10 min',
          comingSoon: true
        }
      ]
    },
    {
      title: 'Configure Your Presentation',
      description: 'Customize settings for optimal results',
      icon: FileText,
      settings: [
        'Number of slides (3, 5, 8, 10, or 15)',
        'Presentation style (Professional, Friendly, Fun, Casual, Formal)',
        'Language (English, Spanish, French, German)',
        'Content length (Brief, Medium, Detailed)'
      ]
    },
    {
      title: 'Review and Generate',
      description: 'AI creates your presentation outline and slides',
      icon: Sparkles,
      process: [
        'AI analyzes your input and creates a structured outline',
        'Each section gets optimized titles and bullet points',
        'Templates are automatically selected for visual variety',
        'You can edit the outline before generating slides'
      ]
    },
    {
      title: 'Edit and Customize',
      description: 'Refine your presentation with powerful editing tools',
      icon: Users,
      features: [
        'Rich text editor with formatting options',
        'AI assistant for conversational editing',
        'Theme selection and visual customization',
        'Drag & drop slide reordering'
      ]
    }
  ];

  const keyFeatures = [
    {
      title: 'AI-Powered Generation',
      description: 'Create complete presentations from simple prompts',
      benefits: [
        'Save hours of manual work',
        'Professional content and structure',
        'Multiple AI models for best results'
      ]
    },
    {
      title: 'Smart Template Selection',
      description: 'AI chooses optimal layouts for your content',
      benefits: [
        '14+ professional templates',
        'Automatic content-layout matching',
        'Responsive design for all devices'
      ]
    },
    {
      title: 'Conversational Editing',
      description: 'Edit slides using natural language commands',
      benefits: [
        'No complex menus or tools',
        'Context-aware AI assistant',
        'Real-time slide updates'
      ]
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Getting Started</h1>
            <p className="text-lg text-gray-600">Your complete guide to creating AI-powered presentations</p>
          </div>
        </div>
      </div>

      {/* Quick Overview */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to the Future of Presentations</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Cursor for Slides uses advanced AI to transform how you create presentations. Instead of spending hours 
                designing slides, simply describe what you want and get professional results in minutes.
              </p>
              <div className="flex items-center space-x-4">
                <Badge className="bg-blue-100 text-blue-800">
                  <Clock className="w-3 h-3 mr-1" />
                  10x Faster
                </Badge>
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Professional Quality
                </Badge>
              </div>
            </div>
            <div className="text-center">
              <Link href="/create/generate">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  Create Your First Presentation
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <p className="text-sm text-gray-500 mt-2">No setup required • Start immediately</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step-by-Step Process */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Step-by-Step Process</h2>
        
        <div className="space-y-8">
          {onboardingSteps.map((step, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="outline" className="text-xs">Step {index + 1}</Badge>
                      <CardTitle className="text-xl">{step.title}</CardTitle>
                    </div>
                    <CardDescription className="mt-2">{step.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {step.options && (
                  <div className="grid md:grid-cols-3 gap-4">
                    {step.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="p-4 rounded-lg border border-gray-200 relative">
                        {option.recommended && (
                          <Badge className="absolute -top-2 left-4 bg-blue-100 text-blue-800 text-xs">
                            Recommended
                          </Badge>
                        )}
                        {option.comingSoon && (
                          <Badge className="absolute -top-2 left-4 bg-yellow-100 text-yellow-800 text-xs">
                            Coming Soon
                          </Badge>
                        )}
                        <h4 className="font-semibold text-gray-900 mb-2 mt-2">{option.name}</h4>
                        <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">{option.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {step.settings && (
                  <ul className="grid md:grid-cols-2 gap-3">
                    {step.settings.map((setting, settingIndex) => (
                      <li key={settingIndex} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="text-sm text-gray-600">{setting}</span>
                      </li>
                    ))}
                  </ul>
                )}
                
                {step.process && (
                  <ol className="space-y-3">
                    {step.process.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-medium text-blue-600">{itemIndex + 1}</span>
                        </div>
                        <span className="text-sm text-gray-600">{item}</span>
                      </li>
                    ))}
                  </ol>
                )}
                
                {step.features && (
                  <ul className="grid md:grid-cols-2 gap-3">
                    {step.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                        <span className="text-sm text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Key Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Why Choose Cursor for Slides?</h2>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {keyFeatures.map((feature, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <li key={benefitIndex} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{benefit}</span>
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
        <h2 className="text-2xl font-bold text-gray-900">Ready to Get Started?</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6 text-center">
              <Zap className="w-12 h-12 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Start Creating</h3>
              <p className="text-gray-600 mb-4">Jump right in with AI generation</p>
              <Link href="/create/generate">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Generate Presentation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-6 text-center">
              <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">Learn More</h3>
              <p className="text-gray-600 mb-4">Explore detailed feature guides</p>
              <Link href="/docs-section/guides/creating-presentations">
                <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-white/20">
                  View Guides
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
