'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from './SlideRenderer';

interface ThreeColumnWithHeadingsProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
}

export function ThreeColumnWithHeadings({ 
  title, 
  leftHeading, 
  leftContent, 
  centerHeading, 
  centerContent, 
  rightHeading, 
  rightContent, 
  isGenerating, 
  onUpdate, 
  isEditable = false 
}: ThreeColumnWithHeadingsProps) {
  
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

  const handleLeftContentChange = (newContent: string) => {
    if (onUpdate) {
      onUpdate({ leftContent: newContent.replace(/<[^>]*>/g, '') });
    }
  };

  const handleCenterHeadingChange = (newHeading: string) => {
    if (onUpdate) {
      onUpdate({ centerHeading: newHeading.replace(/<[^>]*>/g, '') });
    }
  };

  const handleCenterContentChange = (newContent: string) => {
    if (onUpdate) {
      onUpdate({ centerContent: newContent.replace(/<[^>]*>/g, '') });
    }
  };

  const handleRightHeadingChange = (newHeading: string) => {
    if (onUpdate) {
      onUpdate({ rightHeading: newHeading.replace(/<[^>]*>/g, '') });
    }
  };

  const handleRightContentChange = (newContent: string) => {
    if (onUpdate) {
      onUpdate({ rightContent: newContent.replace(/<[^>]*>/g, '') });
    }
  };

  return (
    <div className="w-full min-h-[500px] bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col p-6">
      {/* Main Title */}
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

      {/* Three Columns with Headings */}
      <div className="flex-1 flex gap-4">
        <div className="w-1/3 space-y-3">
          {isGenerating ? (
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ) : (
            <>
              {(leftHeading || isEditable) && (
                <div>
                  {isEditable ? (
                    <TiptapEditor
                      content={leftHeading || 'Left Heading'}
                      onChange={handleLeftHeadingChange}
                      placeholder="Enter left heading..."
                    />
                  ) : (
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                      {leftHeading}
                    </h3>
                  )}
                </div>
              )}
              
              {(leftContent || isEditable) && (
                <div>
                  {isEditable ? (
                    <TiptapEditor
                      content={leftContent || 'Left column content...'}
                      onChange={handleLeftContentChange}
                      placeholder="Enter left column content..."
                    />
                  ) : (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {leftContent}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="w-1/3 space-y-3">
          {isGenerating ? (
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ) : (
            <>
              {(centerHeading || isEditable) && (
                <div>
                  {isEditable ? (
                    <TiptapEditor
                      content={centerHeading || 'Center Heading'}
                      onChange={handleCenterHeadingChange}
                      placeholder="Enter center heading..."
                    />
                  ) : (
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                      {centerHeading}
                    </h3>
                  )}
                </div>
              )}
              
              {(centerContent || isEditable) && (
                <div>
                  {isEditable ? (
                    <TiptapEditor
                      content={centerContent || 'Center column content...'}
                      onChange={handleCenterContentChange}
                      placeholder="Enter center column content..."
                    />
                  ) : (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {centerContent}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="w-1/3 space-y-3">
          {isGenerating ? (
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ) : (
            <>
              {(rightHeading || isEditable) && (
                <div>
                  {isEditable ? (
                    <TiptapEditor
                      content={rightHeading || 'Right Heading'}
                      onChange={handleRightHeadingChange}
                      placeholder="Enter right heading..."
                    />
                  ) : (
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-2">
                      {rightHeading}
                    </h3>
                  )}
                </div>
              )}
              
              {(rightContent || isEditable) && (
                <div>
                  {isEditable ? (
                    <TiptapEditor
                      content={rightContent || 'Right column content...'}
                      onChange={handleRightContentChange}
                      placeholder="Enter right column content..."
                    />
                  ) : (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {rightContent}
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}