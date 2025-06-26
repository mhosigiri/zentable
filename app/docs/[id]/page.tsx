'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  Loader2,
  X
  } from 'lucide-react';
import { db, DocumentData, PresentationUpdate } from '@/lib/database';
import { supabase } from '@/lib/supabase';
import { defaultTheme } from '@/lib/themes';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { generateUUID } from '@/lib/uuid';

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

export default function PresentationPage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;
  const { setTheme, getThemeForDocument } = useTheme();
  const initRef = useRef(false);

  // Helper function to estimate data size
  const getDataSize = (data: any): string => {
    try {
      const jsonString = JSON.stringify(data);
      const sizeInBytes = new Blob([jsonString]).size;
      const sizeInKB = (sizeInBytes / 1024).toFixed(2);
      const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
      return sizeInBytes > 1024 * 1024 ? `${sizeInMB} MB` : `${sizeInKB} KB`;
    } catch {
      return 'Unknown size';
    }
  };
  
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingSlideIndex, setGeneratingSlideIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [generatingImages, setGeneratingImages] = useState(new Set<number>());
  const [generatingSlides, setGeneratingSlides] = useState(new Set<number>());
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false); // Prevent conflicts during programmatic scroll
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  
  // Database integration state
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
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
        
        // Load theme with priority: database data > localStorage > default
        let themeToUse = defaultTheme;
        
        if (data.theme) {
          // Use theme from database data (saved from outline configuration) - highest priority
          const themes = require('@/lib/themes').themes;
          const dbTheme = themes.find((t: any) => t.id === data.theme);
          if (dbTheme) {
            themeToUse = dbTheme;
            console.log('✅ Loading theme from database data (highest priority):', data.theme);
          }
        } else {
          // Fallback to localStorage theme if no database theme
          const localStorageTheme = getThemeForDocument(documentId);
          if (localStorageTheme.id !== defaultTheme.id) {
            themeToUse = localStorageTheme;
            console.log('✅ Loading theme from localStorage (fallback):', localStorageTheme.id);
          }
        }
        
        // Use setTheme for initial load
        setTheme(themeToUse, documentId);
        
        // First, try to load existing generated slides
        if (data.generatedSlides && data.generatedSlides.length > 0) {
          console.log('✅ Loading existing generated slides from localStorage');
          setSlides(data.generatedSlides);
        } else if (data.outline) {
          // Only generate slides if none exist
          if (!initRef.current) {
            initRef.current = true;
            console.log('🔄 No existing slides found, initializing new slides');
            initializeSlides(data.outline, data.cardCount);
          }
        }
      }
    };

    loadDocumentData();
  }, [documentId, getThemeForDocument]);

  // Listen for theme changes from sidebar and update internal state
  const { currentTheme } = useTheme();
  useEffect(() => {
    if (documentData && currentTheme && currentTheme.id !== documentData.theme) {
      // Update the internal documentData state to reflect the theme change
      const updatedData = { ...documentData, theme: currentTheme.id };
      setDocumentData(updatedData);
      console.log('🔄 Updated internal theme state to:', currentTheme.id);
    }
  }, [currentTheme, documentData?.theme]);

  // Effect to automatically generate images when needed
  useEffect(() => {
    slides.forEach((slide, index) => {
      // If a slide has an image prompt, no image URL, and we're not already generating an image for it...
      if (slide.imagePrompt && !slide.imageUrl && !generatingImages.has(index) && !slide.isGeneratingImage) {
        console.log(`useEffect trigger: Generating image for slide ${index}`);
        generateSlideImage(slide.imagePrompt, index);
      }
    });
  }, [slides, generatingImages]);

  // Save slides to localStorage whenever they change
  useEffect(() => {
    if (documentData && slides.length > 0) {
      const updatedData: DocumentData = {
        ...documentData,
        generatedSlides: slides
      };
      
      const dataString = JSON.stringify(updatedData);
      const dataSize = getDataSize(updatedData);
      
      // Check if data is too large (over 5MB)
      const sizeInBytes = new Blob([dataString]).size;
      if (sizeInBytes > 5 * 1024 * 1024) {
        console.warn(`⚠️ Data size (${dataSize}) exceeds 5MB limit. Skipping localStorage save to prevent quota errors.`);
        return;
      }
      
      try {
        localStorage.setItem(`document_${documentId}`, dataString);
        console.log(`💾 Saved document to localStorage (${dataSize})`);
      } catch (error: any) {
        console.error(`❌ Failed to save to localStorage (attempted size: ${dataSize}):`, error);
        
        // Handle different types of localStorage errors
        if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
          console.warn('📦 localStorage quota exceeded. Attempting to clean up old data...');
          
          // Try to free up space by removing old documents
          try {
            const keysToRemove: string[] = [];
            for (let i = 0; i < localStorage.length; i++) {
              const key = localStorage.key(i);
              if (key && key.startsWith('document_') && key !== `document_${documentId}`) {
                keysToRemove.push(key);
              }
            }
            
            // Remove oldest documents first (simple cleanup strategy)
            keysToRemove.slice(0, Math.min(5, keysToRemove.length)).forEach(key => {
              localStorage.removeItem(key);
              console.log('🗑️ Removed old document:', key);
            });
            
            // Try saving again after cleanup
            localStorage.setItem(`document_${documentId}`, dataString);
            console.log('✅ Successfully saved after cleanup');
          } catch (cleanupError) {
            console.error('❌ Failed to save even after cleanup:', cleanupError);
            
            // Last resort: save only essential data without generated slides
            try {
              const essentialData = {
                ...documentData,
                generatedSlides: [] // Remove slides to save space
              };
              localStorage.setItem(`document_${documentId}`, JSON.stringify(essentialData));
              console.warn('⚠️ Saved essential data only (without slides) due to storage constraints');
            } catch (finalError) {
              console.error('❌ Complete localStorage failure:', finalError);
            }
          }
        } else {
          console.error('❌ Non-quota localStorage error:', error);
        }
      }
    }
  }, [slides, documentData, documentId]);

  // Auto-save to database
  useEffect(() => {
    const databaseId = documentData?.databaseId;
    // Don't save if there's no database ID yet.
    if (!databaseId) {
      return;
    }

    const handler = setTimeout(async () => {
      setIsSyncing(true);
      console.log('🔄 Auto-saving to database...');
      try {
        const presentationUpdates: PresentationUpdate = {
          title: documentData.outline?.title,
          theme_id: documentData.theme,
          outline: documentData.outline,
        };

        await db.updatePresentation(databaseId, presentationUpdates);
        await db.saveSlides(databaseId, slides);

        setLastSavedAt(new Date());
        console.log('✅ Successfully saved to database.');
      } catch (error) {
        console.error('❌ Failed to save to database:', error);
      } finally {
        setIsSyncing(false);
      }
    }, 5000); // Debounce saves by 5 seconds

    return () => {
      clearTimeout(handler);
    };
  }, [slides, documentData]);

  // Update presentation title in database when outline title is available
  useEffect(() => {
    const updatePresentationTitle = async () => {
      if (documentData?.outline?.title && documentData?.databaseId && documentData.outline.title !== 'Untitled Presentation') {
        try {
          await db.updatePresentation(documentData.databaseId, {
            title: documentData.outline.title
          });
          console.log('✅ Updated presentation title to:', documentData.outline.title);
        } catch (error) {
          console.warn('⚠️ Failed to update presentation title:', error);
        }
      }
    };

    updatePresentationTitle();
  }, [documentData?.outline?.title, documentData?.databaseId]);

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
          contentLength: documentData?.contentLength || 'medium',
          imageStyle: documentData?.imageStyle || 'professional',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate slide');
      }

      // Parse JSON response instead of streaming
      const result = await response.json();
      
      console.log('🤖 LLM Response Data:', JSON.stringify(result, null, 2));
      
      if (!result.success || !result.data) {
        throw new Error('Invalid response format');
      }

      const slideData = result.data;
      
      // Update slide with generated content
      setSlides(prevSlides => {
        const newSlides = [...prevSlides];
        const currentSlide = newSlides[slideIndex];
        
        newSlides[slideIndex] = { 
          ...currentSlide, 
          ...slideData,
          isGenerating: false
        };
        return newSlides;
      });

      // Generate image if needed
      if (slideData.imagePrompt && !slideData.imageUrl) {
        console.log('🎯 Generation complete, image will be generated by effect for slide:', slideIndex);
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
        body: JSON.stringify({ 
          prompt: imagePrompt,
          templateType: slides[slideIndex]?.templateType,
          theme: documentData?.theme,
          imageStyle: documentData?.imageStyle
        }),
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
      id: generateUUID(),
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
          contentLength: documentData?.contentLength || 'medium',
          imageStyle: documentData?.imageStyle || 'professional',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate slide');
      }

      // Parse JSON response instead of streaming
      const result = await response.json();
      
      if (!result.success || !result.data) {
        throw new Error('Invalid response format');
      }

      const slideData = result.data;
      
      // Update slide with generated content
      setSlides(prevSlides => 
        prevSlides.map((slide, index) => 
          index === targetIndex 
            ? { 
                ...slide, 
                ...slideData,
                isGenerating: false
              }
            : slide
        )
      );

      // Generate image if needed
      if (slideData.imagePrompt && !slideData.imageUrl) {
        console.log('🎯 Generation complete, image will be generated by effect for slide:', targetIndex);
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

  // Database integration functions
  // Removed local generateUUID function in favor of the centralized utility from lib/uuid.ts

  const saveToDatabase = async (forceSync = false) => {
    if (!documentData?.databaseId || isSyncing) return;
    
    // Only sync if there are changes or forced
    if (!forceSync && lastSavedAt && Date.now() - lastSavedAt.getTime() < 5000) {
      return; // Don't sync more than once every 5 seconds
    }

    setIsSyncing(true);
    try {
      // Save presentation data
      await db.updatePresentation(documentData.databaseId, {
        prompt: documentData.prompt,
        card_count: documentData.cardCount,
        style: documentData.style as any,
        language: documentData.language,
        content_length: documentData.contentLength as any || 'medium',
        theme_id: documentData.theme || 'default',
        image_style: documentData.imageStyle || null,
        status: 'completed' as any,
        outline: documentData.outline
      });

      // Clear existing slides for this presentation to avoid duplicates
      // Note: This is a simple approach - in production you might want to do a smarter sync
      try {
        const { data: existingSlides } = await supabase
          .from('slides')
          .select('id')
          .eq('presentation_id', documentData.databaseId);
        
        if (existingSlides && existingSlides.length > 0) {
          await supabase
            .from('slides')
            .delete()
            .eq('presentation_id', documentData.databaseId);
        }
      } catch (error) {
        console.warn('Failed to clear existing slides:', error);
      }

      // Save current slides to database using their existing UUIDs
      if (slides.length > 0) {
        for (let i = 0; i < slides.length; i++) {
          const slide = slides[i];
          // Ensure slide ID is a valid UUID before saving
          const slideUUID = slide.id;
          
          try {
            await db.createSlide({
              id: slideUUID,
              presentation_id: documentData.databaseId,
              position: i,
              template_type: slide.templateType,
              title: slide.title || null,
              content: slide.content || null,
              bullet_points: slide.bulletPoints || null,
              image_url: slide.imageUrl || null,
              image_prompt: slide.imagePrompt || null,
              is_hidden: false,
              is_generating: slide.isGenerating || false,
              is_generating_image: slide.isGeneratingImage || false
            });
          } catch (error) {
            console.warn('Failed to save slide to database:', slide.id, error);
          }
        }
      }

      setLastSavedAt(new Date());
      console.log('✅ Presentation synced to database');
    } catch (error) {
      console.warn('⚠️ Database sync failed:', error);
    } finally {
      setIsSyncing(false);
    }
  };

  const startAutoSave = () => {
    if (autoSaveIntervalRef.current) return;
    
    autoSaveIntervalRef.current = setInterval(() => {
      saveToDatabase();
    }, 30000); // Save every 30 seconds
  };

  const stopAutoSave = () => {
    if (autoSaveIntervalRef.current) {
      clearInterval(autoSaveIntervalRef.current);
      autoSaveIntervalRef.current = null;
    }
  };

  // Save on navigation away
  useEffect(() => {
    const handleBeforeUnload = () => {
      saveToDatabase(true); // Force sync on page unload
    };

    const handleRouteChange = () => {
      saveToDatabase(true); // Force sync on route change
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Start auto-save when component mounts
    startAutoSave();

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      stopAutoSave();
      saveToDatabase(true); // Final sync on cleanup
    };
  }, [documentData, slides]);

  // Trigger sync when slides change (debounced)
  useEffect(() => {
    if (slides.length > 0 && documentData?.databaseId) {
      const timeoutId = setTimeout(() => {
        saveToDatabase();
      }, 2000); // Debounce slide changes by 2 seconds

      return () => clearTimeout(timeoutId);
    }
  }, [slides, documentData]);

  // Add state for mobile detection
  const [isMobile, setIsMobile] = useState(false);

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // PDF Download functionality
  const handleDownloadPDF = async () => {
    if (slides.length === 0 || isPdfGenerating) return;

    setIsPdfGenerating(true);
    
    try {
      // Create PDF with 16:9 aspect ratio
      const pdf = new jsPDF({
        orientation: 'landscape', // Landscape for presentation slides
        unit: 'px',
        format: [1600, 900] // 16:9 aspect ratio at high resolution
      });
      
      const slideElements = document.querySelectorAll('.slide-for-pdf');
      
      if (slideElements.length === 0) {
        // If no slides with the specific class are found, try rendering to canvas manually
        for (let i = 0; i < slides.length; i++) {
          // Create temporary slide renderer
          const slideContainer = document.createElement('div');
          slideContainer.style.width = '1600px';
          slideContainer.style.height = '900px';
          slideContainer.style.position = 'absolute';
          slideContainer.style.left = '-9999px';
          slideContainer.className = 'slide-temp-render';
          document.body.appendChild(slideContainer);
          
          // Render slide
          const slide = slides[i];
          const slideElement = document.createElement('div');
          slideElement.className = 'bg-white w-full h-full';
          slideContainer.appendChild(slideElement);
          
          // Wait for the next frame to ensure the slide is rendered
          await new Promise(resolve => requestAnimationFrame(resolve));
          
          // Capture as canvas and add to PDF
          const canvas = await html2canvas(slideContainer, {
            scale: 1,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
          });
          
          const imgData = canvas.toDataURL('image/jpeg', 0.92);
          
          if (i > 0) {
            pdf.addPage();
          }
          pdf.addImage(imgData, 'JPEG', 0, 0, 1600, 900);
          
          // Clean up
          document.body.removeChild(slideContainer);
        }
      } else {
        // Use existing slide elements
        for (let i = 0; i < slideElements.length; i++) {
          const slideElement = slideElements[i] as HTMLElement;
          
          const canvas = await html2canvas(slideElement, {
            scale: 1,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff'
          });
          
          const imgData = canvas.toDataURL('image/jpeg', 0.92);
          
          if (i > 0) {
            pdf.addPage();
          }
          pdf.addImage(imgData, 'JPEG', 0, 0, 1600, 900);
        }
      }
      
      // Save the PDF
      const title = documentData?.outline?.title || 'presentation';
      const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      pdf.save(`${safeTitle}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  // Presentation mode functionality
  useEffect(() => {
    if (!isPlaying) return;
    
    // Handle full screen presentation mode
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isPlaying) return;
      
      switch(e.key) {
        case 'Escape':
          setIsPlaying(false);
          setIsFullScreen(false);
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          // Next slide
          if (currentSlideIndex < slides.length - 1) {
            setCurrentSlideIndex(prev => prev + 1);
          }
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'Backspace':
          // Previous slide
          if (currentSlideIndex > 0) {
            setCurrentSlideIndex(prev => prev - 1);
          }
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    setIsFullScreen(true);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, currentSlideIndex, slides.length]);

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

  // Presentation mode full screen view
  if (isPlaying && isFullScreen) {
    return (
      <ThemedLayout>
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          <div className="bg-black/40 p-2 flex justify-between items-center">
            <h2 className="text-white">
              {documentData?.outline?.title || 'Presentation'} ({currentSlideIndex + 1}/{slides.length})
            </h2>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => {
                setIsPlaying(false);
                setIsFullScreen(false);
              }}
              className="text-white"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            <div className="w-full max-w-6xl aspect-[16/9] mx-auto">
              <SlideRenderer
                slide={slides[currentSlideIndex]}
                isEditable={false}
              />
            </div>
          </div>
          
          <div className="bg-black/40 p-3 flex justify-center items-center space-x-4">
            <Button
              variant="ghost"
              disabled={currentSlideIndex === 0}
              onClick={() => setCurrentSlideIndex(prev => Math.max(0, prev - 1))}
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <span className="text-white">{currentSlideIndex + 1} / {slides.length}</span>
            <Button
              variant="ghost"
              disabled={currentSlideIndex === slides.length - 1}
              onClick={() => setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
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
            {isSyncing && (
              <div className="flex items-center text-green-600 text-sm mr-4">
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
                Syncing...
              </div>
            )}
            {lastSavedAt && !isSyncing && (
              <div className="flex items-center text-gray-500 text-sm mr-4">
                Saved {lastSavedAt.toLocaleTimeString()}
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-gray-600 hover:text-gray-900"
              title="Present Slides"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownloadPDF}
              disabled={isPdfGenerating}
              className="text-gray-600 hover:text-gray-900"
              title="Download as PDF"
            >
              {isPdfGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
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
      <main className={`${isMobile ? 'max-w-sm' : 'max-w-4xl'} mx-auto px-4 sm:px-6 py-4 sm:py-8`}>
        {isMobile ? (
          // Mobile: Static scaled slides without editing
          <div className="space-y-4">
            {slides.map((slide, index) => (
              <div key={slide.id} className="relative">
                {/* Slide Number */}
                <div className="absolute -left-8 top-2 text-xs text-white/60 font-medium z-10">
                  {index + 1}
                </div>
                
                {/* Mobile Slide Container */}
                <div className="relative bg-white/10 rounded-lg overflow-hidden shadow-lg">
                  <div 
                    className="relative w-full"
                    style={{
                      aspectRatio: '16/9',
                      minHeight: '140px'
                    }}
                  >
                    <div 
                      className="absolute inset-0 w-full h-full overflow-hidden"
                      style={{
                        transform: 'scale(0.35)',
                        transformOrigin: 'center',
                        width: '285%',
                        height: '285%',
                        left: '-92.5%',
                        top: '-92.5%'
                      }}
                    >
                      <div className="w-full h-full pointer-events-none">
                        <SlideRenderer 
                          slide={slide} 
                          isEditable={false}
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Mobile slide indicator */}
                  <div className="absolute bottom-2 right-2 bg-black/20 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-xs text-white/80">
                      {index + 1} / {slides.length}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Desktop: Full editing experience
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
        )}
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