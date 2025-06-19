'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface TitleWithTextProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  theme?: 'light' | 'dark';
}

export function TitleWithText({ 
  title, 
  content,
  isGenerating, 
  onUpdate, 
  isEditable = false,
  theme = 'light'
}: TitleWithTextProps) {

  const handleTitleChange = (newTitle: string) => {
    if (onUpdate) {
      onUpdate({ title: newTitle.replace(/<[^>]*>/g, '') });
    }
  };

  const handleContentChange = (newContent: string) => {
    if (onUpdate) {
      onUpdate({ content: newContent });
    }
  };

  const defaultContent = "This is a concise paragraph that provides key information about your topic. Keep it brief and focused on the main message you want to convey to your audience.";

  const displayContent = content || defaultContent;

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

      {/* Content */}
      <div className="flex-1 flex flex-col justify-start">
        {isGenerating ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`h-5 rounded w-${i === 5 ? '3/4' : 'full'} ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
            ))}
          </div>
        ) : isEditable ? (
          <TiptapEditor
            content={displayContent}
            onChange={handleContentChange}
            placeholder="Add a short paragraph here..."
            variant="body"
            className={`prose prose-lg max-w-none ${
              isDark ? '[&_.ProseMirror]:text-gray-300 prose-invert' : ''
            }`}
          />
        ) : (
          <div className={`prose prose-lg max-w-none ${
            isDark ? 'prose-invert text-white/90' : 'text-gray-800'
          }`}>
            <div dangerouslySetInnerHTML={{ __html: displayContent }} />
          </div>
        )}
      </div>
    </SlideWrapper>
  );
} 