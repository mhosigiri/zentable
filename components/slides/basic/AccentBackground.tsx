'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface AccentBackgroundProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  accentColor?: string;
}

export function AccentBackground({ 
  content,
  imageUrl,
  imagePrompt,
  isGenerating,
  isGeneratingImage,
  onUpdate, 
  isEditable = false,
  accentColor = '#8b5cf6'
}: AccentBackgroundProps) {

  const handleContentChange = (newContent: string) => {
    if (onUpdate) {
      console.log('💾 AccentBackground - Content being saved:', newContent);
      onUpdate({ content: newContent });
    }
  };

  const defaultContent = `<h1 style="color: white; text-align: center;">Eye-Catching Title</h1>
<p style="color: white; text-align: center; font-size: 1.25rem; margin-top: 2rem;">Supporting subtitle or key message that complements the main title and provides additional context for your presentation.</p>`;

  const displayContent = content || defaultContent;

  // Create background style based on image availability
  const backgroundStyle = imageUrl
    ? {
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }
    : {
        background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`
      };

  if (isGenerating || isGeneratingImage) {
    return (
      <div 
        className="w-full h-full flex items-center justify-center p-8"
        style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)` }}
      >
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-white/20 rounded-xl mx-auto flex items-center justify-center shadow-sm">
            <Loader2 className="w-8 h-8 animate-spin text-white" />
          </div>
          <div className="space-y-2">
            <p className="text-sm text-white font-medium">
              {isGenerating ? 'Generating slide...' : 'Generating background image...'}
            </p>
            {imagePrompt && (
              <p className="text-xs text-white/80 max-w-xs px-4 leading-relaxed">&quot;{imagePrompt}&quot;</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full h-full flex items-center justify-center p-8"
      style={backgroundStyle}
    >
      <div className="w-full max-w-4xl">
        <TiptapEditor
          content={displayContent}
          onChange={handleContentChange}
          placeholder="Enter slide content..."
          className="w-full [&_.ProseMirror]:text-white [&_.ProseMirror_h1]:text-white [&_.ProseMirror_h2]:text-white [&_.ProseMirror_h3]:text-white [&_.ProseMirror_p]:text-white"
          editable={isEditable}
        />
      </div>
    </div>
  );
} 