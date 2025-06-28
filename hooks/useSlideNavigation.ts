'use client';

import { useState, useEffect } from 'react';
import { SlideData } from '@/components/slides/SlideRenderer';

/**
 * A custom hook to manage slide navigation, including scroll detection and keyboard shortcuts.
 * @param slides The array of slides.
 * @param currentSlideIndex The current active slide index.
 * @param setCurrentSlideIndex A function to set the active slide index.
 * @returns An object containing the handleSlideSelect function.
 */
export function useSlideNavigation(
  slides: SlideData[],
  currentSlideIndex: number,
  setCurrentSlideIndex: (index: number) => void
) {
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);

  // Function to smoothly scroll to a selected slide
  const handleSlideSelect = (index: number) => {
    if (index < 0 || index >= slides.length) return;

    setCurrentSlideIndex(index);
    setIsAutoScrolling(true);

    const slideElement = document.querySelector(`[data-slide-index="${index}"]`);
    if (slideElement) {
      slideElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });

      // Re-enable auto-detection after scroll completes
      setTimeout(() => {
        setIsAutoScrolling(false);
      }, 1000); // Allow time for smooth scroll to complete
    } else {
      setIsAutoScrolling(false);
    }
  };

  // Auto-detect current slide based on scroll position
  useEffect(() => {
    if (slides.length === 0 || isAutoScrolling) return;

    const observer = new IntersectionObserver(
      (entries) => {
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
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
      }
    );

    const slideElements = document.querySelectorAll('[data-slide-index]');
    slideElements.forEach((element) => observer.observe(element));

    return () => {
      observer.disconnect();
    };
  }, [slides.length, isAutoScrolling, currentSlideIndex, setCurrentSlideIndex]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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
  }, [currentSlideIndex, slides.length]); // handleSlideSelect is not needed here as it's stable

  return { handleSlideSelect };
} 