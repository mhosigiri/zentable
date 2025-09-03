'use client';

import { HITLChat } from '@/components/assistant-ui/hitl-chat';

export default function TestHITLPage() {
  // Use a sample presentation ID for testing
  const samplePresentationId = 'test-presentation-123';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Human-in-the-Loop Chat Test
          </h1>
          <p className="text-gray-600">
            Test the HITL functionality with slide operations that require approval.
          </p>
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">How it works:</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Ask the AI to modify slides (e.g., "Update slide 1 with new content")</li>
              <li>• The AI will show a tool call that requires your approval</li>
              <li>• Click "Approve" to execute the tool or "Deny" to reject it</li>
              <li>• The AI will continue with a final response after tool execution</li>
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <HITLChat 
            presentationId={samplePresentationId}
            className="h-[600px]"
          />
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Test Commands:</h3>
          <div className="text-sm space-y-1">
            <p><strong>Content Updates:</strong> "Update slide 1 with better bullet points"</p>
            <p><strong>Slide Creation:</strong> "Create a new slide about market analysis"</p>
            <p><strong>Slide Deletion:</strong> "Delete slide 2"</p>
            <p><strong>Theme Changes:</strong> "Apply a modern theme to the presentation"</p>
            <p><strong>Image Generation:</strong> "Add an image to slide 1 showing data visualization"</p>
          </div>
        </div>
      </div>
    </div>
  );
}

