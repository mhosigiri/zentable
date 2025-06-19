'use client';

import { useState } from 'react';
import { TitleWithBullets } from '@/components/slides/basic/TitleWithBullets';
import { Button } from '@/components/ui/button';

export default function TestTitleBulletsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [isEditable, setIsEditable] = useState(true);
  const [slideData, setSlideData] = useState({
    id: 'test-slide',
    templateType: 'titleWithBullets' as const,
    title: 'Key Benefits of Renewable Energy',
    bulletPoints: [
      'Significantly reduces carbon emissions and environmental impact',
      'Creates long-term energy independence and security',
      'Generates sustainable economic growth and job opportunities',
      'Provides stable energy costs over time'
    ]
  });

  const handleUpdate = (updates: any) => {
    setSlideData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className={`min-h-screen p-8 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Title with Bullets Test
          </h1>
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => setIsEditable(!isEditable)}
              variant={isEditable ? 'default' : 'outline'}
            >
              {isEditable ? 'View Mode' : 'Edit Mode'}
            </Button>
            <Button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              variant="outline"
            >
              {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
            </Button>
          </div>
        </div>

        {/* Debug Info */}
        <div className={`p-4 rounded-lg border ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200'}`}>
          <h2 className="font-semibold mb-2">Debug Info:</h2>
          <p><strong>Editable:</strong> {isEditable ? 'Yes' : 'No'}</p>
          <p><strong>Theme:</strong> {theme}</p>
          <p><strong>Bullet Points Count:</strong> {slideData.bulletPoints.length}</p>
          <p><strong>Bullet Points:</strong></p>
          <ul className="list-disc list-inside ml-4 mt-2">
            {slideData.bulletPoints.map((point, index) => (
              <li key={index} className="text-sm">{point}</li>
            ))}
          </ul>
        </div>

        {/* Slide Component */}
        <TitleWithBullets
          {...slideData}
          onUpdate={handleUpdate}
          isEditable={isEditable}
          theme={theme}
        />
      </div>
    </div>
  );
} 