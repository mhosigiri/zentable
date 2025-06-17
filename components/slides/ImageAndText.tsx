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
  onUpdate, 
  isEditable = false 
}: ImageAndTextProps) {
  const [imageLoading, setImageLoading] = useState(!imageUrl);
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
    <div className="w-full min-h-[500px] bg-white rounded-lg shadow-lg border border-gray-200 flex">
      {/* Image Section */}
      <div className="w-1/2 h-full min-h-[500px] relative bg-gray-100 rounded-l-lg overflow-hidden">
        {isGenerating || imageLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center space-y-4">
              <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
              <p className="text-sm text-gray-500">
                {isGenerating ? 'Generating image...' : 'Loading image...'}
              </p>
              {imagePrompt && (
                <p className="text-xs text-gray-400 max-w-xs px-4">"{imagePrompt}"</p>
              )}
            </div>
          </div>
        ) : imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-blue-200 rounded-lg mx-auto flex items-center justify-center">
                <span className="text-2xl">🖼️</span>
              </div>
              <p className="text-sm text-gray-600">Image placeholder</p>
            </div>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={imagePrompt || 'Slide image'}
            className="w-full h-full object-cover"
            onLoad={() => setImageLoading(false)}
            onError={() => {
              setImageError(true);
              setImageLoading(false);
            }}
          />
        )}
      </div>

      {/* Text Section */}
      <div className="w-1/2 h-full min-h-[500px] flex flex-col justify-center p-6">
        {isGenerating ? (
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {(title || isEditable) && (
              <div>
                {isEditable ? (
                  <TiptapEditor
                    content={title || 'Slide Title'}
                    onChange={handleTitleChange}
                    placeholder="Enter slide title..."
                    className="text-center"
                  />
                ) : (
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                    {title}
                  </h2>
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
                  />
                ) : (
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed">
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