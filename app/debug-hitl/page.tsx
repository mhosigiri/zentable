'use client';

import { HITLChat } from '@/components/assistant-ui/hitl-chat';
import { useState } from 'react';

export default function DebugHITLPage() {
  const [presentationId, setPresentationId] = useState('test-presentation-123');

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            HITL Debug Page
          </h1>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Presentation ID:
            </label>
            <input
              type="text"
              value={presentationId}
              onChange={(e) => setPresentationId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Enter presentation ID"
            />
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-semibold text-yellow-900 mb-2">Debug Instructions:</h3>
            <ol className="text-sm text-yellow-800 space-y-1">
              <li>1. Open browser console (F12)</li>
              <li>2. Try these commands in the chat:</li>
              <li>   • "Apply sunset theme to the presentation"</li>
              <li>   • "Create a new slide about market analysis"</li>
              <li>   • "Update slide 1 with better content"</li>
              <li>3. Check console for debug logs</li>
              <li>4. Look for approval buttons</li>
            </ol>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg">
          <HITLChat 
            presentationId={presentationId}
            className="h-[600px]"
          />
        </div>

        <div className="mt-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="font-semibold mb-2">Expected Behavior:</h3>
          <ul className="text-sm space-y-1">
            <li>• Tools without execute functions should show approval UI</li>
            <li>• Tools with execute functions should run automatically</li>
            <li>• AI should wait for user approval before continuing</li>
            <li>• Console should show debug logs</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

