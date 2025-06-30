'use client';

import { useState } from 'react';
import { AccentLeft } from '@/components/slides/basic/AccentLeft';
import { AccentRight } from '@/components/slides/basic/AccentRight';
import { AccentTop } from '@/components/slides/basic/AccentTop';
import { AccentBackground } from '@/components/slides/basic/AccentBackground';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemedLayout } from '@/components/ui/themed-layout';

type AccentTemplate = 'accent-left' | 'accent-right' | 'accent-top' | 'accent-background';

export default function TestAccentPage() {
  const { currentTheme } = useTheme();
  const [selectedTemplate, setSelectedTemplate] = useState<AccentTemplate>('accent-left');

  const templates = [
    {
      id: 'accent-left' as AccentTemplate,
      name: 'Accent Left',
      description: 'Image on left (full cover), content on right',
      component: AccentLeft,
      inAI: true,
    },
    {
      id: 'accent-right' as AccentTemplate,
      name: 'Accent Right', 
      description: 'Content on left, image on right (full cover)',
      component: AccentRight,
      inAI: true,
    },
    {
      id: 'accent-top' as AccentTemplate,
      name: 'Accent Top',
      description: 'Image on top (full cover), content below',
      component: AccentTop,
      inAI: true,
    },
    {
      id: 'accent-background' as AccentTemplate,
      name: 'Accent Background',
      description: 'Image as background with content overlay',
      component: AccentBackground,
      inAI: false,
    },
  ];

  const sampleData = {
    id: 'test-accent',
    templateType: selectedTemplate,
    content: `<h1>AI-Powered Development Revolution</h1>
<p>Transform your development workflow with cutting-edge AI tools that streamline coding, enhance productivity, and unlock new possibilities for innovation.</p>
<ul>
  <li>Accelerate development with intelligent code generation</li>
  <li>Enhance code quality through AI-powered reviews</li>
  <li>Streamline debugging with smart error detection</li>
  <li>Automate testing and deployment processes</li>
</ul>`,
    imageUrl: 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=800',
    imagePrompt: 'Modern developer workspace with multiple monitors showing code, AI interface, and futuristic technology elements',
    isEditable: true,
    theme: 'light' as const
  };

  const SelectedComponent = templates.find(t => t.id === selectedTemplate)?.component || AccentLeft;

  return (
    <ThemedLayout>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Test: Accent Slide Templates
            </h1>
            <p className="text-gray-600 mb-6">
              Testing all accent slide templates with image layouts and different content arrangements.
            </p>

            {/* Template Selector */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-all ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{template.name}</h3>
                    <div className="flex gap-1">
                      {template.inAI && (
                        <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                          AI
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">{template.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Slide Preview */}
          <div className="bg-white rounded-lg shadow-lg p-8 min-h-[600px] mb-8">
            <SelectedComponent {...sampleData} />
          </div>

          {/* Template Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-4 text-gray-900">Template Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Template ID:</span>
                  <span className="text-gray-600">{selectedTemplate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">AI Integration:</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    templates.find(t => t.id === selectedTemplate)?.inAI 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {templates.find(t => t.id === selectedTemplate)?.inAI ? 'Enabled' : 'Manual Only'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Image Handling:</span>
                  <span className="text-gray-600">
                    {selectedTemplate === 'accent-background' ? 'Background Cover' : 'Object Cover'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-gray-700">Content Support:</span>
                  <span className="text-gray-600">Text & Bullets</span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-4 text-gray-900">Usage Guidelines</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Accent templates emphasize visual content with prominent image placement</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>AI-enabled templates automatically generate appropriate images</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Content adapts between bullet points and paragraphs based on context</span>
                </li>
                <li className="flex items-start">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <span>Different aspect ratios optimize images for each layout type</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Sample Content Variations */}
          <div className="mt-8 p-6 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-4 text-gray-900">Sample Content</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Image Prompt:</h4>
                <p className="text-gray-600 italic">&quot;{sampleData.imagePrompt}&quot;</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Image URL:</h4>
                <p className="text-gray-600 italic text-xs break-all">{sampleData.imageUrl}</p>
              </div>
              <div className="md:col-span-2">
                <h4 className="font-medium text-gray-700 mb-2">Unified Content (HTML):</h4>
                <div className="text-gray-600 italic text-xs p-3 bg-gray-100 rounded border overflow-auto max-h-32">
                  <pre>{sampleData.content}</pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ThemedLayout>
  );
} 