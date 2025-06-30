'use client';

import React, { ReactNode } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemesSidebar } from './themes-sidebar';

interface ThemedLayoutProps {
  children: ReactNode;
  className?: string;
}

export function ThemedLayout({ children, className = '' }: ThemedLayoutProps) {
  const { currentTheme } = useTheme();

  return (
    <div className={`min-h-screen relative ${className}`}>
      {/* Background Layer */}
      <div 
        className="fixed inset-0 z-0"
        style={{ 
          background: currentTheme.background,
          backgroundSize: 'cover'
        }}
      />
      
      {/* Glass overlay for better readability */}
      <div className="fixed inset-0 z-0 bg-white/5 backdrop-blur-[0.5px]" />
      
      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
      
      {/* Themes Sidebar */}
      <ThemesSidebar />
    </div>
  );
} 