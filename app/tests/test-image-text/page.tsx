'use client';

import { useState } from 'react';
import { SlideRenderer, SlideData } from '@/components/slides/SlideRenderer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestImageTextPage() {
  const [imagePrompt, setImagePrompt] = useState('Space debris and satellites floating in orbit around Earth with a purple cosmic background');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [slide, setSlide] = useState<SlideData>({
    id: 'test-image-text-1',
    templateType: 'image-and-text',
    title: 'The Growing Challenge of Space Debris',
    content: 'Space debris, also known as orbital debris, refers to man-made objects in orbit around Earth that no longer serve a useful function. This includes defunct satellites, spent rocket stages, and fragments from collisions or explosions. The increasing amount of debris poses a significant threat to active satellites and future space missions, necessitating urgent solutions for tracking, removal, and prevention.',
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=600&fit=crop&auto=format',
    imagePrompt: 'Space debris and satellites floating in orbit around Earth with a purple cosmic background',
    isGenerating: false
  });

  const handleSlideUpdate = (updates: Partial<SlideData>) => {
    setSlide(prev => ({ ...prev, ...updates }));
    console.log('Slide updated:', updates);
  };

  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      alert('Please enter an image prompt');
      return;
    }

    console.log('🎨 Starting image generation with prompt:', imagePrompt);
    setIsGeneratingImage(true);
    setSlide(prev => ({ ...prev, isGenerating: true, imagePrompt }));

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: imagePrompt,
          templateType: slide.templateType
        }),
      });

      console.log('📡 API Response status:', response.status);
      const data = await response.json();
      console.log('📦 API Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (data.imageUrl) {
        console.log('✅ Image generated successfully, updating slide data');
        setSlide(prev => ({ 
          ...prev, 
          imageUrl: data.imageUrl, 
          imagePrompt: data.prompt,
          isGenerating: false 
        }));
      } else {
        throw new Error('No image URL received from API');
      }
    } catch (error) {
      console.error('❌ Image generation error:', error);
      alert(`Failed to generate image: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setSlide(prev => ({ ...prev, isGenerating: false }));
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Image and Text Template Test</h1>
          <p className="text-gray-600 mb-6">Testing the updated Image and Text template with image on left and content on right. Click any text to edit with TiptapEditor!</p>
          
          {/* Image Generation Controls */}
          <div className="p-4 rounded-lg border bg-white border-gray-200 mb-6">
            <Label htmlFor="image-text-prompt" className="text-sm font-medium text-gray-900">
              Generate New Image
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="image-text-prompt"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Enter image prompt..."
                className="flex-1"
              />
              <Button 
                onClick={generateImage}
                disabled={isGeneratingImage || !imagePrompt.trim()}
                className="min-w-[120px]"
              >
                {isGeneratingImage ? 'Generating...' : 'Generate'}
              </Button>
            </div>
            <p className="text-xs mt-2 text-gray-500">
              This will generate a new image using AI and replace the current image.
            </p>
          </div>
        </div>
        
        <SlideRenderer 
          slide={slide}
          isEditable={true}
          onUpdate={handleSlideUpdate}
        />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            ✅ Image Left, Text Right | ✅ Editable with TiptapEditor | ✅ Large Title | ✅ Rich Text Formatting
          </p>
        </div>
      </div>
    </div>
  );
} 