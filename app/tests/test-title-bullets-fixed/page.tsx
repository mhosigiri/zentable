'use client';

import { TitleWithBullets } from '@/components/slides/basic/TitleWithBullets';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemedLayout } from '@/components/ui/themed-layout';

export default function TestTitleBulletsFixedPage() {
  const { currentTheme } = useTheme();

  const sampleData = {
    id: 'test-title-bullets-fixed',
    templateType: 'title-with-bullets',
    title: 'Key Benefits of Cloud Computing',
    bulletPoints: [
      'Scalability - Easily scale resources up or down based on demand',
      'Cost Efficiency - Pay only for what you use, reducing infrastructure costs',
      'Accessibility - Access your data and applications from anywhere with internet',
      'Reliability - Built-in redundancy and backup systems ensure high availability',
      'Security - Enterprise-grade security measures and compliance standards'
    ],
    isEditable: true
  };

  return (
    <ThemedLayout>
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Test: Title with Bullets Template (Fixed)
            </h1>
            <p className="text-gray-600">
              Testing the TitleWithBullets component to verify proper rendering
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 min-h-[600px]">
            <TitleWithBullets {...sampleData} />
          </div>

          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Template Info:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Template Type: title-with-bullets</li>
              <li>• Features: Title + Simple bullet points with custom bullet styling</li>
              <li>• Use Case: Key points, features, benefits, or action items</li>
              <li>• Content: Array of string bullet points</li>
              <li>• Styling: Custom bullet dots with proper spacing</li>
            </ul>
          </div>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-800">Difference from Bullets Template:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• TitleWithBullets: Simple bullet points (strings)</li>
              <li>• Bullets: Numbered bullets with titles and descriptions</li>
              <li>• TitleWithBullets: Uses custom bullet dots</li>
              <li>• Bullets: Uses numbered circles in a 2x2 grid</li>
            </ul>
          </div>
        </div>
      </div>
    </ThemedLayout>
  );
} 