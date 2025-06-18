'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from './SlideRenderer';

interface ParagraphProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  sections?: Array<{
    heading: string;
    paragraphs: string[];
  }>;
  conclusion?: string;
}

export function Paragraph({ 
  title, 
  sections = [],
  conclusion,
  isGenerating, 
  onUpdate, 
  isEditable = false 
}: ParagraphProps) {

  const handleTitleChange = (newTitle: string) => {
    if (onUpdate) {
      onUpdate({ title: newTitle.replace(/<[^>]*>/g, '') });
    }
  };

  const handleSectionChange = (sectionIndex: number, field: 'heading' | 'paragraphs', value: string | string[]) => {
    if (onUpdate && sections) {
      const updatedSections = [...sections];
      if (field === 'heading') {
        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          heading: (value as string).replace(/<[^>]*>/g, '')
        };
      } else {
        // For paragraphs, convert HTML to array of paragraphs
        const htmlContent = value as string;
        const div = document.createElement('div');
        div.innerHTML = htmlContent;
        const paragraphs = div.textContent || '';
        const paragraphArray = paragraphs.split('\n').filter(p => p.trim());
        updatedSections[sectionIndex] = {
          ...updatedSections[sectionIndex],
          paragraphs: paragraphArray
        };
      }
      onUpdate({ sections: updatedSections });
    }
  };

  const handleConclusionChange = (newConclusion: string) => {
    if (onUpdate) {
      onUpdate({ conclusion: newConclusion.replace(/<[^>]*>/g, '') });
    }
  };

  // Default sections if none provided
  const defaultSections = [
    {
      heading: "Section Heading",
      paragraphs: [
        "First paragraph of content goes here.",
        "Second paragraph with additional details."
      ]
    },
    {
      heading: "Another Section",
      paragraphs: [
        "More content in this section.",
        "Additional paragraph with more information."
      ]
    }
  ];

  const displaySections = sections.length > 0 ? sections : defaultSections;

  return (
    <div className="w-full min-h-[500px] bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col p-8">
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

      {/* Sections with Headings and Paragraphs */}
      <div className="flex-1 space-y-6">
        {isGenerating ? (
          <div className="animate-pulse space-y-6">
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
          displaySections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-4">
              {/* Section Heading */}
              {isEditable ? (
                <TiptapEditor
                  content={section.heading}
                  onChange={(value) => handleSectionChange(sectionIndex, 'heading', value)}
                  placeholder="Enter section heading..."
                  variant="subtitle"
                  className="font-semibold text-gray-900"
                />
              ) : (
                <h2 className="text-xl md:text-2xl font-semibold text-gray-900 leading-tight">
                  {section.heading}
                </h2>
              )}
              
              {/* Section Paragraphs */}
              <div className="space-y-3">
                {isEditable ? (
                  <TiptapEditor
                    content={section.paragraphs.join('\n\n')}
                    onChange={(value) => handleSectionChange(sectionIndex, 'paragraphs', value)}
                    placeholder="Enter paragraphs for this section..."
                    variant="body"
                    className="text-gray-700"
                  />
                ) : (
                  section.paragraphs.map((paragraph, paragraphIndex) => (
                    <p key={paragraphIndex} className="text-base md:text-lg text-gray-700 leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Conclusion Paragraph */}
      {(conclusion || isEditable) && (
        <div className="mt-6 pt-4">
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
            <p className="text-base md:text-lg text-gray-700 leading-relaxed">
              {conclusion}
            </p>
          )}
        </div>
      )}
    </div>
  );
} 