'use client';

import React, { FC, ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AssistantLayoutContextValue {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  sidebarWidth: number;
  setSidebarWidth: (width: number) => void;
}

const AssistantLayoutContext = createContext<AssistantLayoutContextValue | undefined>(undefined);

export const useAssistantLayout = () => {
  const context = useContext(AssistantLayoutContext);
  if (!context) {
    throw new Error('useAssistantLayout must be used within AssistantLayoutProvider');
  }
  return context;
};

interface AssistantLayoutProviderProps {
  children: ReactNode;
}

export const AssistantLayoutProvider: FC<AssistantLayoutProviderProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('assistant-sidebar-open');
      if (saved !== null) return JSON.parse(saved);
      return window.innerWidth >= 1440;
    }
    return false;
  });

  const [sidebarWidth, setSidebarWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('assistant-sidebar-width');
      return saved ? parseInt(saved) : 400;
    }
    return 400;
  });

  useEffect(() => {
    localStorage.setItem('assistant-sidebar-open', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  useEffect(() => {
    localStorage.setItem('assistant-sidebar-width', sidebarWidth.toString());
  }, [sidebarWidth]);

  return (
    <AssistantLayoutContext.Provider value={{ sidebarOpen, setSidebarOpen, sidebarWidth, setSidebarWidth }}>
      {children}
    </AssistantLayoutContext.Provider>
  );
};

interface AssistantLayoutProps {
  children: ReactNode;
  sidebar: ReactNode;
  className?: string;
}

export const AssistantLayout: FC<AssistantLayoutProps> = ({ children, sidebar, className }) => {
  const { sidebarOpen, sidebarWidth } = useAssistantLayout();

  return (
    <div className={cn('flex h-screen overflow-hidden', className)}>
      {/* Main content area */}
      <div 
        className="flex-1 overflow-auto transition-all duration-300"
        style={{ 
          marginRight: sidebarOpen ? `${sidebarWidth}px` : '0',
        }}
      >
        {children}
      </div>

      {/* Sidebar */}
      <div
        className={cn(
          'fixed right-0 top-0 h-full transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        )}
        style={{ width: `${sidebarWidth}px` }}
      >
        {sidebar}
      </div>
    </div>
  );
};