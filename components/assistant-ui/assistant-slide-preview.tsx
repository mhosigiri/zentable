import React from 'react';
import { SlideRenderer, SlideData } from '@/components/slides/SlideRenderer';

interface AssistantSlidePreviewProps {
  content: string;
  title?: string;
  templateType?: string;
  imageUrl?: string;
  imagePrompt?: string;
}

export const AssistantSlidePreview: React.FC<AssistantSlidePreviewProps> = ({ 
  content, 
  title = '', 
  templateType = 'bullets', 
  imageUrl, 
  imagePrompt 
}) => {
  // Minimal SlideData for preview
  const slide: SlideData = {
    id: 'preview',
    templateType,
    title,
    content,
    imageUrl,
    imagePrompt,
  };

  return (
    <div className="w-full max-w-xs mx-auto my-4 rounded-lg shadow-lg border border-white/20 bg-white/10 overflow-hidden">
      <div className="relative" style={{ aspectRatio: '16 / 9' }}>
        <div className="absolute inset-0 scale-[0.35] origin-top-left transform-gpu">
          <div className="w-[calc(100%/0.35)] h-[calc(100%/0.35)] overflow-y-auto">
            <SlideRenderer slide={slide} isEditable={false} />
          </div>
        </div>
      </div>
    </div>
  );
};
