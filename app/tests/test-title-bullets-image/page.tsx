'use client';

import { useState } from 'react';
import { TitleWithBulletsAndImage } from '@/components/slides/basic/TitleWithBulletsAndImage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function TestTitleBulletsImagePage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [imagePrompt, setImagePrompt] = useState('Modern electric car charging at a futuristic charging station');
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [slideData, setSlideData] = useState({
    id: 'test-slide',
    templateType: 'titleWithBulletsAndImage' as const,
    title: 'Future of Clean Transportation',
    bulletPoints: [
      'Electric vehicles reduce emissions by 60-70%',
      'Autonomous driving improves safety and efficiency',
      'Shared mobility reduces urban congestion',
      'Smart charging infrastructure enables grid stability'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1593941707882-a5bac6861d75?w=400&h=600&fit=crop',
    imagePrompt: 'Modern electric car charging at a futuristic charging station',
    isGenerating: false
  });

  const handleUpdate = (updates: any) => {
    setSlideData(prev => ({ ...prev, ...updates }));
  };

  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      alert('Please enter an image prompt');
      return;
    }

    console.log('🎨 Starting image generation with prompt:', imagePrompt);
    setIsGeneratingImage(true);
    setSlideData(prev => ({ ...prev, isGenerating: true, imagePrompt }));

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: imagePrompt,
          templateType: slideData.templateType
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
        setSlideData(prev => ({ 
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
      setSlideData(prev => ({ ...prev, isGenerating: false }));
    } finally {
      setIsGeneratingImage(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      <div className="container mx-auto p-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className={`text-2xl font-bold ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              TitleWithBulletsAndImage Template Test
            </h1>
            <Button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              variant="outline"
              className={theme === 'dark' ? 'border-gray-600 text-white hover:bg-gray-700' : ''}
            >
              Switch to {theme === 'light' ? 'Dark' : 'Light'} Theme
            </Button>
          </div>

          {/* Image Generation Controls */}
          <div className={`p-4 rounded-lg border ${
            theme === 'dark' 
              ? 'bg-gray-800 border-gray-600' 
              : 'bg-white border-gray-200'
          }`}>
            <Label htmlFor="image-prompt" className={`text-sm font-medium ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Generate New Image
            </Label>
            <div className="flex gap-2 mt-2">
              <Input
                id="image-prompt"
                value={imagePrompt}
                onChange={(e) => setImagePrompt(e.target.value)}
                placeholder="Enter image prompt..."
                className={`flex-1 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-white placeholder:text-gray-400' 
                    : ''
                }`}
              />
              <Button 
                onClick={generateImage}
                disabled={isGeneratingImage || !imagePrompt.trim()}
                className="min-w-[120px]"
              >
                {isGeneratingImage ? 'Generating...' : 'Generate'}
              </Button>
            </div>
            <p className={`text-xs mt-2 ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}>
              This will generate a new image using AI and replace the current image in all examples below.
            </p>
          </div>
        </div>

        <div className="grid gap-8">
          {/* Read-only Version */}
          <div>
            <h2 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Read-only Version
            </h2>
            <TitleWithBulletsAndImage
              {...slideData}
              theme={theme}
              isEditable={false}
            />
          </div>

          {/* Editable Version */}
          <div>
            <h2 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Editable Version
            </h2>
            <TitleWithBulletsAndImage
              {...slideData}
              theme={theme}
              isEditable={true}
              onUpdate={handleUpdate}
            />
          </div>

          {/* Loading State */}
          <div>
            <h2 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Loading State
            </h2>
            <TitleWithBulletsAndImage
              {...slideData}
              theme={theme}
              isGenerating={true}
            />
          </div>

          {/* Without Image (Error State) */}
          <div>
            <h2 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>
              Image Error State
            </h2>
            <TitleWithBulletsAndImage
              {...slideData}
              imageUrl="invalid-url"
              theme={theme}
              isEditable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 