'use client';

import { TwoColumns } from '@/components/slides/TwoColumns';

export default function TestTwoColumnsPage() {
  const lightSlideData = {
    id: 'test-two-columns-light',
    templateType: 'two-columns',
    title: 'The High Cost of Space Exploration',
    leftBullets: [
      'Space exploration is an inherently expensive endeavor, driven by the extreme technical challenges and the precision required for operating in the harsh vacuum of space. The primary cost drivers include:',
      'Research & Development: Designing and testing cutting-edge technologies, from propulsion systems to life support.',
      'Manufacturing: Constructing highly complex spacecraft, rockets, and ground infrastructure with stringent quality control.',
      'Launch Operations: The immense fuel, personnel, and infrastructure costs associated with launching payloads into orbit.',
      'Mission Operations: Ongoing costs for tracking, communication, data analysis, and anomaly resolution throughout a mission\'s lifespan.'
    ],
    rightBullets: [
      'Despite the high costs, the benefits of space exploration often outweigh the investment, leading to scientific breakthroughs, technological advancements, and economic growth. Efforts to make space exploration more sustainable and affordable include:',
      'Reusability: Developing reusable rocket components to significantly reduce launch costs, as pioneered by private companies.',
      'Standardization: Creating standardized components and interfaces to streamline design and manufacturing processes.',
      'International Collaboration: Sharing costs and resources through partnerships between nations and space agencies.',
      'Commercialization: Encouraging private sector investment and competition to drive down costs and foster innovation in space activities.'
    ]
  };

  const darkSlideData = {
    ...lightSlideData,
    id: 'test-two-columns-dark'
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Two Columns Template Test</h1>
        
        {/* Light Theme */}
        <div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Light Theme</h2>
          <div className="bg-white rounded-lg shadow-lg p-4">
            <TwoColumns 
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
            <TwoColumns 
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