"use client";

import { useEffect } from 'react';

interface UseAIKeyboardShortcutsProps {
  onToggleAI: () => void;
  isAIOpen: boolean;
  onCloseAI: () => void;
}

export function useAIKeyboardShortcuts({ 
  onToggleAI, 
  isAIOpen, 
  onCloseAI 
}: UseAIKeyboardShortcutsProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Cmd/Ctrl + K to toggle AI
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        onToggleAI();
      }
      
      // Escape key to close AI when open
      if (event.key === 'Escape' && isAIOpen) {
        event.preventDefault();
        onCloseAI();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onToggleAI, isAIOpen, onCloseAI]);
} 