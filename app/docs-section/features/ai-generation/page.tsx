import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Zap, 
  ArrowRight, 
  Sparkles, 
  Brain, 
  FileText, 
  Settings,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

export default function AIGenerationPage() {
  const creationMethods = [
    {
      title: 'Generate from Prompt',
      description: 'Create presentations from a simple one-line description',
      icon: Zap,
      popular: true,
      steps: [
        'Enter a descriptive prompt (e.g., "Digital marketing strategies for small businesses")',
        'Choose number of slides (3, 5, 8, 10, or 15)',
        'Select presentation style (Professional, Friendly, Fun, Casual, Formal)',
        'Pick language (English, Spanish, French, German)',
        'AI generates complete outline and slide content'
      ]
    },
    {
      title: 'Paste Existing Content',
      description: 'Transform notes, outlines, or documents into presentations',
      icon: FileText,
      steps: [
        'Paste your existing content into the text area',
        'Choose "Generate or Summarize" to let AI restructure content',
        'Or choose "Preserve exact text" to maintain your formatting',
        'Use "---" separators to create specific slide breaks',
        'AI organizes content into professional slides'
      ]
    }
  ];

  const aiFeatures = [
    {
      title: 'Intelligent Content Structuring',
      description: 'AI analyzes your prompt to create logical slide flow and hierarchy',
      icon: Brain
    },
    {
      title: 'Template Auto-Selection',
      description: 'Smart algorithm chooses the best slide layout for each content type',
      icon: Settings
    },
    {
      title: 'Context-Aware Images',
      description: 'Automatically generates relevant images that match your content',
      icon: Sparkles
    }
  ];

  const tips = [
    {
      type: 'success',
      title: 'Best Practices',
      content: 'Be specific in your prompts. Instead of "marketing presentation," try "social media marketing strategies for restaurants in 2024"'
    },
    {
      type: 'info',
      title: 'Pro Tip',
      content: 'Use the "Professional" style for business presentations and "Friendly" for educational or team presentations'
    },
    {
      type: 'warning',
      title: 'Content Length',
      content: 'For best results, keep prompts between 10-50 words. Very short prompts may lack context, while very long ones may be overwhelming'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Generation</h1>
            <p className="text-lg text-gray-600">Create presentations from prompts and existing content</p>
          </div>
        </div>
      </div>

      {/* Creation Methods */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Creation Methods</h2>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {creationMethods.map((method) => (
            <Card key={method.title} className="bg-white/80 backdrop-blur-sm border-0 relative">
              {method.popular && (
                <Badge className="absolute -top-2 left-4 bg-blue-100 text-blue-800">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <method.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{method.title}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {method.steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <p className="text-sm text-gray-600">{step}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* AI Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">AI-Powered Features</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {aiFeatures.map((feature) => (
            <Card key={feature.title} className="bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Configuration Options */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Configuration Options</h2>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Slide Count</h4>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">• 3 slides - Quick overview</div>
                  <div className="text-sm text-gray-600">• 5 slides - Standard presentation</div>
                  <div className="text-sm text-gray-600">• 8 slides - Detailed coverage</div>
                  <div className="text-sm text-gray-600">• 10-15 slides - Comprehensive</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Presentation Style</h4>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">• Professional - Business focused</div>
                  <div className="text-sm text-gray-600">• Friendly - Approachable tone</div>
                  <div className="text-sm text-gray-600">• Fun - Creative and engaging</div>
                  <div className="text-sm text-gray-600">• Casual - Relaxed approach</div>
                  <div className="text-sm text-gray-600">• Formal - Academic style</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Languages</h4>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">• English (US)</div>
                  <div className="text-sm text-gray-600">• Spanish</div>
                  <div className="text-sm text-gray-600">• French</div>
                  <div className="text-sm text-gray-600">• German</div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Content Length</h4>
                <div className="space-y-2">
                  <div className="text-sm text-gray-600">• Brief - Key points only</div>
                  <div className="text-sm text-gray-600">• Medium - Balanced detail</div>
                  <div className="text-sm text-gray-600">• Detailed - Comprehensive</div>
                </div>
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
              <h3 className="font-semibold text-gray-900 mb-2">Try AI Generation</h3>
              <p className="text-gray-600 mb-4">Ready to create your first AI-powered presentation?</p>
              <Link href="/create/generate">
                <Button className="bg-blue-500 hover:bg-blue-600">
                  Start Creating
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="bg-white/80 backdrop-blur-sm border-0">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Learn About Editing</h3>
              <p className="text-gray-600 mb-4">Discover how to customize and refine your generated slides</p>
              <Link href="/docs-section/guides/editing-slides">
                <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-white/20">
                  Editing Guide
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
