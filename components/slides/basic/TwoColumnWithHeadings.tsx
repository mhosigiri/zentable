'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface TwoColumnWithHeadingsProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  theme?: 'light' | 'dark';
}

export function TwoColumnWithHeadings({ 
  content,
  isGenerating, 
  onUpdate, 
  isEditable = false,
  theme = 'light'
}: TwoColumnWithHeadingsProps) {

  const handleContentChange = (newContent: string) => {
    if (onUpdate) {
      console.log('💾 TwoColumnWithHeadings - Content being saved:', newContent);
      onUpdate({ content: newContent });
    }
  };

  const defaultContent = `<h1>Comparison or Two-Part Topic</h1>

<table style="width: 100%; border-collapse: collapse; margin-top: 2rem;">
  <tr>
    <td style="width: 50%; padding: 0 1.5rem 0 0; vertical-align: top;">
      <h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Left Section Heading</h2>
      <ul>
        <li>First point in left section</li>
        <li>Second important detail</li>
        <li>Third supporting argument</li>
        <li>Fourth key consideration</li>
      </ul>
    </td>
    <td style="width: 50%; padding: 0 0 0 1.5rem; vertical-align: top;">
      <h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Right Section Heading</h2>
      <ul>
        <li>First point in right section</li>
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
                <div className={`h-8 rounded w-3/4 ${
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
                <div className={`h-8 rounded w-3/4 ${
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
            placeholder="Enter slide content with two columns and headings..."
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