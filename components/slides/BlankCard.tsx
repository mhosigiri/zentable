'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from './SlideRenderer';

interface BlankCardProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
}

export function BlankCard({ 
  title, 
  content, 
  isGenerating, 
  onUpdate, 
  isEditable = false 
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

  return (
    <div className="w-full min-h-[500px] bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col items-center justify-center p-8">
      {isGenerating ? (
        <div className="animate-pulse space-y-4 w-full">
          <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
        </div>
      ) : (
        <div className="text-center space-y-4 max-w-4xl w-full">
          {(title || isEditable) && (
            <div className="mb-4">
              {isEditable ? (
                <TiptapEditor
                  content={title || 'Slide Title'}
                  onChange={handleTitleChange}
                  placeholder="Enter slide title..."
                  className="text-center"
                />
              ) : (
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
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
                  className="text-center"
                />
              ) : (
                <p className="text-base md:text-lg text-gray-600 leading-relaxed">
                  {content}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}