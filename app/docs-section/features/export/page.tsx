import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Download, 
  ArrowRight, 
  FileText,
  Share2,
  Settings,
  CheckCircle,
  AlertCircle,
  Lightbulb
} from 'lucide-react';

export default function ExportPage() {
  const exportFeatures = [
    {
      title: 'PDF Export',
      description: 'High-quality PDF generation with theme preservation',
      icon: FileText,
      features: [
        'Maintains all theme styling and backgrounds',
        'High-resolution output (1600x900 pixels)',
        'Proper slide aspect ratio (16:9)',
        'Automatic filename generation from presentation title',
        'JPEG compression for optimal file size'
      ],
      status: 'Available'
    },
    {
      title: 'Presentation Mode',
      description: 'Full-screen presenting directly in the browser',
      icon: Settings,
      features: [
        'Presenter view with controls',
        'Full-screen distraction-free mode',
        'Keyboard and mouse navigation',
        'Smooth slide transitions',
        'Theme-aware background rendering'
      ],
      status: 'Available'
    },
    {
      title: 'Sharing Options',
      description: 'Share presentations with others',
      icon: Share2,
      features: [
        'Public presentation URLs',
        'View-only sharing links',
        'Embed codes for websites',
        'Social media sharing',
        'Collaboration invites'
      ],
      status: 'Coming Soon'
    }
  ];

  const exportProcess = [
    {
      step: 1,
      title: 'Open Your Presentation',
      description: 'Navigate to the presentation you want to export in the editor'
    },
    {
      step: 2,
      title: 'Click Export Button',
      description: 'Find the export/download button in the presentation toolbar'
    },
    {
      step: 3,
      title: 'Choose Export Format',
      description: 'Select PDF export (more formats coming soon)'
    },
    {
      step: 4,
      title: 'Download File',
      description: 'Your presentation will be processed and downloaded automatically'
    }
  ];

  const tips = [
    {
      type: 'success',
      title: 'Theme Preservation',
      content: 'All themes, including gradients, waves, and glass effects, are perfectly preserved in PDF exports'
    },
    {
      type: 'info',
      title: 'File Naming',
      content: 'PDFs are automatically named based on your presentation title with special characters replaced by underscores'
    },
    {
      type: 'warning',
      title: 'Processing Time',
      content: 'Large presentations with many slides may take a few moments to process - please be patient'
    }
  ];

  const technicalDetails = [
    {
      aspect: 'Resolution',
      detail: '1600x900 pixels per slide (16:9 aspect ratio)'
    },
    {
      aspect: 'Format',
      detail: 'PDF with JPEG image compression at 95% quality'
    },
    {
      aspect: 'Rendering',
      detail: 'HTML to Canvas conversion with theme background preservation'
    },
    {
      aspect: 'File Size',
      detail: 'Optimized compression for reasonable file sizes while maintaining quality'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Download className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Export & Sharing</h1>
            <p className="text-lg text-gray-600">Download presentations and share them with others</p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Export Options</h2>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {exportFeatures.map((option) => (
            <Card key={option.title} className="bg-white/80 backdrop-blur-sm border-0 relative">
              <div className="absolute -top-2 right-4">
                <Badge className={
                  option.status === 'Available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }>
                  {option.status}
                </Badge>
              </div>
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <option.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{option.title}</CardTitle>
                    <CardDescription>{option.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {option.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Export Process */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">How to Export</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {exportProcess.map((step) => (
            <Card key={step.step} className="bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">{step.step}</span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Technical Details */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Technical Details</h2>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {technicalDetails.map((detail, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <h4 className="font-semibold text-gray-900">{detail.aspect}:</h4>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">{detail.detail}</p>
                  </div>
                </div>
              ))}
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

      {/* Coming Soon Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Coming Soon</h2>
        
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Planned Export Features</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Additional Formats:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• PowerPoint (PPTX) export</li>
                  <li>• Google Slides integration</li>
                  <li>• HTML export for web embedding</li>
                  <li>• Image sequence (PNG/JPG)</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Sharing Options:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Public presentation URLs</li>
                  <li>• Password-protected sharing</li>
                  <li>• Embed codes for websites</li>
                  <li>• Real-time collaboration</li>
                </ul>
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
              <h3 className="font-semibold text-gray-900 mb-2">Try PDF Export</h3>
              <p className="text-gray-600 mb-4">Create a presentation and test the PDF export feature</p>
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
              <h3 className="font-semibold text-gray-900 mb-2">Learn Presentation Mode</h3>
              <p className="text-gray-600 mb-4">Discover how to present directly in the browser</p>
              <Link href="/docs-section/features/presentation-mode">
                <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-white/20">
                  Presentation Guide
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
