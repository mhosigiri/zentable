'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from './button';
import { ThemesButton } from './themes-button';
import { Presentation, Home } from 'lucide-react';

interface SlidesHeaderProps {
  title?: string;
  showHomeButton?: boolean;
  additionalButtons?: React.ReactNode;
}

export function SlidesHeader({ title, showHomeButton = false, additionalButtons }: SlidesHeaderProps) {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-white/20 px-6 py-4 sticky top-0 z-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {showHomeButton ? (
            <Link href="/" className="flex items-center text-white/80 hover:text-white transition-colors">
              <Home className="w-5 h-5 mr-2" />
              Home
            </Link>
          ) : (
            <div className="flex items-center space-x-2">
              <Presentation className="h-6 w-6 text-gray-700" />
              <span className="text-lg font-semibold text-gray-900">
                {title || 'PresentAI'}
              </span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <ThemesButton />
          {additionalButtons}
        </div>
      </div>
    </header>
  );
} 