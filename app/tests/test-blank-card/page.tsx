'use client';

import { BlankCard } from '@/components/slides/BlankCard';

export default function TestBlankCardPage() {
  const lightSlideData = {
    id: 'test-blank-card-light',
    templateType: 'blank-card',
    title: 'Untitled card',
    content: 'Start typing...'
  };

  const darkSlideData = {
    id: 'test-blank-card-dark',
    templateType: 'blank-card',
    title: 'Untitled card',
    content: 'Start typing...'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Blank Card Template Test</h1>
        
        {/* Light Theme */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Light Theme</h2>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <BlankCard 
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
            <BlankCard 
              {...darkSlideData}
              theme="dark"
              isEditable={true}
              onUpdate={(updates) => console.log('Dark Updates:', updates)}
            />
          </div>
        </div>

        {/* Empty State Examples */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Empty States</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <BlankCard 
                id="empty-light"
                templateType="blank-card"
                theme="light"
                isEditable={false}
              />
            </div>
            <div className="bg-gray-800 rounded-lg shadow-lg p-4">
              <BlankCard 
                id="empty-dark"
                templateType="blank-card"
                theme="dark"
                isEditable={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 