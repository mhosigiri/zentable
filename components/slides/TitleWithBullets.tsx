'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from './SlideRenderer';

interface TitleWithBulletsProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
}

export function TitleWithBullets({ 
  title, 
  bulletPoints, 
  isGenerating, 
  onUpdate, 
  isEditable = false 
}: TitleWithBulletsProps) {

  const handleTitleChange = (newTitle: string) => {
    if (onUpdate) {
      onUpdate({ title: newTitle.replace(/<[^>]*>/g, '') }); // Strip HTML tags for title
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
    <div className="w-full min-h-[500px] bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col p-8">
      {/* Title */}
      {(title || isEditable) && (
        <div className="mb-8">
          {isGenerating ? (
            <div className="h-12 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
          ) : isEditable ? (
            <div className="text-center">
              <TiptapEditor
                content={title || 'Slide Title'}
                onChange={handleTitleChange}
                placeholder="Enter slide title..."
                className="text-center"
              />
            </div>
          ) : (
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-left leading-tight mb-0">
              {title}
            </h2>
          )}
        </div>
      )}

      {/* Bullet Points */}
      <div className="flex-1 flex flex-col justify-start">
        {isGenerating ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-gray-200 rounded-full mt-3 flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-5 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : isEditable ? (
          <TiptapEditor
            content={bulletPointsHTML}
            onChange={handleBulletPointsChange}
            placeholder="• Add your bullet points here..."
            className="[&_.ProseMirror_ul]:space-y-3 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-3 [&_.ProseMirror_li]:text-lg [&_.ProseMirror_li]:leading-relaxed [&_.ProseMirror_li]:text-gray-700"
          />
        ) : (
          bulletPoints && bulletPoints.length > 0 && (
            <ul className="space-y-4 list-none">
              {bulletPoints.map((point, index) => (
                <li key={index} className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-gray-900 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-normal">
                    {point}
                  </p>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </div>
  );
}