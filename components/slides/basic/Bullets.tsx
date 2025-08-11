'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface BulletsProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
}

export function Bullets({ 
  content,
  isGenerating, 
  onUpdate, 
  isEditable = false 
}: BulletsProps) {

  const handleContentChange = (newContent: string) => {
    if (onUpdate) {
      // console.log('💾 Bullets - Content being saved:', newContent);
      onUpdate({ content: newContent });
    }
  };

  // Default content with title and 2x2 grid of numbered bullets  
  const defaultContent = `<h1>Key Points Overview</h1>

<table style="width: 100%; border-collapse: collapse; margin-top: 2rem;">
  <tr>
    <td style="width: 50%; padding: 0 1rem 1rem 0; vertical-align: top;">
      <h3><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">1</span>First Point</h3>
      <p>Description for the first point goes here with detailed explanation.</p>
    </td>
    <td style="width: 50%; padding: 0 0 1rem 1rem; vertical-align: top;">
      <h3><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">2</span>Second Point</h3>
      <p>Description for the second point goes here with detailed explanation.</p>
    </td>
  </tr>
  <tr>
    <td style="width: 50%; padding: 1rem 1rem 0 0; vertical-align: top;">
      <h3><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">3</span>Third Point</h3>
      <p>Description for the third point goes here with detailed explanation.</p>
    </td>
    <td style="width: 50%; padding: 1rem 0 0 1rem; vertical-align: top;">
      <h3><span style="display: inline-flex; align-items: center; justify-content: center; width: 2rem; height: 2rem; background: #8b5cf6; color: white; border-radius: 50%; font-weight: bold; margin-right: 0.75rem;">4</span>Fourth Point</h3>
      <p>Description for the fourth point goes here with detailed explanation.</p>
    </td>
  </tr>
</table>

<hr style="margin: 2rem 0; border: 1px solid #e5e7eb;" />
<p><strong>Conclusion:</strong> Concluding thoughts and summary of the key points discussed above.</p>`;

  const displayContent = content || defaultContent;

  return (
    <SlideWrapper>
      <div className="flex-1">
        {isGenerating ? (
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-gray-200 rounded w-2/3"></div>
            <div className="grid grid-cols-2 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex-shrink-0"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  </div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/5"></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-6">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          </div>
        ) : (
          <TiptapEditor
            content={displayContent}
            onChange={handleContentChange}
            placeholder="Enter slide content with numbered bullet points..."
            className="w-full"
            editable={isEditable}
          />
        )}
      </div>
    </SlideWrapper>
  );
} 