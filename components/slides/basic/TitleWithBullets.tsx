'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface TitleWithBulletsProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  theme?: 'light' | 'dark';
}

export function TitleWithBullets({ 
  title, 
  bulletPoints = [], 
  isGenerating, 
  onUpdate, 
  isEditable = false,
  theme = 'light'
}: TitleWithBulletsProps) {

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
    'First key point about your topic',
    'Second important consideration or detail',
    'Third supporting argument or example',
    'Fourth conclusion or call to action'
  ];

  const displayBulletPoints = bulletPoints.length > 0 ? bulletPoints : defaultBulletPoints;

  const isDark = theme === 'dark';

  return (
    <SlideWrapper>
      {/* Title */}
      {(title || isEditable) && (
        <div className="mb-8">
          {isGenerating ? (
            <div className={`h-12 rounded w-full animate-pulse ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
          ) : isEditable ? (
            <TiptapEditor
              content={title || 'Slide Title'}
              onChange={handleTitleChange}
              placeholder="Enter slide title..."
              variant="title"
              className={`text-left ${isDark ? '[&_.ProseMirror]:text-white' : ''}`}
            />
          ) : (
            <h1 className={`text-3xl md:text-4xl font-bold text-left leading-tight ${
              isDark ? 'text-white drop-shadow-lg' : 'text-gray-900 drop-shadow-sm'
            }`}>
              {title}
            </h1>
          )}
        </div>
      )}

      {/* Bullet Points */}
      <div className="flex-1 flex flex-col justify-start">
        {isGenerating ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4].map((i) => (
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
        ) : isEditable ? (
          <TiptapEditor
            content={`<ul>${displayBulletPoints.map(point => `<li>${point}</li>`).join('')}</ul>`}
            onChange={handleBulletPointsChange}
            placeholder="• Add your bullet points here..."
            variant="body"
            className={`[&_.ProseMirror_ul]:space-y-4 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-4 ${
              isDark ? '[&_.ProseMirror]:text-gray-300' : ''
            }`}
          />
        ) : (
          displayBulletPoints && displayBulletPoints.length > 0 && (
            <ul className="space-y-4 list-none">
              {displayBulletPoints.map((point, index) => (
                <li key={index} className="flex items-start space-x-4">
                  <div className={`w-2 h-2 rounded-full mt-3 flex-shrink-0 ${
                    isDark ? 'bg-white' : 'bg-gray-900'
                  }`}></div>
                  <p className={`text-lg md:text-xl leading-relaxed font-normal ${
                    isDark ? 'text-white/90 drop-shadow-md' : 'text-gray-800 drop-shadow-sm'
                  }`}>
                    {point}
                  </p>
                </li>
              ))}
            </ul>
          )
        )}
      </div>
    </SlideWrapper>
  );
}