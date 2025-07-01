import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { 
  Edit, 
  ArrowRight, 
  Type,
  Bot,
  Move,
  Copy,
  Trash2,
  Palette,
  Image,
  Keyboard,
  MousePointer
} from 'lucide-react';

export default function EditingSlidesPage() {
  const editingFeatures = [
    {
      title: 'Rich Text Editor',
      description: 'Professional text editing with formatting options',
      icon: Type,
      features: [
        'Bold, italic, underline formatting',
        'Text color and background color',
        'Font size and alignment options',
        'Bullet points and numbered lists',
        'Bubble menu for quick formatting'
      ]
    },
    {
      title: 'AI-Powered Editing',
      description: 'Intelligent assistance for content improvement',
      icon: Bot,
      features: [
        'Natural language slide modifications',
        'Content generation and enhancement',
        'Template and theme suggestions',
        'Image generation and replacement',
        'Conversational editing interface'
      ]
    },
    {
      title: 'Slide Management',
      description: 'Complete control over slide organization',
      icon: Move,
      features: [
        'Drag and drop reordering',
        'Duplicate slides with one click',
        'Delete unwanted slides',
        'Add new slides anywhere',
        'Bulk slide operations'
      ]
    }
  ];

  const editingMethods = [
    {
      method: 'Direct Text Editing',
      description: 'Click on any text to edit it directly',
      icon: Type,
      steps: [
        'Click on any text element in a slide',
        'Text becomes editable with cursor',
        'Type or modify content as needed',
        'Use formatting options from bubble menu',
        'Click outside to save changes'
      ]
    },
    {
      method: 'AI Assistant Chat',
      description: 'Use natural language to modify slides',
      icon: Bot,
      steps: [
        'Open the AI assistant sidebar',
        'Describe what you want to change',
        'AI proposes specific modifications',
        'Review and approve the changes',
        'Changes apply automatically to slides'
      ]
    },
    {
      method: 'Template Switching',
      description: 'Change slide layouts without losing content',
      icon: Palette,
      steps: [
        'Select the slide you want to modify',
        'Open template selector from toolbar',
        'Choose a new template layout',
        'Content automatically adapts to new layout',
        'Fine-tune positioning if needed'
      ]
    }
  ];

  const keyboardShortcuts = [
    { category: 'Text Formatting', shortcuts: [
      { key: 'Ctrl/Cmd + B', action: 'Bold text' },
      { key: 'Ctrl/Cmd + I', action: 'Italic text' },
      { key: 'Ctrl/Cmd + U', action: 'Underline text' },
      { key: 'Ctrl/Cmd + Z', action: 'Undo changes' },
      { key: 'Ctrl/Cmd + Y', action: 'Redo changes' }
    ]},
    { category: 'Slide Management', shortcuts: [
      { key: 'Ctrl/Cmd + D', action: 'Duplicate slide' },
      { key: 'Delete', action: 'Delete selected slide' },
      { key: 'Ctrl/Cmd + N', action: 'Add new slide' },
      { key: 'Arrow Keys', action: 'Navigate between slides' }
    ]},
    { category: 'Navigation', shortcuts: [
      { key: 'Tab', action: 'Move to next editable element' },
      { key: 'Shift + Tab', action: 'Move to previous element' },
      { key: 'Escape', action: 'Exit editing mode' }
    ]}
  ];

  const collaborationFeatures = [
    {
      title: 'Real-time Sync',
      description: 'Changes save automatically to the cloud',
      icon: Move,
      details: 'All edits are saved to localStorage immediately and synced to the database within 5 seconds'
    },
    {
      title: 'Version History',
      description: 'Track changes and revert if needed',
      icon: Copy,
      details: 'Undo/redo functionality preserves your editing history during the session'
    },
    {
      title: 'AI Collaboration',
      description: 'Work alongside AI for enhanced productivity',
      icon: Bot,
      details: 'AI assistant understands your presentation context and provides relevant suggestions'
    }
  ];

  const tips = [
    {
      title: 'Use the Bubble Menu',
      content: 'Select text to see formatting options appear automatically - much faster than toolbar buttons'
    },
    {
      title: 'AI Assistant Context',
      content: 'The AI understands your entire presentation, so you can reference other slides in your requests'
    },
    {
      title: 'Template Flexibility',
      content: 'Don\'t hesitate to switch templates - your content will adapt automatically without data loss'
    },
    {
      title: 'Keyboard Navigation',
      content: 'Use Tab to quickly move between editable elements without reaching for the mouse'
    }
  ];

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Edit className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editing Slides</h1>
            <p className="text-lg text-gray-600">Master the art of slide editing with rich text tools and AI assistance</p>
          </div>
        </div>
      </div>

      {/* Editing Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Editing Features</h2>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {editingFeatures.map((feature) => (
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
                <ul className="space-y-2">
                  {feature.features.map((item, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Editing Methods */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">How to Edit Slides</h2>
        
        <div className="space-y-8">
          {editingMethods.map((method) => (
            <Card key={method.method} className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <method.icon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{method.method}</CardTitle>
                    <CardDescription>{method.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {method.steps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-medium text-blue-600">{index + 1}</span>
                      </div>
                      <span className="text-sm text-gray-600">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Keyboard Shortcuts</h2>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {keyboardShortcuts.map((category) => (
            <Card key={category.category} className="bg-white/80 backdrop-blur-sm border-0">
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <Keyboard className="w-5 h-5 mr-2 text-blue-600" />
                  {category.category}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">{shortcut.action}</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {shortcut.key}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Collaboration Features */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Collaboration & Sync</h2>
        
        <div className="grid md:grid-cols-3 gap-6">
          {collaborationFeatures.map((feature) => (
            <Card key={feature.title} className="bg-white/80 backdrop-blur-sm border-0">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{feature.description}</p>
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-blue-800">{feature.details}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
                    <MousePointer className="w-5 h-5 text-white" />
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
              <h3 className="font-semibold text-gray-900 mb-2">Start Editing</h3>
              <p className="text-gray-600 mb-4">Create a presentation and try out the editing features</p>
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
              <h3 className="font-semibold text-gray-900 mb-2">Learn AI Assistant</h3>
              <p className="text-gray-600 mb-4">Discover how to use AI for advanced slide editing</p>
              <Link href="/docs-section/features/ai-assistant">
                <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-white/20">
                  AI Assistant Guide
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
