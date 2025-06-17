'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from './SlideRenderer';

interface TwoColumnsProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
}

export function TwoColumns({ 
  title, 
  leftContent, 
  rightContent, 
  isGenerating, 
  onUpdate, 
  isEditable = false 
}: TwoColumnsProps) {
  
  const handleTitleChange = (newTitle: string) => {
    if (onUpdate) {
      onUpdate({ title: newTitle.replace(/<[^>]*>/g, '') });
    }
  };

  const handleLeftContentChange = (newContent: string) => {
    if (onUpdate) {
      onUpdate({ leftContent: newContent.replace(/<[^>]*>/g, '') });
    }
  };

  const handleRightContentChange = (newContent: string) => {
    if (onUpdate) {
      onUpdate({ rightContent: newContent.replace(/<[^>]*>/g, '') });
    }
  };

  return (
    <div className="w-full min-h-[500px] bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col p-6">
      {/* Title */}
      {(title || isEditable) && (
        <div className="mb-6">
          {isGenerating ? (
            <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto animate-pulse"></div>
          ) : isEditable ? (
            <TiptapEditor
              content={title || 'Slide Title'}
              onChange={handleTitleChange}
              placeholder="Enter slide title..."
              className="text-center"
            />
          ) : (
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 text-center">
              {title}
            </h2>
          )}
        </div>
      )}

      {/* Two Columns */}
      <div className="flex-1 flex gap-6">
        <div className="w-1/2 flex flex-col justify-center">
          {isGenerating ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/6"></div>
            </div>
          ) : isEditable ? (
            <TiptapEditor
              content={leftContent || 'Left column content...'}
              onChange={handleLeftContentChange}
              placeholder="Enter left column content..."
            />
          ) : (
            leftContent && (
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {leftContent}
              </p>
            )
          )}
        </div>

        <div className="w-1/2 flex flex-col justify-center">
          {isGenerating ? (
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              <div className="h-4 bg-gray-200 rounded w-3/6"></div>
            </div>
          ) : isEditable ? (
            <TiptapEditor
              content={rightContent || 'Right column content...'}
              onChange={handleRightContentChange}
              placeholder="Enter right column content..."
            />
          ) : (
            rightContent && (
              <p className="text-sm md:text-base text-gray-600 leading-relaxed">
                {rightContent}
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}