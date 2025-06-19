'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface AccentTopProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  theme?: 'light' | 'dark';
}

export function AccentTop({ 
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
}: AccentTopProps) {
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
    <SlideWrapper layout="vertical" className="p-0 gap-0">
      {/* Top Image Section - Full Width */}
      <div className="w-full h-1/3 max-h-48 relative overflow-hidden rounded-t-lg">
        {isGenerating || isGeneratingImage || imageLoading ? (
          <div className={`w-full h-full flex items-center justify-center ${
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
        ) : imageError || !imageUrl ? (
          <div className={`w-full h-full flex items-center justify-center ${
            isDark 
              ? 'bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 border-slate-600' 
              : 'bg-gradient-to-br from-slate-200 via-slate-100 to-white border-slate-200'
          } border-b`}>
            <div className="text-center space-y-3">
              <div className={`w-20 h-20 rounded-xl mx-auto flex items-center justify-center shadow-sm border ${
                isDark 
                  ? 'bg-gradient-to-br from-slate-600 to-slate-700 border-slate-500' 
                  : 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-200'
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
          <img
            src={imageUrl}
            alt={imagePrompt || 'Slide image'}
            className="w-full h-full object-cover object-top"
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
        )}
      </div>

      {/* Bottom Content Section */}
      <div className="w-full h-2/3 flex flex-col justify-center px-12 py-8">
        {isGenerating ? (
          <div className="animate-pulse space-y-6">
            <div className={`h-12 rounded w-full ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-4">
                  <div className={`w-2 h-2 rounded-full mt-3 flex-shrink-0 ${
                    isDark ? 'bg-gray-600' : 'bg-gray-200'
                  }`}></div>
                  <div className="flex-1 space-y-2">
                    <div className={`h-5 rounded w-full ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-5 rounded w-4/5 ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6 h-full flex flex-col justify-center">
            {/* Title */}
            {(title || isEditable) && (
              <div>
                {isEditable ? (
                  <TiptapEditor
                    content={title || 'Slide Title'}
                    onChange={handleTitleChange}
                    placeholder="Enter slide title..."
                    variant="title"
                    className={`text-center ${isDark ? '[&_.ProseMirror]:text-white' : ''}`}
                  />
                ) : (
                  <h1 className={`text-3xl md:text-4xl font-bold text-center leading-tight ${
                    isDark ? 'text-white drop-shadow-lg' : 'text-gray-900 drop-shadow-sm'
                  }`}>
                    {title}
                  </h1>
                )}
              </div>
            )}
            
            {/* Content or Bullet Points */}
            <div className="flex-1 flex flex-col justify-start">
              {hasBullets ? (
                // Bullet Points
                isEditable ? (
                  <TiptapEditor
                    content={`<ul>${bulletPoints.map(point => `<li>${point}</li>`).join('')}</ul>`}
                    onChange={handleBulletPointsChange}
                    placeholder="• Add your bullet points here..."
                    variant="body"
                    className={`[&_.ProseMirror_ul]:space-y-3 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-4 ${
                      isDark ? '[&_.ProseMirror]:text-gray-300' : ''
                    }`}
                  />
                ) : (
                  <ul className="space-y-3 list-none">
                    {bulletPoints.map((point, index) => (
                      <li key={index} className="flex items-start space-x-4">
                        <div className={`w-2 h-2 rounded-full mt-3 flex-shrink-0 ${
                          isDark ? 'bg-white' : 'bg-gray-900'
                        }`}></div>
                        <p className={`text-base md:text-lg leading-relaxed font-normal ${
                          isDark ? 'text-white/90 drop-shadow-md' : 'text-gray-800 drop-shadow-sm'
                        }`}>
                          {point}
                        </p>
                      </li>
                    ))}
                  </ul>
                )
              ) : hasContent || isEditable ? (
                // Text Content
                isEditable ? (
                  <TiptapEditor
                    content={content || 'Add your content here...'}
                    onChange={handleContentChange}
                    placeholder="Enter slide content..."
                    variant="body"
                    className={isDark ? '[&_.ProseMirror]:text-gray-300' : ''}
                  />
                ) : (
                  <div className={`text-base md:text-lg leading-relaxed text-center ${
                    isDark ? 'text-white/90 drop-shadow-md' : 'text-gray-800 drop-shadow-sm'
                  }`} dangerouslySetInnerHTML={{ __html: content || '' }} />
                )
              ) : null}
            </div>
          </div>
        )}
      </div>
    </SlideWrapper>
  );
} 