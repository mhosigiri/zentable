'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface ThreeColumnsProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  theme?: 'light' | 'dark';
}

export function ThreeColumns({ 
  content,
  isGenerating, 
  onUpdate, 
  isEditable = false,
  theme = 'light'
}: ThreeColumnsProps) {

  const handleContentChange = (newContent: string) => {
    if (onUpdate) {
      console.log('💾 ThreeColumns - Content being saved:', newContent);
      onUpdate({ content: newContent });
    }
  };

  const defaultContent = `<h1>Three-Column Analysis</h1>

<table style="width: 100%; border-collapse: collapse; margin-top: 2rem;">
  <tr>
    <td style="width: 33.33%; padding: 0 1rem 0 0; vertical-align: top;">
      <h3>Technology</h3>
      <ul>
        <li>Infrastructure modernization</li>
        <li>Cloud-first approach</li>
        <li>API-driven architecture</li>
        <li>Security & compliance</li>
      </ul>
    </td>
    <td style="width: 33.33%; padding: 0 0.5rem; vertical-align: top;">
      <h3>Process</h3>
      <ul>
        <li>Agile methodologies</li>
        <li>Continuous integration</li>
        <li>Quality assurance</li>
        <li>Performance monitoring</li>
      </ul>
    </td>
    <td style="width: 33.33%; padding: 0 0 0 1rem; vertical-align: top;">
      <h3>People</h3>
      <ul>
        <li>Skills development</li>
        <li>Cultural transformation</li>
        <li>Leadership alignment</li>
        <li>Change management</li>
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
            <div className="grid grid-cols-3 gap-6">
              {[1, 2, 3].map((col) => (
                <div key={col} className="space-y-4">
                  <div className={`h-6 rounded w-3/4 ${
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
              ))}
            </div>
          </div>
        ) : (
          <TiptapEditor
            content={displayContent}
            onChange={handleContentChange}
            placeholder="Enter slide content with three columns..."
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