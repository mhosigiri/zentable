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
  content,
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

  const handleContentChange = (newContent: string) => {
    if (onUpdate) {
      // console.log('💾 TitleWithBulletsAndImage - Content being saved:', newContent);
      onUpdate({ content: newContent });
    }
  };

  // Default content with title and bullet points
  const defaultContent = `<h1>Slide Title</h1>
<ul>
  <li>Key benefit or feature of your solution</li>
  <li>Important detail or supporting evidence</li>
  <li>Additional value proposition or example</li>
  <li>Call to action or next steps</li>
</ul>`;

  const displayContent = content || defaultContent;
  const isDark = theme === 'dark';

  return (
    <SlideWrapper layout="horizontal">
      {/* Content Section */}
      <div className="w-2/3 h-full min-h-[500px] flex flex-col justify-center p-8">
            {isGenerating ? (
          <div className="animate-pulse space-y-6">
            {/* Title placeholder */}
            <div className={`h-10 rounded w-3/4 ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
            {/* Bullet points placeholder */}
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
        ) : (
            <TiptapEditor
            content={displayContent}
            onChange={handleContentChange}
            placeholder="# Enter slide title

• Add your bullet points here..."
            variant="default"
            editable={isEditable}
            className={`w-full ${
              isDark ? '[&_.ProseMirror]:text-gray-300 [&_.ProseMirror_h1]:text-white [&_.ProseMirror_h2]:text-white [&_.ProseMirror_h3]:text-white' : ''
              }`}
            />
          )}
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
                    }`}>&quot;{imagePrompt}&quot;</p>
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