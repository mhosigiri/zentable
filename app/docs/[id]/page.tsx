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
  const [generatingImages, setGeneratingImages] = useState(new Set<number>());
  const [generatingSlides, setGeneratingSlides] = useState(new Set<number>());

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
    // Prevent re-initialization if slides already exist
    if (slides.length > 0) {
      console.log('🚫 Slides already initialized, skipping re-generation');
      return;
    }

    console.log('✅ Initializing slides for the first time');
    
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
        // Continue with next slide even if one fails
      }
    }
    
    setIsGenerating(false);
    setGeneratingSlideIndex(-1);
  };

  // Generate individual slide
  const generateSlide = async (section: OutlineSection, slideIndex: number) => {
    // Prevent duplicate slide generation
    if (generatingSlides.has(slideIndex)) {
      console.log('🚫 Already generating slide:', slideIndex, 'skipping duplicate');
      return;
    }

    console.log('🎯 Starting slide generation for:', slideIndex);
    setGeneratingSlides(prev => new Set(prev).add(slideIndex));

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
      let lastUpdate = 0;
      let latestData: any = null;
      const UPDATE_THROTTLE = 100; // Throttle updates to every 100ms

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer
        
        const now = Date.now();
        let shouldUpdate = false;
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const streamData = JSON.parse(line.slice(6));
              
              // Only update if we have meaningful data
              if (Object.keys(streamData).length > 0) {
                latestData = streamData;
                shouldUpdate = true;
              }
            } catch (e) {
              // Silently ignore parsing errors to avoid console spam
            }
          }
        }
        
        // Throttled update with latest data
        if (shouldUpdate && latestData && (now - lastUpdate > UPDATE_THROTTLE)) {
          lastUpdate = now;
          
          // Batch updates to reduce re-renders
          setSlides(prevSlides => {
            const newSlides = [...prevSlides];
            const currentSlide = newSlides[slideIndex];
            
            // Only update if the data has actually changed
            const hasChanges = Object.keys(latestData).some(key => 
              currentSlide[key as keyof SlideData] !== latestData[key]
            );
            
            if (hasChanges) {
              newSlides[slideIndex] = { 
                ...currentSlide, 
                ...latestData,
                isGenerating: false
              };
              return newSlides;
            }
            
            return prevSlides;
          });

          // Don't generate image during streaming to avoid multiple calls
          // Image will be generated after streaming completes
        }
      }
      
      // Final update with any remaining data
      if (latestData) {
        setSlides(prevSlides => {
          const newSlides = [...prevSlides];
          const currentSlide = newSlides[slideIndex];
          
          newSlides[slideIndex] = { 
            ...currentSlide, 
            ...latestData,
            isGenerating: false
          };
          return newSlides;
        });

        // Generate image only after streaming is completely finished
        if (latestData.imagePrompt && !latestData.imageUrl) {
          console.log('🎯 Streaming complete, generating image for slide:', slideIndex);
          generateSlideImage(latestData.imagePrompt, slideIndex);
        }
      }

      // Remove from generating slides set
      setGeneratingSlides(prev => {
        const newSet = new Set(prev);
        newSet.delete(slideIndex);
        return newSet;
      });
          } catch (error) {
        console.error('❌ Slide generation failed for slide:', slideIndex, error);
        
        // Remove from generating slides set
        setGeneratingSlides(prev => {
          const newSet = new Set(prev);
          newSet.delete(slideIndex);
          return newSet;
        });
        
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
      console.log('🎨 Attempting image generation for slide:', slideIndex, 'with prompt:', imagePrompt);
      
      // Check if already generating this slide's image
      if (generatingImages.has(slideIndex)) {
        console.log('🚫 Already generating image for slide:', slideIndex);
        return;
      }

      // Check if slide already has an image
      const currentSlide = slides[slideIndex];
      if (currentSlide?.imageUrl) {
        console.log('🚫 Slide already has image:', slideIndex);
        return;
      }

      console.log('✅ Proceeding with image generation for slide:', slideIndex);
      
      // Add to generating set
      setGeneratingImages(prev => new Set(prev).add(slideIndex));
      
      // Mark slide as generating image to prevent duplicate calls
      setSlides(prevSlides => 
        prevSlides.map((slide, index) => 
          index === slideIndex 
            ? { ...slide, isGeneratingImage: true }
            : slide
        )
      );

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
      
      console.log('✅ Image generated successfully for slide:', slideIndex);
      
      // Remove from generating set
      setGeneratingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(slideIndex);
        return newSet;
      });
      
      // Update slide with generated image
      setSlides(prevSlides => 
        prevSlides.map((slide, index) => 
          index === slideIndex 
            ? { ...slide, imageUrl, isGeneratingImage: false }
            : slide
        )
      );
    } catch (error) {
      console.error('❌ Image generation failed for slide:', slideIndex, error);
      
      // Remove from generating set
      setGeneratingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(slideIndex);
        return newSet;
      });
      
      // Mark as failed
      setSlides(prevSlides => 
        prevSlides.map((slide, index) => 
          index === slideIndex 
            ? { ...slide, isGeneratingImage: false }
            : slide
        )
      );
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