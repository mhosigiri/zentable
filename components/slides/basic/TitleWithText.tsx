'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface TitleWithTextProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  theme?: 'light' | 'dark';
}

export function TitleWithText({ 
  title, 
  content,
  isGenerating, 
  onUpdate, 
  isEditable = false,
  theme = 'light'
}: TitleWithTextProps) {

  const handleTitleChange = (newTitle: string) => {
    if (onUpdate) {
      onUpdate({ title: newTitle.replace(/<[^>]*>/g, '') });
    }
  };

  const handleContentChange = (newContent: string) => {
    if (onUpdate) {
      console.log('📝 TitleWithText - Content changed:', newContent);
      onUpdate({ content: newContent });
    }
  };

  const defaultContent = `<h1>Slide Title</h1>
<p>This is a concise paragraph that provides key information about your topic. Keep it brief and focused on the main message you want to convey to your audience.</p>`;

  const displayContent = content || defaultContent;
  const isDark = theme === 'dark';

  return (
    <SlideWrapper>
      <div className="flex-1 flex flex-col justify-start">
        {isGenerating ? (
          <div className="animate-pulse space-y-4">
            <div className={`h-12 rounded w-2/3 ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className={`h-5 rounded w-${i === 5 ? '3/4' : 'full'} ${
                isDark ? 'bg-gray-700' : 'bg-gray-200'
              }`}></div>
            ))}
          </div>
        ) : (
          <TiptapEditor
            content={displayContent}
            onChange={handleContentChange}
            placeholder="Enter slide title and content..."
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