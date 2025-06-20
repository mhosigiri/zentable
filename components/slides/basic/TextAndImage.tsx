'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface TextAndImageProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
}

export function TextAndImage({ 
  content,
  imageUrl, 
  imagePrompt, 
  isGenerating, 
  isGeneratingImage,
  onUpdate, 
  isEditable = false 
}: TextAndImageProps) {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleContentChange = (newContent: string) => {
    if (onUpdate) {
      console.log('💾 TextAndImage - Content being saved:', newContent);
      onUpdate({ content: newContent });
    }
  };

  const defaultContent = `<h1>Text-Focused Content</h1>

<p>This layout prioritizes text content while providing visual support through the image on the right. It's perfect for detailed explanations, storytelling, or when the text is the primary message.</p>

<h2>Key Benefits</h2>
<ul>
  <li>Text-first approach for detailed content</li>
  <li>Visual support enhances understanding</li>
  <li>Ideal for explanatory content</li>
  <li>Maintains reader focus on text</li>
</ul>

<p>The complementary image helps illustrate your points without overwhelming the textual content, creating a balanced and professional presentation.</p>`;

  const displayContent = content || defaultContent;

  return (
    <SlideWrapper layout="horizontal">
      {/* Text Section */}
      <div className="w-1/2 h-full min-h-[400px] flex flex-col justify-center">
        {isGenerating ? (
          <div className="animate-pulse space-y-6">
            <div className="h-12 bg-gray-200 rounded w-full"></div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>
        ) : (
          <TiptapEditor
            content={displayContent}
            onChange={handleContentChange}
            placeholder="Enter slide content with headings, paragraphs, and lists..."
            className="w-full"
            editable={isEditable}
          />
        )}
      </div>

      {/* Image Section */}
      <div className="w-1/2 h-full min-h-[400px] relative rounded-lg overflow-hidden flex items-center justify-center">
        {isGenerating || isGeneratingImage || imageLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-white/80 rounded-xl mx-auto flex items-center justify-center shadow-sm">
                <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
              </div>
              <div className="space-y-2">
                <p className="text-sm text-slate-600 font-medium">
                  {isGenerating ? 'Generating slide...' : isGeneratingImage ? 'Generating image...' : 'Loading image...'}
                </p>
                {imagePrompt && (
                  <p className="text-xs text-slate-500 max-w-xs px-4 leading-relaxed">"{imagePrompt}"</p>
                )}
              </div>
            </div>
          </div>
        ) : imageError || !imageUrl ? (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-200 via-slate-100 to-white rounded-lg border border-slate-200">
            <div className="text-center space-y-3">
              <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl mx-auto flex items-center justify-center shadow-sm border border-slate-200">
                <span className="text-3xl opacity-60">🖼️</span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-slate-600 font-medium">Image placeholder</p>
                <p className="text-xs text-slate-500">Visual content will appear here</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full bg-slate-900 flex items-center justify-center rounded-lg overflow-hidden">
            <img
              src={imageUrl}
              alt={imagePrompt || 'Slide image'}
              className="max-w-full max-h-full object-contain rounded-lg"
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
            />
          </div>
        )}
      </div>
    </SlideWrapper>
  );
}