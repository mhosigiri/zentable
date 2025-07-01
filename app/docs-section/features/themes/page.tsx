import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Palette, 
  ArrowRight, 
  Sparkles,
  Circle,
  Waves,
  Grid3X3
} from 'lucide-react';

export default function ThemesPage() {
  const themeCategories = [
    {
      title: 'Gradient Themes',
      description: 'Dynamic color transitions for modern presentations',
      icon: Palette,
      count: 11,
      popular: true,
      themes: [
        { name: 'Sunset', colors: 'Red to Yellow to Pink', mood: 'Energetic, Creative' },
        { name: 'Ocean', colors: 'Blue to Teal', mood: 'Professional, Calm' },
        { name: 'Forest', colors: 'Teal to Green', mood: 'Natural, Growth' },
        { name: 'Fire', colors: 'Pink to Orange', mood: 'Bold, Passionate' },
        { name: 'Aurora', colors: 'Indigo to Purple to Pink', mood: 'Mystical, Innovative' },
        { name: 'Cosmic', colors: 'Dark Blue to Purple', mood: 'Professional, Tech' },
        { name: 'Tropical', colors: 'Pink to Red to Blue', mood: 'Vibrant, Fun' },
        { name: 'Neon', colors: 'Green to Cyan', mood: 'Modern, Tech' },
        { name: 'Volcano', colors: 'Red to Pink', mood: 'Intense, Powerful' },
        { name: 'Electric', colors: 'Indigo to Purple to Pink', mood: 'Dynamic, Creative' },
        { name: 'Rainbow', colors: 'Multi-color spectrum', mood: 'Playful, Diverse' }
      ]
    },
    {
      title: 'Solid Color Themes',
      description: 'Clean, professional single-color backgrounds',
      icon: Circle,
      count: 5,
      themes: [
        { name: 'Midnight', colors: 'Dark Navy', mood: 'Professional, Elegant' },
        { name: 'Snow', colors: 'Pure White', mood: 'Clean, Minimal' },
        { name: 'Emerald', colors: 'Deep Green', mood: 'Natural, Trustworthy' },
        { name: 'Ruby', colors: 'Deep Red', mood: 'Bold, Confident' },
        { name: 'Amber', colors: 'Deep Orange', mood: 'Warm, Inviting' }
      ]
    },
    {
      title: 'Wave Themes',
      description: 'Organic patterns with flowing visual elements',
      icon: Waves,
      count: 5,
      themes: [
        { name: 'Ocean Waves', colors: 'Blue gradient with wave patterns', mood: 'Fluid, Dynamic' },
        { name: 'Sunset Waves', colors: 'Red to Yellow with wave overlays', mood: 'Warm, Flowing' },
        { name: 'Purple Waves', colors: 'Indigo to Purple with patterns', mood: 'Creative, Elegant' },
        { name: 'Emerald Waves', colors: 'Green gradient with wave effects', mood: 'Natural, Organic' },
        { name: 'Cosmic Waves', colors: 'Dark blue with purple wave patterns', mood: 'Mysterious, Tech' }
      ]
    },
    {
      title: 'Glass Themes',
      description: 'Translucent effects with modern glass morphism',
      icon: Sparkles,
      count: 3,
      themes: [
        { name: 'Frosted', colors: 'Translucent white with blur', mood: 'Clean, Modern' },
        { name: 'Tinted', colors: 'Indigo to Purple glass effect', mood: 'Sophisticated, Tech' },
        { name: 'Emerald Glass', colors: 'Green translucent with blur', mood: 'Fresh, Modern' }
      ]
    }
  ];

  const themeFeatures = [
    {
      title: 'Instant Application',
      description: 'Themes apply immediately to all slides with live preview',
      icon: Sparkles
    },
    {
      title: 'Template Integration',
      description: 'All themes work seamlessly with every slide template',
      icon: Grid3X3
    },
    {
      title: 'Export Preservation',
      description: 'Theme styling is maintained in PDF exports and presentation mode',
      icon: Palette
    },
    {
      title: 'Responsive Design',
      description: 'Themes adapt beautifully to different screen sizes and orientations',
      icon: Circle
    }
  ];

  const usageGuidelines = [
    {
      category: 'Business Presentations',
      recommended: ['Ocean', 'Midnight', 'Snow', 'Cosmic'],
      avoid: ['Rainbow', 'Neon', 'Tropical'],
      reason: 'Professional appearance with subtle colors'
    },
    {
      category: 'Creative Presentations',
      recommended: ['Aurora', 'Electric', 'Sunset Waves', 'Tropical'],
      avoid: ['Midnight', 'Snow'],
      reason: 'Vibrant colors that inspire creativity'
    },
    {
      category: 'Educational Content',
      recommended: ['Forest', 'Emerald', 'Ocean Waves', 'Frosted'],
      avoid: ['Fire', 'Volcano'],
      reason: 'Calming colors that aid concentration'
    },
    {
      category: 'Tech Presentations',
      recommended: ['Cosmic', 'Tinted', 'Neon', 'Electric'],
      avoid: ['Sunset', 'Tropical'],
      reason: 'Modern, tech-forward aesthetic'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Themes</h1>
            <p className="text-lg text-gray-600">Beautiful visual themes to customize your presentation appearance</p>
          </div>
        </div>
      </div>

      {/* Theme Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Theme Features</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {themeFeatures.map((feature) => (
            <Card key={feature.title} className="bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Theme Categories */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Theme Categories</h2>
        
        {themeCategories.map((category) => (
          <div key={category.title} className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <category.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <span>{category.title}</span>
                  <Badge className="bg-blue-100 text-blue-800">{category.count} themes</Badge>
                  {category.popular && (
                    <Badge className="bg-green-100 text-green-800">Popular</Badge>
                  )}
                </h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.themes.map((theme) => (
                <Card key={theme.name} className="bg-white/80 backdrop-blur-sm border-0">
                  <CardContent className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{theme.name}</h4>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-700">Colors:</p>
                        <p className="text-xs text-gray-600">{theme.colors}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-700">Mood:</p>
                        <p className="text-xs text-gray-600">{theme.mood}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Usage Guidelines */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Usage Guidelines</h2>
        <p className="text-gray-600">Choose themes that match your presentation context and audience</p>
        
        <div className="grid md:grid-cols-2 gap-6">
          {usageGuidelines.map((guideline) => (
            <Card key={guideline.category} className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg">{guideline.category}</CardTitle>
                <CardDescription>{guideline.reason}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-semibold text-green-700 mb-2">Recommended:</h5>
                    <div className="flex flex-wrap gap-2">
                      {guideline.recommended.map((theme) => (
                        <Badge key={theme} className="bg-green-100 text-green-800 text-xs">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h5 className="text-sm font-semibold text-red-700 mb-2">Avoid:</h5>
                    <div className="flex flex-wrap gap-2">
                      {guideline.avoid.map((theme) => (
                        <Badge key={theme} variant="outline" className="border-red-200 text-red-700 text-xs">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* How to Apply Themes */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">How to Apply Themes</h2>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Open Theme Panel</h4>
                <p className="text-sm text-gray-600">Click the themes button in the presentation editor toolbar</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Browse Categories</h4>
                <p className="text-sm text-gray-600">Explore gradient, solid, wave, and glass theme options</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Apply & Preview</h4>
                <p className="text-sm text-gray-600">Click any theme to apply it instantly with live preview</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Next Steps</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-2">Try Different Themes</h3>
              <p className="text-gray-600 mb-4">Create a presentation and experiment with various themes</p>
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
              <h3 className="font-semibold text-gray-900 mb-2">Learn About Templates</h3>
              <p className="text-gray-600 mb-4">Discover how themes work with different slide templates</p>
              <Link href="/docs-section/features/slide-templates">
                <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-white/20">
                  Template Guide
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
