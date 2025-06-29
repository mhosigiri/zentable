'use client';

import React, { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';

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
    w-full ${minHeight} rounded-xl shadow-2xl transition-all duration-300 ease-in-out overflow-hidden p-8 sm:p-10 md:p-12 lg:p-14
    ${isDarkTheme 
      ? 'bg-black/10 backdrop-blur-lg border-white/10' 
      : 'bg-white/50 backdrop-blur-lg border-white/30'
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