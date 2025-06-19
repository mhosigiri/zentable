'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

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
  const hasRightBullets = rightBullets && rightBullets.length > 0;
  const hasRightContent = rightContent && rightContent.trim();

  // Default content if nothing is provided
  const defaultLeftContent = 'Your left column content here';
  const defaultRightContent = 'Your right column content here';

  const isDark = theme === 'dark';

  const renderLeftColumn = () => {
    if (isGenerating) {
      return (
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
      );
    }

    if (isEditable) {
      const editorContent = hasLeftBullets 
        ? `<ul>${leftBullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`
        : hasLeftContent 
          ? leftContent 
          : defaultLeftContent;

      return (
        <TiptapEditor
          content={editorContent}
          onChange={handleLeftContentChange}
          placeholder="Add content here..."
          variant="body"
          className={`[&_.ProseMirror_ul]:space-y-2 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-2 ${
            isDark ? '[&_.ProseMirror]:text-gray-300' : ''
          }`}
        />
      );
    }

    // Display mode
    if (hasLeftBullets) {
      return (
        <ul className="space-y-3 list-none">
          {leftBullets.map((bullet, index) => (
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
      );
    }

    // Render as paragraph content
    const displayContent = hasLeftContent ? leftContent : defaultLeftContent;
    return (
      <div className={`text-base leading-relaxed ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {displayContent.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-3 last:mb-0">
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

  const renderRightColumn = () => {
    if (isGenerating) {
      return (
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
      );
    }

    if (isEditable) {
      const editorContent = hasRightBullets 
        ? `<ul>${rightBullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`
        : hasRightContent 
          ? rightContent 
          : defaultRightContent;

      return (
        <TiptapEditor
          content={editorContent}
          onChange={handleRightContentChange}
          placeholder="Add content here..."
          variant="body"
          className={`[&_.ProseMirror_ul]:space-y-2 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-2 ${
            isDark ? '[&_.ProseMirror]:text-gray-300' : ''
          }`}
        />
      );
    }

    // Display mode
    if (hasRightBullets) {
      return (
        <ul className="space-y-3 list-none">
          {rightBullets.map((bullet, index) => (
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
      );
    }

    // Render as paragraph content
    const displayContent = hasRightContent ? rightContent : defaultRightContent;
    return (
      <div className={`text-base leading-relaxed ${
        isDark ? 'text-gray-300' : 'text-gray-700'
      }`}>
        {displayContent.split('\n').map((paragraph, index) => (
          <p key={index} className="mb-3 last:mb-0">
            {paragraph}
          </p>
        ))}
      </div>
    );
  };

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
          {renderLeftColumn()}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {renderRightColumn()}
        </div>
      </div>
    </SlideWrapper>
  );
}