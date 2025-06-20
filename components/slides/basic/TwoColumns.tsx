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
  content,
  isGenerating, 
  onUpdate, 
  isEditable = false,
  theme = 'light'
}: TwoColumnsProps) {

  const handleContentChange = (newContent: string) => {
    if (onUpdate) {
      console.log('💾 TwoColumns - Content being saved:', newContent);
      onUpdate({ content: newContent });
    }
  };

  const defaultContent = `<h1>Two-Column Layout</h1>

<table style="width: 100%; border-collapse: collapse; margin-top: 2rem;">
  <tr>
    <td style="width: 50%; padding: 0 1.5rem 0 0; vertical-align: top;">
      <h3>Left Column</h3>
      <ul>
        <li>First point in left column</li>
        <li>Second important detail</li>
        <li>Third supporting argument</li>
        <li>Fourth key consideration</li>
      </ul>
    </td>
    <td style="width: 50%; padding: 0 0 0 1.5rem; vertical-align: top;">
      <h3>Right Column</h3>
      <ul>
        <li>First point in right column</li>
        <li>Second important detail</li>
        <li>Third supporting argument</li>
        <li>Fourth key consideration</li>
      </ul>
    </td>
  </tr>
</table>`;

  const displayContent = content || defaultContent;
  const isDark = theme === 'dark';

  return (
    <SlideWrapper>
      <div className="flex-1">
        {isGenerating ? (
          <div className="animate-pulse space-y-8">
            <div className={`h-12 rounded w-2/3 mx-auto ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            <div className="grid grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className={`h-6 rounded w-1/2 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        isDark ? 'bg-gray-600' : 'bg-gray-200'
                      }`}></div>
                      <div className={`h-4 rounded flex-1 ${
                        isDark ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <div className={`h-6 rounded w-1/2 ${
                  isDark ? 'bg-gray-700' : 'bg-gray-200'
                }`}></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        isDark ? 'bg-gray-600' : 'bg-gray-200'
                      }`}></div>
                      <div className={`h-4 rounded flex-1 ${
                        isDark ? 'bg-gray-700' : 'bg-gray-200'
                      }`}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <TiptapEditor
            content={displayContent}
            onChange={handleContentChange}
            placeholder="Enter slide content with two columns..."
            className={`w-full ${
              isDark ? '[&_.ProseMirror]:text-gray-300 [&_.ProseMirror_h1]:text-white [&_.ProseMirror_h2]:text-white [&_.ProseMirror_h3]:text-white' : ''
            }`}
            editable={isEditable}
          />
        )}
      </div>
    </SlideWrapper>
  );
}