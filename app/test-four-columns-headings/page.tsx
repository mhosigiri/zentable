'use client';

import { FourColumnsWithHeadings } from '@/components/slides/FourColumnsWithHeadings';

export default function TestFourColumnsHeadingsPage() {
  const slideData = {
    id: 'test-four-columns-headings',
    templateType: 'four-columns-with-headings',
    title: 'Project Management Framework',
    column1Heading: 'Planning',
    column1Bullets: [
      'Define objectives',
      'Resource allocation',
      'Timeline creation'
    ],
    column2Heading: 'Execution',
    column2Bullets: [
      'Task management',
      'Team coordination',
      'Progress tracking'
    ],
    column3Heading: 'Monitoring',
    column3Bullets: [
      'Performance metrics',
      'Risk assessment',
      'Quality control'
    ],
    column4Heading: 'Closing',
    column4Bullets: [
      'Final deliverables',
      'Lessons learned',
      'Project evaluation'
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Four Column With Headings Template Test</h1>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <FourColumnsWithHeadings 
            {...slideData}
            isEditable={true}
            onUpdate={(updates) => console.log('Updates:', updates)}
          />
        </div>
      </div>
    </div>
  );
} 