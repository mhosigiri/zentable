'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AssistantSlidePreview } from '@/components/assistant-ui/assistant-slide-preview';
import { useMyRuntime } from '@/app/docs/[id]/MyRuntimeProvider';
import { useTheme } from '@/contexts/ThemeContext';
import { getThemeById, applyAndPersistTheme } from '@/lib/themes';
import { getUserFriendlyToolName, getToolIcon, GlassContainer } from './shared';


interface ToolCallResult {
  toolName: string;
  args: Record<string, any>;
  result: any;
}

interface ToolResultProps {
  toolCall: ToolCallResult;
  onApprove?: (toolCall: ToolCallResult, successMessage?: string) => void;
  onReject?: (toolCall: ToolCallResult, failureMessage?: string) => void;
  onResult?: (toolCall: ToolCallResult) => void;
}



export function ToolResult({ toolCall, onApprove, onReject, onResult }: ToolResultProps) {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const slideManager = useMyRuntime();
  const { setTheme } = useTheme();
  const params = useParams();
  const documentId = params.id as string;

  // Debug logging
  console.log('ToolResult render - status:', status, 'toolCall:', toolCall.toolName);

  // Force re-render when status changes
  useEffect(() => {
    console.log('Status changed to:', status);
  }, [status]);
  
  // Remove the automatic onResult call - only call it when user actually approves/rejects
  
  const handleApprove = async () => {
    console.log('handleApprove called!');
    // Set status to approved immediately for visual feedback
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
      // Pass failure message to parent
      const failureMessage = toolCall.result?.failureResponse || `Failed to apply ${getUserFriendlyToolName(toolName)}. Please try again.`;
      onApprove?.(toolCall, failureMessage);
      return;
    }

    // Update local status to approved
    setStatus('approved');
    
    // Pass success message to parent
    const successMessage = toolCall.result?.successResponse || ` ${getUserFriendlyToolName(toolName)} applied successfully!`;
    onApprove?.(toolCall, successMessage);
  };
  
  const handleReject = () => {
    setStatus('rejected');
    const failureMessage = toolCall.result?.failureResponse || ` ${getUserFriendlyToolName(toolCall.toolName)} was rejected.`;
    onReject?.(toolCall, failureMessage);
  };

  const isUpdateSlideContent = toolCall.toolName === 'updateSlideContent';
  const isGetSlideContent = toolCall.toolName === 'getSlideContent';
  const requiresApproval = toolCall.result?.requiresApproval;
  
  return (
    <div className="my-4">
      <div className="bg-white/85 backdrop-blur-2xl border border-white/50 rounded-xl p-0 overflow-hidden shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-white/30 rounded-xl"></div>
        <div className="relative z-10">
      <div className="p-4 pb-3">
        <div className="flex items-center gap-3">
          {getToolIcon(toolCall.toolName)}
          <div className="flex-1">
            <div className="text-base font-medium">
              {getUserFriendlyToolName(toolCall.toolName)}
            </div>
          </div>
                           <Badge
                   variant={
                     status === 'approved' ? 'default' :
                     status === 'rejected' ? 'destructive' :
                     toolCall.result ? 'default' :
                     'secondary'
                   }
                   className={`gap-1 ${status === 'approved' ? 'bg-green-100 text-green-800 border-green-200' : ''}`}
                 >
                   {status === 'pending' && !toolCall.result && <Loader2 className="w-3 h-3 animate-spin" />}
                   {status === 'pending' && toolCall.result && <CheckCircle className="w-3 h-3" />}
                   {status === 'approved' && <CheckCircle className="w-3 h-3" />}
                   {status === 'rejected' && <XCircle className="w-3 h-3" />}
                 </Badge>
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="space-y-3">
          {/* For slide content viewing */}
          {isGetSlideContent && toolCall.result?.success && (
            <div>
              <h4 className="text-sm font-medium mb-2">Slide Preview:</h4>
              <div className="mb-4">
                <AssistantSlidePreview 
                  content={toolCall.result.content || ''} 
                  title={toolCall.result.title || ''}
                  templateType={toolCall.result.templateType || 'bullets'}
                />
              </div>
            </div>
          )}

          {/* For slide updates, show content preview */}
          {isUpdateSlideContent && toolCall.args.content && (
            <div>
              <h4 className="text-sm font-medium mb-2">Content Preview:</h4>
              <div className="mb-10 pb-4">
                <AssistantSlidePreview 
                  content={toolCall.args.content} 
                  title={toolCall.args.title || ''}
                  templateType={toolCall.args.templateType || 'bullets'}
                />
              </div>
            </div>
          )}

          {/* Previews for other tools */}
          {toolCall.toolName === 'updateSlideImage' && toolCall.result?.imagePrompt && (
            <p className="text-sm">Generate image with prompt: <em>&quot;{toolCall.result.imagePrompt}&quot;</em></p>
          )}

          {toolCall.toolName === 'changeSlideTemplate' && toolCall.result?.slideId && (
            <p className="text-sm">Change template for slide <code className='text-xs bg-gray-200 p-1 rounded'>{toolCall.result.slideId}</code> to <strong>{toolCall.result.newTemplateType}</strong>?</p>
          )}
          {/* Action Buttons */}
          {requiresApproval && (
            <div className="flex gap-2 pt-2">
                                   <Button
                       onClick={() => {
                         console.log('Button clicked!');
                         handleApprove();
                         setStatus('approved');
                       }}
                       size="sm"
                       className={status === 'approved' ? 'bg-green-800 text-white' : 'bg-green-600 hover:bg-green-700'}
                       disabled={status !== 'pending'}
                     >
                       <CheckCircle className="w-4 h-4 mr-1" />
                       {status === 'pending' ? 'Apply Changes' : 'Applied!'}
                     </Button>
              <Button 
                onClick={handleReject}
                variant="outline"
                size="sm"
                disabled={status !== 'pending'}
              >
                <XCircle className="w-4 h-4 mr-1" />
                Reject
              </Button>
            </div>
          )}
                           {status === 'approved' && (
                   <div className="text-sm text-green-600 font-medium flex items-center gap-2">
                     <CheckCircle className="w-4 h-4" />
                     Changes applied to slide
                   </div>
                 )}
                 {status === 'rejected' && (
                   <div className="text-sm text-red-600 font-medium flex items-center gap-2">
                     <XCircle className="w-4 h-4" />
                     Changes rejected
                   </div>
                 )}
        </div>
              </div>
        </div>
      </div>
    </div>
  );
}
