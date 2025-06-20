'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface ParagraphProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
}

export function Paragraph({ 
  content,
  isGenerating, 
  onUpdate, 
  isEditable = false 
}: ParagraphProps) {

  const handleContentChange = (newContent: string) => {
    if (onUpdate) {
      console.log('💾 Paragraph - Content being saved:', newContent);
      onUpdate({ content: newContent });
    }
  };

  // Default content with multiple sections
  const defaultContent = `<h1>Detailed Analysis</h1>

<h2>Section Heading</h2>
<p>First paragraph of content goes here with detailed information about the topic.</p>
<p>Second paragraph with additional details and supporting information.</p>

<h2>Another Section</h2>
<p>More content in this section with relevant details.</p>
<p>Additional paragraph with more comprehensive information.</p>

<h2>Conclusion</h2>
<p>Concluding thoughts and final insights about the topic discussed above.</p>`;

  const displayContent = content || defaultContent;

  return (
    <SlideWrapper>
      <div className="flex-1">
        {isGenerating ? (
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-2/3"></div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                  <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <TiptapEditor
            content={displayContent}
            onChange={handleContentChange}
            placeholder="Enter slide content with headings and paragraphs..."
            className="w-full"
            editable={isEditable}
          />
        )}
      </div>
    </SlideWrapper>
  );
} 