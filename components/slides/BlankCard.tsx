'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from './SlideRenderer';
import { SlideWrapper } from './SlideWrapper';

interface BlankCardProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  theme?: 'light' | 'dark';
}

export function BlankCard({ 
  title, 
  content, 
  isGenerating, 
  onUpdate, 
  isEditable = false,
  theme = 'light'
}: BlankCardProps) {

  const handleContentChange = (newContent: string) => {
    if (onUpdate) {
      console.log('💾 BlankCard - Complete content being saved:', newContent);
      // UNIFIED: Save complete HTML content (title + body)
      onUpdate({ content: newContent });
    }
  };

  const isDark = theme === 'dark';

  // Default content if none provided (with legacy support)
  const getDefaultContent = () => {
    if (content && content.includes('<')) {
      return content;
    }
    
    // Legacy fallback: combine title and content into HTML
    const displayTitle = title || 'Slide Title';
    const displayContent = content || 'Add your content here...';
    
    return `<h1>${displayTitle}</h1><p>${displayContent}</p>`;
  };
  
  return (
    <SlideWrapper className="items-center justify-center">
      {isGenerating ? (
        <div className="animate-pulse space-y-6 w-full max-w-4xl">
          <div className={`h-12 rounded w-3/4 mx-auto ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
          <div className={`h-6 rounded w-1/2 mx-auto ${
            isDark ? 'bg-gray-700' : 'bg-gray-200'
          }`}></div>
        </div>
              ) : (
          <div className="text-center w-full max-w-4xl">
            <TiptapEditor
              content={getDefaultContent()}
              onChange={handleContentChange}
              placeholder="# Enter slide title

Add your content here..."
              variant="default"
              editable={isEditable}
              className={`w-full text-center ${isDark ? 'text-white' : 'text-gray-900'}`}
            />
          </div>
      )}
    </SlideWrapper>
  );
}