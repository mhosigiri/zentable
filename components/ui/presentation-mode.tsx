'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { ThemedLayout } from '@/components/ui/themed-layout';
import { SlideRenderer, SlideData } from '@/components/slides/SlideRenderer';
import { ChevronLeft, ChevronRight, X, ChevronDown, Monitor, Eye, Presentation } from 'lucide-react';
import { motion } from 'framer-motion';

export type PresentationViewMode = 'presenter' | 'fullscreen';

interface PresentationModeProps {
  isPlaying: boolean;
  isFullScreen: boolean;
  currentSlide: SlideData;
  currentSlideIndex: number;
  totalSlides: number;
  title: string;
  onPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function PresentationMode({
  isPlaying,
  isFullScreen,
  currentSlide,
  currentSlideIndex,
  totalSlides,
  title,
  onPause,
  onNext,
  onPrevious
}: PresentationModeProps) {
  const [viewMode, setViewMode] = useState<PresentationViewMode>('presenter');

  if (!isPlaying || !isFullScreen) {
    return null;
  }

  // Full screen mode - no UI chrome, just the slide
  if (viewMode === 'fullscreen') {
    return (
      <ThemedLayout>
        <div className="fixed inset-0 z-50">
          {/* Invisible navigation areas for mouse interaction */}
          <div 
            className="absolute left-0 top-0 w-1/3 h-full z-10 cursor-pointer"
            onClick={onPrevious}
            title="Previous slide"
          />
          <div 
            className="absolute right-0 top-0 w-1/3 h-full z-10 cursor-pointer"
            onClick={onNext}
            title="Next slide"
          />
          
          {/* Exit button - only visible on hover */}
          <div className="absolute top-4 right-4 z-20 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onPause}
              className="text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Mode selector - only visible on hover */}
          <div className="absolute top-4 left-4 z-20 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Full Screen
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/80 backdrop-blur-md border-white/20">
                <DropdownMenuItem 
                  onClick={() => setViewMode('presenter')}
                  className="text-white hover:bg-white/20"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Presenter view
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setViewMode('fullscreen')}
                  className="text-white hover:bg-white/20"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Full screen
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          {/* Main slide area - full screen, edge-to-edge */}
          <div className="w-full h-full flex items-center justify-center">
            <motion.div
              key={currentSlideIndex}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ 
                type: "spring",
                stiffness: 400,
                damping: 40,
                duration: 0.3
              }}
              className="w-full h-full flex items-center justify-center"
            >
              <div className="w-[80%] h-[80%] max-w-full max-h-full aspect-[16/9] flex items-center justify-center">
                <SlideRenderer
                  slide={currentSlide}
                  isEditable={false}
                />
              </div>
            </motion.div>
          </div>

          {/* Slide counter - only visible on hover */}
          <div className="absolute bottom-4 right-4 z-20 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <div className="bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 border border-white/20">
              <span className="text-white text-sm font-medium drop-shadow-lg">
                {currentSlideIndex + 1} / {totalSlides}
              </span>
            </div>
          </div>
        </div>
      </ThemedLayout>
    );
  }

  // Presenter mode - with UI chrome
  return (
    <ThemedLayout>
      <div className="fixed inset-0 z-50 flex flex-col">
        {/* Header with theme-aware translucent background */}
        <div className="relative z-10 bg-black/20 backdrop-blur-md border-b border-white/10 p-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h2 className="text-white font-medium text-lg drop-shadow-lg">
              {title} ({currentSlideIndex + 1}/{totalSlides})
            </h2>
            
            {/* Mode selector */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Presenter view
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-black/80 backdrop-blur-md border-white/20">
                <DropdownMenuItem 
                  onClick={() => setViewMode('presenter')}
                  className="text-white hover:bg-white/20"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Presenter view
                  <span className="ml-auto text-xs text-white/60">View notes while presenting</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setViewMode('fullscreen')}
                  className="text-white hover:bg-white/20"
                >
                  <Monitor className="w-4 h-4 mr-2" />
                  Full screen
                  <span className="ml-auto text-xs text-white/60">Hide all controls</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onPause}
            className="text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Main slide area - preserves theme background */}
        <div className="flex-1 flex items-center justify-center p-8">
          <motion.div
            key={currentSlideIndex}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ 
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.4
            }}
            className="w-full max-w-7xl aspect-[16/9] mx-auto"
          >
            {/* Slide container with enhanced glass effect for presentation */}
            <div className="w-full h-full relative">
              <SlideRenderer
                slide={currentSlide}
                isEditable={false}
              />
            </div>
          </motion.div>
        </div>
        
        {/* Navigation footer with theme-aware translucent background */}
        <div className="relative z-10 bg-black/20 backdrop-blur-md border-t border-white/10 p-4 flex justify-center items-center space-x-6">
          <Button
            variant="ghost"
            disabled={currentSlideIndex === 0}
            onClick={onPrevious}
            className="text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 px-4 py-2"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </Button>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <span className="text-white font-medium drop-shadow-lg">
              {currentSlideIndex + 1} / {totalSlides}
            </span>
          </div>
          
          <Button
            variant="ghost"
            disabled={currentSlideIndex === totalSlides - 1}
            onClick={onNext}
            className="text-white hover:bg-white/20 backdrop-blur-sm transition-all duration-200 px-4 py-2"
          >
            Next
            <ChevronRight className="w-5 h-5 ml-1" />
          </Button>
        </div>
      </div>
    </ThemedLayout>
  );
} 