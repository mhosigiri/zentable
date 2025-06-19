'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface TitleWithBulletsAndImageProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  theme?: 'light' | 'dark';
}

export function TitleWithBulletsAndImage({ 
  title, 
  bulletPoints = [], 
  imageUrl, 
  imagePrompt, 
  isGenerating, 
  isGeneratingImage,
  onUpdate, 
  isEditable = false,
  theme = 'light'
}: TitleWithBulletsAndImageProps) {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleTitleChange = (newTitle: string) => {
    if (onUpdate) {
      onUpdate({ title: newTitle.replace(/<[^>]*>/g, '') });
    }
  };

  const handleBulletPointsChange = (newContent: string) => {
    if (onUpdate) {
      // Convert HTML to bullet points array
      const div = document.createElement('div');
      div.innerHTML = newContent;
      const listItems = div.querySelectorAll('li');
      const points = Array.from(listItems).map(li => li.textContent || '').filter(text => text.trim());
      
      // If no list items, split by line breaks
      if (points.length === 0) {
        const textContent = div.textContent || '';
        const lines = textContent.split('\n').filter(line => line.trim());
        onUpdate({ bulletPoints: lines });
      } else {
        onUpdate({ bulletPoints: points });
      }
    }
  };

  // Default bullet points if none provided
  const defaultBulletPoints = [
    'Key benefit or feature of your solution',
    'Important detail or supporting evidence',
    'Additional value proposition or example',
    'Call to action or next steps'
  ];

  const displayBulletPoints = bulletPoints.length > 0 ? bulletPoints : defaultBulletPoints;

  const isDark = theme === 'dark';

  return (
    <SlideWrapper layout="horizontal">
      {/* Content Section */}
      <div className="w-2/3 h-full min-h-[500px] flex flex-col justify-center p-8">
        {/* Title */}
        {(title || isEditable) && (
          <div className="mb-6">
            {isGenerating ? (
              <div className={`h-10 rounded w-3/4 animate-pulse ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
            ) : isEditable ? (
              <TiptapEditor
                content={title || 'Slide Title'}
                onChange={handleTitleChange}
                placeholder="Enter slide title..."
                variant="subtitle"
                className={`text-left ${isDark ? '[&_.ProseMirror]:text-white' : ''}`}
              />
            ) : (
              <h1 className={`text-xl md:text-2xl font-bold leading-tight ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>
                {title}
              </h1>
            )}
          </div>
        )}

        {/* Bullet Points */}
        <div className="flex-1">
          {isGenerating ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    isDark ? 'bg-gray-600' : 'bg-gray-200'
                  }`}></div>
                  <div className="flex-1 space-y-1">
                    <div className={`h-4 rounded w-full ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-4 rounded w-3/4 ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          ) : isEditable ? (
            <TiptapEditor
              content={`<ul>${displayBulletPoints.map(point => `<li>${point}</li>`).join('')}</ul>`}
              onChange={handleBulletPointsChange}
              placeholder="• Add your bullet points here..."
              variant="body"
              className={`[&_.ProseMirror_ul]:space-y-3 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-3 ${
                isDark ? '[&_.ProseMirror]:text-gray-300' : ''
              }`}
            />
          ) : (
            displayBulletPoints && displayBulletPoints.length > 0 && (
              <ul className="space-y-3 list-none">
                {displayBulletPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                      isDark ? 'bg-purple-400' : 'bg-purple-500'
                    }`}></div>
                    <p className={`text-sm md:text-base leading-relaxed ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {point}
                    </p>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>

      {/* Image Section */}
      <div className="w-1/3 h-full min-h-[500px] flex items-center justify-center p-8">
        <div className="w-full h-80 relative rounded-xl overflow-hidden">
          {isGenerating || isGeneratingImage || imageLoading ? (
            <div className={`w-full h-full flex items-center justify-center rounded-xl ${
              isDark 
                ? 'bg-gradient-to-br from-slate-800 to-slate-700' 
                : 'bg-gradient-to-br from-slate-100 to-slate-200'
            }`}>
              <div className="text-center space-y-4">
                <div className={`w-16 h-16 rounded-xl mx-auto flex items-center justify-center shadow-sm ${
                  isDark ? 'bg-slate-600/50' : 'bg-white/80'
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
          ) : imageError ? (
            <div className={`w-full h-full flex items-center justify-center rounded-xl ${
              isDark 
                ? 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 border border-slate-600' 
                : 'bg-gradient-to-br from-slate-200 via-slate-100 to-white border border-slate-200'
            }`}>
              <div className="text-center space-y-3">
                <div className={`w-20 h-20 rounded-xl mx-auto flex items-center justify-center shadow-sm ${
                  isDark 
                    ? 'bg-gradient-to-br from-slate-700 to-slate-600 border border-slate-500' 
                    : 'bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200'
                }`}>
                  <span className="text-3xl opacity-60">🖼️</span>
                </div>
                <div className="space-y-1">
                  <p className={`text-sm font-medium ${
                    isDark ? 'text-slate-300' : 'text-slate-600'
                  }`}>Image placeholder</p>
                  <p className={`text-xs ${
                    isDark ? 'text-slate-400' : 'text-slate-500'
                  }`}>Visual content will appear here</p>
                </div>
              </div>
            </div>
          ) : (
            <div className={`w-full h-full flex items-center justify-center rounded-xl overflow-hidden ${
              isDark ? 'bg-slate-800' : 'bg-slate-900'
            }`}>
              <img
                src={imageUrl}
                alt={imagePrompt || 'Slide image'}
                className="w-full h-full object-cover rounded-xl"
                onLoad={() => setImageLoading(false)}
                onError={() => {
                  setImageError(true);
                  setImageLoading(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
    </SlideWrapper>
  );
}