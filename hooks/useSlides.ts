'use client';

import { useState, useCallback } from 'react';
import { arrayMove } from '@dnd-kit/sortable';
import { SlideData } from '@/components/slides/SlideRenderer';
import { generateUUID } from '@/lib/uuid';
import { v4 as uuidv4 } from 'uuid';

export interface UseSlidesReturn {
  slides: SlideData[];
  setAllSlides: (slides: SlideData[]) => void;
  addSlide: (newSlide: SlideData, index?: number) => void;
  updateSlide: (index: number, updates: Partial<SlideData>) => void;
  updateSlideById: (slideId: string, updates: Partial<SlideData>) => number;
  deleteSlide: (index: number) => void;
  duplicateSlide: (index: number) => void;
  reorderSlides: (oldIndex: number, newIndex: number) => void;
}

/**
 * A custom hook to manage the state and operations for a collection of slides.
 * This centralizes all slide manipulation logic.
 * @param initialSlides The initial array of slides.
 * @returns An object containing the slides array and functions to manage them.
 */
export function useSlides(initialSlides: SlideData[] = []) {
  const [slides, setSlides] = useState<SlideData[]>(initialSlides);

  const setAllSlides = useCallback((newSlides: SlideData[]) => {
    setSlides(newSlides);
  }, []);

  const addSlide = useCallback((slideData: Partial<SlideData>, index: number) => {
    const newSlide: SlideData = {
      id: generateUUID(),
      templateType: 'blank-card',
      title: 'New Slide',
      isGenerating: false,
      ...slideData,
    };
    
    const newSlides = [...slides];
    newSlides.splice(index, 0, newSlide);
    setSlides(newSlides);
  }, [slides]);

  const updateSlide = useCallback((index: number, updates: Partial<SlideData>) => {
    setSlides(prevSlides =>
      prevSlides.map((slide, i) =>
        i === index ? { ...slide, ...updates } : slide
      )
    );
  }, []);

  const updateSlideById = useCallback((slideId: string, updates: Partial<SlideData>) => {
    setSlides(prevSlides =>
      prevSlides.map(slide =>
        slide.id === slideId ? { ...slide, ...updates } : slide
      )
    );
    return slides.findIndex(slide => slide.id === slideId);
  }, [slides]);
  
  const deleteSlide = useCallback((index: number) => {
    if (slides.length <= 1) return; // Prevent deleting the last slide
    setSlides(prevSlides => prevSlides.filter((_, i) => i !== index));
  }, [slides.length]);

  const duplicateSlide = useCallback((index: number) => {
    if (index < 0 || index >= slides.length) return;
    
    const slideToClone = slides[index];
    const duplicatedSlide: SlideData = {
      ...slideToClone,
      id: generateUUID(),
      title: `${slideToClone.title || ''} (Copy)`,
    };
    
    const newSlides = [...slides];
    newSlides.splice(index + 1, 0, duplicatedSlide);
    setSlides(newSlides);
  }, [slides]);

  const reorderSlides = useCallback((oldIndex: number, newIndex: number) => {
    setSlides(prevSlides => arrayMove(prevSlides, oldIndex, newIndex));
  }, []);

  return {
    slides,
    setAllSlides,
    addSlide,
    updateSlide,
    updateSlideById,
    deleteSlide,
    duplicateSlide,
    reorderSlides,
  };
} 