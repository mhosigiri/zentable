'use client';

import { TwoColumnWithHeadings } from '@/components/slides/TwoColumnWithHeadings';

export default function TestTwoColumnsHeadingsPage() {
  const slideData = {
    id: 'test-two-columns-headings',
    templateType: 'two-column-with-headings',
    title: 'The Growing Challenge of Space Debris',
    leftHeading: 'Understanding the Threat',
    leftBullets: [
      'Space debris, also known as orbital debris, refers to non-functional man-made objects orbiting Earth.',
      'This includes defunct satellites, spent rocket stages, and fragments from past collisions or explosions.',
      'The increasing volume of this debris poses significant risks:',
      'Threatens active satellites and operational spacecraft.',
      'Endangers future space missions and human spaceflight.',
      'Increases the risk of the "Kessler Syndrome," a cascading series of collisions creating even more debris.'
    ],
    rightHeading: 'Seeking Solutions',
    rightBullets: [
      'Addressing space debris requires a two-pronged approach: prevention and removal.',
      'Current and proposed solutions include:',
      'Prevention: Designing new satellites for controlled re-entry or de-orbiting at the end of their operational life, minimizing debris generation during launches, and avoiding in-orbit explosions.',
      'Active Removal: Developing technologies to track, capture, and safely de-orbit larger pieces of debris. Research is ongoing into methods like nets, harpoons, and even laser-based systems.',
      'International Cooperation: Collaborative efforts among space agencies and private companies are crucial for establishing global guidelines and implementing effective mitigation strategies.'
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Two Column With Headings Template Test</h1>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <TwoColumnWithHeadings 
            {...slideData}
            isEditable={true}
            onUpdate={(updates) => console.log('Updates:', updates)}
          />
        </div>
      </div>
    </div>
  );
} 