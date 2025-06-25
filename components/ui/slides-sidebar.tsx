'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { SlideRenderer, SlideData } from '@/components/slides/SlideRenderer';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SlideContextMenu } from '@/components/ui/slide-context-menu';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  FileText,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

// Helper functions to extract text from HTML content
function getSlideTitle(slide: SlideData): string {
  // First try the legacy title field
  if (slide.title) {
    return slide.title;
  }
  
  // Extract title from HTML content
  if (slide.content) {
    // Try to extract h1, h2, or h3 tags
    const titleMatch = slide.content.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/i);
    if (titleMatch) {
      return titleMatch[1].replace(/<[^>]*>/g, '').trim();
    }
    
    // Fallback to first line of text content
    const textContent = slide.content.replace(/<[^>]*>/g, '').trim();
    const firstLine = textContent.split('\n')[0];
    if (firstLine.length > 0) {
      return firstLine.length > 50 ? firstLine.substring(0, 47) + '...' : firstLine;
    }
  }
  
  return 'Untitled Slide';
}

function getSlidePreview(slide: SlideData): string {
  // First try the legacy bulletPoints field
  if (slide.bulletPoints && slide.bulletPoints.length > 0) {
    return slide.bulletPoints[0];
  }
  
  // Extract preview from HTML content
  if (slide.content) {
    // Remove HTML tags and get plain text
    let textContent = slide.content.replace(/<[^>]*>/g, '').trim();
    
    // Remove the title part (first line) to get the content
    const lines = textContent.split('\n').filter(line => line.trim().length > 0);
    if (lines.length > 1) {
      // Skip the first line (title) and get the next meaningful content
      const contentLines = lines.slice(1);
      const preview = contentLines.join(' ').trim();
      return preview.length > 100 ? preview.substring(0, 97) + '...' : preview;
    } else if (lines.length === 1) {
      // If only one line, show a portion of it
      const content = lines[0];
      return content.length > 50 ? content.substring(0, 47) + '...' : content;
    }
  }
  
  return 'No content';
}

// Sortable slide item component
function SortableSlideItem({ 
  slide, 
  index, 
  currentSlideIndex, 
  showTextView, 
  onSlideSelect,
  onContextMenu
}: {
  slide: SlideData;
  index: number;
  currentSlideIndex: number;
  showTextView: boolean;
  onSlideSelect: (index: number) => void;
  onContextMenu: (event: React.MouseEvent, index: number) => void;
}) {
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
    transition: isDragging ? transition : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onSlideSelect(index)}
      onContextMenu={(e) => onContextMenu(e, index)}
      className={`
        group cursor-pointer rounded-lg border transition-all duration-200
        ${currentSlideIndex === index 
          ? 'border-white/40 bg-white/20' 
          : 'border-white/10 hover:border-white/30 hover:bg-white/10'
        }
        ${isDragging ? 'opacity-50 z-50' : ''}
      `}
    >
      {showTextView ? (
        // Text View
        <div className="p-3">
          <div className="flex items-start gap-3">
            <div className="text-xs text-white/60 font-medium mt-0.5 min-w-[16px]">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white text-sm font-medium truncate">
                {getSlideTitle(slide)}
              </h4>
              <p className="text-white/60 text-xs mt-1 line-clamp-2">
                {getSlidePreview(slide)}
              </p>
            </div>
          </div>
        </div>
      ) : (
        // Thumbnail View
        <div className="p-2">
          <div 
            className="w-full h-full bg-white/5 rounded border border-white/10 overflow-hidden relative"
            style={{ aspectRatio: '1200/650' }}
          >
            <div 
              className="absolute bottom-2 right-2 z-10 bg-black/60 text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center"
            >
              {index + 1}
            </div>
            
            <div 
              className="absolute inset-0 w-full h-full"
              style={{
                transform: 'scale(0.25)',
                transformOrigin: 'center',
                width: '400%',
                height: '400%',
                left: '-150%',
                top: '-150%'
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
        </div>
      )}
    </div>
  );
}

interface SlidesSidebarProps {
  slides: SlideData[];
  currentSlideIndex: number;
  onSlideSelect: (index: number) => void;
  onAddSlide?: () => void;
  onAddFromTemplate?: () => void;
  onAddWithAI?: () => void;
  onReorderSlides?: (oldIndex: number, newIndex: number) => void;
  onDuplicateSlide?: (index: number) => void;
  onDeleteSlide?: (index: number) => void;
  onMoveSlideUp?: (index: number) => void;
  onMoveSlideDown?: (index: number) => void;
  onHideSlide?: (index: number) => void;
  onExportSlide?: (index: number) => void;
}

export function SlidesSidebar({ 
  slides, 
  currentSlideIndex, 
  onSlideSelect,
  onAddSlide,
  onAddFromTemplate,
  onAddWithAI,
  onReorderSlides,
  onDuplicateSlide,
  onDeleteSlide,
  onMoveSlideUp,
  onMoveSlideDown,
  onHideSlide,
  onExportSlide
}: SlidesSidebarProps) {
  // Initialize collapsed state based on screen size
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768; // Default to collapsed on mobile (md breakpoint)
    }
    return false;
  });
  
  const [showTextView, setShowTextView] = useState(false);
  const [showNewMenu, setShowNewMenu] = useState(false);
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    slideIndex: number;
  }>({
    isOpen: false,
    position: { x: 0, y: 0 },
    slideIndex: -1
  });

  // Handle window resize to update collapsed state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768 && !isCollapsed) {
        // Auto-collapse on small screens
        setIsCollapsed(true);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isCollapsed]);

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id && onReorderSlides) {
      const oldIndex = slides.findIndex(slide => slide.id === active.id);
      const newIndex = slides.findIndex(slide => slide.id === over.id);
      onReorderSlides(oldIndex, newIndex);
    }
  };

  const handleContextMenu = (event: React.MouseEvent, slideIndex: number) => {
    event.preventDefault();
    setContextMenu({
      isOpen: true,
      position: { x: event.clientX, y: event.clientY },
      slideIndex
    });
  };

  if (isCollapsed) {
    return (
      <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsCollapsed(false)}
          className="bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 rounded-lg p-2"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed left-4 top-1/2 transform -translate-y-1/2 z-50 w-64">
      <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl shadow-2xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/20">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium text-sm">Slides</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(true)}
              className="text-white/70 hover:text-white hover:bg-white/10 p-1"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setShowTextView(false)}
              title="Thumbnails view" // Tooltip on hover
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded text-xs font-medium transition-all ${
                !showTextView 
                  ? 'bg-white/20 text-white shadow-sm' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <div className="w-3.5 h-3.5 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-[1px]"></div>
                <div className="bg-current rounded-[1px]"></div>
                <div className="bg-current rounded-[1px]"></div>
                <div className="bg-current rounded-[1px]"></div>
              </div>
            </button>
            <button
              onClick={() => setShowTextView(true)}
              title="Text view" // Tooltip on hover
              className={`flex-1 flex items-center justify-center px-3 py-2 rounded text-xs font-medium transition-all ${
                showTextView 
                  ? 'bg-white/20 text-white shadow-sm' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Slides List */}
        <div className="flex-1 overflow-y-auto p-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={slides.map(slide => slide.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {slides.map((slide, index) => (
                  <SortableSlideItem
                    key={slide.id}
                    slide={slide}
                    index={index}
                    currentSlideIndex={currentSlideIndex}
                    showTextView={showTextView}
                    onSlideSelect={onSlideSelect}
                    onContextMenu={handleContextMenu}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>

        {/* Footer with New button and dropdown */}
        <div className="p-2 border-t border-white/20">
          <div className="relative">
            {/* New Menu Dropdown */}
            {showNewMenu && (
              <div className="absolute left-0 top-full mt-2 w-64 bg-white/40 backdrop-blur-sm border border-white/20 rounded-lg shadow-xl z-10">
                {/* 
                  - left-0: aligns dropdown to left edge of button
                  - top-full mt-2: positions dropdown below the button with margin
                  - bg-white/40: more opaque background for better visibility
                */}
                <div className="p-2 space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onAddWithAI?.();
                      setShowNewMenu(false);
                    }}
                    className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 text-sm py-2"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Add new with AI
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onAddFromTemplate?.();
                      setShowNewMenu(false);
                    }}
                    className="w-full justify-start text-white/90 hover:text-white hover:bg-white/10 text-sm py-2"
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Add new from template
                  </Button>
                </div>
              </div>
            )}
            
            {/* Split New Button */}
            <div className="flex w-full bg-white/20 hover:bg-white/30 border border-white/30 rounded-lg overflow-hidden">
              {/* Main New Button - Creates slide directly */}
              <button
                onClick={onAddSlide}
                className="flex-1 flex items-center justify-center gap-2 text-white text-sm py-2.5 hover:bg-white/10 transition-colors"
              >
                <Plus className="w-4 h-4" />
                New
              </button>
              
              {/* Dropdown Arrow Button */}
              <button
                onClick={() => setShowNewMenu(!showNewMenu)}
                className="px-3 py-2.5 border-l border-white/30 text-white hover:bg-white/10 transition-colors flex items-center justify-center"
              >
                {showNewMenu ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Context Menu */}
      <SlideContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        onClose={() => setContextMenu(prev => ({ ...prev, isOpen: false }))}
        slideIndex={contextMenu.slideIndex}
        totalSlides={slides.length}
        variant="sidebar"
        onDuplicate={onDuplicateSlide}
        onDelete={onDeleteSlide}
        onMoveUp={onMoveSlideUp}
        onMoveDown={onMoveSlideDown}
        onHide={onHideSlide}
        onExport={onExportSlide}
      />
    </div>
  );
} 