'use client';

import React from 'react';
import { useParams, usePathname } from 'next/navigation';
import { X, Palette, Circle, Grid, Sparkles } from 'lucide-react';
import { Button } from './button';
import { ScrollArea } from './scroll-area';
import { Badge } from './badge';
import { useTheme } from '@/contexts/ThemeContext';
import { themes, getThemesByCategory, Theme } from '@/lib/themes';
import { db } from '@/lib/database';

export function ThemesSidebar() {
  const { currentTheme, setTheme, isThemesSidebarOpen, setIsThemesSidebarOpen } = useTheme();
  const params = useParams();
  const pathname = usePathname();

  if (!isThemesSidebarOpen) return null;

  const gradientThemes = getThemesByCategory('gradient');
  const solidThemes = getThemesByCategory('solid');
  const patternThemes = getThemesByCategory('pattern');
  const glassThemes = getThemesByCategory('glass');

  const handleThemeSelect = async (theme: Theme) => {
    // Check if we're on a document/slides page and have a document ID
    const documentId = pathname.includes('/docs/') ? params.id as string : undefined;
    
    // Always update the theme context first
    setTheme(theme, documentId);
    console.log('🎨 User selected theme:', theme.id);
    
    // If we're on a slides page, directly update the database and localStorage
    if (documentId && pathname.includes('/docs/')) {
      try {
        // Get current document data from localStorage
        const stored = localStorage.getItem(`document_${documentId}`);
        if (stored) {
          const documentData = JSON.parse(stored);
          
          // Update localStorage immediately
          const updatedData = { ...documentData, theme: theme.id };
          localStorage.setItem(`document_${documentId}`, JSON.stringify(updatedData));
          console.log('✅ Updated theme in localStorage:', theme.id);
          
          // Update database if we have a database ID
          if (documentData.databaseId) {
            await db.updatePresentation(documentData.databaseId, {
              theme_id: theme.id
            });
            console.log('✅ Updated theme in database:', theme.id);
          }
        }
      } catch (error) {
        console.warn('⚠️ Failed to update theme in database:', error);
      }
    }
  };

  const getCategoryIcon = (category: Theme['category']) => {
    switch (category) {
      case 'gradient':
        return <Palette className="w-4 h-4" />;
      case 'solid':
        return <Circle className="w-4 h-4" />;
      case 'pattern':
        return <Grid className="w-4 h-4" />;
      case 'glass':
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const ThemeGrid = ({ themes, title, category }: { 
    themes: Theme[], 
    title: string, 
    category: Theme['category'] 
  }) => (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        {getCategoryIcon(category)}
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        <Badge variant="secondary" className="text-xs">
          {themes.length}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {themes.map((theme) => (
          <div
            key={theme.id}
            className={`
              group relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200
              ${currentTheme.id === theme.id 
                ? 'border-blue-500 ring-2 ring-blue-500/20 scale-105' 
                : 'border-gray-200 hover:border-gray-300 hover:scale-105'
              }
            `}
            onClick={() => handleThemeSelect(theme)}
          >
            <div 
              className="aspect-video w-full relative"
              style={{ 
                background: theme.background.includes('gradient') || theme.background.includes('radial') || theme.background.includes('repeating')
                  ? theme.background 
                  : theme.background,
                backgroundSize: theme.category === 'pattern' ? '20px 20px' : 'cover'
              }}
            >
              {theme.category === 'glass' && (
                <div className="absolute inset-0 backdrop-blur-sm" />
              )}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/5 transition-colors" />
              
              {/* Preview content */}
              <div className="absolute inset-2 flex flex-col justify-center items-center text-center">
                <div className="w-8 h-8 rounded bg-white/20 backdrop-blur-sm mb-1 flex items-center justify-center">
                  <div className="w-4 h-4 rounded bg-white/40" />
                </div>
                <div className="w-12 h-1 bg-white/30 rounded mb-1" />
                <div className="w-8 h-1 bg-white/20 rounded" />
              </div>
              
              {/* Selection indicator */}
              {currentTheme.id === theme.id && (
                <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full" />
                </div>
              )}
            </div>
            
            <div className="p-2 bg-white">
              <p className="text-xs font-medium text-gray-900 truncate">
                {theme.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsThemesSidebarOpen(false)}
      />
      
      {/* Sidebar */}
      <div className="relative ml-auto w-80 bg-white shadow-2xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold text-gray-900">Themes</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsThemesSidebarOpen(false)}
              className="p-1 h-auto hover:bg-gray-100"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Content */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              <ThemeGrid 
                themes={gradientThemes} 
                title="Gradients" 
                category="gradient" 
              />
              <ThemeGrid 
                themes={solidThemes} 
                title="Solid Colors" 
                category="solid" 
              />
              <ThemeGrid 
                themes={patternThemes} 
                title="Patterns" 
                category="pattern" 
              />
              <ThemeGrid 
                themes={glassThemes} 
                title="Glass Effects" 
                category="glass" 
              />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
} 