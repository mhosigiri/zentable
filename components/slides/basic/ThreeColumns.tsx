'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface ThreeColumnsProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  theme?: 'light' | 'dark';
}

export function ThreeColumns({ 
  title, 
  leftContent,
  leftBullets = [],
  centerContent,
  centerBullets = [],
  rightContent,
  rightBullets = [],
  isGenerating, 
  onUpdate, 
  isEditable = false,
  theme = 'light'
}: ThreeColumnsProps) {
  
  const handleTitleChange = (newTitle: string) => {
    if (onUpdate) {
      onUpdate({ title: newTitle.replace(/<[^>]*>/g, '') });
    }
  };

  const handleLeftContentChange = (newContent: string) => {
    if (onUpdate) {
      const div = document.createElement('div');
      div.innerHTML = newContent;
      const listItems = div.querySelectorAll('li');
      
      if (listItems.length > 0) {
        // Content has bullet points
        const points = Array.from(listItems).map(li => li.textContent || '').filter(text => text.trim());
        onUpdate({ leftBullets: points, leftContent: undefined });
      } else {
        // Content is paragraph format
        const textContent = div.textContent || newContent.replace(/<[^>]*>/g, '');
        onUpdate({ leftContent: textContent, leftBullets: [] });
      }
    }
  };

  const handleCenterContentChange = (newContent: string) => {
    if (onUpdate) {
      const div = document.createElement('div');
      div.innerHTML = newContent;
      const listItems = div.querySelectorAll('li');
      
      if (listItems.length > 0) {
        // Content has bullet points
        const points = Array.from(listItems).map(li => li.textContent || '').filter(text => text.trim());
        onUpdate({ centerBullets: points, centerContent: undefined });
      } else {
        // Content is paragraph format
        const textContent = div.textContent || newContent.replace(/<[^>]*>/g, '');
        onUpdate({ centerContent: textContent, centerBullets: [] });
      }
    }
  };

  const handleRightContentChange = (newContent: string) => {
    if (onUpdate) {
      const div = document.createElement('div');
      div.innerHTML = newContent;
      const listItems = div.querySelectorAll('li');
      
      if (listItems.length > 0) {
        // Content has bullet points
        const points = Array.from(listItems).map(li => li.textContent || '').filter(text => text.trim());
        onUpdate({ rightBullets: points, rightContent: undefined });
      } else {
        // Content is paragraph format
        const textContent = div.textContent || newContent.replace(/<[^>]*>/g, '');
        onUpdate({ rightContent: textContent, rightBullets: [] });
      }
    }
  };

  // Determine what to display for each column
  const hasLeftBullets = leftBullets && leftBullets.length > 0;
  const hasLeftContent = leftContent && leftContent.trim();
  const hasCenterBullets = centerBullets && centerBullets.length > 0;
  const hasCenterContent = centerContent && centerContent.trim();
  const hasRightBullets = rightBullets && rightBullets.length > 0;
  const hasRightContent = rightContent && rightContent.trim();

  // Default content if nothing is provided
  const defaultLeftContent = 'Technology Infrastructure and modern solutions';
  const defaultCenterContent = 'Process Optimization and methodologies';
  const defaultRightContent = 'People & Culture transformation';

  const displayLeftContent = hasLeftContent ? leftContent : defaultLeftContent;
  const displayCenterContent = hasCenterContent ? centerContent : defaultCenterContent;
  const displayRightContent = hasRightContent ? rightContent : defaultRightContent;

  const isDark = theme === 'dark';

  return (
    <SlideWrapper>
      {/* Main Title */}
      {(title || isEditable) && (
        <div className="mb-8">
          {isGenerating ? (
            <div className={`h-12 rounded w-full animate-pulse ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
          ) : isEditable ? (
            <TiptapEditor
              content={title || 'Digital Transformation Strategy'}
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

      {/* Three Columns */}
      <div className="flex-1 grid grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-3">
          {isGenerating ? (
            <div className="animate-pulse space-y-3">
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className={`w-1 h-1 rounded-full mt-2 ${
                      isDark ? 'bg-gray-600' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-3 rounded flex-1 ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {isEditable ? (
                <TiptapEditor
                  content={hasLeftBullets 
                    ? `<ul>${leftBullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`
                    : hasLeftContent 
                      ? leftContent 
                      : defaultLeftContent}
                  onChange={handleLeftContentChange}
                  placeholder="Add content here..."
                  variant="body"
                  className={`[&_.ProseMirror_ul]:space-y-2 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-2 ${
                    isDark ? '[&_.ProseMirror]:text-gray-300' : ''
                  }`}
                />
              ) : hasLeftBullets ? (
                <ul className="space-y-2 list-none">
                  {leftBullets.map((bullet, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                        isDark ? 'bg-white' : 'bg-gray-900'
                      }`}></div>
                      <p className={`text-sm leading-relaxed ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {bullet}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={`text-sm leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {displayLeftContent.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center Column */}
        <div className="space-y-3">
          {isGenerating ? (
            <div className="animate-pulse space-y-3">
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className={`w-1 h-1 rounded-full mt-2 ${
                      isDark ? 'bg-gray-600' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-3 rounded flex-1 ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {isEditable ? (
                <TiptapEditor
                  content={hasCenterBullets 
                    ? `<ul>${centerBullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`
                    : hasCenterContent 
                      ? centerContent 
                      : defaultCenterContent}
                  onChange={handleCenterContentChange}
                  placeholder="Add content here..."
                  variant="body"
                  className={`[&_.ProseMirror_ul]:space-y-2 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-2 ${
                    isDark ? '[&_.ProseMirror]:text-gray-300' : ''
                  }`}
                />
              ) : hasCenterBullets ? (
                <ul className="space-y-2 list-none">
                  {centerBullets.map((bullet, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                        isDark ? 'bg-white' : 'bg-gray-900'
                      }`}></div>
                      <p className={`text-sm leading-relaxed ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {bullet}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={`text-sm leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {displayCenterContent.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-3">
          {isGenerating ? (
            <div className="animate-pulse space-y-3">
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className={`w-1 h-1 rounded-full mt-2 ${
                      isDark ? 'bg-gray-600' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-3 rounded flex-1 ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {isEditable ? (
                <TiptapEditor
                  content={hasRightBullets 
                    ? `<ul>${rightBullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`
                    : hasRightContent 
                      ? rightContent 
                      : defaultRightContent}
                  onChange={handleRightContentChange}
                  placeholder="Add content here..."
                  variant="body"
                  className={`[&_.ProseMirror_ul]:space-y-2 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-2 ${
                    isDark ? '[&_.ProseMirror]:text-gray-300' : ''
                  }`}
                />
              ) : hasRightBullets ? (
                <ul className="space-y-2 list-none">
                  {rightBullets.map((bullet, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                        isDark ? 'bg-white' : 'bg-gray-900'
                      }`}></div>
                      <p className={`text-sm leading-relaxed ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {bullet}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className={`text-sm leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {displayRightContent.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-2 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </SlideWrapper>
  );
}