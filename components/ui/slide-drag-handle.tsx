'use client';

import { useState } from 'react';
import { GripVertical, MoreVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { SlideContextMenu } from '@/components/ui/slide-context-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SlideDragHandleProps {
  slideId: string;
  slideIndex: number;
  totalSlides: number;
  children: React.ReactNode;
  onDuplicate?: (index: number) => void;
  onDelete?: (index: number) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onHide?: (index: number) => void;
  onExport?: (index: number) => void;
}

export function SlideDragHandle({ 
  slideId, 
  slideIndex, 
  totalSlides, 
  children,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onHide,
  onExport
}: SlideDragHandleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: slideId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TooltipProvider>
      <div
        ref={setNodeRef}
        style={style}
        className={`relative ${isDragging ? 'z-50' : ''}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Drag Handle and Context Menu - appears on hover */}
        <div
          className={`
            absolute -top-2 -left-2 z-10 flex gap-1
            transition-all duration-200 ease-out
            ${isHovered 
              ? 'opacity-100 scale-100 translate-y-0' 
              : 'opacity-0 scale-95 translate-y-1 pointer-events-none'
            }
            ${isDragging ? 'opacity-100 scale-110' : ''}
          `}
        >
          {/* Drag Handle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center cursor-grab active:cursor-grabbing hover:bg-white/20 transition-colors"
                {...attributes}
                {...listeners}
              >
                <GripVertical className="w-4 h-4 text-white/80" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Drag to reorder slide</p>
            </TooltipContent>
          </Tooltip>
          
          {/* Context Menu Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  setContextMenuPosition({ x: e.clientX, y: e.clientY });
                  setShowContextMenu(true);
                }}
              >
                <MoreVertical className="w-4 h-4 text-white/80" />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>Slide options</p>
            </TooltipContent>
          </Tooltip>
        </div>

      {/* Slide Content */}
      <div className={isDragging ? 'opacity-50' : ''}>
        {children}
      </div>

      {/* Context Menu */}
      <SlideContextMenu
        isOpen={showContextMenu}
        position={contextMenuPosition}
        onClose={() => setShowContextMenu(false)}
        slideIndex={slideIndex}
        totalSlides={totalSlides}
        variant="main"
        onDuplicate={onDuplicate}
        onDelete={onDelete}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onHide={onHide}
        onExport={onExport}
      />
      </div>
    </TooltipProvider>
  );
} 