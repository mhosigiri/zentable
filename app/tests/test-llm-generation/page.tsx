'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { SlideRenderer } from '@/components/slides/SlideRenderer';
import { ThemedLayout } from '@/components/ui/themed-layout';
import { Loader2, RefreshCw } from 'lucide-react';

interface GeneratedSlide {
  id: string;
  templateType: string;
  content?: string;
  imageUrl?: string;
  imagePrompt?: string;
  isGenerating?: boolean;
  isGeneratingImage?: boolean;
}

const TEMPLATE_TYPES = [
  { id: 'blank-card', name: 'Blank Card', hasImage: false },
  { id: 'title-with-bullets', name: 'Title with Bullets', hasImage: false },
  { id: 'title-with-text', name: 'Title with Text', hasImage: false },
  { id: 'paragraph', name: 'Paragraph', hasImage: false },
  { id: 'bullets', name: 'Bullets (2x2 Grid)', hasImage: false },
  { id: 'two-columns', name: 'Two Columns', hasImage: false },
  { id: 'two-column-with-headings', name: 'Two Columns with Headings', hasImage: false },
  { id: 'three-columns', name: 'Three Columns', hasImage: false },
  { id: 'three-column-with-headings', name: 'Three Columns with Headings', hasImage: false },
  { id: 'four-columns', name: 'Four Columns', hasImage: false },
  { id: 'four-columns-with-headings', name: 'Four Columns with Headings', hasImage: false },
  { id: 'image-and-text', name: 'Image and Text', hasImage: true },
  { id: 'text-and-image', name: 'Text and Image', hasImage: true },
  { id: 'title-with-bullets-and-image', name: 'Title with Bullets and Image', hasImage: true },
  { id: 'accent-left', name: 'Accent Left', hasImage: true },
  { id: 'accent-right', name: 'Accent Right', hasImage: true },
  { id: 'accent-top', name: 'Accent Top', hasImage: true },
  { id: 'accent-background', name: 'Accent Background', hasImage: true },
];

const TEST_TOPICS = [
  {
    title: 'Artificial Intelligence Revolution',
    points: ['Machine learning breakthroughs', 'Automation impact', 'Ethical considerations', 'Future applications']
  },
  {
    title: 'Sustainable Energy Solutions',
    points: ['Solar power advancement', 'Wind energy efficiency', 'Battery technology', 'Grid modernization']
  },
  {
    title: 'Space Exploration Milestones',
    points: ['Mars missions', 'Commercial spaceflight', 'Satellite technology', 'Deep space research']
  },
  {
    title: 'Digital Transformation',
    points: ['Cloud computing', 'Remote work evolution', 'Cybersecurity challenges', 'Data analytics']
  },
  {
    title: 'Climate Change Solutions',
    points: ['Carbon reduction strategies', 'Renewable energy adoption', 'Environmental policies', 'Green technologies']
  }
];

export default function TestLLMGenerationPage() {
  const [slides, setSlides] = useState<GeneratedSlide[]>([]);
  const [generatingSlides, setGeneratingSlides] = useState<Set<string>>(new Set());
  const [selectedTopic, setSelectedTopic] = useState(TEST_TOPICS[0]);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);

  const generateSlide = async (templateType: string, topicOverride?: typeof TEST_TOPICS[0]) => {
    const topic = topicOverride || selectedTopic;
    const slideId = `${templateType}-${Date.now()}`;
    
    // Add slide with generating state
    const newSlide: GeneratedSlide = {
      id: slideId,
      templateType,
      isGenerating: true,
    };
    
    setSlides(prev => [...prev.filter(s => s.templateType !== templateType), newSlide]);
    setGeneratingSlides(prev => new Set([...prev, templateType]));

    try {
      // Generate slide content
      const slideResponse = await fetch('/api/generate-slide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionTitle: topic.title,
          bulletPoints: topic.points,
          templateType,
          style: 'modern',
          language: 'en'
        }),
      });

      if (!slideResponse.ok) {
        throw new Error('Failed to generate slide');
      }

      const reader = slideResponse.body?.getReader();
      if (!reader) throw new Error('No reader available');

      let slideData: any = {};
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = new TextDecoder().decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              slideData = { ...slideData, ...data };
            } catch (e) {
              // Ignore parsing errors for partial data
            }
          }
        }
      }

      // Update slide with content
      const hasImage = TEMPLATE_TYPES.find(t => t.id === templateType)?.hasImage;
      const updatedSlide: GeneratedSlide = {
        ...newSlide,
        ...slideData,
        isGenerating: false,
        isGeneratingImage: hasImage && slideData.imagePrompt ? true : false,
      };

      setSlides(prev => prev.map(s => s.id === slideId ? updatedSlide : s));

      // Generate image if needed
      if (hasImage && slideData.imagePrompt) {
        try {
          const imageResponse = await fetch('/api/generate-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: slideData.imagePrompt,
              templateType,
            }),
          });

          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            setSlides(prev => prev.map(s => 
              s.id === slideId 
                ? { ...s, imageUrl: imageData.imageUrl, isGeneratingImage: false }
                : s
            ));
          } else {
            setSlides(prev => prev.map(s => 
              s.id === slideId ? { ...s, isGeneratingImage: false } : s
            ));
          }
        } catch (error) {
          console.error('Image generation failed:', error);
          setSlides(prev => prev.map(s => 
            s.id === slideId ? { ...s, isGeneratingImage: false } : s
          ));
        }
      }

    } catch (error) {
      console.error('Slide generation failed:', error);
      setSlides(prev => prev.map(s => 
        s.id === slideId 
          ? { ...s, isGenerating: false, content: '<h1>Generation Failed</h1><p>Error generating slide content.</p>' }
          : s
      ));
    } finally {
      setGeneratingSlides(prev => {
        const newSet = new Set(prev);
        newSet.delete(templateType);
        return newSet;
      });
    }
  };

  const generateAllSlides = async () => {
    setIsGeneratingAll(true);
    setSlides([]);
    
    // Generate slides sequentially to avoid overwhelming the API
    for (let i = 0; i < TEMPLATE_TYPES.length; i++) {
      const template = TEMPLATE_TYPES[i];
      const topic = TEST_TOPICS[i % TEST_TOPICS.length]; // Cycle through topics
      await generateSlide(template.id, topic);
      
      // Small delay between generations
      if (i < TEMPLATE_TYPES.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    setIsGeneratingAll(false);
  };

  const clearSlides = () => {
    setSlides([]);
  };

  return (
    <ThemedLayout>
      <div className="min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Test: LLM Slide Generation
            </h1>
            <p className="text-gray-600 mb-6">
              Test all slide templates with AI-generated content and images. This helps verify the complete LLM integration pipeline.
            </p>

            {/* Topic Selector */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3">Select Test Topic:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {TEST_TOPICS.map((topic, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTopic(topic)}
                    className={`p-3 rounded-lg border text-left transition-all text-sm ${
                      selectedTopic === topic
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                    }`}
                  >
                    <div className="font-medium text-gray-900 mb-1">{topic.title}</div>
                    <div className="text-xs text-gray-500">
                      {topic.points.length} key points
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap gap-4 mb-8">
              <Button
                onClick={generateAllSlides}
                disabled={isGeneratingAll}
                size="lg"
                className="flex items-center gap-2"
              >
                {isGeneratingAll ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                Generate All Templates ({TEMPLATE_TYPES.length})
              </Button>
              
              <Button
                onClick={clearSlides}
                variant="outline"
                size="lg"
                disabled={isGeneratingAll}
              >
                Clear All Slides
              </Button>
            </div>

            {/* Progress */}
            {(isGeneratingAll || generatingSlides.size > 0) && (
              <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="font-medium text-blue-900">
                    {isGeneratingAll ? 'Generating all slides...' : 'Generating slides...'}
                  </span>
                </div>
                <div className="text-sm text-blue-700">
                  Generated: {slides.filter(s => !s.isGenerating).length} / {TEMPLATE_TYPES.length} templates
                </div>
                {generatingSlides.size > 0 && (
                  <div className="text-xs text-blue-600 mt-1">
                    Currently generating: {Array.from(generatingSlides).join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Template Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {TEMPLATE_TYPES.map((template) => {
              const slide = slides.find(s => s.templateType === template.id);
              const isGenerating = generatingSlides.has(template.id);

              return (
                <Card key={template.id} className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-gray-900">{template.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-gray-500">Template: {template.id}</span>
                        {template.hasImage && (
                          <span className="px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                            Image
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      onClick={() => generateSlide(template.id)}
                      disabled={isGenerating || isGeneratingAll}
                      size="sm"
                      variant="outline"
                    >
                      {isGenerating ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        'Generate'
                      )}
                    </Button>
                  </div>

                  <div className="bg-gray-50 rounded-lg min-h-[300px] flex items-center justify-center">
                    {slide ? (
                      <div className="w-full h-full">
                        <SlideRenderer
                          slide={slide}
                          isEditable={false}
                        />
                      </div>
                    ) : (
                      <div className="text-center text-gray-500">
                        <div className="w-16 h-16 bg-gray-200 rounded-lg mx-auto mb-3 flex items-center justify-center">
                          <span className="text-2xl opacity-60">📄</span>
                        </div>
                        <p className="text-sm">Click Generate to create slide</p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Stats */}
          {slides.length > 0 && (
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-4 text-gray-900">Generation Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">Total Generated:</span>
                  <span className="ml-2 text-gray-600">{slides.length}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">With Images:</span>
                  <span className="ml-2 text-gray-600">
                    {slides.filter(s => s.imageUrl).length}
                  </span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Currently Generating:</span>
                  <span className="ml-2 text-gray-600">{generatingSlides.size}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Success Rate:</span>
                  <span className="ml-2 text-gray-600">
                    {slides.length > 0 ? Math.round((slides.filter(s => s.content && !s.content.includes('Generation Failed')).length / slides.length) * 100) : 0}%
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ThemedLayout>
  );
} 