'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from './SlideRenderer';

interface ImageAndTextProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
}

export function ImageAndText({ 
  title, 
  content, 
  imageUrl, 
  imagePrompt, 
  isGenerating, 
  isGeneratingImage,
  onUpdate, 
  isEditable = false 
}: ImageAndTextProps) {
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
    <div className="w-full min-h-[500px] bg-white rounded-lg shadow-lg border border-gray-200 flex p-8 gap-8">
      {/* Image Section */}
      <div className="w-1/2 h-full min-h-[400px] relative bg-gray-100 rounded-lg overflow-hidden">
        {isGenerating || isGeneratingImage || imageLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
              <p className="text-sm text-gray-500">
                {isGenerating ? 'Generating slide...' : isGeneratingImage ? 'Generating image...' : 'Loading image...'}
              </p>
              {imagePrompt && (
                <p className="text-xs text-gray-400 max-w-xs px-4">"{imagePrompt}"</p>
              )}
            </div>
          </div>
        ) : imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-purple-600">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-white/20 rounded-lg mx-auto flex items-center justify-center">
                <span className="text-2xl">🖼️</span>
              </div>
              <p className="text-sm text-white/80">Image placeholder</p>
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
    </div>
  );
}