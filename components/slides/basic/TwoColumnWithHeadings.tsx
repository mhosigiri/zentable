'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface TwoColumnWithHeadingsProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  leftBullets?: string[];
  rightBullets?: string[];
}

export function TwoColumnWithHeadings({ 
  title, 
  leftHeading, 
  leftContent,
  leftBullets = [],
  rightHeading, 
  rightContent,
  rightBullets = [],
  isGenerating, 
  onUpdate, 
  isEditable = false 
}: TwoColumnWithHeadingsProps) {
  
  const handleTitleChange = (newTitle: string) => {
    if (onUpdate) {
      onUpdate({ title: newTitle.replace(/<[^>]*>/g, '') });
    }
  };

  const handleLeftHeadingChange = (newHeading: string) => {
    if (onUpdate) {
      onUpdate({ leftHeading: newHeading.replace(/<[^>]*>/g, '') });
    }
  };

  const handleLeftBulletsChange = (newContent: string) => {
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
        onUpdate({ leftBullets: lines });
      } else {
        onUpdate({ leftBullets: points });
      }
    }
  };

  const handleRightHeadingChange = (newHeading: string) => {
    if (onUpdate) {
      onUpdate({ rightHeading: newHeading.replace(/<[^>]*>/g, '') });
    }
  };

  const handleRightBulletsChange = (newContent: string) => {
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
        onUpdate({ rightBullets: lines });
      } else {
        onUpdate({ rightBullets: points });
      }
    }
  };

  // Default bullets if none provided
  const defaultLeftBullets = [
    "Your left column content here"
  ];

  const defaultRightBullets = [
    "Your right column content here"
  ];

  const displayLeftBullets = leftBullets.length > 0 ? leftBullets : defaultLeftBullets;
  const displayRightBullets = rightBullets.length > 0 ? rightBullets : defaultRightBullets;

  return (
    <SlideWrapper>
      {/* Main Title */}
      {(title || isEditable) && (
        <div className="mb-8">
          {isGenerating ? (
            <div className="h-12 bg-gray-200 rounded w-full animate-pulse"></div>
          ) : isEditable ? (
            <TiptapEditor
              content={title || 'Slide Title'}
              onChange={handleTitleChange}
              placeholder="Enter slide title..."
              variant="title"
              className="text-left"
            />
          ) : (
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left leading-tight">
              {title}
            </h1>
          )}
        </div>
      )}

      {/* Two Columns with Headings */}
      <div className="flex-1 grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-4">
          {isGenerating ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-gray-200 rounded-full mt-2"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {(leftHeading || isEditable) && (
                <div className="mb-4">
                  {isEditable ? (
                    <TiptapEditor
                      content={leftHeading || 'Understanding the Threat'}
                      onChange={handleLeftHeadingChange}
                      placeholder="Enter left heading..."
                      variant="subtitle"
                    />
                  ) : (
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
                      {leftHeading}
                    </h2>
                  )}
                </div>
              )}
              
              <div className="space-y-3">
                {isEditable ? (
                  <TiptapEditor
                    content={`<ul>${displayLeftBullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`}
                    onChange={handleLeftBulletsChange}
                    placeholder="• Add bullet points here..."
                    variant="body"
                    className="[&_.ProseMirror_ul]:space-y-2 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-2"
                  />
                ) : (
                  <ul className="space-y-3 list-none">
                    {displayLeftBullets.map((bullet, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-base text-gray-700 leading-relaxed">
                          {bullet}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {isGenerating ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-gray-200 rounded-full mt-2"></div>
                    <div className="h-4 bg-gray-200 rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {(rightHeading || isEditable) && (
                <div className="mb-4">
                  {isEditable ? (
                    <TiptapEditor
                      content={rightHeading || 'Seeking Solutions'}
                      onChange={handleRightHeadingChange}
                      placeholder="Enter right heading..."
                      variant="subtitle"
                    />
                  ) : (
                    <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
                      {rightHeading}
                    </h2>
                  )}
                </div>
              )}
              
              <div className="space-y-3">
                {isEditable ? (
                  <TiptapEditor
                    content={`<ul>${displayRightBullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`}
                    onChange={handleRightBulletsChange}
                    placeholder="• Add bullet points here..."
                    variant="body"
                    className="[&_.ProseMirror_ul]:space-y-2 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-2"
                  />
                ) : (
                  <ul className="space-y-3 list-none">
                    {displayRightBullets.map((bullet, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <div className="w-1.5 h-1.5 bg-gray-900 rounded-full mt-2 flex-shrink-0"></div>
                        <p className="text-base text-gray-700 leading-relaxed">
                          {bullet}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </SlideWrapper>
  );
}