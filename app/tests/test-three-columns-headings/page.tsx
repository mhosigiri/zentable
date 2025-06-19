'use client';

import { ThreeColumnWithHeadings } from '@/components/slides/basic/ThreeColumnWithHeadings';

export default function TestThreeColumnsHeadingsPage() {
  const slideData = {
    id: 'test-three-columns-headings',
    templateType: 'three-column-with-headings',
    title: 'Digital Transformation Strategy',
    leftHeading: 'Technology',
    leftBullets: [
      'Cloud infrastructure migration',
      'AI and machine learning integration',
      'Mobile-first development',
      'API-driven architecture'
    ],
    centerHeading: 'Process',
    centerBullets: [
      'Agile methodology adoption',
      'DevOps implementation',
      'Continuous integration/deployment',
      'Data-driven decision making'
    ],
    rightHeading: 'People',
    rightBullets: [
      'Digital skills training',
      'Change management',
      'Cross-functional teams',
      'Innovation culture'
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Three Column With Headings Template Test</h1>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <ThreeColumnWithHeadings 
            {...slideData}
            isEditable={true}
            onUpdate={(updates) => console.log('Updates:', updates)}
          />
        </div>
      </div>
    </div>
  );
} 