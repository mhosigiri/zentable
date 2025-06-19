'use client';

import React, { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

interface SlideWrapperProps {
  children: ReactNode;
  className?: string;
  layout?: 'default' | 'horizontal' | 'vertical';
  minHeight?: string;
}

export function SlideWrapper({ 
  children, 
  className = '', 
  layout = 'default',
  minHeight = 'min-h-[500px]'
}: SlideWrapperProps) {
  const { currentTheme } = useTheme();
  
  // Determine if we should use dark styling based on theme
  const isDarkTheme = currentTheme.category === 'solid' && 
    (currentTheme.id.includes('midnight') || currentTheme.id.includes('ruby') || currentTheme.id.includes('emerald'));
  
  // Base styling that applies to all slides
  const baseClasses = `
    w-full ${minHeight} rounded-lg shadow-2xl border transition-all duration-300 hover:shadow-3xl
    backdrop-blur-md hover:backdrop-blur-lg
    ${isDarkTheme 
      ? 'bg-black/15 border-white/30 shadow-black/25 hover:bg-black/20' 
      : 'bg-white/60 border-white/50 shadow-black/15 hover:bg-white/70'
    }
  `.trim();
  
  // Layout-specific classes
  const layoutClasses = {
    default: 'flex flex-col p-8',
    horizontal: 'flex p-8 gap-8',
    vertical: 'flex flex-col p-8'
  };
  
  const finalClasses = `${baseClasses} ${layoutClasses[layout]} ${className}`;
  
  return (
    <div className={finalClasses}>
      {children}
    </div>
  );
} 