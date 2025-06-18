'use client';

import { FourColumns } from '@/components/slides/FourColumns';

export default function TestFourColumnsPage() {
  const lightSlideData = {
    id: 'test-four-columns-light',
    templateType: 'four-columns',
    title: 'Project Management Framework',
    column1Bullets: [
      'Planning Phase',
      'Define objectives',
      'Resource allocation',
      'Timeline creation'
    ],
    column2Bullets: [
      'Execution Phase',
      'Task management',
      'Team coordination',
      'Progress tracking'
    ],
    column3Bullets: [
      'Monitoring Phase',
      'Performance metrics',
      'Risk assessment',
      'Quality control'
    ],
    column4Bullets: [
      'Closing Phase',
      'Final deliverables',
      'Lessons learned',
      'Project evaluation'
    ]
  };

  const darkSlideData = {
    ...lightSlideData,
    id: 'test-four-columns-dark'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Four Columns Template Test</h1>
        
        {/* Light Theme */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Light Theme</h2>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <FourColumns 
              {...lightSlideData}
              theme="light"
              isEditable={true}
              onUpdate={(updates) => console.log('Light Updates:', updates)}
            />
          </div>
        </div>

        {/* Dark Theme */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dark Theme</h2>
          <div className="bg-gray-800 rounded-lg shadow-lg p-4">
            <FourColumns 
              {...darkSlideData}
              theme="dark"
              isEditable={true}
              onUpdate={(updates) => console.log('Dark Updates:', updates)}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 