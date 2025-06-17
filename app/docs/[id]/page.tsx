'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { SlideRenderer, SlideData } from '@/components/slides/SlideRenderer';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw,
  Download,
  Share2,
  Loader2
} from 'lucide-react';

interface OutlineSection {
  id: string;
  title: string;
  bulletPoints: string[];
  templateType: string;
}

interface GeneratedOutline {
  title: string;
  sections: OutlineSection[];
}

interface DocumentData {
  id: string;
  prompt: string;
  cardCount: number;
  style: string;
  language: string;
  createdAt: string;
  status: string;
  outline?: GeneratedOutline;
}

export default function PresentationPage() {
  const params = useParams();
  const documentId = params.id as string;
  
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingSlideIndex, setGeneratingSlideIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  // Load document data from localStorage
  useEffect(() => {
    const loadDocumentData = () => {
      const stored = localStorage.getItem(`document_${documentId}`);
      if (stored) {
        const data: DocumentData = JSON.parse(stored);
        setDocumentData(data);
        
        if (data.outline) {
          initializeSlides(data.outline, data.cardCount);
        }
      }
    };

    loadDocumentData();
  }, [documentId]);

  // Initialize slides from outline - only create the requested number of slides
  const initializeSlides = (outline: GeneratedOutline, requestedCount: number) => {
    // Only create slides from sections, no automatic title slide
    // Take only the requested number of sections
    const sectionsToUse = outline.sections.slice(0, requestedCount);
    
    const sectionSlides: SlideData[] = sectionsToUse.map((section, index) => ({
      id: section.id,
      templateType: section.templateType,
      title: section.title,
      bulletPoints: section.bulletPoints,
      isGenerating: true
    }));

    setSlides(sectionSlides);
    
    // Start generating slides
    generateAllSlides(sectionsToUse, sectionSlides);
  };

  // Generate all slides sequentially
  const generateAllSlides = async (sections: OutlineSection[], initialSlides: SlideData[]) => {
    setIsGenerating(true);
    
    for (let i = 0; i < initialSlides.length; i++) {
      const section = sections[i];
      setGeneratingSlideIndex(i);
      
      try {
        await generateSlide(section, i);
      } catch (error) {
        console.error(`Error generating slide ${i}:`, error);
        // Continue with next slide even if one fails
      }
    }
    
    setIsGenerating(false);
    setGeneratingSlideIndex(-1);
  };

  // Generate individual slide
  const generateSlide = async (section: OutlineSection, slideIndex: number) => {
    try {
      const response = await fetch('/api/generate-slide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sectionTitle: section.title,
          bulletPoints: section.bulletPoints,
          templateType: section.templateType,
          style: documentData?.style || 'default',
          language: documentData?.language || 'en',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate slide');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const streamData = JSON.parse(line.slice(6));
              console.log('Received slide data:', streamData);
              
              // Update the slide with the latest partial data
              setSlides(prevSlides => 
                prevSlides.map((slide, index) => 
                  index === slideIndex 
                    ? { 
                        ...slide, 
                        ...streamData,
                        isGenerating: false
                      }
                    : slide
                )
              );

              // If slide has imagePrompt, generate image
              if (streamData.imagePrompt && !streamData.imageUrl) {
                generateSlideImage(streamData.imagePrompt, slideIndex);
              }
            } catch (e) {
              console.error('Error parsing slide data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating slide:', error);
      // Mark slide as failed
      setSlides(prevSlides => 
        prevSlides.map((slide, index) => 
          index === slideIndex 
            ? { 
                ...slide, 
                isGenerating: false,
                title: section.title,
                bulletPoints: section.bulletPoints
              }
            : slide
        )
      );
    }
  };

  // Generate image for slide
  const generateSlideImage = async (imagePrompt: string, slideIndex: number) => {
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: imagePrompt }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate image');
      }

      const { imageUrl } = await response.json();
      
      // Update slide with generated image
      setSlides(prevSlides => 
        prevSlides.map((slide, index) => 
          index === slideIndex 
            ? { ...slide, imageUrl }
            : slide
        )
      );
    } catch (error) {
      console.error('Error generating image:', error);
    }
  };

  // Update slide content
  const updateSlideContent = (slideIndex: number, updates: Partial<SlideData>) => {
    setSlides(prevSlides => 
      prevSlides.map((slide, index) => 
        index === slideIndex 
          ? { ...slide, ...updates }
          : slide
      )
    );
  };

  if (!documentData || slides.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading presentation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-semibold text-gray-900 truncate max-w-md">
              {documentData.outline?.title || 'Presentation'}
            </h1>
            {isGenerating && (
              <div className="flex items-center text-blue-600 text-sm">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Generating slides... ({generatingSlideIndex + 1}/{slides.length})
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-gray-600 hover:text-gray-900"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <Download className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
            >
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content - Vertical Slide Layout */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-8">
          {slides.map((slide, index) => (
            <div key={slide.id} className="relative">
              {/* Slide Number */}
              <div className="absolute -left-12 top-4 text-sm text-gray-400 font-medium">
                {index + 1}
              </div>
              
              {/* Slide Content */}
              <div className="relative">
                <SlideRenderer 
                  slide={slide} 
                  onUpdate={(updates) => updateSlideContent(index, updates)}
                  isEditable={!slide.isGenerating}
                />
                
                {/* Generation Status Overlay */}
                {slide.isGenerating && (
                  <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                      <p className="text-gray-600">Generating slide content...</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer with slide count */}
      <footer className="bg-white border-t border-gray-200 px-6 py-4 sticky bottom-0">
        <div className="max-w-4xl mx-auto flex items-center justify-center">
          <span className="text-sm text-gray-500">
            {slides.length} slides
          </span>
        </div>
      </footer>
    </div>
  );
}