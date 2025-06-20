'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface ImageAndTextProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
}

export function ImageAndText({ 
  content,
  imageUrl, 
  imagePrompt, 
  isGenerating, 
  isGeneratingImage,
  onUpdate, 
  isEditable = false 
}: ImageAndTextProps) {
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleContentChange = (newContent: string) => {
    if (onUpdate) {
      console.log('💾 ImageAndText - Content being saved:', newContent);
      onUpdate({ content: newContent });
    }
  };

  const defaultContent = `<h1>Visual Content Slide</h1>

<p>This slide combines visual and textual content to create a compelling presentation. The image on the left provides visual context while this text area offers detailed explanation and supporting information.</p>

<p>Use this layout when you want to:</p>
<ul>
  <li>Showcase a product or concept visually</li>
  <li>Explain a process or workflow</li>
  <li>Provide context for visual data</li>
  <li>Create engaging narrative content</li>
</ul>

<p>The visual-text combination helps reinforce your message and makes it more memorable for your audience.</p>`;

  const displayContent = content || defaultContent;

  return (
    <SlideWrapper layout="horizontal">
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
    </SlideWrapper>
  );
}