'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Sparkles, Grid3X3 } from 'lucide-react';

interface InterSlideAddButtonsProps {
  onAddSlide: () => void;
  onAddFromTemplate: () => void;
  onAddWithAI: () => void;
  insertIndex: number; // Position where the slide will be inserted
}

export function InterSlideAddButtons({
  onAddSlide,
  onAddFromTemplate,
  onAddWithAI,
  insertIndex
}: InterSlideAddButtonsProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <TooltipProvider>
      <div 
        className="relative h-8 flex items-center justify-center group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Hover zone - invisible but extends the hover area */}
        <div className="absolute inset-0 -my-4" />
        
        {/* Divider line that's always visible */}
        <div className="absolute inset-x-0 top-1/2 h-px bg-white/20 transform -translate-y-1/2" />
        
        {/* Button group - only visible on hover */}
        <div className={`
          relative bg-white/10 backdrop-blur-md rounded-full border border-white/20
          transition-all duration-200 ease-out
          ${isHovered 
            ? 'opacity-100 scale-100 translate-y-0' 
            : 'opacity-0 scale-95 translate-y-2 pointer-events-none'
          }
        `}>
          <div className="flex items-center gap-1 p-1">
            {/* Quick Add - Basic slide */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onAddSlide}
                  className="
                    h-8 w-8 p-0 rounded-full
                    bg-white/10 hover:bg-white/20 
                    border border-white/20 hover:border-white/30
                    text-white/80 hover:text-white
                    transition-all duration-150
                  "
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add blank slide</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Add from Template */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onAddFromTemplate}
                  className="
                    h-8 w-8 p-0 rounded-full
                    bg-white/10 hover:bg-white/20 
                    border border-white/20 hover:border-white/30
                    text-white/80 hover:text-white
                    transition-all duration-150
                  "
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Add from template</p>
              </TooltipContent>
            </Tooltip>
            
            {/* Add with AI */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={onAddWithAI}
                  className="
                    h-8 w-8 p-0 rounded-full
                    bg-white/10 hover:bg-white/20 
                    border border-white/20 hover:border-white/30
                    text-white/80 hover:text-white
                    transition-all duration-150
                  "
                >
                  <Sparkles className="w-4 h-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Generate with AI</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        
        {/* Small indicator dot in center when not hovered */}
        <div className={`
          absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
          w-2 h-2 bg-white/30 rounded-full
          transition-all duration-200
          ${isHovered ? 'opacity-0 scale-0' : 'opacity-100 scale-100'}
        `} />
      </div>
    </TooltipProvider>
  );
} 