'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface AccentTopProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  accentColor?: string;
}

export function AccentTop({ 
  content,
  imageUrl,
  imagePrompt,
  isGenerating,
  isGeneratingImage,
  onUpdate, 
  isEditable = false,
  accentColor = '#8b5cf6'
}: AccentTopProps) {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleContentChange = (newContent: string) => {
    if (onUpdate) {
      console.log('💾 AccentTop - Content being saved:', newContent);
      onUpdate({ content: newContent });
    }
  };

  const defaultContent = `<h1>Main Slide Title</h1>
<p>This content area provides space for detailed information, bullet points, or any other content you want to highlight below the colorful accent header.</p>
<ul>
  <li>First key point or benefit</li>
  <li>Second important detail</li>
  <li>Third supporting argument</li>
</ul>`;

  const displayContent = content || defaultContent;

  return (
    <SlideWrapper>
      <div className="flex-1 flex flex-col">
        {/* Top Image Panel */}
        <div className="h-64 mb-8 relative">
          {isGenerating || isGeneratingImage || imageLoading ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-white/80 rounded-xl mx-auto flex items-center justify-center shadow-sm">
                  <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-slate-600 font-medium">
                    {isGenerating ? 'Generating slide...' : isGeneratingImage ? 'Generating image...' : 'Loading image...'}
                  </p>
                  {imagePrompt && (
                    <p className="text-xs text-slate-500 max-w-xs px-4 leading-relaxed">&quot;{imagePrompt}&quot;</p>
                  )}
                </div>
              </div>
            </div>
          ) : imageError || !imageUrl ? (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-white rounded-lg border border-slate-200">
              <div className="text-center space-y-3">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl mx-auto flex items-center justify-center shadow-sm border border-slate-200">
                  <span className="text-3xl opacity-60">🖼️</span>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-600 font-medium">Image placeholder</p>
                  <p className="text-xs text-slate-500">Visual content will appear here</p>
                </div>
              </div>
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={imagePrompt || 'Slide image'}
              className="w-full h-full object-cover rounded-lg"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          {isGenerating ? (
            <div className="animate-pulse space-y-6">
              <div className="h-12 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/5"></div>
              </div>
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-gray-200 rounded-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <TiptapEditor
              content={displayContent}
              onChange={handleContentChange}
              placeholder="Enter slide content..."
              className="w-full"
              editable={isEditable}
            />
          )}
        </div>
      </div>
    </SlideWrapper>
  );
} 