'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { SlideRenderer, SlideData } from '@/components/slides/SlideRenderer';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RotateCcw,
  Download,
  Share2,
  Loader2,
  Plus,
  GripVertical,
  List,
  Grid3x3,
  Sparkles,
  FileText,
  Send
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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

// Add template options
const SLIDE_TEMPLATES = [
  { id: 'blank-card', name: 'Blank card', icon: FileText },
  { id: 'image-and-text', name: 'Image and text', icon: FileText },
  { id: 'text-and-image', name: 'Text and image', icon: FileText },
  { id: 'two-columns', name: 'Two columns', icon: FileText },
  { id: 'two-column-with-headings', name: 'Two column with headings', icon: FileText },
  { id: 'three-columns', name: 'Three columns', icon: FileText },
  { id: 'three-column-with-headings', name: 'Three column with headings', icon: FileText },
  { id: 'four-columns', name: 'Four columns', icon: FileText },
  { id: 'four-columns-with-headings', name: 'Four columns with headings', icon: FileText },
  { id: 'title-with-bullets', name: 'Title with bullets', icon: FileText },
  { id: 'title-with-bullets-and-image', name: 'Title with bullets and image', icon: FileText },
  { id: 'bullets', name: 'Bullets', icon: FileText },
  { id: 'paragraph', name: 'Paragraph', icon: FileText },
];

interface SortableSlideThumbnailProps {
  slide: SlideData;
  index: number;
  isActive: boolean;
  onClick: () => void;
  viewMode: 'preview' | 'text';
}

function SortableSlideThumbnail({ slide, index, isActive, onClick, viewMode }: SortableSlideThumbnailProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slide.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="group">
      <div 
        className={`relative border-2 rounded-lg p-2 cursor-pointer transition-all ${
          isActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-200 hover:border-gray-300 bg-white'
        }`}
        onClick={onClick}
      >
        {/* Drag Handle */}
        <div 
          {...attributes} 
          {...listeners}
          className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 cursor-grab active:cursor-grabbing z-10"
        >
          <GripVertical className="w-3 h-3 text-gray-400" />
        </div>

        {/* Slide Number */}
        <div className="absolute top-1 left-1 bg-gray-900 text-white text-xs px-1.5 py-0.5 rounded text-center min-w-[20px]">
          {index + 1}
        </div>

        {viewMode === 'preview' ? (
          /* Mini Preview */
          <div className="aspect-[16/9] bg-gray-50 rounded border overflow-hidden mt-4">
            <div className="transform scale-[0.25] origin-top-left w-[400%] h-[400%]">
              <SlideRenderer slide={slide} isEditable={false} />
            </div>
          </div>
        ) : (
          /* Text View */
          <div className="mt-4 p-2 min-h-[60px]">
            <h4 className="text-xs font-medium text-gray-900 mb-1 line-clamp-2">
              {slide.title || 'Untitled'}
            </h4>
            <p className="text-xs text-gray-600 line-clamp-3">
              {slide.bulletPoints?.join(', ') || slide.content || 'No content'}
            </p>
          </div>
        )}

        {/* Loading Overlay */}
        {slide.isGenerating && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
          </div>
        )}
      </div>
    </div>
  );
}

export default function PresentationPage() {
  const params = useParams();
  const documentId = params.id as string;
  
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingSlideIndex, setGeneratingSlideIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [generatingImages, setGeneratingImages] = useState(new Set<number>());
  const [generatingSlides, setGeneratingSlides] = useState(new Set<number>());
  
  // Sidebar state
  const [sidebarViewMode, setSidebarViewMode] = useState<'preview' | 'text'>('preview');
  const [showNewSlideMenu, setShowNewSlideMenu] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  // Add new slide functions
  const addBlankSlide = () => {
    const newSlide: SlideData = {
      id: `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      templateType: 'blank-card',
      title: '',
      content: '',
      isGenerating: false
    };
    
    const newSlides = [...slides];
    newSlides.splice(currentSlideIndex + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentSlideIndex(currentSlideIndex + 1);
    setShowNewSlideMenu(false);
  };

  const addSlideFromTemplate = (templateType: string) => {
    const newSlide: SlideData = {
      id: `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      templateType,
      title: '',
      content: '',
      isGenerating: false
    };
    
    const newSlides = [...slides];
    newSlides.splice(currentSlideIndex + 1, 0, newSlide);
    setSlides(newSlides);
    setCurrentSlideIndex(currentSlideIndex + 1);
    setShowTemplateMenu(false);
  };

  const generateAISlide = async () => {
    if (!aiPrompt.trim()) return;
    
    setIsGeneratingAI(true);
    
    try {
      // Create placeholder slide
      const newSlide: SlideData = {
        id: `slide_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        templateType: 'blank-card',
        title: 'Generating...',
        content: '',
        isGenerating: true
      };
      
      const newSlides = [...slides];
      newSlides.splice(currentSlideIndex + 1, 0, newSlide);
      setSlides(newSlides);
      const newSlideIndex = currentSlideIndex + 1;
      setCurrentSlideIndex(newSlideIndex);
      
      // Generate slide content using existing API
      const response = await fetch('/api/generate-slide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sectionTitle: aiPrompt,
          bulletPoints: [],
          templateType: 'blank-card',
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
        
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const streamData = JSON.parse(line.slice(6));
              
              if (Object.keys(streamData).length > 0) {
                setSlides(prevSlides => {
                  const newSlides = [...prevSlides];
                  newSlides[newSlideIndex] = { 
                    ...newSlides[newSlideIndex], 
                    ...streamData,
                    isGenerating: false
                  };
                  return newSlides;
                });
              }
            } catch (e) {
              // Ignore parsing errors
            }
          }
        }
      }
      
      setAiPrompt('');
      setShowAIGenerator(false);
      
    } catch (error) {
      console.error('Error generating AI slide:', error);
      // Remove the placeholder slide on error
      setSlides(prevSlides => prevSlides.filter((_, index) => index !== currentSlideIndex + 1));
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = slides.findIndex(slide => slide.id === active.id);
      const newIndex = slides.findIndex(slide => slide.id === over.id);

      const newSlides = arrayMove(slides, oldIndex, newIndex);
      setSlides(newSlides);
      
      // Update current slide index if the current slide was moved
      if (oldIndex === currentSlideIndex) {
        setCurrentSlideIndex(newIndex);
      } else if (oldIndex < currentSlideIndex && newIndex >= currentSlideIndex) {
        setCurrentSlideIndex(currentSlideIndex - 1);
      } else if (oldIndex > currentSlideIndex && newIndex <= currentSlideIndex) {
        setCurrentSlideIndex(currentSlideIndex + 1);
      }
    }
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
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-900">Slides</h2>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarViewMode('preview')}
                className={sidebarViewMode === 'preview' ? 'bg-gray-100' : ''}
              >
                <Grid3x3 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarViewMode('text')}
                className={sidebarViewMode === 'text' ? 'bg-gray-100' : ''}
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* New Slide Button */}
          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-start"
              onClick={() => setShowNewSlideMenu(!showNewSlideMenu)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
            
            {showNewSlideMenu && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                <button
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
                  onClick={addBlankSlide}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add new blank
                </button>
                <button
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
                  onClick={() => {
                    setShowNewSlideMenu(false);
                    setShowTemplateMenu(true);
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Add from template
                </button>
                <button
                  className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
                  onClick={() => {
                    setShowNewSlideMenu(false);
                    setShowAIGenerator(true);
                  }}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Add new with AI
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Slides List */}
        <div className="flex-1 p-2 overflow-y-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={slides.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {slides.map((slide, index) => (
                  <SortableSlideThumbnail
                    key={slide.id}
                    slide={slide}
                    index={index}
                    isActive={index === currentSlideIndex}
                    onClick={() => setCurrentSlideIndex(index)}
                    viewMode={sidebarViewMode}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
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

        {/* Current Slide */}
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            {slides[currentSlideIndex] && (
              <SlideRenderer 
                slide={slides[currentSlideIndex]} 
                onUpdate={(updates) => updateSlideContent(currentSlideIndex, updates)}
                isEditable={!slides[currentSlideIndex].isGenerating}
              />
            )}
          </div>
        </main>

        {/* Navigation Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentSlideIndex(Math.max(0, currentSlideIndex - 1))}
              disabled={currentSlideIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>
            
            <span className="text-sm text-gray-500">
              {currentSlideIndex + 1} of {slides.length}
            </span>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCurrentSlideIndex(Math.min(slides.length - 1, currentSlideIndex + 1))}
              disabled={currentSlideIndex === slides.length - 1}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </footer>
      </div>

      {/* Template Selection Modal */}
      {showTemplateMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Choose a template</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTemplateMenu(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              {SLIDE_TEMPLATES.map((template) => (
                <button
                  key={template.id}
                  className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all text-center"
                  onClick={() => addSlideFromTemplate(template.id)}
                >
                  <template.icon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium text-gray-900">{template.name}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* AI Generator Modal */}
      {showAIGenerator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Generate with AI</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAIGenerator(false)}
              >
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <Textarea
                placeholder="Describe what you'd like to create..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="min-h-[100px]"
              />
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowAIGenerator(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={generateAISlide}
                  disabled={!aiPrompt.trim() || isGeneratingAI}
                  className="flex-1"
                >
                  {isGeneratingAI ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}