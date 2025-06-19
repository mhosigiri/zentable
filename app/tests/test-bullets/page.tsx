'use client';

import { useState } from 'react';
import { SlideRenderer, SlideData } from '@/components/slides/SlideRenderer';

export default function TestBulletsPage() {
  const [slide, setSlide] = useState<SlideData>({
    id: 'test-bullets-1',
    templateType: 'bullets',
    title: 'Developing AI Skills: Learning Paths and Resources - GenAI Focus',
    bullets: [
      {
        title: 'Hands-On Experimentation',
        description: "Don't just read about GenAI - dive in and experiment with the technology yourself. Build prototypes, test different models, and learn through hands-on practice."
      },
      {
        title: 'Participate in Challenges',
        description: 'Join AI hackathons, coding competitions, or online challenges to put your skills to the test and learn from other participants.'
      },
      {
        title: 'Contribute to Open-Source',
        description: 'Get involved in open-source GenAI projects, where you can learn from experienced developers and gain practical experience.'
      },
      {
        title: 'Continuous Iteration',
        description: 'Adopt a mindset of continuous learning and iteration. Regularly experiment with new GenAI techniques, tools, and applications to expand your capabilities.'
      }
    ],
    conclusion: 'Developing AI skills is an ongoing journey. Beyond formal courses and tutorials, immersing yourself in the vibrant AI community, obtaining certifications, and maintaining a continuous learning mindset will help you stay ahead of the curve and position yourself as a sought-after AI professional.'
  });

  const handleSlideUpdate = (updates: Partial<SlideData>) => {
    setSlide(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Bullets Template Test</h1>
          <p className="text-gray-600">Testing the new Bullets template with 2x2 grid layout. Click any text to edit with TiptapEditor!</p>
        </div>
        
        <SlideRenderer 
          slide={slide}
          isEditable={true}
          onUpdate={handleSlideUpdate}
        />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            ✅ 2x2 Grid Layout | ✅ Editable with TiptapEditor | ✅ Numbered Bullets | ✅ Rich Text Formatting
          </p>
        </div>
      </div>
    </div>
  );
} 