import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Palette, 
  Bot, 
  Monitor, 
  Download, 
  PlayCircle,
  Edit,
  ArrowRight,
  Sparkles,
  Brain,
  Wand2
} from 'lucide-react';

export default function DocsPage() {
  const quickStartSteps = [
    {
      step: 1,
      title: 'Choose Creation Method',
      description: 'Start with AI generation, paste existing content, or import files',
      href: '/docs-section/guides/creating-presentations'
    },
    {
      step: 2,
      title: 'Customize Your Slides',
      description: 'Edit content, apply themes, and arrange slides to your liking',
      href: '/docs-section/guides/editing-slides'
    },
    {
      step: 3,
      title: 'Present or Export',
      description: 'Use presentation mode or export to PDF for sharing',
      href: '/docs-section/features/presentation-mode'
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'AI Generation',
      description: 'Transform simple prompts into comprehensive presentations with intelligent content structuring',
      href: '/docs-section/features/ai-generation',
      badge: 'Popular'
    },
    {
      icon: Bot,
      title: 'AI Assistant',
      description: 'Chat with AI to edit slides, add content, and make changes using natural language',
      href: '/docs-section/features/ai-assistant',
      badge: 'New'
    },
    {
      icon: Palette,
      title: 'Slide Templates',
      description: '14+ professional slide layouts including columns, bullets, images, and accent designs',
      href: '/docs-section/features/slide-templates'
    },
    {
      icon: Wand2,
      title: 'Themes',
      description: 'Beautiful visual themes with gradients, solid colors, waves, and glass effects',
      href: '/docs-section/features/themes'
    },
    {
      icon: Monitor,
      title: 'Presentation Mode',
      description: 'Fullscreen presenting with presenter view and audience mode options',
      href: '/docs-section/features/presentation-mode'
    },
    {
      icon: Download,
      title: 'Export & Sharing',
      description: 'Export presentations to PDF with high-quality rendering and theme preservation',
      href: '/docs-section/features/export'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Cursor for Slides Documentation
            </h1>
            <p className="text-xl text-gray-600">
              Learn how to create stunning AI-powered presentations
            </p>
          </div>
        </div>
        
        <div className="flex items-center justify-center space-x-4">
          <Link href="/docs-section/guides/creating-presentations">
            <Button size="lg" className="bg-blue-500 hover:bg-blue-600">
              <PlayCircle className="w-5 h-5 mr-2" />
              Get Started
            </Button>
          </Link>
          <Link href="/create">
            <Button variant="outline" size="lg" className="bg-white/60 backdrop-blur-sm border-white/20">
              Create Presentation
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Start Guide */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Start</h2>
          <p className="text-lg text-gray-600">Get up and running in 3 simple steps</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {quickStartSteps.map((step) => (
            <Link key={step.step} href={step.href}>
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 h-full">
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-xl font-bold text-white">{step.step}</span>
                  </div>
                  <CardTitle className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                    {step.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Features Overview */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Features</h2>
          <p className="text-lg text-gray-600">Explore all the powerful features available in Cursor for Slides</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link key={feature.title} href={feature.href}>
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 h-full relative">
                {feature.badge && (
                  <Badge className="absolute -top-2 left-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
                    {feature.badge}
                  </Badge>
                )}
                <CardHeader className="pb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-xl font-semibold group-hover:text-blue-600 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* What's New */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What&rsquo;s New</h2>
          <p className="text-lg text-gray-600">Latest features and improvements</p>
        </div>
        
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Enhanced AI Assistant</h3>
                <p className="text-gray-600 mb-4">
                  Our AI assistant now supports more natural conversations and can perform complex slide operations 
                  like reordering, duplicating, and applying themes through simple chat commands.
                </p>
                <Link href="/docs-section/features/ai-assistant">
                  <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-white/20">
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Help & Support */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Need Help?</h2>
          <p className="text-lg text-gray-600">Get support and connect with the community</p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Guides & Tutorials</h3>
              <p className="text-gray-600 mb-4">
                Step-by-step guides to help you master all features
              </p>
              <Link href="/docs-section/guides/creating-presentations">
                <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-white/20">
                  View Guides
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Feature Requests</h3>
              <p className="text-gray-600 mb-4">
                Have an idea? We&rsquo;d love to hear your suggestions
              </p>
              <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-white/20">
                Submit Feedback
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
