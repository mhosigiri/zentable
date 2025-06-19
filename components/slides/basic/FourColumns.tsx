'use client';

import { TiptapEditor } from '@/components/editor/TiptapEditor';
import { SlideData } from '../SlideRenderer';
import { SlideWrapper } from '../SlideWrapper';

interface FourColumnsProps extends SlideData {
  onUpdate?: (updates: Partial<SlideData>) => void;
  isEditable?: boolean;
  theme?: 'light' | 'dark';
}

export function FourColumns({ 
  title, 
  column1Content,
  column1Bullets = [],
  column2Content,
  column2Bullets = [],
  column3Content,
  column3Bullets = [],
  column4Content,
  column4Bullets = [],
  isGenerating, 
  onUpdate, 
  isEditable = false,
  theme = 'light'
}: FourColumnsProps) {
  
  const handleTitleChange = (newTitle: string) => {
    if (onUpdate) {
      onUpdate({ title: newTitle.replace(/<[^>]*>/g, '') });
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
    'Planning Phase',
    'Define objectives',
    'Resource allocation',
    'Timeline creation'
  ];

  const defaultColumn2Bullets = [
    'Execution Phase',
    'Task management',
    'Team coordination',
    'Progress tracking'
  ];

  const defaultColumn3Bullets = [
    'Monitoring Phase',
    'Performance metrics',
    'Risk assessment',
    'Quality control'
  ];

  const defaultColumn4Bullets = [
    'Closing Phase',
    'Final deliverables',
    'Lessons learned',
    'Project evaluation'
  ];

  const displayColumn1Bullets = column1Bullets.length > 0 ? column1Bullets : defaultColumn1Bullets;
  const displayColumn2Bullets = column2Bullets.length > 0 ? column2Bullets : defaultColumn2Bullets;
  const displayColumn3Bullets = column3Bullets.length > 0 ? column3Bullets : defaultColumn3Bullets;
  const displayColumn4Bullets = column4Bullets.length > 0 ? column4Bullets : defaultColumn4Bullets;

  const isDark = theme === 'dark';

  return (
    <SlideWrapper>
      {/* Main Title */}
      {(title || isEditable) && (
        <div className="mb-8">
          {isGenerating ? (
            <div className={`h-12 rounded w-full animate-pulse ${
              isDark ? 'bg-gray-700' : 'bg-gray-200'
            }`}></div>
          ) : isEditable ? (
            <TiptapEditor
              content={title || 'Project Management Framework'}
              onChange={handleTitleChange}
              placeholder="Enter slide title..."
              variant="title"
              className={`text-center ${isDark ? '[&_.ProseMirror]:text-white' : ''}`}
            />
          ) : (
            <h1 className={`text-3xl md:text-4xl font-bold text-center leading-tight ${
              isDark ? 'text-white' : 'text-gray-900'
            }`}>
              {title}
            </h1>
          )}
        </div>
      )}

      {/* Four Columns */}
      <div className="flex-1 grid grid-cols-4 gap-4">
        {/* Column 1 */}
        <div className="space-y-2">
          {isGenerating ? (
            <div className="animate-pulse space-y-2">
              <div className="space-y-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className={`w-1 h-1 rounded-full mt-1 ${
                      isDark ? 'bg-gray-600' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-3 rounded flex-1 ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              {isEditable ? (
                <TiptapEditor
                  content={`<ul>${displayColumn1Bullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`}
                  onChange={handleColumn1BulletsChange}
                  placeholder="• Add bullet points here..."
                  variant="body"
                  className={`[&_.ProseMirror_ul]:space-y-1 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-2 ${
                    isDark ? '[&_.ProseMirror]:text-gray-300' : ''
                  }`}
                />
              ) : (
                <ul className="space-y-1.5 list-none">
                  {displayColumn1Bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${
                        isDark ? 'bg-white' : 'bg-gray-900'
                      }`}></div>
                      <p className={`text-xs leading-relaxed ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {bullet}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Column 2 */}
        <div className="space-y-2">
          {isGenerating ? (
            <div className="animate-pulse space-y-2">
              <div className="space-y-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className={`w-1 h-1 rounded-full mt-1 ${
                      isDark ? 'bg-gray-600' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-3 rounded flex-1 ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              {isEditable ? (
                <TiptapEditor
                  content={`<ul>${displayColumn2Bullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`}
                  onChange={handleColumn2BulletsChange}
                  placeholder="• Add bullet points here..."
                  variant="body"
                  className={`[&_.ProseMirror_ul]:space-y-1 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-2 ${
                    isDark ? '[&_.ProseMirror]:text-gray-300' : ''
                  }`}
                />
              ) : (
                <ul className="space-y-1.5 list-none">
                  {displayColumn2Bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${
                        isDark ? 'bg-white' : 'bg-gray-900'
                      }`}></div>
                      <p className={`text-xs leading-relaxed ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {bullet}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Column 3 */}
        <div className="space-y-2">
          {isGenerating ? (
            <div className="animate-pulse space-y-2">
              <div className="space-y-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className={`w-1 h-1 rounded-full mt-1 ${
                      isDark ? 'bg-gray-600' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-3 rounded flex-1 ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              {isEditable ? (
                <TiptapEditor
                  content={`<ul>${displayColumn3Bullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`}
                  onChange={handleColumn3BulletsChange}
                  placeholder="• Add bullet points here..."
                  variant="body"
                  className={`[&_.ProseMirror_ul]:space-y-1 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-2 ${
                    isDark ? '[&_.ProseMirror]:text-gray-300' : ''
                  }`}
                />
              ) : (
                <ul className="space-y-1.5 list-none">
                  {displayColumn3Bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${
                        isDark ? 'bg-white' : 'bg-gray-900'
                      }`}></div>
                      <p className={`text-xs leading-relaxed ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {bullet}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Column 4 */}
        <div className="space-y-2">
          {isGenerating ? (
            <div className="animate-pulse space-y-2">
              <div className="space-y-1">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start space-x-2">
                    <div className={`w-1 h-1 rounded-full mt-1 ${
                      isDark ? 'bg-gray-600' : 'bg-gray-200'
                    }`}></div>
                    <div className={`h-3 rounded flex-1 ${
                      isDark ? 'bg-gray-700' : 'bg-gray-200'
                    }`}></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-1.5">
              {isEditable ? (
                <TiptapEditor
                  content={`<ul>${displayColumn4Bullets.map(bullet => `<li>${bullet}</li>`).join('')}</ul>`}
                  onChange={handleColumn4BulletsChange}
                  placeholder="• Add bullet points here..."
                  variant="body"
                  className={`[&_.ProseMirror_ul]:space-y-1 [&_.ProseMirror_li]:flex [&_.ProseMirror_li]:items-start [&_.ProseMirror_li]:space-x-2 ${
                    isDark ? '[&_.ProseMirror]:text-gray-300' : ''
                  }`}
                />
              ) : (
                <ul className="space-y-1.5 list-none">
                  {displayColumn4Bullets.map((bullet, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className={`w-1 h-1 rounded-full mt-1.5 flex-shrink-0 ${
                        isDark ? 'bg-white' : 'bg-gray-900'
                      }`}></div>
                      <p className={`text-xs leading-relaxed ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {bullet}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
    </SlideWrapper>
  );
}