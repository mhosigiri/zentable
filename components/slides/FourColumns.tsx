'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from './SlideRenderer';

interface FourColumnsProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
}

export function FourColumns({ 
  title, 
  column1Content, 
  column2Content, 
  column3Content, 
  column4Content, 
  isGenerating, 
  onUpdate, 
  isEditable = false 
}: FourColumnsProps) {
  
  const handleTitleChange = (newTitle: string) => {
    if (onUpdate) {
      onUpdate({ title: newTitle.replace(/<[^>]*>/g, '') });
    }
  };

  const handleColumn1Change = (newContent: string) => {
    if (onUpdate) {
      onUpdate({ column1Content: newContent.replace(/<[^>]*>/g, '') });
    }
  };

  const handleColumn2Change = (newContent: string) => {
    if (onUpdate) {
      onUpdate({ column2Content: newContent.replace(/<[^>]*>/g, '') });
    }
  };

  const handleColumn3Change = (newContent: string) => {
    if (onUpdate) {
      onUpdate({ column3Content: newContent.replace(/<[^>]*>/g, '') });
    }
  };

  const handleColumn4Change = (newContent: string) => {
    if (onUpdate) {
      onUpdate({ column4Content: newContent.replace(/<[^>]*>/g, '') });
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

      {/* Four Columns */}
      <div className="flex-1 flex gap-3">
        <div className="w-1/4 flex flex-col justify-center">
          {isGenerating ? (
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          ) : isEditable ? (
            <TiptapEditor
              content={column1Content || 'Column 1 content...'}
              onChange={handleColumn1Change}
              placeholder="Enter column 1 content..."
            />
          ) : (
            column1Content && (
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {column1Content}
              </p>
            )
          )}
        </div>

        <div className="w-1/4 flex flex-col justify-center">
          {isGenerating ? (
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          ) : isEditable ? (
            <TiptapEditor
              content={column2Content || 'Column 2 content...'}
              onChange={handleColumn2Change}
              placeholder="Enter column 2 content..."
            />
          ) : (
            column2Content && (
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {column2Content}
              </p>
            )
          )}
        </div>

        <div className="w-1/4 flex flex-col justify-center">
          {isGenerating ? (
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          ) : isEditable ? (
            <TiptapEditor
              content={column3Content || 'Column 3 content...'}
              onChange={handleColumn3Change}
              placeholder="Enter column 3 content..."
            />
          ) : (
            column3Content && (
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {column3Content}
              </p>
            )
          )}
        </div>

        <div className="w-1/4 flex flex-col justify-center">
          {isGenerating ? (
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-gray-200 rounded"></div>
              <div className="h-3 bg-gray-200 rounded w-5/6"></div>
              <div className="h-3 bg-gray-200 rounded w-4/6"></div>
            </div>
          ) : isEditable ? (
            <TiptapEditor
              content={column4Content || 'Column 4 content...'}
              onChange={handleColumn4Change}
              placeholder="Enter column 4 content..."
            />
          ) : (
            column4Content && (
              <p className="text-xs md:text-sm text-gray-600 leading-relaxed">
                {column4Content}
              </p>
            )
          )}
        </div>
      </div>
    </div>
  );
}