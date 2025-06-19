'use client';

import React from 'react';
import { Palette } from 'lucide-react';
import { Button } from './button';
import { useTheme } from '@/contexts/ThemeContext';

export function ThemesButton() {
  const { setIsThemesSidebarOpen } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setIsThemesSidebarOpen(true)}
      className="bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90 hover:border-white/30 text-gray-700"
    >
      <Palette className="w-4 h-4 mr-2" />
      Themes
    </Button>
  );
} 