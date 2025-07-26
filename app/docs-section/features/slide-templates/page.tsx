import React from 'react';
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { generatePageMetadata, PageSEO } from '@/components/seo/page-seo';
import { 
  Palette, 
  ArrowRight, 
  Layout,
  Columns,
  Image,
  Type,
  List,
  Grid3X3,
  Sparkles
} from 'lucide-react';

export const metadata: Metadata = generatePageMetadata({
  title: 'Slide Templates - 14+ Professional Layouts',
  description: 'Explore Zent\'s comprehensive collection of slide templates including columns, images, text, and accent designs. Perfect layouts for every presentation need.',
  path: '/docs-section/features/slide-templates',
  keywords: ['slide templates', 'presentation layouts', 'slide designs', 'template gallery']
})

export default function SlideTemplatesPage() {
  const faqData = {
    faqs: [
      {
        '@type': 'Question',
        name: 'How many slide templates are available?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Zent offers 14+ professional slide templates across 5 categories: Basic Templates, Column Layouts, Image & Text Combinations, Accent Templates, and Text-Focused Templates.'
        }
      },
      {
        '@type': 'Question',
        name: 'Can I customize the templates?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, all templates are fully customizable. You can modify colors, fonts, layouts, and content to match your brand and presentation needs.'
        }
      }
    ]
  }

  const templateCategories = [
    {
      title: 'Basic Templates',
      description: 'Simple, clean layouts for essential content',
      icon: Layout,
      templates: [
        {
          name: 'Blank Card',
          description: 'Minimal template for custom content',
          useCase: 'Custom layouts, special content',
          preview: 'Simple card with flexible content area'
        },
        {
          name: 'Bullets',
          description: 'Structured bullet point lists',
          useCase: 'Key points, features, benefits',
          preview: 'Title with organized bullet points'
        },
        {
          name: 'Paragraph',
          description: 'Text-heavy content with sections',
          useCase: 'Detailed explanations, stories',
          preview: 'Multiple text sections with headings'
        }
      ]
    },
    {
      title: 'Column Layouts',
      description: 'Multi-column designs for organized content',
      icon: Columns,
      templates: [
        {
          name: 'Two Columns',
          description: 'Side-by-side content comparison',
          useCase: 'Before/after, pros/cons, comparisons',
          preview: 'Two equal columns with content'
        },
        {
          name: 'Three Columns',
          description: 'Triple layout for categorized content',
          useCase: 'Features, steps, categories',
          preview: 'Three equal columns with headers'
        },
        {
          name: 'Four Columns',
          description: 'Grid layout for multiple items',
          useCase: 'Team members, products, statistics',
          preview: 'Four-column grid with content blocks'
        },
        {
          name: 'Two Columns with Headings',
          description: 'Columns with prominent headers',
          useCase: 'Detailed comparisons, feature lists',
          preview: 'Two columns with bold headings'
        },
        {
          name: 'Three Columns with Headings',
          description: 'Triple layout with section headers',
          useCase: 'Process steps, service categories',
          preview: 'Three columns with descriptive headers'
        },
        {
          name: 'Four Columns with Headings',
          description: 'Grid with individual section titles',
          useCase: 'Product features, team roles',
          preview: 'Four-column grid with headers'
        }
      ]
    },
    {
      title: 'Image & Text Combinations',
      description: 'Visual layouts combining images with content',
      icon: Image,
      templates: [
        {
          name: 'Image and Text',
          description: 'Image on left, content on right',
          useCase: 'Product showcases, case studies',
          preview: 'Large image with accompanying text'
        },
        {
          name: 'Text and Image',
          description: 'Content on left, image on right',
          useCase: 'Explanations with visuals, tutorials',
          preview: 'Text content with supporting image'
        },
        {
          name: 'Title with Bullets and Image',
          description: 'Combines title, bullets, and visual',
          useCase: 'Feature highlights, benefit summaries',
          preview: 'Title, bullet points, and image'
        }
      ]
    },
    {
      title: 'Accent Templates',
      description: 'Prominent visual designs with emphasis',
      icon: Sparkles,
      popular: true,
      templates: [
        {
          name: 'Accent Left',
          description: 'Large image on left with content overlay',
          useCase: 'Hero slides, impactful statements',
          preview: 'Prominent left image with text overlay'
        },
        {
          name: 'Accent Right',
          description: 'Large image on right with content overlay',
          useCase: 'Product launches, key messages',
          preview: 'Prominent right image with text overlay'
        },
        {
          name: 'Accent Top',
          description: 'Full-width image header with content below',
          useCase: 'Section dividers, chapter introductions',
          preview: 'Wide header image with content below'
        },
        {
          name: 'Accent Background',
          description: 'Full background image with overlay text',
          useCase: 'Cover slides, dramatic presentations',
          preview: 'Full background with centered text'
        }
      ]
    },
    {
      title: 'Text-Focused Templates',
      description: 'Typography-centered designs for content-heavy slides',
      icon: Type,
      templates: [
        {
          name: 'Title with Text',
          description: 'Large title with detailed content below',
          useCase: 'Introductions, explanations, summaries',
          preview: 'Prominent title with paragraph content'
        },
        {
          name: 'Title with Bullets',
          description: 'Title with organized bullet points',
          useCase: 'Agendas, key points, action items',
          preview: 'Clear title with structured bullets'
        }
      ]
    }
  ];

  const templateFeatures = [
    {
      title: 'Intelligent Auto-Selection',
      description: 'AI analyzes your content to choose the most appropriate template automatically',
      icon: Sparkles
    },
    {
      title: 'Responsive Design',
      description: 'All templates adapt beautifully to different screen sizes and orientations',
      icon: Layout
    },
    {
      title: 'Theme Integration',
      description: 'Templates work seamlessly with all theme categories and visual styles',
      icon: Palette
    },
    {
      title: 'Easy Switching',
      description: 'Change templates anytime without losing your content or formatting',
      icon: Grid3X3
    }
  ];

  const usageTips = [
    {
      template: 'Accent Templates',
      tip: 'Perfect for opening slides, section breaks, and key message highlights',
      icon: Sparkles
    },
    {
      template: 'Column Layouts',
      tip: 'Great for comparisons, feature lists, and organizing related information',
      icon: Columns
    },
    {
      template: 'Image & Text',
      tip: 'Ideal when you need to explain concepts with visual support',
      icon: Image
    },
    {
      template: 'Text-Focused',
      tip: 'Best for detailed explanations, introductions, and content-heavy slides',
      icon: Type
    }
  ];

  return (
    <>
      <PageSEO schemaType="FAQPage" schemaData={faqData} />
      <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Palette className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Slide Templates</h1>
            <p className="text-lg text-gray-600">14+ professional layouts for every presentation need</p>
          </div>
        </div>
      </div>

      {/* Template Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Template Features</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {templateFeatures.map((feature) => (
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

      {/* Template Categories */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-gray-900">Template Categories</h2>
        
        {templateCategories.map((category) => (
          <div key={category.title} className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <category.icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <span>{category.title}</span>
                  {category.popular && (
                    <Badge className="bg-blue-100 text-blue-800">Popular</Badge>
                  )}
                </h3>
                <p className="text-gray-600">{category.description}</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {category.templates.map((template) => (
                <Card key={template.name} className="bg-white/80 backdrop-blur-sm border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">{template.name}</CardTitle>
                    <CardDescription>{template.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-4 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <p className="text-sm text-gray-500 text-center italic">
                          {template.preview}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-1">Best for:</p>
                        <p className="text-sm text-gray-600">{template.useCase}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Usage Tips */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Usage Tips</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {usageTips.map((tip, index) => (
            <Card key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <tip.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{tip.template}</h4>
                    <p className="text-sm text-gray-600">{tip.tip}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Template Selection Process */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">How Templates Are Selected</h2>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-white">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Content Analysis</h4>
                  <p className="text-sm text-gray-600">AI analyzes your content type, length, and structure</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-white">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Template Matching</h4>
                  <p className="text-sm text-gray-600">System matches content characteristics to optimal layouts</p>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <span className="text-xl font-bold text-white">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Visual Variety</h4>
                  <p className="text-sm text-gray-600">Ensures diverse layouts throughout your presentation</p>
                </div>
              </div>
              
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Manual Override</h4>
                <p className="text-sm text-gray-600">
                  You can always change templates manually using the template selector in the slide editor. 
                  Your content will automatically adapt to the new layout while preserving all formatting.
                </p>
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
              <h3 className="font-semibold text-gray-900 mb-2">Explore Templates</h3>
              <p className="text-gray-600 mb-4">Start creating presentations to see all templates in action</p>
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
              <h3 className="font-semibold text-gray-900 mb-2">Learn About Themes</h3>
              <p className="text-gray-600 mb-4">Discover how to customize the visual appearance of your slides</p>
              <Link href="/docs-section/features/themes">
                <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-white/20">
                  Theme Guide
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
      </div>
    </>
  );
}
