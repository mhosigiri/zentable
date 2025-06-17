'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from './SlideRenderer';

interface TitleWithBulletsAndImageProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
}

export function TitleWithBulletsAndImage({ 
  title, 
  bulletPoints, 
  imageUrl, 
  imagePrompt, 
  isGenerating, 
  onUpdate, 
  isEditable = false 
}: TitleWithBulletsAndImageProps) {
  const [imageLoading, setImageLoading] = useState(!imageUrl);
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

  // Convert bullet points to HTML for editor
  const bulletPointsHTML = bulletPoints?.length 
    ? `<ul>${bulletPoints.map(point => `<li>${point}</li>`).join('')}</ul>`
    : '<ul><li>First point</li><li>Second point</li><li>Third point</li></ul>';

  return (
    <div className="w-full min-h-[500px] bg-white rounded-lg shadow-lg border border-gray-200 flex">
      {/* Content Section */}
      <div className="w-2/3 h-full min-h-[500px] flex flex-col justify-center p-6">
        {/* Title */}
        {(title || isEditable) && (
          <div className="mb-4">
            {isGenerating ? (
              <div className="h-8 bg-gray-200 rounded w-3/4 animate-pulse"></div>
            ) : isEditable ? (
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

        {/* Bullet Points */}
        <div className="flex-1">
          {isGenerating ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-gray-200 rounded-full mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-full mb-1"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : isEditable ? (
            <TiptapEditor
              content={bulletPointsHTML}
              onChange={handleBulletPointsChange}
              placeholder="• Add your bullet points here..."
              className="prose-ul:space-y-3 prose-li:flex prose-li:items-start prose-li:space-x-3"
            />
          ) : (
            bulletPoints && bulletPoints.length > 0 && (
              <ul className="space-y-3">
                {bulletPoints.map((point, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed">
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
      <div className="w-1/3 h-full min-h-[500px] relative bg-gray-100 rounded-r-lg overflow-hidden">
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
    </div>
  );
}