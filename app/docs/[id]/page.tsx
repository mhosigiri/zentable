'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { SlideRenderer, SlideData } from '@/components/slides/SlideRenderer';
import { ThemedLayout } from '@/components/ui/themed-layout';
import { AssistantSidebar } from '@/components/assistant-ui/sidebar';
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
import { PresentationMode } from '@/components/ui/presentation-mode';
import { db, DocumentData, PresentationUpdate } from '@/lib/database';
import { supabase } from '@/lib/supabase';
import { defaultTheme } from '@/lib/themes';
import { getSlideById } from '@/lib/slides';
import { exportSlidesToPDF } from '@/lib/export';
import { fetchGeneratedSlide, fetchGeneratedImage } from '@/lib/ai/generation';
import { useSlideNavigation } from '@/hooks/useSlideNavigation';
import { usePresentationMode } from '@/hooks/usePresentationMode';
import { useMyRuntime } from './MyRuntimeProvider';
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
  
  // Replace useState with our new hook
  const { 
    slides, 
    setAllSlides,
    addSlide,
    updateSlide,
    updateSlideById,
    deleteSlide,
    duplicateSlide,
    reorderSlides,
  } = useMyRuntime();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatingSlideIndex, setGeneratingSlideIndex] = useState(-1);
  const [generatingImages, setGeneratingImages] = useState(new Set<number>());
  const [generatingSlides, setGeneratingSlides] = useState(new Set<number>());
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  
  const { handleSlideSelect } = useSlideNavigation(slides, currentSlideIndex, setCurrentSlideIndex);
  const presentationMode = usePresentationMode({ slides, initialSlideIndex: currentSlideIndex });

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
          }
        } else {
          // Fallback to localStorage theme if no database theme
          const localStorageTheme = getThemeForDocument(documentId);
          if (localStorageTheme.id !== defaultTheme.id) {
            themeToUse = localStorageTheme;
          }
        }
        
        // Use setTheme for initial load
        setTheme(themeToUse, documentId);
        
        // First, try to load existing generated slides
        if (data.generatedSlides && data.generatedSlides.length > 0) {
          setAllSlides(data.generatedSlides);
        } else if (data.outline) {
          // Only generate slides if none exist
          if (!initRef.current) {
            initRef.current = true;
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
    }
  }, [currentTheme, documentData?.theme]);

  // Effect to automatically generate images when needed
  useEffect(() => {
    slides.forEach((slide, index) => {
      // If a slide has an image prompt, no image URL, and we're not already generating an image for it...
      if (slide.imagePrompt && !slide.imageUrl && !generatingImages.has(index) && !slide.isGeneratingImage) {
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
        // Only warn, not log
        return;
      }
      
      try {
        localStorage.setItem(`document_${documentId}`, dataString);
      } catch (error: any) {
        // Only log errors, not normal saves
        // eslint-disable-next-line no-console
        console.error(`❌ Failed to save to localStorage (attempted size: ${dataSize}):`, error);
        
        // Handle different types of localStorage errors
        if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
          // eslint-disable-next-line no-console
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
            });
            
            // Try saving again after cleanup
            localStorage.setItem(`document_${documentId}`, dataString);
          } catch (cleanupError) {
            // eslint-disable-next-line no-console
            console.error('❌ Failed to save even after cleanup:', cleanupError);
            
            // Last resort: save only essential data without generated slides
            try {
              const essentialData = {
                ...documentData,
                generatedSlides: [] // Remove slides to save space
              };
              localStorage.setItem(`document_${documentId}`, JSON.stringify(essentialData));
              // eslint-disable-next-line no-console
              console.warn('⚠️ Saved essential data only (without slides) due to storage constraints');
            } catch (finalError) {
              // eslint-disable-next-line no-console
              console.error('❌ Complete localStorage failure:', finalError);
            }
          }
        } else {
          // eslint-disable-next-line no-console
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
      try {
        const presentationUpdates: PresentationUpdate = {
          title: documentData.outline?.title,
          theme_id: documentData.theme,
          outline: documentData.outline,
        };

        await db.updatePresentation(databaseId, presentationUpdates);
        await db.saveSlides(databaseId, slides);

        setLastSavedAt(new Date());
      } catch (error) {
        // eslint-disable-next-line no-console
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
        } catch (error) {
          // eslint-disable-next-line no-console
          console.warn('⚠️ Failed to update presentation title:', error);
        }
      }
    };

    updatePresentationTitle();
  }, [documentData?.outline?.title, documentData?.databaseId]);

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

    setAllSlides(sectionSlides);
    
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
      return;
    }

    setGeneratingSlides(prev => new Set(prev).add(slideIndex));

    try {
      const slideData = await fetchGeneratedSlide(section, documentData || {});
      
      updateSlide(slideIndex, { ...slideData, isGenerating: false });

      // Generate image if needed
      if (slideData.imagePrompt && !slideData.imageUrl) {
        // image will be generated by effect
      }

      // Remove from generating slides set
      setGeneratingSlides(prev => {
        const newSet = new Set(prev);
        newSet.delete(slideIndex);
        return newSet;
      });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.error('❌ Slide generation failed for slide:', slideIndex, error);
        
        // Remove from generating slides set
        setGeneratingSlides(prev => {
          const newSet = new Set(prev);
          newSet.delete(slideIndex);
          return newSet;
        });
        
        // Mark slide as failed
        updateSlide(slideIndex, { 
          isGenerating: false,
          title: section.title,
          bulletPoints: section.bulletPoints
        });
      }
  };

  // Generate image for slide
  const generateSlideImage = async (imagePrompt: string, slideIndex: number) => {
    try {
      // Check if already generating this slide's image
      if (generatingImages.has(slideIndex)) {
        return;
      }
      
      // Add to generating set
      setGeneratingImages(prev => new Set(prev).add(slideIndex));
      
      // Mark slide as generating image to prevent duplicate calls
      updateSlide(slideIndex, { isGeneratingImage: true });

      const { imageUrl } = await fetchGeneratedImage(
        imagePrompt,
        slides[slideIndex]?.templateType,
        documentData?.theme,
        documentData?.imageStyle
      );
      
      // Remove from generating set
      setGeneratingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(slideIndex);
        return newSet;
      });
      
      // Update slide with generated image
      updateSlide(slideIndex, { imageUrl, isGeneratingImage: false });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Image generation failed for slide:', slideIndex, error);
      
      // Remove from generating set
      setGeneratingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(slideIndex);
        return newSet;
      });
      
      // Mark as failed
      updateSlide(slideIndex, { isGeneratingImage: false });
    }
  };

  // Update slide content
  const updateSlideContent = (slideIndex: number, updates: Partial<SlideData>) => {
    updateSlide(slideIndex, updates);
  };
  
  // New function to update slide content by ID (for AI assistant updates)
  const updateSlideContentById = async (slideId: string, newContent: string) => {
    try {
      // Find the slide index by ID
      const updatedIndex = updateSlideById(slideId, { content: newContent });
      
      if (updatedIndex === -1) {
        // eslint-disable-next-line no-console
        console.error(`❌ Could not find slide with ID ${slideId} in local state`);
        return false;
      }
      
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Error updating slide by ID:', error);
      return false;
    }
  };

  // Refresh a single slide from database after approval
  const refreshSlideById = async (slideId: string): Promise<boolean> => {
    try {
      // Get the updated slide from database
      const updatedSlide = await getSlideById(slideId);
      
      if (!updatedSlide) {
        // eslint-disable-next-line no-console
        console.error('❌ Slide not found in database:', slideId);
        return false;
      }
      
      // Find the slide in local state
      const slideIndex = slides.findIndex(slide => slide.id === slideId);
      
      if (slideIndex === -1) {
        // eslint-disable-next-line no-console
        console.error('❌ Slide not found in local state:', slideId);
        return false;
      }
      
      // Update local state with fresh data from database
      updateSlide(slideIndex, {
        content: updatedSlide.content || undefined, // Use undefined to avoid overwriting with null
        title: updatedSlide.title || undefined
      });
      
      return true;
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('❌ Error refreshing slide by ID:', error);
      return false;
    }
  };

  // Sidebar handlers - Phase 2: Navigation & Selection
  // const handleSlideSelect = (index: number) => { ... };

  // Phase 3: Slide addition functions
  const addNewSlide = (templateType: string, slideData: Partial<SlideData> = {}, insertIndex?: number) => {
    const targetIndex = insertIndex !== undefined ? insertIndex : currentSlideIndex + 1;
    
    // Create a complete SlideData object with defaults
    const newSlide: SlideData = {
      id: generateUUID(),
      templateType,
      title: 'New Slide',
      isGenerating: false,
      ...slideData, // Override defaults with provided data
    };
    
    addSlide(newSlide, targetIndex);
    
    setCurrentSlideIndex(targetIndex);
    setInsertAtIndex(null);
    setTimeout(() => handleSlideSelect(targetIndex), 100);
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
      
      reorderSlides(oldIndex, newIndex);
      
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
    reorderSlides(oldIndex, newIndex);
    
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
    setAllSlides(newSlides);
    
    // Update current slide index if needed
    if (index < currentSlideIndex) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  const handleDeleteSlide = (index: number) => {
    if (slides.length <= 1) return; // Don't delete the last slide
    
    deleteSlide(index);
    
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
    setAllSlides(reorderedSlides);
    
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
    setAllSlides(reorderedSlides);
    
    // Update current slide index if needed
    if (index === currentSlideIndex) {
      setCurrentSlideIndex(index + 1);
    } else if (index + 1 === currentSlideIndex) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  const handleHideSlide = (index: number) => {
    // TODO: Implement hide functionality
  };

  const handleExportSlide = (index: number) => {
    // TODO: Implement export functionality
  };

  const handleAIGenerate = async (prompt: string, templateType: string) => {
    setIsGeneratingNewSlide(true);
    const targetIndex = insertAtIndex !== null ? insertAtIndex : currentSlideIndex + 1;
    
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

      addSlide(placeholderSlide, targetIndex);
      
      setCurrentSlideIndex(targetIndex);

      // Generate slide content using new helper
      const slideData = await fetchGeneratedSlide({
        title: prompt,
        bulletPoints: [],
        templateType: templateType === 'magic' ? 'title-with-bullets' : templateType,
      }, documentData || {});
      
      // Update slide with generated content
      updateSlide(targetIndex, { ...slideData, isGenerating: false });

      // Generate image if needed
      if (slideData.imagePrompt && !slideData.imageUrl) {
        // image will be generated by effect
      }

      setShowAIModal(false);
      
      // Scroll to new slide
      setTimeout(() => {
        handleSlideSelect(targetIndex);
      }, 100);
      
      // Reset insert position
      setInsertAtIndex(null);
      
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to generate slide:', error);
      // Remove failed slide
      deleteSlide(targetIndex);
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

      // First fetch existing slides to identify which ones to update vs. create
      try {
        const { data: existingSlides } = await supabase
          .from('slides')
          .select('id, updated_at')
          .eq('presentation_id', documentData.databaseId);
        
        const existingSlideMap = new Map();
        if (existingSlides && existingSlides.length > 0) {
          existingSlides.forEach(slide => {
            existingSlideMap.set(slide.id, slide.updated_at);
          });
        }
        
        // Find slides that are in database but not in current state (need to be deleted)
        const currentSlideIds = new Set(slides.map(slide => slide.id));
        const slidesToDelete = existingSlides?.filter(slide => !currentSlideIds.has(slide.id)) || [];
        
        // Delete slides that no longer exist in current state
        if (slidesToDelete.length > 0) {
          const idsToDelete = slidesToDelete.map(slide => slide.id);
          await supabase
            .from('slides')
            .delete()
            .in('id', idsToDelete);
        }

        // Save current slides to database using upsert operation
        if (slides.length > 0) {
          const slidesBatch = slides.map((slide, i) => ({
            id: slide.id,
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
          }));
          
          // Use upsert operation to update existing slides and create new ones
          const { error } = await supabase
            .from('slides')
            .upsert(slidesBatch, { onConflict: 'id' });
            
          if (error) {
            throw error;
          }
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.warn('Failed to sync slides to database:', error);
      }

      setLastSavedAt(new Date());
    } catch (error) {
      // eslint-disable-next-line no-console
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
    await exportSlidesToPDF(slides, documentData, setIsPdfGenerating);
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

  // Presentation mode full screen view
  if (presentationMode.isPlaying && presentationMode.isFullScreen) {
    return (
      <PresentationMode
        isPlaying={presentationMode.isPlaying}
        isFullScreen={presentationMode.isFullScreen}
        currentSlide={presentationMode.currentSlideInPresentation}
        currentSlideIndex={presentationMode.currentSlideIndexInPresentation}
        totalSlides={slides.length}
        title={documentData?.outline?.title || 'Presentation'}
        onPause={presentationMode.pause}
        onNext={presentationMode.goToNextSlide}
        onPrevious={presentationMode.goToPrevSlide}
      />
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
              onClick={() => (presentationMode.isPlaying ? presentationMode.pause() : presentationMode.play(currentSlideIndex))}
              className="text-gray-600 hover:text-gray-900"
              title="Present Slides"
            >
              {presentationMode.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
              {/* <Share2 className="w-4 h-4" /> */}
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

      {/* Assistant UI Sidebar - only shown on desktop with a valid database ID */}
      {!isMobile && documentData?.databaseId && (
        <AssistantSidebar 
          presentationId={documentData.databaseId}
          className="max-w-xs"
          onSlideUpdate={(slideId: string, newContent: string | null) => {
            if (!slideId) {
              // eslint-disable-next-line no-console
              console.error("❌ Invalid slideId for slide update");
              return;
            }
            
            // If newContent is null, this is a refresh request after approval
            if (newContent === null) {
              // Refresh the slide from database
              refreshSlideById(slideId).then(() => {
                // Find the slide index to scroll to it
                const slideIndex = slides.findIndex(slide => slide.id === slideId);
                if (slideIndex !== -1) {
                  handleSlideSelect(slideIndex);
                }
              });
              return;
            }
            
            // Otherwise, this is a direct content update (legacy support)
            if (!newContent) {
              // eslint-disable-next-line no-console
              console.error("❌ Invalid content for slide update");
              return;
            }
            
            // Use the new atomic update function to update a single slide's content
            updateSlideContentById(slideId, newContent)
              .then(success => {
                if (success) {
                  // Find the slide index to potentially scroll to it
                  const slideIndex = slides.findIndex(slide => slide.id === slideId);
                  if (slideIndex !== -1) {
                    handleSlideSelect(slideIndex);
                  }
                } else {
                  // eslint-disable-next-line no-console
                  console.error("❌ Failed to update slide content in UI");
                }
              });
          }}
        />
      )}

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