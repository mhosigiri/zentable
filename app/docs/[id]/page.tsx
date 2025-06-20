'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { SlideRenderer, SlideData } from '@/components/slides/SlideRenderer';
import { ThemedLayout } from '@/components/ui/themed-layout';
import { SlidesHeader } from '@/components/ui/slides-header';
import { SlidesSidebar } from '@/components/ui/slides-sidebar';
import { TemplateSelectionModal } from '@/components/ui/template-selection-modal';
import { AIGenerationModal } from '@/components/ui/ai-generation-modal';
import { InterSlideAddButtons } from '@/components/ui/inter-slide-add-buttons';
import { SlideDragHandle } from '@/components/ui/slide-drag-handle';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
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
  generatedSlides?: SlideData[];
}

export default function PresentationPage() {
  const params = useParams();
  const documentId = params.id as string;
  const { setTheme, getThemeForDocument } = useTheme();
  
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingSlideIndex, setGeneratingSlideIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatingImages, setGeneratingImages] = useState(new Set<number>());
  const [generatingSlides, setGeneratingSlides] = useState(new Set<number>());
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false); // Prevent conflicts during programmatic scroll
  
  // Phase 3: Modal states for slide addition
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showAIModal, setShowAIModal] = useState(false);
  const [isGeneratingNewSlide, setIsGeneratingNewSlide] = useState(false);
  const [insertAtIndex, setInsertAtIndex] = useState<number | null>(null); // For inter-slide insertion

  // Phase 4: Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px movement before starting drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load document data and theme from localStorage
  useEffect(() => {
    const loadDocumentData = () => {
      const stored = localStorage.getItem(`document_${documentId}`);
      if (stored) {
        const data: DocumentData = JSON.parse(stored);
        setDocumentData(data);
        
        // Load theme for this document
        const documentTheme = getThemeForDocument(documentId);
        setTheme(documentTheme, documentId);
        
        // First, try to load existing generated slides
        if (data.generatedSlides && data.generatedSlides.length > 0) {
          console.log('✅ Loading existing generated slides from localStorage');
          setSlides(data.generatedSlides);
        } else if (data.outline) {
          // Only generate slides if none exist
          console.log('🔄 No existing slides found, initializing new slides');
          initializeSlides(data.outline, data.cardCount);
        }
      }
    };

    loadDocumentData();
  }, [documentId, setTheme, getThemeForDocument]);

  // Save slides to localStorage whenever they change
  useEffect(() => {
    if (documentData && slides.length > 0) {
      const updatedData: DocumentData = {
        ...documentData,
        generatedSlides: slides
      };
      localStorage.setItem(`document_${documentId}`, JSON.stringify(updatedData));
    }
  }, [slides, documentData, documentId]);

  // Phase 2: Auto-detect current slide based on scroll position
  useEffect(() => {
    if (slides.length === 0 || isAutoScrolling) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Find the slide that's most visible in the viewport
        let mostVisibleSlide = null;
        let maxVisibility = 0;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxVisibility) {
            maxVisibility = entry.intersectionRatio;
            mostVisibleSlide = entry.target;
          }
        });

        if (mostVisibleSlide) {
          const slideIndex = parseInt(
            (mostVisibleSlide as HTMLElement).getAttribute('data-slide-index') || '0'
          );
          if (slideIndex !== currentSlideIndex) {
            setCurrentSlideIndex(slideIndex);
          }
        }
      },
      {
        root: null, // Use viewport as root
        rootMargin: '-20% 0px -20% 0px', // Only consider slides in middle 60% of viewport
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0] // Multiple thresholds for better detection
      }
    );

    // Observe all slide elements
    const slideElements = document.querySelectorAll('[data-slide-index]');
    slideElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [slides.length, currentSlideIndex, isAutoScrolling]);

  // Phase 2: Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle arrow keys when not in an input field
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement ||
        (event.target as HTMLElement)?.contentEditable === 'true'
      ) {
        return;
      }

      switch (event.key) {
        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          if (currentSlideIndex > 0) {
            handleSlideSelect(currentSlideIndex - 1);
          }
          break;
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          if (currentSlideIndex < slides.length - 1) {
            handleSlideSelect(currentSlideIndex + 1);
          }
          break;
        case 'Home':
          event.preventDefault();
          handleSlideSelect(0);
          break;
        case 'End':
          event.preventDefault();
          handleSlideSelect(slides.length - 1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentSlideIndex, slides.length]);

  // Initialize slides from outline - only create the requested number of slides
  const initializeSlides = (outline: GeneratedOutline, requestedCount: number) => {
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
              
              // Console log the LLM response for debugging
              console.log('🤖 LLM Response Data:', JSON.stringify(streamData, null, 2));
              
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

  // Sidebar handlers - Phase 2: Navigation & Selection
  const handleSlideSelect = (index: number) => {
    setCurrentSlideIndex(index);
    setIsAutoScrolling(true);
    
    // Smooth scroll to selected slide
    const slideElement = document.querySelector(`[data-slide-index="${index}"]`);
    if (slideElement) {
      slideElement.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center',
        inline: 'nearest'
      });
      
      // Re-enable auto-detection after scroll completes
      setTimeout(() => {
        setIsAutoScrolling(false);
      }, 1000); // Allow time for smooth scroll to complete
    } else {
      setIsAutoScrolling(false);
    }
  };

  // Phase 3: Slide addition functions
  const addNewSlide = (templateType: string, slideData: Partial<SlideData> = {}, insertIndex?: number) => {
    const newSlide: SlideData = {
      id: `slide-${Date.now()}`,
      templateType,
      title: slideData.title || 'New Slide',
      content: slideData.content || '',
      bulletPoints: slideData.bulletPoints || [],
      isGenerating: false,
      ...slideData
    };

    // Use provided insertIndex or default to after current slide
    const targetIndex = insertIndex !== undefined ? insertIndex : currentSlideIndex + 1;
    const newSlides = [...slides];
    newSlides.splice(targetIndex, 0, newSlide);
    
    setSlides(newSlides);
    setCurrentSlideIndex(targetIndex);
    
    // Reset insert position
    setInsertAtIndex(null);
    
    // Scroll to new slide after a brief delay
    setTimeout(() => {
      handleSlideSelect(targetIndex);
    }, 100);
  };

  const handleAddSlide = () => {
    // Add a basic blank slide
    addNewSlide('blank-card');
  };

  const handleAddFromTemplate = () => {
    setShowTemplateModal(true);
  };

  const handleAddWithAI = () => {
    setShowAIModal(true);
  };

  const handleTemplateSelect = (templateType: string) => {
    addNewSlide(templateType, {}, insertAtIndex || undefined);
  };

  // Inter-slide add handlers
  const handleInterSlideAdd = (insertIndex: number) => {
    setInsertAtIndex(insertIndex);
    addNewSlide('blank-card', {}, insertIndex);
  };

  const handleInterSlideAddFromTemplate = (insertIndex: number) => {
    setInsertAtIndex(insertIndex);
    setShowTemplateModal(true);
  };

  const handleInterSlideAddWithAI = (insertIndex: number) => {
    setInsertAtIndex(insertIndex);
    setShowAIModal(true);
  };

  // Phase 4: Slide reordering function
  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = slides.findIndex(slide => slide.id === active.id);
      const newIndex = slides.findIndex(slide => slide.id === over.id);
      
      const reorderedSlides = arrayMove(slides, oldIndex, newIndex);
      setSlides(reorderedSlides);
      
      // Update current slide index if needed
      if (oldIndex === currentSlideIndex) {
        setCurrentSlideIndex(newIndex);
      } else if (oldIndex < currentSlideIndex && newIndex >= currentSlideIndex) {
        setCurrentSlideIndex(currentSlideIndex - 1);
      } else if (oldIndex > currentSlideIndex && newIndex <= currentSlideIndex) {
        setCurrentSlideIndex(currentSlideIndex + 1);
      }
    }
  };

  // Sidebar reorder handler
  const handleSidebarReorder = (oldIndex: number, newIndex: number) => {
    const reorderedSlides = arrayMove(slides, oldIndex, newIndex);
    setSlides(reorderedSlides);
    
    // Update current slide index if needed
    if (oldIndex === currentSlideIndex) {
      setCurrentSlideIndex(newIndex);
    } else if (oldIndex < currentSlideIndex && newIndex >= currentSlideIndex) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    } else if (oldIndex > currentSlideIndex && newIndex <= currentSlideIndex) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  // Phase 5: Slide management functions

  const handleDuplicateSlide = (index: number) => {
    const slideToClone = slides[index];
    const duplicatedSlide: SlideData = {
      ...slideToClone,
      id: `slide-${Date.now()}`,
      title: `${slideToClone.title} (Copy)`
    };
    
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, duplicatedSlide);
    setSlides(newSlides);
    
    // Update current slide index if needed
    if (index < currentSlideIndex) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) return; // Don't delete the last slide
    
    const newSlides = slides.filter((_, i) => i !== index);
    setSlides(newSlides);
    
    // Update current slide index
    if (index < currentSlideIndex) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    } else if (index === currentSlideIndex) {
      // If deleting current slide, move to previous or stay at 0
      setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1));
    }
  };

  const handleMoveSlideUp = (index: number) => {
    if (index === 0) return; // Can't move first slide up
    
    const reorderedSlides = arrayMove(slides, index, index - 1);
    setSlides(reorderedSlides);
    
    // Update current slide index if needed
    if (index === currentSlideIndex) {
      setCurrentSlideIndex(index - 1);
    } else if (index - 1 === currentSlideIndex) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handleMoveSlideDown = (index: number) => {
    if (index === slides.length - 1) return; // Can't move last slide down
    
    const reorderedSlides = arrayMove(slides, index, index + 1);
    setSlides(reorderedSlides);
    
    // Update current slide index if needed
    if (index === currentSlideIndex) {
      setCurrentSlideIndex(index + 1);
    } else if (index + 1 === currentSlideIndex) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleHideSlide = (index: number) => {
    // TODO: Implement hide functionality
    console.log('Hide slide:', index);
  };

  const handleExportSlide = (index: number) => {
    // TODO: Implement export functionality
    console.log('Export slide:', index);
  };

  const handleAIGenerate = async (prompt: string, templateType: string) => {
    setIsGeneratingNewSlide(true);
    
    try {
      // Create placeholder slide
      const placeholderSlide: SlideData = {
        id: `slide-${Date.now()}`,
        templateType: templateType === 'magic' ? 'title-with-bullets' : templateType,
        title: 'Generating...',
        content: prompt,
        bulletPoints: [],
        isGenerating: true
      };

      const targetIndex = insertAtIndex !== null ? insertAtIndex : currentSlideIndex + 1;
      const newSlides = [...slides];
      newSlides.splice(targetIndex, 0, placeholderSlide);
      
      setSlides(newSlides);
      setCurrentSlideIndex(targetIndex);

      // Generate slide content using existing API
      const response = await fetch('/api/generate-slide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sectionTitle: prompt,
          bulletPoints: [],
          templateType: templateType === 'magic' ? 'title-with-bullets' : templateType,
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
      let latestData: any = null;

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const streamData = JSON.parse(line.slice(6));
              if (Object.keys(streamData).length > 0) {
                latestData = streamData;
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }

      // Update slide with generated content
      if (latestData) {
        setSlides(prevSlides => 
          prevSlides.map((slide, index) => 
            index === targetIndex 
              ? { 
                  ...slide, 
                  ...latestData,
                  isGenerating: false
                }
              : slide
          )
        );

        // Generate image if needed
        if (latestData.imagePrompt && !latestData.imageUrl) {
          generateSlideImage(latestData.imagePrompt, targetIndex);
        }
      }

      setShowAIModal(false);
      
      // Scroll to new slide
      setTimeout(() => {
        handleSlideSelect(targetIndex);
      }, 100);
      
      // Reset insert position
      setInsertAtIndex(null);
      
    } catch (error) {
      console.error('Failed to generate slide:', error);
      // Remove failed slide
      setSlides(prevSlides => prevSlides.filter((_, index) => index !== currentSlideIndex + 1));
    } finally {
      setIsGeneratingNewSlide(false);
    }
  };

  if (!documentData || slides.length === 0) {
    return (
      <ThemedLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-white" />
            <p className="text-white/80">Loading presentation...</p>
          </div>
        </div>
      </ThemedLayout>
    );
  }

  return (
    <ThemedLayout>
      {/* Slides Sidebar */}
      <SlidesSidebar
        slides={slides}
        currentSlideIndex={currentSlideIndex}
        onSlideSelect={handleSlideSelect}
        onAddSlide={handleAddSlide}
        onAddFromTemplate={handleAddFromTemplate}
        onAddWithAI={handleAddWithAI}
        onReorderSlides={handleSidebarReorder}
        onDuplicateSlide={handleDuplicateSlide}
        onDeleteSlide={handleDeleteSlide}
        onMoveSlideUp={handleMoveSlideUp}
        onMoveSlideDown={handleMoveSlideDown}
        onHideSlide={handleHideSlide}
        onExportSlide={handleExportSlide}
      />

      <SlidesHeader 
        title={documentData.outline?.title || 'Presentation'}
        additionalButtons={
          <>
            {isGenerating && (
              <div className="flex items-center text-blue-600 text-sm mr-4">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Generating slides... ({generatingSlideIndex + 1}/{slides.length})
              </div>
            )}
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
          </>
        }
      />

      {/* Main Content - Vertical Slide Layout */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div className="space-y-0">
            {/* Add button before first slide */}
            <InterSlideAddButtons
              onAddSlide={() => handleInterSlideAdd(0)}
              onAddFromTemplate={() => handleInterSlideAddFromTemplate(0)}
              onAddWithAI={() => handleInterSlideAddWithAI(0)}
              insertIndex={0}
            />
            
            <SortableContext
              items={slides.map(slide => slide.id)}
              strategy={verticalListSortingStrategy}
            >
              {slides.map((slide, index) => (
                <div key={slide.id}>
                  {/* Slide Container with Drag Handle */}
                  <SlideDragHandle 
                    slideId={slide.id}
                    slideIndex={index}
                    totalSlides={slides.length}
                    onDuplicate={handleDuplicateSlide}
                    onDelete={handleDeleteSlide}
                    onMoveUp={handleMoveSlideUp}
                    onMoveDown={handleMoveSlideDown}
                    onHide={handleHideSlide}
                    onExport={handleExportSlide}
                  >
                    <div 
                      className="relative mb-8"
                      data-slide-index={index} // For scroll targeting
                    >
                      {/* Slide Number */}
                      <div className="absolute -left-12 top-4 text-sm text-white/60 font-medium">
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
                  </SlideDragHandle>
                  
                  {/* Add button after each slide */}
                  <InterSlideAddButtons
                    onAddSlide={() => handleInterSlideAdd(index + 1)}
                    onAddFromTemplate={() => handleInterSlideAddFromTemplate(index + 1)}
                    onAddWithAI={() => handleInterSlideAddWithAI(index + 1)}
                    insertIndex={index + 1}
                  />
                </div>
              ))}
            </SortableContext>
          </div>
        </DndContext>
      </main>

      {/* Phase 3: Modals for slide addition */}
      <TemplateSelectionModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={handleTemplateSelect}
      />

      <AIGenerationModal
        isOpen={showAIModal}
        onClose={() => setShowAIModal(false)}
        onGenerate={handleAIGenerate}
        isGenerating={isGeneratingNewSlide}
      />

    </ThemedLayout>
  );
}