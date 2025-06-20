'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface FourColumnsProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  theme?: 'light' | 'dark';
}

export function FourColumns({ 
  content,
  isGenerating, 
  onUpdate, 
  isEditable = false,
  theme = 'light'
}: FourColumnsProps) {

  const handleContentChange = (newContent: string) => {
    if (onUpdate) {
      console.log('💾 FourColumns - Content being saved:', newContent);
      onUpdate({ content: newContent });
    }
  };

  const defaultContent = `<h1>Four-Phase Framework</h1>

<table style="width: 100%; border-collapse: collapse; margin-top: 2rem;">
  <tr>
    <td style="width: 25%; padding: 0 0.75rem 0 0; vertical-align: top;">
      <h3>Planning</h3>
      <ul>
        <li>Define objectives</li>
        <li>Resource allocation</li>
        <li>Timeline creation</li>
        <li>Risk assessment</li>
      </ul>
    </td>
    <td style="width: 25%; padding: 0 0.375rem; vertical-align: top;">
      <h3>Execution</h3>
      <ul>
        <li>Task management</li>
        <li>Team coordination</li>
        <li>Progress tracking</li>
        <li>Quality control</li>
      </ul>
    </td>
    <td style="width: 25%; padding: 0 0.375rem; vertical-align: top;">
      <h3>Monitoring</h3>
      <ul>
        <li>Performance metrics</li>
        <li>Risk monitoring</li>
        <li>Status reporting</li>
        <li>Issue resolution</li>
      </ul>
    </td>
    <td style="width: 25%; padding: 0 0 0 0.75rem; vertical-align: top;">
      <h3>Closing</h3>
      <ul>
        <li>Final deliverables</li>
        <li>Lessons learned</li>
        <li>Project evaluation</li>
        <li>Documentation</li>
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
                  <div className={`h-5 rounded w-3/4 ${
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
            placeholder="Enter slide content with four columns..."
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