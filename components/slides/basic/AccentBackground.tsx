'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface AccentBackgroundProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  theme?: 'light' | 'dark';
}

export function AccentBackground({ 
  title, 
  content,
  bulletPoints = [],
  imageUrl, 
  imagePrompt, 
  isGenerating, 
  isGeneratingImage,
  onUpdate, 
  isEditable = false,
  theme = 'light'
}: AccentBackgroundProps) {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleTitleChange = (newTitle: string) => {
    if (onUpdate) {
      onUpdate({ title: newTitle.replace(/<[^>]*>/g, '') });
    }
  };

  const handleContentChange = (newContent: string) => {
    if (onUpdate) {
      onUpdate({ content: newContent.replace(/<[^>]*>/g, '') });
    }
  };

  const handleBulletPointsChange = (newContent: string) => {
    if (onUpdate) {
      const div = document.createElement('div');
      div.innerHTML = newContent;
      const listItems = div.querySelectorAll('li');
      const points = Array.from(listItems).map(li => li.textContent || '').filter(text => text.trim());

      if (points.length === 0) {
        const textContent = div.textContent || '';
        const lines = textContent.split('\n').filter(line => line.trim());
        onUpdate({ bulletPoints: lines });
      } else {
        onUpdate({ bulletPoints: points });
      }
    }
  };

  const isDark = theme === 'dark';
  const hasContent = content && content.trim().length > 0;
  const hasBullets = bulletPoints && bulletPoints.length > 0;

  return (
    <SlideWrapper className="p-0 relative overflow-hidden">
      {/* Background Image */}
      {!isGenerating && !isGeneratingImage && !imageLoading && !imageError && imageUrl && (
        <>
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </>
      )}

      {/* Loading State */}
      {(isGenerating || isGeneratingImage || imageLoading) && (
        <div className={`absolute inset-0 flex items-center justify-center ${
          isDark ? 'bg-gradient-to-br from-slate-800 to-slate-900' : 'bg-gradient-to-br from-slate-100 to-slate-200'
        }`}>
          <div className="text-center space-y-4">
            <div className={`w-16 h-16 rounded-xl mx-auto flex items-center justify-center shadow-sm ${
              isDark ? 'bg-slate-700/80' : 'bg-white/80'
            }`}>
              <Loader2 className={`w-8 h-8 animate-spin ${
                isDark ? 'text-slate-300' : 'text-slate-400'
              }`} />
            </div>
            <div className="space-y-2">
              <p className={`text-sm font-medium ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {isGenerating ? 'Generating slide...' : isGeneratingImage ? 'Generating image...' : 'Loading image...'}
              </p>
              {imagePrompt && (
                <p className={`text-xs max-w-xs px-4 leading-relaxed ${
                  isDark ? 'text-slate-400' : 'text-slate-500'
                }`}>"{imagePrompt}"</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Placeholder when no image */}
      {!isGenerating && !isGeneratingImage && !imageLoading && (imageError || !imageUrl) && (
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900' 
            : 'bg-gradient-to-br from-slate-200 via-slate-100 to-white'
        }`}>
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <div className="text-center space-y-3">
              <div className={`w-24 h-24 rounded-xl mx-auto flex items-center justify-center shadow-sm border ${
                isDark 
                  ? 'bg-gradient-to-br from-slate-600 to-slate-700 border-slate-500' 
                  : 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-200'
              }`}>
                <span className="text-4xl opacity-60">🖼️</span>
              </div>
              <div className="space-y-1">
                <p className={`text-sm font-medium ${
                  isDark ? 'text-slate-300' : 'text-slate-600'
                }`}>Background image placeholder</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col justify-center px-12 py-8">
        {isGenerating ? (
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-white/20 rounded w-full"></div>
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-white/30 rounded-full mt-3 flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-white/20 rounded w-full"></div>
                    <div className="h-5 bg-white/20 rounded w-4/5"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 h-full flex flex-col justify-center">
            {/* Title */}
            {(title || isEditable) && (
              <div>
                {isEditable ? (
                  <TiptapEditor
                    content={title || 'Slide Title'}
                    onChange={handleTitleChange}
                    placeholder="Enter slide title..."
                    variant="title"
                    className="text-center [&_.ProseMirror]:text-white [&_.ProseMirror]:drop-shadow-lg"
                  />
                ) : (
                  <h1 className="text-3xl md:text-4xl font-bold text-center leading-tight text-white drop-shadow-lg">
                    {title}
                  </h1>
                )}
              </div>
            )}
            
            {/* Content or Bullet Points */}
            <div className="flex-1 flex flex-col justify-start max-w-4xl mx-auto">
              {hasBullets ? (
                // Bullet Points
                isEditable ? (
                  <TiptapEditor
                    content={`<ul>${bulletPoints.map(point => `<li>${point}</li>`).join('')}</ul>`}
                    onChange={handleBulletPointsChange}
                    placeholder="• Add your bullet points here..."
                    variant="body"
                    className="[&_.ProseMirror_ul]:space-y-4 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-4 [&_.ProseMirror]:text-white [&_.ProseMirror]:drop-shadow-md"
                  />
                ) : (
                  <ul className="space-y-4 list-none">
                    {bulletPoints.map((point, index) => (
                      <li key={index} className="flex items-start space-x-4">
                        <div className="w-2 h-2 bg-white rounded-full mt-3 flex-shrink-0"></div>
                        <p className="text-lg md:text-xl leading-relaxed font-normal text-white drop-shadow-md">
                          {point}
                        </p>
                      </li>
                    ))}
                  </ul>
                )
              ) : hasContent || isEditable ? (
                // Text Content
                <div className="text-center">
                  {isEditable ? (
                    <TiptapEditor
                      content={content || 'Add your content here...'}
                      onChange={handleContentChange}
                      placeholder="Enter slide content..."
                      variant="body"
                      className="[&_.ProseMirror]:text-white [&_.ProseMirror]:drop-shadow-md"
                    />
                  ) : (
                    <div 
                      className="text-base md:text-lg leading-relaxed text-white drop-shadow-md"
                      dangerouslySetInnerHTML={{ __html: content || '' }} 
                    />
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Hidden image for loading detection */}
      {imageUrl && (
        <img
          src={imageUrl}
          alt={imagePrompt || 'Background image'}
          className="hidden"
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
        />
      )}
    </SlideWrapper>
  );
} 