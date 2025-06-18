'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from './SlideRenderer';

interface BlankCardProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  theme?: 'light' | 'dark';
}

export function BlankCard({ 
  title, 
  content, 
  isGenerating, 
  onUpdate, 
  isEditable = false,
  theme = 'light'
}: BlankCardProps) {
  
  const handleTitleChange = (newTitle: string) => {
    if (onUpdate) {
      onUpdate({ title: newTitle.replace(/<[^>]*>/g, '') }); // Strip HTML tags for title
    }
  };

  const handleContentChange = (newContent: string) => {
    if (onUpdate) {
      onUpdate({ content: newContent.replace(/<[^>]*>/g, '') }); // Strip HTML tags for content
    }
  };

  const isDark = theme === 'dark';
  
  return (
    <div className={`w-full min-h-[500px] rounded-lg shadow-lg border flex flex-col items-center justify-center p-8 ${
      isDark 
        ? 'bg-gray-900 border-gray-700' 
        : 'bg-white border-gray-200'
    }`}>
      {isGenerating ? (
        <div className="animate-pulse space-y-6 w-full max-w-4xl">
          <div className={`h-12 rounded w-3/4 mx-auto ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
          <div className={`h-6 rounded w-1/2 mx-auto ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
        </div>
      ) : (
        <div className="text-center space-y-6 max-w-4xl w-full">
          {(title || isEditable) && (
            <div>
              {isEditable ? (
                <TiptapEditor
                  content={title || 'Untitled card'}
                  onChange={handleTitleChange}
                  placeholder="Enter slide title..."
                  variant="title"
                  className={`text-center ${isDark ? '[&_.ProseMirror]:text-white' : ''}`}
                />
              ) : (
                <h1 className={`text-3xl md:text-4xl font-bold mb-4 leading-tight ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>
                  {title}
                </h1>
              )}
            </div>
          )}
          
          {(content || isEditable) && (
            <div>
              {isEditable ? (
                <TiptapEditor
                  content={content || 'Start typing...'}
                  onChange={handleContentChange}
                  placeholder="Enter slide content..."
                  variant="body"
                  className={`text-center ${isDark ? '[&_.ProseMirror]:text-gray-300' : ''}`}
                />
              ) : (
                <p className={`text-base md:text-lg leading-relaxed ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  {content}
                </p>
              )}
            </div>
          )}
          
          {!title && !content && !isEditable && (
            <div className={`space-y-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              <h3 className="text-xl font-medium">Heading 3</h3>
              <p className="text-base">Start typing...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}