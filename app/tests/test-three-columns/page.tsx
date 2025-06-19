'use client';

import { ThreeColumns } from '@/components/slides/basic/ThreeColumns';

export default function TestThreeColumnsPage() {
  const lightSlideData = {
    id: 'test-three-columns-light',
    templateType: 'three-columns',
    title: 'Digital Transformation Strategy',
    leftBullets: [
      'Technology Infrastructure',
      'Cloud migration strategies',
      'API-first architecture',
      'Mobile-responsive design',
      'Data analytics platforms'
    ],
    centerBullets: [
      'Process Optimization',
      'Agile methodology',
      'DevOps practices',
      'Continuous integration',
      'Quality assurance'
    ],
    rightBullets: [
      'People & Culture',
      'Digital skills training',
      'Change management',
      'Cross-functional teams',
      'Innovation mindset'
    ]
  };

  const darkSlideData = {
    ...lightSlideData,
    id: 'test-three-columns-dark'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Three Columns Template Test</h1>
        
        {/* Light Theme */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Light Theme</h2>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <ThreeColumns 
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
            <ThreeColumns 
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