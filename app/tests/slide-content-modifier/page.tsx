'use client';

import React, { useState } from 'react';
import { getSlideById } from '@/lib/slides';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2 } from 'lucide-react';
// No authentication import needed

export default function SlideContentModifierTest() {
  const [slideId, setSlideId] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [currentSlide, setCurrentSlide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    text?: string;
    toolCall?: {
      name: string;
      parameters: Record<string, any>;
    };
    toolResult?: {
      success: boolean;
      error?: string;
      message?: string;
      slideId?: string;
    };
  } | null>(null);
  // No authentication state or check needed

  // Fetch slide content
  const fetchSlide = async () => {
    if (!slideId) {
      setError('Please enter a valid slide ID');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const slide = await getSlideById(slideId);
      
      if (!slide) {
        setError(`No slide found with ID: ${slideId}`);
        setCurrentSlide(null);
      } else {
        setCurrentSlide(slide);
      }
    } catch (err) {
      console.error('Error fetching slide:', err);
      setError('Failed to fetch slide. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  // Process slide content with AI
  const processSlideContent = async () => {
    if (!currentSlide) {
      setError('Please fetch a slide first');
      return;
    }

    if (!prompt) {
      setError('Please enter instructions for the AI');
      return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/assistant-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Please modify the content of slide ${currentSlide.id} based on these instructions: ${prompt}`,
            },
          ],
          context: { 
            presentationId: currentSlide.presentation_id 
          },
          threadId: null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to process slide content');
      }

      // For streaming responses from the AI SDK
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let responseText = '';
      let isToolCallActive = false;
      let toolCallData = '';
      
      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        console.log('Raw chunk:', chunk); // Debug

        // Parse based on actual format we're receiving
        // Format appears to be "f:" for first chunk, "0:" for text chunks, "e:" for end
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            // Handle header chunk (f:)
            if (line.startsWith('f:')) {
              const headerData = line.substring(2);
              try {
                const parsed = JSON.parse(headerData);
                console.log('Header data:', parsed);
              } catch (e) {
                console.warn('Error parsing header data:', headerData);
              }
              continue;
            }
            
            // Handle text chunks (0:)
            if (line.startsWith('0:')) {
              const text = line.substring(2);
              responseText += text;
              setResult(prev => ({
                ...prev,
                text: responseText
              }));
              continue;
            }
            
            // Handle end marker (e:) or completion data (d:)
            if (line.startsWith('e:') || line.startsWith('d:')) {
              const metadataStr = line.substring(2);
              try {
                const metadata = JSON.parse(metadataStr);
                console.log('Completion metadata:', metadata);
              } catch (e) {
                console.warn('Error parsing metadata:', metadataStr);
              }
              continue;
            }
            
            // Try to parse any other format as JSON
            if (line.includes('{') && line.includes('}')) {
              try {
                // Try to extract JSON
                const jsonMatch = line.match(/\{.*\}/);
                if (jsonMatch) {
                  const parsed = JSON.parse(jsonMatch[0]);
                  console.log('Other data format parsed:', parsed);
            
                  // Handle tool call
                  if (parsed.type === 'tool_call') {
                    isToolCallActive = true;
                    setResult(prev => ({
                      ...prev,
                      toolCall: parsed.tool_call
                    }));
                  }
                  // Handle tool result
                  else if (parsed.type === 'tool_result') {
                    isToolCallActive = false;
                    setResult(prev => ({
                      ...prev,
                      toolResult: parsed.tool_result || parsed.result
                    }));
                    
                    // Check if slide update was successful
                    const result = parsed.tool_result || parsed.result;
                    if (result && result.success) {
                      console.log('Slide updated successfully, refetching...');
                      await fetchSlide(); // Refetch slide with updated content
                    }
                  }
                }
              } catch (e) {
                console.warn('Error parsing possible JSON in line:', line);
              }
            }
          } catch (e) {
            console.warn('Error parsing chunk:', e, 'for line:', line);
          }
        }
      }

      // Refetch the slide to show the updated content
      if (result && result.toolResult && result.toolResult.success) {
        await fetchSlide();
      }
    } catch (err: any) {
      console.error('Error processing slide content:', err);
      setError(err.message || 'Failed to process slide content');
    } finally {
      setIsProcessing(false);
    }
  };

  // No authentication check needed

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8">AI Assistant Slide Content Modifier Test</h1>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Fetch Slide</CardTitle>
          <CardDescription>Enter a slide ID to fetch its current content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div>
              <Label htmlFor="slideId">Slide ID</Label>
              <Input
                id="slideId"
                value={slideId}
                onChange={(e) => setSlideId(e.target.value)}
                placeholder="Enter slide ID"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={fetchSlide} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Fetching...
              </>
            ) : (
              'Fetch Slide'
            )}
          </Button>
        </CardFooter>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {currentSlide && (
        <>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Current Slide Content</CardTitle>
              <CardDescription>
                ID: {currentSlide.id} • Template: {currentSlide.template_type} • Position: {currentSlide.position}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="rendered" className="w-full">
                <TabsList>
                  <TabsTrigger value="rendered">Rendered</TabsTrigger>
                  <TabsTrigger value="html">HTML</TabsTrigger>
                </TabsList>
                <TabsContent value="rendered" className="border rounded-md p-4 mt-2">
                  <div 
                    className="prose max-w-none" 
                    dangerouslySetInnerHTML={{ __html: currentSlide.content || '<p><em>No content</em></p>' }}
                  />
                </TabsContent>
                <TabsContent value="html" className="border rounded-md p-4 mt-2">
                  <pre className="whitespace-pre-wrap text-sm bg-slate-100 p-4 rounded">
                    {currentSlide.content || 'No content'}
                  </pre>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>AI Assistant Content Modification</CardTitle>
              <CardDescription>Enter instructions for modifying the slide content using the assistant-chat API</CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="prompt">Instructions</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., Make this content more concise and impactful"
                  className="min-h-[120px]"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={processSlideContent} disabled={isProcessing}>
                {isProcessing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Process with AI'
                )}
              </Button>
            </CardFooter>
          </Card>
        </>
      )}

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>AI Result</CardTitle>
            <CardDescription>Processed content and tool execution results</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="response" className="w-full">
              <TabsList>
                <TabsTrigger value="response">AI Response</TabsTrigger>
                <TabsTrigger value="tool">Tool Call</TabsTrigger>
                <TabsTrigger value="result">Tool Result</TabsTrigger>
              </TabsList>
              
              <TabsContent value="response" className="border rounded-md p-4 mt-2">
                <div className="prose max-w-none whitespace-pre-wrap">
                  {result.text || 'No text response'}
                </div>
              </TabsContent>
              
              <TabsContent value="tool" className="border rounded-md p-4 mt-2">
                {result.toolCall ? (
                  <div>
                    <h3 className="font-medium">Tool: {result.toolCall.name}</h3>
                    <pre className="whitespace-pre-wrap text-sm bg-slate-100 p-4 rounded mt-2">
                      {JSON.stringify(result.toolCall.parameters, null, 2)}
                    </pre>
                  </div>
                ) : (
                  <p>No tool call data</p>
                )}
              </TabsContent>
              
              <TabsContent value="result" className="border rounded-md p-4 mt-2">
                {result.toolResult ? (
                  <pre className="whitespace-pre-wrap text-sm bg-slate-100 p-4 rounded">
                    {JSON.stringify(result.toolResult, null, 2)}
                  </pre>
                ) : (
                  <p>No tool result data</p>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
