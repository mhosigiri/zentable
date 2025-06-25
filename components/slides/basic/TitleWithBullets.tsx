'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface TitleWithBulletsProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  theme?: 'light' | 'dark';
}

export function TitleWithBullets({ 
  content,
  isGenerating, 
  onUpdate, 
  isEditable = false,
  theme = 'light'
}: TitleWithBulletsProps) {

  const handleContentChange = (newContent: string) => {
    if (onUpdate) {
      console.log('💾 TitleWithBullets - Content being saved:', newContent);
      onUpdate({ content: newContent });
    }
  };

  // Default content with title and bullet points
  const defaultContent = `<h1>Slide Title</h1>
<ul>
  <li>First key point about your topic</li>
  <li>Second important consideration or detail</li>
  <li>Third supporting argument or example</li>
  <li>Fourth conclusion or call to action</li>
</ul>`;

  const displayContent = content || defaultContent;
  const isDark = theme === 'dark';

  return (
    <SlideWrapper>
      <div className="w-full h-full flex flex-col">
        {isGenerating ? (
          <div className="animate-pulse space-y-6">
            {/* Title placeholder */}
            <div className={`h-12 rounded w-full ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
            {/* Bullet points placeholder */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start space-x-4">
                <div className={`w-2 h-2 rounded-full mt-3 flex-shrink-0 ${
                  isDark ? 'bg-gray-600' : 'bg-gray-200'
                }`}></div>
                <div className="flex-1 space-y-2">
                  <div className={`h-5 rounded w-full ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                  <div className={`h-5 rounded w-4/5 ${
                    isDark ? 'bg-gray-700' : 'bg-gray-200'
                  }`}></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
                      <TiptapEditor
            content={displayContent}
              onChange={handleContentChange}
              placeholder="# Enter slide title

• Add your bullet points here..."
              variant="default"
              editable={isEditable}
              className={`w-full ${isDark ? 'text-white' : 'text-gray-900'}`}
            />
        )}
      </div>
    </SlideWrapper>
  );
}