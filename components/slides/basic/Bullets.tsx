'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface BulletsProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  bullets?: Array<{
    title: string;
    description: string;
  }>;
  conclusion?: string;
}

export function Bullets({ 
  title, 
  bullets = [],
  conclusion,
  isGenerating, 
  onUpdate, 
  isEditable = false 
}: BulletsProps) {

  const handleTitleChange = (newTitle: string) => {
    if (onUpdate) {
      onUpdate({ title: newTitle.replace(/<[^>]*>/g, '') }); // Strip HTML tags for title
    }
  };

  const handleBulletChange = (index: number, field: 'title' | 'description', value: string) => {
    if (onUpdate && bullets) {
      const updatedBullets = [...bullets];
      updatedBullets[index] = {
        ...updatedBullets[index],
        [field]: value.replace(/<[^>]*>/g, '') // Strip HTML tags
      };
      onUpdate({ bullets: updatedBullets });
    }
  };

  const handleConclusionChange = (newConclusion: string) => {
    if (onUpdate) {
      onUpdate({ conclusion: newConclusion.replace(/<[^>]*>/g, '') });
    }
  };

  // Default bullets if none provided
  const defaultBullets = [
    { title: "First Point", description: "Description for the first point goes here." },
    { title: "Second Point", description: "Description for the second point goes here." },
    { title: "Third Point", description: "Description for the third point goes here." },
    { title: "Fourth Point", description: "Description for the fourth point goes here." }
  ];

  const displayBullets = bullets.length > 0 ? bullets : defaultBullets;

  return (
    <SlideWrapper>
      {/* Title */}
      {(title || isEditable) && (
        <div className="mb-8">
          {isGenerating ? (
            <div className="h-16 bg-gray-200 rounded w-full animate-pulse"></div>
          ) : isEditable ? (
            <TiptapEditor
              content={title || 'Slide Title'}
              onChange={handleTitleChange}
              placeholder="Enter slide title..."
              variant="title"
              className="text-left"
            />
          ) : (
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left leading-tight mb-0">
              {title}
            </h1>
          )}
        </div>
      )}

      {/* 2x2 Grid of Numbered Bullets */}
      <div className="flex-1 mb-8">
        {isGenerating ? (
          <div className="animate-pulse grid grid-cols-2 gap-6">
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
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {displayBullets.map((bullet, index) => (
              <div key={index} className="space-y-3">
                {/* Number and Title */}
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  {isEditable ? (
                    <div className="flex-1">
                      <TiptapEditor
                        content={bullet.title}
                        onChange={(value) => handleBulletChange(index, 'title', value)}
                        placeholder="Enter bullet title..."
                        variant="subtitle"
                        className="font-semibold text-gray-900"
                      />
                    </div>
                  ) : (
                    <h4 className="text-lg font-semibold text-gray-900 leading-tight flex-1">
                      {bullet.title}
                    </h4>
                  )}
                </div>
                
                {/* Description */}
                                 <div className="text-gray-700 leading-relaxed">
                   {isEditable ? (
                     <TiptapEditor
                       content={bullet.description}
                       onChange={(value) => handleBulletChange(index, 'description', value)}
                       placeholder="Enter bullet description..."
                       variant="body"
                       className="text-gray-700"
                     />
                  ) : (
                    <p className="text-gray-700 leading-relaxed">
                      {bullet.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Conclusion Paragraph */}
      {(conclusion || isEditable) && (
        <div className="border-t border-gray-200 pt-6">
          {isGenerating ? (
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
          ) : isEditable ? (
            <TiptapEditor
              content={conclusion || 'Concluding thoughts go here...'}
              onChange={handleConclusionChange}
              placeholder="Enter concluding paragraph..."
              variant="body"
              className="text-gray-700 leading-relaxed"
            />
          ) : (
            <p className="text-gray-700 leading-relaxed text-base">
              {conclusion}
            </p>
          )}
        </div>
      )}
    </SlideWrapper>
  );
} 