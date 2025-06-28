"use client";

import { useSlides, UseSlidesReturn } from '@/hooks/useSlides';
import { createContext, useContext, FC, ReactNode } from 'react';

// Create a context with a default value of null
const MyRuntimeContext = createContext<UseSlidesReturn | null>(null);

// Custom hook to use the runtime context
export const useMyRuntime = () => {
  const context = useContext(MyRuntimeContext);
  if (!context) {
    throw new Error('useMyRuntime must be used within a MyRuntimeProvider');
  }
  return context;
};

// The provider component
export const MyRuntimeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const slideManager = useSlides();

  return (
    <MyRuntimeContext.Provider value={slideManager}>
      {children}
    </MyRuntimeContext.Provider>
  );
};
