'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from './SlideRenderer';

interface FourColumnsWithHeadingsProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  column1Bullets?: string[];
  column2Bullets?: string[];
  column3Bullets?: string[];
  column4Bullets?: string[];
}

export function FourColumnsWithHeadings({ 
  title, 
  column1Heading, 
  column1Content,
  column1Bullets = [],
  column2Heading, 
  column2Content,
  column2Bullets = [],
  column3Heading, 
  column3Content,
  column3Bullets = [],
  column4Heading, 
  column4Content,
  column4Bullets = [],
  isGenerating, 
  onUpdate, 
  isEditable = false 
}: FourColumnsWithHeadingsProps) {
  
  const handleTitleChange = (newTitle: string) => {
    if (onUpdate) {
      onUpdate({ title: newTitle.replace(/<[^>]*>/g, '') });
    }
  };

  const handleColumn1HeadingChange = (newHeading: string) => {
    if (onUpdate) {
      onUpdate({ column1Heading: newHeading.replace(/<[^>]*>/g, '') });
    }
  };

  const handleColumn1BulletsChange = (newContent: string) => {
    if (onUpdate) {
      const div = document.createElement('div');
      div.innerHTML = newContent;
      const listItems = div.querySelectorAll('li');
      const points = Array.from(listItems).map(li => li.textContent || '').filter(text => text.trim());
      
      if (points.length === 0) {
        const textContent = div.textContent || '';
        const lines = textContent.split('\n').filter(line => line.trim());
        onUpdate({ column1Bullets: lines });
      } else {
        onUpdate({ column1Bullets: points });
      }
    }
  };

  const handleColumn2HeadingChange = (newHeading: string) => {
    if (onUpdate) {
      onUpdate({ column2Heading: newHeading.replace(/<[^>]*>/g, '') });
    }
  };

  const handleColumn2BulletsChange = (newContent: string) => {
    if (onUpdate) {
      const div = document.createElement('div');
      div.innerHTML = newContent;
      const listItems = div.querySelectorAll('li');
      const points = Array.from(listItems).map(li => li.textContent || '').filter(text => text.trim());
      
      if (points.length === 0) {
        const textContent = div.textContent || '';
        const lines = textContent.split('\n').filter(line => line.trim());
        onUpdate({ column2Bullets: lines });
      } else {
        onUpdate({ column2Bullets: points });
      }
    }
  };

  const handleColumn3HeadingChange = (newHeading: string) => {
    if (onUpdate) {
      onUpdate({ column3Heading: newHeading.replace(/<[^>]*>/g, '') });
    }
  };

  const handleColumn3BulletsChange = (newContent: string) => {
    if (onUpdate) {
      const div = document.createElement('div');
      div.innerHTML = newContent;
      const listItems = div.querySelectorAll('li');
      const points = Array.from(listItems).map(li => li.textContent || '').filter(text => text.trim());
      
      if (points.length === 0) {
        const textContent = div.textContent || '';
        const lines = textContent.split('\n').filter(line => line.trim());
        onUpdate({ column3Bullets: lines });
      } else {
        onUpdate({ column3Bullets: points });
      }
    }
  };

  const handleColumn4HeadingChange = (newHeading: string) => {
    if (onUpdate) {
      onUpdate({ column4Heading: newHeading.replace(/<[^>]*>/g, '') });
    }
  };

  const handleColumn4BulletsChange = (newContent: string) => {
    if (onUpdate) {
      const div = document.createElement('div');
      div.innerHTML = newContent;
      const listItems = div.querySelectorAll('li');
      const points = Array.from(listItems).map(li => li.textContent || '').filter(text => text.trim());
      
      if (points.length === 0) {
        const textContent = div.textContent || '';
        const lines = textContent.split('\n').filter(line => line.trim());
        onUpdate({ column4Bullets: lines });
      } else {
        onUpdate({ column4Bullets: points });
      }
    }
  };

  // Default bullets if none provided
  const defaultColumn1Bullets = [
    "First column key point",
    "Supporting detail",
    "Additional context"
  ];

  const defaultColumn2Bullets = [
    "Second column main idea",
    "Important information",
    "Relevant example"
  ];

  const defaultColumn3Bullets = [
    "Third column concept",
    "Supporting evidence", 
    "Key insight"
  ];

  const defaultColumn4Bullets = [
    "Fourth column point",
    "Final consideration",
    "Summary thought"
  ];

  const displayColumn1Bullets = column1Bullets.length > 0 ? column1Bullets : defaultColumn1Bullets;
  const displayColumn2Bullets = column2Bullets.length > 0 ? column2Bullets : defaultColumn2Bullets;
  const displayColumn3Bullets = column3Bullets.length > 0 ? column3Bullets : defaultColumn3Bullets;
  const displayColumn4Bullets = column4Bullets.length > 0 ? column4Bullets : defaultColumn4Bullets;

  return (
    <div className="w-full min-h-[500px] bg-white rounded-lg shadow-lg border border-gray-200 flex flex-col p-8">
      {/* Main Title */}
      {(title || isEditable) && (
        <div className="mb-8">
          {isGenerating ? (
            <div className="h-12 bg-gray-200 rounded w-full animate-pulse"></div>
          ) : isEditable ? (
            <TiptapEditor
              content={title || 'Four Column Slide Title'}
              onChange={handleTitleChange}
              placeholder="Enter slide title..."
              variant="title"
              className="text-left"
            />
          ) : (
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-left leading-tight">
              {title}
            </h1>
          )}
        </div>
      )}

      {/* Four Columns with Headings */}
      <div className="flex-1 grid grid-cols-4 gap-4">
        {/* Column 1 */}
        <div className="space-y-3">
          {isGenerating ? (
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-1">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-gray-200 rounded-full mt-1"></div>
                    <div className="h-3 bg-gray-200 rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {(column1Heading || isEditable) && (
                <div className="mb-2">
                  {isEditable ? (
                    <TiptapEditor
                      content={column1Heading || 'Column 1'}
                      onChange={handleColumn1HeadingChange}
                      placeholder="Enter column 1 heading..."
                      variant="subtitle"
                    />
                  ) : (
                    <h2 className="text-base md:text-lg font-semibold text-gray-900 leading-tight">
                      {column1Heading}
                    </h2>
                  )}
                </div>
              )}
              
              <div className="space-y-1.5">
                {isEditable ? (
                  <TiptapEditor
                    content={`<ul>${displayColumn1Bullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`}
                    onChange={handleColumn1BulletsChange}
                    placeholder="• Add bullet points here..."
                    variant="body"
                    className="[&_.ProseMirror_ul]:space-y-1 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-2"
                  />
                ) : (
                  <ul className="space-y-1.5 list-none">
                    {displayColumn1Bullets.map((bullet, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-gray-900 rounded-full mt-1.5 flex-shrink-0"></div>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {bullet}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>

        {/* Column 2 */}
        <div className="space-y-3">
          {isGenerating ? (
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-1">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-gray-200 rounded-full mt-1"></div>
                    <div className="h-3 bg-gray-200 rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {(column2Heading || isEditable) && (
                <div className="mb-2">
                  {isEditable ? (
                    <TiptapEditor
                      content={column2Heading || 'Column 2'}
                      onChange={handleColumn2HeadingChange}
                      placeholder="Enter column 2 heading..."
                      variant="subtitle"
                    />
                  ) : (
                    <h2 className="text-base md:text-lg font-semibold text-gray-900 leading-tight">
                      {column2Heading}
                    </h2>
                  )}
                </div>
              )}
              
              <div className="space-y-1.5">
                {isEditable ? (
                  <TiptapEditor
                    content={`<ul>${displayColumn2Bullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`}
                    onChange={handleColumn2BulletsChange}
                    placeholder="• Add bullet points here..."
                    variant="body"
                    className="[&_.ProseMirror_ul]:space-y-1 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-2"
                  />
                ) : (
                  <ul className="space-y-1.5 list-none">
                    {displayColumn2Bullets.map((bullet, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-gray-900 rounded-full mt-1.5 flex-shrink-0"></div>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {bullet}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>

        {/* Column 3 */}
        <div className="space-y-3">
          {isGenerating ? (
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-1">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-gray-200 rounded-full mt-1"></div>
                    <div className="h-3 bg-gray-200 rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {(column3Heading || isEditable) && (
                <div className="mb-2">
                  {isEditable ? (
                    <TiptapEditor
                      content={column3Heading || 'Column 3'}
                      onChange={handleColumn3HeadingChange}
                      placeholder="Enter column 3 heading..."
                      variant="subtitle"
                    />
                  ) : (
                    <h2 className="text-base md:text-lg font-semibold text-gray-900 leading-tight">
                      {column3Heading}
                    </h2>
                  )}
                </div>
              )}
              
              <div className="space-y-1.5">
                {isEditable ? (
                  <TiptapEditor
                    content={`<ul>${displayColumn3Bullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`}
                    onChange={handleColumn3BulletsChange}
                    placeholder="• Add bullet points here..."
                    variant="body"
                    className="[&_.ProseMirror_ul]:space-y-1 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-2"
                  />
                ) : (
                  <ul className="space-y-1.5 list-none">
                    {displayColumn3Bullets.map((bullet, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-gray-900 rounded-full mt-1.5 flex-shrink-0"></div>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {bullet}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>

        {/* Column 4 */}
        <div className="space-y-3">
          {isGenerating ? (
            <div className="animate-pulse space-y-3">
              <div className="h-5 bg-gray-200 rounded w-3/4"></div>
              <div className="space-y-1">
                {[1, 2].map((i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className="w-1 h-1 bg-gray-200 rounded-full mt-1"></div>
                    <div className="h-3 bg-gray-200 rounded flex-1"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {(column4Heading || isEditable) && (
                <div className="mb-2">
                  {isEditable ? (
                    <TiptapEditor
                      content={column4Heading || 'Column 4'}
                      onChange={handleColumn4HeadingChange}
                      placeholder="Enter column 4 heading..."
                      variant="subtitle"
                    />
                  ) : (
                    <h2 className="text-base md:text-lg font-semibold text-gray-900 leading-tight">
                      {column4Heading}
                    </h2>
                  )}
                </div>
              )}
              
              <div className="space-y-1.5">
                {isEditable ? (
                  <TiptapEditor
                    content={`<ul>${displayColumn4Bullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`}
                    onChange={handleColumn4BulletsChange}
                    placeholder="• Add bullet points here..."
                    variant="body"
                    className="[&_.ProseMirror_ul]:space-y-1 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-2"
                  />
                ) : (
                  <ul className="space-y-1.5 list-none">
                    {displayColumn4Bullets.map((bullet, index) => (
                      <li key={index} className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-gray-900 rounded-full mt-1.5 flex-shrink-0"></div>
                        <p className="text-xs text-gray-700 leading-relaxed">
                          {bullet}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 