'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface SimpleMarkdownProps {
  children: string;
  className?: string;
}

export function SimpleMarkdown({ children, className }: SimpleMarkdownProps) {
  // Simple markdown parsing for basic formatting
  const parseMarkdown = (text: string) => {
    // Convert markdown to HTML-like structure
    let parsed = text
      // Bold
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Code
      .replace(/`(.*?)`/g, '<code>$1</code>')
      // Line breaks
      .replace(/\n/g, '<br />');

    return parsed;
  };

  const htmlContent = parseMarkdown(children);

  return (
    <div 
      className={cn('prose prose-sm max-w-none', className)}
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

