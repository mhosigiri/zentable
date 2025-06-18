'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from './SlideRenderer';

interface TwoColumnsProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  theme?: 'light' | 'dark';
}

export function TwoColumns({ 
  title, 
  leftContent,
  leftBullets = [],
  rightContent,
  rightBullets = [],
  isGenerating, 
  onUpdate, 
  isEditable = false,
  theme = 'light'
}: TwoColumnsProps) {
  
  const handleTitleChange = (newTitle: string) => {
    if (onUpdate) {
      onUpdate({ title: newTitle.replace(/<[^>]*>/g, '') });
    }
  };

  const handleLeftBulletsChange = (newContent: string) => {
    if (onUpdate) {
      const div = document.createElement('div');
      div.innerHTML = newContent;
      const listItems = div.querySelectorAll('li');
      const points = Array.from(listItems).map(li => li.textContent || '').filter(text => text.trim());
      
      if (points.length === 0) {
        const textContent = div.textContent || '';
        const lines = textContent.split('\n').filter(line => line.trim());
        onUpdate({ leftBullets: lines });
      } else {
        onUpdate({ leftBullets: points });
      }
    }
  };

  const handleRightBulletsChange = (newContent: string) => {
    if (onUpdate) {
      const div = document.createElement('div');
      div.innerHTML = newContent;
      const listItems = div.querySelectorAll('li');
      const points = Array.from(listItems).map(li => li.textContent || '').filter(text => text.trim());
      
      if (points.length === 0) {
        const textContent = div.textContent || '';
        const lines = textContent.split('\n').filter(line => line.trim());
        onUpdate({ rightBullets: lines });
      } else {
        onUpdate({ rightBullets: points });
      }
    }
  };

  // Default bullets if none provided
  const defaultLeftBullets = [
    'Your left column content here'
  ];

  const defaultRightBullets = [
    'Your right column content here'
  ];

  const displayLeftBullets = leftBullets.length > 0 ? leftBullets : defaultLeftBullets;
  const displayRightBullets = rightBullets.length > 0 ? rightBullets : defaultRightBullets;

  const isDark = theme === 'dark';

  return (
    <div className={`w-full min-h-[500px] rounded-lg shadow-lg border flex flex-col p-8 ${
      isDark 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {/* Main Title */}
      {(title || isEditable) && (
        <div className="mb-8">
          {isGenerating ? (
            <div className={`h-12 rounded w-full animate-pulse ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
          ) : isEditable ? (
            <TiptapEditor
              content={title || 'The High Cost of Space Exploration'}
              onChange={handleTitleChange}
              placeholder="Enter slide title..."
              variant="title"
              className={`text-center ${isDark ? '[&_.ProseMirror]:text-white' : ''}`}
            />
          ) : (
            <h1 className={`text-3xl md:text-4xl font-bold text-center leading-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h1>
          )}
        </div>
      )}

      {/* Two Columns */}
      <div className="flex-1 grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-4">
          {isGenerating ? (
            <div className="animate-pulse space-y-4">
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className={`w-1 h-1 rounded-full mt-2 ${
                      isDark ? 'bg-gray-600' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-4 rounded flex-1 ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {isEditable ? (
                <TiptapEditor
                  content={`<ul>${displayLeftBullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`}
                  onChange={handleLeftBulletsChange}
                  placeholder="• Add bullet points here..."
                  variant="body"
                  className={`[&_.ProseMirror_ul]:space-y-2 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-2 ${
                    isDark ? '[&_.ProseMirror]:text-gray-300' : ''
                  }`}
                />
              ) : (
                <ul className="space-y-3 list-none">
                  {displayLeftBullets.map((bullet, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                        isDark ? 'bg-white' : 'bg-gray-900'
                      }`}></div>
                      <p className={`text-base leading-relaxed ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {bullet}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {isGenerating ? (
            <div className="animate-pulse space-y-4">
              <div className="space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className={`w-1 h-1 rounded-full mt-2 ${
                      isDark ? 'bg-gray-600' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-4 rounded flex-1 ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {isEditable ? (
                <TiptapEditor
                  content={`<ul>${displayRightBullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`}
                  onChange={handleRightBulletsChange}
                  placeholder="• Add bullet points here..."
                  variant="body"
                  className={`[&_.ProseMirror_ul]:space-y-2 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-2 ${
                    isDark ? '[&_.ProseMirror]:text-gray-300' : ''
                  }`}
                />
              ) : (
                <ul className="space-y-3 list-none">
                  {displayRightBullets.map((bullet, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className={`w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0 ${
                        isDark ? 'bg-white' : 'bg-gray-900'
                      }`}></div>
                      <p className={`text-base leading-relaxed ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {bullet}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}