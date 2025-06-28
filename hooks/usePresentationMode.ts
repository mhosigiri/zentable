'use client';

import { useState, useEffect, useCallback } from 'react';
import { SlideData } from '@/components/slides/SlideRenderer';

interface UsePresentationModeProps {
  slides: SlideData[];
  initialSlideIndex?: number;
}

/**
 * A custom hook to manage the presentation mode, including fullscreen,
 * keyboard navigation, and play/pause state.
 * @param slides The array of slides to present.
 * @returns An object with presentation state and control functions.
 */
export function usePresentationMode({ slides, initialSlideIndex = 0 }: UsePresentationModeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideIndex);

  // Update internal slide index if the external one changes while not playing
  useEffect(() => {
    if (!isPlaying) {
      setCurrentSlideIndex(initialSlideIndex);
    }
  }, [initialSlideIndex, isPlaying]);

  const play = useCallback((startIndex = 0) => {
    setCurrentSlideIndex(startIndex);
    setIsPlaying(true);
    setIsFullScreen(true);
  }, []);

  const pause = useCallback(() => {
    setIsPlaying(false);
    setIsFullScreen(false);
  }, []);

  const goToNextSlide = useCallback(() => {
    setCurrentSlideIndex(prev => Math.min(slides.length - 1, prev + 1));
  }, [slides.length]);

  const goToPrevSlide = useCallback(() => {
    setCurrentSlideIndex(prev => Math.max(0, prev - 1));
  }, []);

  useEffect(() => {
    if (!isPlaying) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          pause();
          break;
        case 'ArrowRight':
        case 'ArrowDown':
        case ' ':
          e.preventDefault();
          goToNextSlide();
          break;
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'Backspace':
          e.preventDefault();
          goToPrevSlide();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, pause, goToNextSlide, goToPrevSlide]);

  return {
    isPlaying,
    isFullScreen,
    currentSlideInPresentation: slides[currentSlideIndex],
    currentSlideIndexInPresentation: currentSlideIndex,
    play,
    pause,
    goToNextSlide,
    goToPrevSlide,
  };
} 