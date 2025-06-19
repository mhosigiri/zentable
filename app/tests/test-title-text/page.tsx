'use client';

import { TitleWithText } from '@/components/slides/basic/TitleWithText';
import { useTheme } from '@/contexts/ThemeContext';
import { ThemedLayout } from '@/components/ui/themed-layout';

export default function TestTitleTextPage() {
  const { currentTheme } = useTheme();

  const sampleData = {
    id: 'test-title-text',
    templateType: 'title-with-text',
    title: 'Understanding Machine Learning',
    content: `Machine learning is a subset of artificial intelligence that enables computers to learn and make decisions without being explicitly programmed for every task. This revolutionary technology has transformed numerous industries by allowing systems to recognize patterns in data and make predictions on new information. Today, machine learning powers everything from recommendation systems to autonomous vehicles, making it one of the most impactful technologies of our time.`,
    isEditable: true
  };

  return (
    <ThemedLayout>
      <div className="min-h-screen p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Test: Title with Text Template
            </h1>
            <p className="text-gray-600">
              Testing the TitleWithText component with sample content
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 min-h-[600px]">
            <TitleWithText {...sampleData} />
          </div>

          <div className="mt-8 p-4 bg-gray-100 rounded-lg">
            <h3 className="font-semibold mb-2">Template Info:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Template Type: title-with-text</li>
              <li>• Features: Title + Short paragraph (3-5 sentences)</li>
              <li>• Use Case: Brief explanations, summaries, concepts, definitions</li>
              <li>• Content: Single focused paragraph with key information</li>
            </ul>
          </div>
        </div>
      </div>
    </ThemedLayout>
  );
} 