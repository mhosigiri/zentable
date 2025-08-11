'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface FourColumnsWithHeadingsProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  theme?: 'light' | 'dark';
}

export function FourColumnsWithHeadings({ 
  content,
  isGenerating, 
  onUpdate, 
  isEditable = false,
  theme = 'light'
}: FourColumnsWithHeadingsProps) {

  const handleContentChange = (newContent: string) => {
    if (onUpdate) {
      // console.log('💾 FourColumnsWithHeadings - Content being saved:', newContent);
      onUpdate({ content: newContent });
    }
  };

  const defaultContent = `<h1>Four-Pillar Strategy</h1>

<table style="width: 100%; border-collapse: collapse; margin-top: 2rem;">
  <tr>
    <td style="width: 25%; padding: 0 0.75rem 0 0; vertical-align: top;">
      <h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Strategy</h2>
      <ul>
        <li>Vision & objectives</li>
        <li>Market analysis</li>
        <li>Competitive advantage</li>
        <li>Strategic planning</li>
      </ul>
    </td>
    <td style="width: 25%; padding: 0 0.375rem; vertical-align: top;">
      <h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Operations</h2>
      <ul>
        <li>Process optimization</li>
        <li>Resource management</li>
        <li>Quality control</li>
        <li>Efficiency metrics</li>
      </ul>
    </td>
    <td style="width: 25%; padding: 0 0.375rem; vertical-align: top;">
      <h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Technology</h2>
      <ul>
        <li>Digital transformation</li>
        <li>System integration</li>
        <li>Innovation pipeline</li>
        <li>Tech infrastructure</li>
      </ul>
    </td>
    <td style="width: 25%; padding: 0 0 0 0.75rem; vertical-align: top;">
      <h2 style="color: #8b5cf6; border-bottom: 2px solid #8b5cf6; padding-bottom: 0.5rem; margin-bottom: 1rem;">Culture</h2>
      <ul>
        <li>Team development</li>
        <li>Leadership growth</li>
        <li>Change management</li>
        <li>Value alignment</li>
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
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((col) => (
                <div key={col} className="space-y-3">
                  <div className={`h-5 rounded w-full ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                  <div className="space-y-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="flex items-center space-x-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          isDark ? 'bg-gray-600' : 'bg-gray-200'
                        }`}></div>
                        <div className={`h-3 rounded flex-1 ${
                          isDark ? 'bg-gray-700' : 'bg-gray-200'
                        }`}></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <TiptapEditor
            content={displayContent}
            onChange={handleContentChange}
            placeholder="Enter slide content with four columns and headings..."
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