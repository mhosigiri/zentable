'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, defaultTheme, getThemeById } from '@/lib/themes';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (theme: Theme, documentId?: string) => void;
  getThemeForDocument: (documentId: string) => Theme;
  isThemesSidebarOpen: boolean;
  setIsThemesSidebarOpen: (open: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [currentTheme, setCurrentTheme] = useState<Theme>(defaultTheme);
  const [isThemesSidebarOpen, setIsThemesSidebarOpen] = useState(false);

  // Load theme from localStorage on mount (fallback for global theme)
  useEffect(() => {
    const savedThemeId = localStorage.getItem('selected-theme');
    if (savedThemeId) {
      const theme = getThemeById(savedThemeId);
      setCurrentTheme(theme);
    }
  }, []);

  const setTheme = (theme: Theme, documentId?: string) => {
    setCurrentTheme(theme);
    if (documentId) {
      // Store theme per document
      localStorage.setItem(`document-theme-${documentId}`, theme.id);
    } else {
      // Fallback global theme
      localStorage.setItem('selected-theme', theme.id);
    }
  };

  const getThemeForDocument = (documentId: string): Theme => {
    const savedThemeId = localStorage.getItem(`document-theme-${documentId}`);
    if (savedThemeId) {
      return getThemeById(savedThemeId);
    }
    // Fallback to global theme
    const globalThemeId = localStorage.getItem('selected-theme');
    return globalThemeId ? getThemeById(globalThemeId) : defaultTheme;
  };

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    getThemeForDocument,
    isThemesSidebarOpen,
    setIsThemesSidebarOpen,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 