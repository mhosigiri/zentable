'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle } from 'lucide-react';
import { AssistantSlidePreview } from '@/components/assistant-ui/assistant-slide-preview';
import { useMyRuntime } from '@/app/docs/[id]/MyRuntimeProvider';
import { useTheme } from '@/contexts/ThemeContext';
import { getThemeById, applyAndPersistTheme } from '@/lib/themes';
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from '@/components/ai-elements/tool';
import { CodeBlock } from '@/components/ai-elements/code-block';
import type { ToolUIPart } from 'ai';

// Convert technical tool names to user-friendly descriptions
const getUserFriendlyToolName = (toolName: string): string => {
  const toolNameMap: Record<string, string> = {
    'updateSlideImage': 'Update Slide Image',
    'applyTheme': 'Apply Theme',
    'changeSlideTemplate': 'Change Slide Template',
    'createSlide': 'Create Slide',
    'createSlideWithAI': 'Generate AI Slide',
    'deleteSlide': 'Delete Slide',
    'duplicateSlide': 'Duplicate Slide',
    'moveSlide': 'Move Slide',
    'getSlideContent': 'Get Slide Content',
    'updateSlideContent': 'Update Slide Content',
    'getSlideIdByNumber': 'Find Slide',
    'getSlideById': 'Retrieve Slide',
    'getAllSlides': 'List All Slides',
    'getOutline': 'Get Outline',
    'generateImage': 'Generate Image',
  };
  
  return toolNameMap[toolName] || toolName;
};

interface ToolCallResult {
  toolName: string;
  args: Record<string, any>;
  result: any;
}

interface ToolResultProps {
  toolCall: ToolCallResult;
  onApprove?: (toolCall: ToolCallResult) => void;
  onReject?: (toolCall: ToolCallResult) => void;
}

// Map tool status to ToolUIPart state
const getToolState = (toolCall: ToolCallResult, status: string): ToolUIPart['state'] => {
  if (!toolCall.result) return 'input-streaming';
  if (status === 'rejected') return 'output-error';
  if (status === 'approved') return 'output-available';
  if (toolCall.result?.requiresApproval) return 'input-available';
  return 'output-available';
};



export function ToolResult({ toolCall, onApprove, onReject }: ToolResultProps) {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const slideManager = useMyRuntime();
  const { setTheme } = useTheme();
  const params = useParams();
  const documentId = params.id as string;
  
  const handleApprove = async () => {
    setStatus('approved');
    
    const { toolName, result } = toolCall;

    try {
      if (toolName === 'updateSlideContent' && toolCall.args.slideId && toolCall.args.content) {
        await slideManager.updateSlideById(toolCall.args.slideId, { content: toolCall.args.content });
      } else if (toolName === 'createSlide' && result.success) {
        slideManager.addSlide(result.newSlide, result.newSlide.position);
      } else if (toolName === 'deleteSlide' && result.success) {
        const slideIndex = slideManager.slides.findIndex(s => s.id === result.slideId);
        if (slideIndex !== -1) slideManager.deleteSlide(slideIndex);
      } else if (toolName === 'duplicateSlide' && result.success) {
        const slideIndex = slideManager.slides.findIndex(s => s.id === result.originalSlideId);
        if (slideIndex !== -1) slideManager.duplicateSlide(slideIndex);
      } else if (toolName === 'moveSlide' && result.success) {
        const oldIndex = slideManager.slides.findIndex(s => s.id === result.slideId);
        if (oldIndex !== -1) slideManager.reorderSlides(oldIndex, result.newPosition);
      } else if (toolName === 'changeSlideTemplate' && result.success) {
        slideManager.updateSlideById(result.slideId, { templateType: result.newTemplateType });
      } else if (toolName === 'applyTheme' && result.success) {
        const theme = getThemeById(result.themeId);
        if (theme) {
          // eslint-disable-next-line no-console
          console.log(`🎨 Assistant applying theme for documentId: ${documentId}`);
          
          // Update the theme context first
          setTheme(theme, documentId);
          
          // Persist the theme change
          applyAndPersistTheme(theme, documentId);
        }
      } else if (toolName === 'updateSlideImage' && result.success) {
        slideManager.updateSlideById(result.slideId, { 
          imagePrompt: result.imagePrompt,
          imageUrl: undefined, // Clear existing image to trigger regeneration
          isGeneratingImage: true 
        });
      }
    } catch (e) {
      console.error(`Failed to apply ${toolName} on client`, e);
      setStatus('rejected'); // Revert status on failure
    }

    // Commenting out server-side callback for testing UI-only updates
    // onApprove?.(toolCall);
  };
  
  const handleReject = () => {
    setStatus('rejected');
    onReject?.(toolCall);
  };

  const isUpdateSlideContent = toolCall.toolName === 'updateSlideContent';
  const isGetSlideContent = toolCall.toolName === 'getSlideContent';
  const requiresApproval = toolCall.result?.requiresApproval;
  const toolState = getToolState(toolCall, status);
  
  // Determine if tool should be open by default
  const defaultOpen = toolState === 'output-available' || toolState === 'output-error' || requiresApproval;
  
  return (
    <Tool defaultOpen={defaultOpen} className="my-4">
      <ToolHeader 
        type={getUserFriendlyToolName(toolCall.toolName)} 
        state={toolState}
      />
      <ToolContent>
        {/* Show input parameters if available */}
        {toolCall.args && Object.keys(toolCall.args).length > 0 && (
          <ToolInput input={toolCall.args} />
        )}
        
        {/* Custom output rendering based on tool type */}
        <div className="space-y-4 px-4 pb-4">
          {/* For slide content viewing */}
          {isGetSlideContent && toolCall.result?.success && (
            <div className="space-y-2">
              <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Slide Preview</h4>
              <div className="rounded-md bg-muted/50 p-4">
                <AssistantSlidePreview 
                  content={toolCall.result.content || ''} 
                  title={toolCall.result.title || ''}
                  templateType={toolCall.result.templateType || 'bullets'}
                  imageUrl={toolCall.result.imageUrl}
                  imagePrompt={toolCall.result.imagePrompt}
                />
              </div>
            </div>
          )}

          {/* For slide updates, show content preview */}
          {isUpdateSlideContent && toolCall.args.content && (
            <div className="space-y-2">
              <h4 className="font-medium text-muted-foreground text-xs uppercase tracking-wide">Content Preview</h4>
              <div className="rounded-md bg-muted/50 p-4">
                <AssistantSlidePreview 
                  content={toolCall.args.content} 
                  title={toolCall.args.title || ''}
                  templateType={toolCall.args.templateType || 'bullets'}
                  imageUrl={toolCall.args.imageUrl}
                  imagePrompt={toolCall.args.imagePrompt}
                />
              </div>
            </div>
          )}

          {/* Show result if available and not already handled */}
          {toolCall.result && !isGetSlideContent && !isUpdateSlideContent && (
            <ToolOutput 
              output={
                <div className="p-3">
                  {toolCall.toolName === 'updateSlideImage' && toolCall.result?.imagePrompt && (
                    <p className="text-sm">Generate image with prompt: <em>&quot;{toolCall.result.imagePrompt}&quot;</em></p>
                  )}
                  {toolCall.toolName === 'changeSlideTemplate' && toolCall.result?.slideId && (
                    <p className="text-sm">Change template to <strong>{toolCall.result.newTemplateType}</strong></p>
                  )}
                  {toolCall.toolName === 'applyTheme' && toolCall.result?.themeId && (
                    <p className="text-sm">Applied theme: <strong>{toolCall.result.themeId}</strong></p>
                  )}
                  {/* For other tools, show JSON result */}
                  {!['updateSlideImage', 'changeSlideTemplate', 'applyTheme'].includes(toolCall.toolName) && (
                    <CodeBlock 
                      code={JSON.stringify(toolCall.result, null, 2)} 
                      language="json" 
                    />
                  )}
                </div>
              }
              errorText={status === 'rejected' ? 'Changes rejected by user' : undefined}
            />
          )}
          
          {/* Action Buttons for approval */}
          {status === 'pending' && requiresApproval && (
            <div className="flex gap-2 px-4 pb-4">
              <Button 
                onClick={handleApprove}
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Apply Changes
              </Button>
              <Button 
                onClick={handleReject}
                variant="outline"
                size="sm"
                className="border-red-500/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </ToolContent>
    </Tool>
  );
}
