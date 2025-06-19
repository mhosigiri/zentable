'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface TextAndImageProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
}

export function TextAndImage({ 
  title, 
  content, 
  imageUrl, 
  imagePrompt, 
  isGenerating, 
  isGeneratingImage,
  onUpdate, 
  isEditable = false 
}: TextAndImageProps) {
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

  return (
    <SlideWrapper layout="horizontal">
      {/* Text Section */}
      <div className="w-1/2 h-full min-h-[400px] flex flex-col justify-center">
        {isGenerating ? (
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-full"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {(title || isEditable) && (
              <div>
                {isEditable ? (
                  <TiptapEditor
                    content={title || 'Slide Title'}
                    onChange={handleTitleChange}
                    placeholder="Enter slide title..."
                    variant="title"
                    className="text-left"
                  />
                ) : (
                  <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
                    {title}
                  </h1>
                )}
              </div>
            )}
            
            {(content || isEditable) && (
              <div>
                {isEditable ? (
                  <TiptapEditor
                    content={content || 'Add your content here...'}
                    onChange={handleContentChange}
                    placeholder="Enter slide content..."
                    variant="body"
                  />
                ) : (
                  <p className="text-base md:text-lg text-gray-700 leading-relaxed">
                    {content}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Image Section */}
      <div className="w-1/2 h-full min-h-[400px] relative rounded-lg overflow-hidden flex items-center justify-center">
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
                  <p className="text-xs text-slate-500 max-w-xs px-4 leading-relaxed">"{imagePrompt}"</p>
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
          <div className="w-full h-full bg-slate-900 flex items-center justify-center rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={imagePrompt || 'Slide image'}
              className="max-w-full max-h-full object-contain rounded-lg"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
          </div>
        )}
      </div>
    </SlideWrapper>
  );
}