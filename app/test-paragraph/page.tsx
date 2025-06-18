'use client';

import { useState } from 'react';
import { SlideRenderer, SlideData } from '@/components/slides/SlideRenderer';

export default function TestParagraphPage() {
  const [slide, setSlide] = useState<SlideData>({
    id: 'test-paragraph-1',
    templateType: 'paragraph',
    title: 'Monetization Strategies for Your Web Development Skills',
    sections: [
      {
        heading: 'Freelance Projects',
        paragraphs: [
          'Start with small gigs on platforms like Upwork or Fiverr.',
          'Build reputation through consistent quality delivery.'
        ]
      },
      {
        heading: 'Template Sales',
        paragraphs: [
          'Create reusable website templates with AI assistance.',
          'Sell them on marketplaces like ThemeForest.'
        ]
      },
      {
        heading: 'Knowledge Sharing',
        paragraphs: [
          'Document your AI development journey.',
          'Monetize through tutorials, courses, or affiliate links.'
        ]
      }
    ],
    conclusion: 'Your portfolio site becomes your most powerful sales tool. Track metrics to understand what attracts potential clients.'
  });

  const handleSlideUpdate = (updates: Partial<SlideData>) => {
    setSlide(prev => ({ ...prev, ...updates }));
    console.log('Slide updated:', updates);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Paragraph Template Test</h1>
          <p className="text-gray-600">Testing the new Paragraph template with sections, headings, and body text. Click any text to edit with TiptapEditor!</p>
        </div>
        
        <SlideRenderer 
          slide={slide}
          isEditable={true}
          onUpdate={handleSlideUpdate}
        />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            ✅ Section-Based Layout | ✅ Editable with TiptapEditor | ✅ Multiple Paragraphs | ✅ Rich Text Formatting
          </p>
        </div>
      </div>
    </div>
  );
} 