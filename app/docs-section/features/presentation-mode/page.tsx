import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Monitor, 
  ArrowRight, 
  Eye,
  Maximize,
  Navigation,
  Keyboard,
  MousePointer,
  Settings
} from 'lucide-react';

export default function PresentationModePage() {
  const presentationModes = [
    {
      title: 'Presenter View',
      description: 'Professional presentation mode with controls and navigation',
      icon: Eye,
      features: [
        'Visible header with presentation title and slide counter',
        'Navigation controls (Previous/Next buttons)',
        'Mode switching dropdown',
        'Exit button for easy return to editing',
        'Smooth slide transitions with animations'
      ],
      useCase: 'Best for: Live presentations, teaching, meetings where you need controls'
    },
    {
      title: 'Full Screen Mode',
      description: 'Immersive full-screen experience with minimal UI',
      icon: Maximize,
      features: [
        'Edge-to-edge slide display',
        'Hidden controls (appear on hover)',
        'Click navigation zones (left/right thirds of screen)',
        'Minimal slide counter (bottom right)',
        'Distraction-free viewing experience'
      ],
      useCase: 'Best for: Audience viewing, kiosk displays, distraction-free presentations'
    }
  ];

  const keyboardShortcuts = [
    { key: 'Space / Arrow Right / Arrow Down', action: 'Next slide' },
    { key: 'Backspace / Arrow Left / Arrow Up', action: 'Previous slide' },
    { key: 'Escape', action: 'Exit presentation mode' },
    { key: 'F11', action: 'Toggle browser fullscreen (recommended)' }
  ];

  const navigationMethods = [
    {
      method: 'Keyboard Navigation',
      description: 'Use arrow keys, space, or backspace to navigate',
      icon: Keyboard,
      details: 'Works in both presenter and fullscreen modes'
    },
    {
      method: 'Click Navigation',
      description: 'Click left/right areas of screen to navigate',
      icon: MousePointer,
      details: 'Left third = previous, right third = next slide'
    },
    {
      method: 'Button Controls',
      description: 'Use Previous/Next buttons in presenter view',
      icon: Navigation,
      details: 'Visible controls with slide counter display'
    }
  ];

  const tips = [
    {
      title: 'Browser Fullscreen',
      content: 'Press F11 before starting presentation mode for the best full-screen experience'
    },
    {
      title: 'Smooth Transitions',
      content: 'Slides animate smoothly between transitions - wait for animations to complete'
    },
    {
      title: 'Theme Preservation',
      content: 'Your selected theme is maintained in presentation mode with proper background rendering'
    },
    {
      title: 'Quick Exit',
      content: 'Press Escape key anytime to quickly exit presentation mode and return to editing'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Presentation Mode</h1>
            <p className="text-lg text-gray-600">Full-screen presenting with professional controls and navigation</p>
          </div>
        </div>
      </div>

      {/* Presentation Modes */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Presentation Modes</h2>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {presentationModes.map((mode) => (
            <Card key={mode.title} className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <mode.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{mode.title}</CardTitle>
                    <CardDescription>{mode.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Features:</h4>
                    <ul className="space-y-2">
                      {mode.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-2">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-blue-800 font-medium">{mode.useCase}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Navigation Methods */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Navigation Methods</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {navigationMethods.map((method) => (
            <Card key={method.method} className="bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <method.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{method.method}</h3>
                <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                <div className="bg-gray-50 rounded-lg p-2">
                  <p className="text-xs text-gray-700">{method.details}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Keyboard Shortcuts</h2>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              {keyboardShortcuts.map((shortcut, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{shortcut.action}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <Badge variant="outline" className="font-mono text-xs">
                      {shortcut.key}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* How to Start Presentation */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">How to Start Presentation Mode</h2>
        
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardContent className="p-6">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">1</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Open Presentation</h4>
                <p className="text-sm text-gray-600">Navigate to your presentation in the editor</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">2</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Click Present Button</h4>
                <p className="text-sm text-gray-600">Find the presentation button in the toolbar</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">3</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Choose Mode</h4>
                <p className="text-sm text-gray-600">Select presenter view or fullscreen mode</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-white">4</span>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">Start Presenting</h4>
                <p className="text-sm text-gray-600">Navigate through slides using keyboard or mouse</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips & Best Practices */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Tips & Best Practices</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {tips.map((tip, index) => (
            <Card key={index} className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Settings className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{tip.title}</h4>
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
              <h3 className="font-semibold text-gray-900 mb-2">Try Presentation Mode</h3>
              <p className="text-gray-600 mb-4">Create a presentation and test the presentation features</p>
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
              <h3 className="font-semibold text-gray-900 mb-2">Learn About Export</h3>
              <p className="text-gray-600 mb-4">Discover how to export presentations for sharing</p>
              <Link href="/docs-section/features/export">
                <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-white/20">
                  Export Guide
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
