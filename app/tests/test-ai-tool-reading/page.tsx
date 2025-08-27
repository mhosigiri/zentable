'use client';

import { useState } from 'react';
import { ThemedLayout } from '@/components/ui/themed-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface ToolResult {
  toolName: string;
  success: boolean;
  message: string;
  data?: any;
  error?: string;
}

export default function TestAIToolReadingPage() {
  const [results, setResults] = useState<ToolResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const testToolResults = [
    {
      toolName: 'getSlideContent',
      success: true,
      message: 'Successfully retrieved Slide 2 of 5. The slide uses the "title-with-bullets" template and contains 245 characters of content.',
      data: {
        slideId: 'slide-123',
        slidePosition: 2,
        totalSlides: 5,
        title: 'Market Analysis',
        templateType: 'title-with-bullets',
        contentLength: 245,
        hasImage: false
      }
    },
    {
      toolName: 'updateSlideContent',
      success: true,
      message: 'Slide content update proposed - awaiting approval',
      data: {
        slideId: 'slide-123',
        contentLength: 312,
        slideTitle: 'Market Analysis',
        requiresApproval: true
      }
    },
    {
      toolName: 'createSlide',
      success: true,
      message: 'Ready to create a new slide with the "two-columns" template. This will be slide 6 of 6 in your presentation.',
      data: {
        templateType: 'two-columns',
        slideTitle: 'New Slide',
        position: 5,
        totalSlidesAfterCreation: 6,
        requiresApproval: true
      }
    },
    {
      toolName: 'deleteSlide',
      success: true,
      message: 'Ready to delete Slide 3 of 5: "Implementation Plan" (bullets template). This action cannot be undone.',
      data: {
        slideId: 'slide-456',
        slideTitle: 'Implementation Plan',
        slidePosition: 3,
        totalSlides: 5,
        templateType: 'bullets',
        requiresApproval: true
      }
    },
    {
      toolName: 'applyTheme',
      success: true,
      message: 'Applied theme: gradient-sunset',
      data: {
        themeId: 'gradient-sunset'
      }
    },
    {
      toolName: 'getSlideIdByNumber',
      success: false,
      error: 'Invalid slide number. Please provide a number between 1 and 5',
      message: 'Slide 7 doesn\'t exist. This presentation has 5 slides (numbered 1-5). Which slide would you like to work with?',
      data: {
        slideNumber: 7,
        totalSlides: 5
      }
    }
  ];

  const simulateAIToolReading = async () => {
    setIsLoading(true);
    setResults([]);

    // Simulate AI processing each tool result
    for (let i = 0; i < testToolResults.length; i++) {
      const result = testToolResults[i];
      
      // Simulate processing time
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setResults(prev => [...prev, result]);
    }
    
    setIsLoading(false);
  };

  const getExpectedAIResponse = (result: ToolResult): string => {
    switch (result.toolName) {
      case 'getSlideContent':
        return `I found Slide ${result.data.slidePosition} of ${result.data.totalSlides}: "${result.data.title}". It uses the ${result.data.templateType} template and contains ${result.data.contentLength} characters of content. You can see the preview above.`;
      
      case 'updateSlideContent':
        return `I've prepared updated content for your slide. The new content is ${result.data.contentLength} characters long. You can see a preview above - please approve if you like the changes, or let me know if you'd like any adjustments.`;
      
      case 'createSlide':
        return `Perfect! I've prepared a new slide with the ${result.data.templateType} template. This will be slide ${result.data.position + 1} of ${result.data.totalSlidesAfterCreation} in your presentation. Click "Apply Changes" to add it.`;
      
      case 'deleteSlide':
        return `I'm ready to delete "${result.data.slideTitle}" (Slide ${result.data.slidePosition} of ${result.data.totalSlides}). This action cannot be undone, so please make sure this is what you want.`;
      
      case 'applyTheme':
        return `Excellent! I've successfully applied the ${result.data.themeId} theme to your presentation. Your slides now have a beautiful sunset gradient look.`;
      
      case 'getSlideIdByNumber':
        return `I couldn't find Slide ${result.data.slideNumber} - your presentation only has ${result.data.totalSlides} slides. Would you like me to help you with one of the existing slides instead?`;
      
      default:
        return 'I processed the tool result and am ready to help you with the next step.';
    }
  };

  return (
    <ThemedLayout>
      <div className="min-h-screen p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Test: AI Tool Result Reading
            </h1>
            <p className="text-gray-600">
              This test demonstrates how the AI reads tool results and forms final responses for users.
            </p>
          </div>

          <div className="mb-6">
            <Button 
              onClick={simulateAIToolReading}
              disabled={isLoading}
              className="mb-4"
            >
              {isLoading ? 'Simulating AI Processing...' : 'Start AI Tool Reading Test'}
            </Button>
            
            <div className="text-sm text-gray-600">
              This will simulate the AI processing various tool results and generating appropriate responses.
            </div>
          </div>

          <div className="grid gap-6">
            {results.map((result, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {result.toolName}
                    </CardTitle>
                    <Badge variant={result.success ? "default" : "destructive"}>
                      {result.success ? "Success" : "Error"}
                    </Badge>
                  </div>
                  <CardDescription>
                    Tool Result #{index + 1}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Tool Result */}
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Tool Result:</h4>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <p className="text-sm">{result.message}</p>
                      {result.data && (
                        <details className="mt-2">
                          <summary className="text-xs text-gray-500 cursor-pointer">Show data</summary>
                          <pre className="text-xs mt-1 text-gray-600 overflow-auto">
                            {JSON.stringify(result.data, null, 2)}
                          </pre>
                        </details>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Expected AI Response */}
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Expected AI Response:</h4>
                    <div className="bg-green-50 p-3 rounded-md border border-green-200">
                      <p className="text-sm text-green-800">
                        {getExpectedAIResponse(result)}
                      </p>
                    </div>
                  </div>

                  {/* Key Features Demonstrated */}
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Key Features:</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.success && <Badge variant="secondary">Acknowledges Success</Badge>}
                      {result.data?.requiresApproval && <Badge variant="secondary">Explains Next Steps</Badge>}
                      {result.data?.slidePosition && <Badge variant="secondary">Provides Context</Badge>}
                      {result.data?.totalSlides && <Badge variant="secondary">Shows Position</Badge>}
                      {!result.success && <Badge variant="secondary">Suggests Alternatives</Badge>}
                      {result.data?.templateType && <Badge variant="secondary">Mentions Template</Badge>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {results.length > 0 && (
            <Card className="mt-8 border-l-4 border-l-green-500">
              <CardHeader>
                <CardTitle className="text-green-700">Test Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">
                    ✅ <strong>Tool Result Reading:</strong> AI successfully reads structured tool results
                  </p>
                  <p className="text-sm">
                    ✅ <strong>Context Awareness:</strong> AI provides slide numbers, positions, and template types
                  </p>
                  <p className="text-sm">
                    ✅ <strong>User Guidance:</strong> AI explains what users should do next (approve/reject)
                  </p>
                  <p className="text-sm">
                    ✅ <strong>Error Handling:</strong> AI suggests alternatives when operations fail
                  </p>
                  <p className="text-sm">
                    ✅ <strong>Conversational Tone:</strong> AI responds in natural, helpful language
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </ThemedLayout>
  );
}
