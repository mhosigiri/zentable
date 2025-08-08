'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AssistantSlidePreview } from '@/components/assistant-ui/assistant-slide-preview';
import { useMyRuntime } from '@/app/docs/[id]/MyRuntimeProvider';
import { useTheme } from '@/contexts/ThemeContext';
import { getThemeById, applyAndPersistTheme } from '@/lib/themes';
import { getUserFriendlyToolName } from './utils';
import { getToolIcon } from './tool-icons';

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

export function ToolResult({ toolCall, onApprove, onReject }: ToolResultProps) {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [isExpanded, setIsExpanded] = useState(true); // Start expanded by default
  const slideManager = useMyRuntime();
  const { setTheme } = useTheme();
  const params = useParams();
  const documentId = params.id as string;
  const requiresApproval = toolCall.result?.requiresApproval;
  
  // Auto-collapse only after user approval or for non-approval tools
  useEffect(() => {
    if (status === 'approved') {
      // Collapse after user clicks "Accept Changes"
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (!requiresApproval && toolCall.result && toolCall.result.success) {
      // Auto-collapse for read-only tools that don't need approval
      const timer = setTimeout(() => {
        setIsExpanded(false);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [status, requiresApproval, toolCall.result]);
  
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
  
  // Determine status for badge - ONLY SHOW ICON
  const getStatusBadge = () => {
    if (status === 'approved') {
      return (
        <Badge variant="default" className="gap-1 bg-green-600">
          <CheckCircle className="w-3 h-3" />
        </Badge>
      );
    } else if (status === 'rejected') {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="w-3 h-3" />
        </Badge>
      );
    } else if (requiresApproval) {
      // Show pending for approval-required tools
      return (
        <Badge variant="secondary" className="gap-1">
          <Loader2 className="w-3 h-3 animate-spin" />
        </Badge>
      );
    } else {
      // Show completed for non-approval tools (like getSlideContent)
      return (
        <Badge variant="default" className="gap-1">
          <CheckCircle className="w-3 h-3" />
        </Badge>
      );
    }
  };

  return (
    <Card className={cn(
      "my-4 bg-white/10 border border-white/20 rounded-lg backdrop-blur shadow-lg",
      "opacity-100"
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            {getToolIcon(toolCall.toolName)}
            <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
              {toolCall.toolName}
            </span>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            {getStatusBadge()}
            
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors flex-shrink-0"
              aria-label={isExpanded ? "Collapse details" : "Expand details"}
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-600" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-600" />
              )}
            </button>
          </div>
        </div>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="pt-0">
          <div className="space-y-3">
            {/* Tool details */}
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Tool:</strong> {getUserFriendlyToolName(toolCall.toolName)}
            </div>

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
            
            {/* Action Buttons - show for tools that require approval */}
            {status === 'pending' && requiresApproval && (
              <div className="flex gap-2 pt-2">
                <Button 
                  onClick={handleApprove}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Apply Changes
                </Button>
                <Button 
                  onClick={handleReject}
                  variant="outline"
                  size="sm"
                >
                  <XCircle className="w-4 h-4 mr-1" />
                  Reject
                </Button>
              </div>
            )}
            
            {/* Status messages - only show after user action */}
            {status === 'approved' && (
              <div className="text-sm text-green-600 font-medium">
                ✅ Changes applied to slide
              </div>
            )}
            {status === 'rejected' && (
              <div className="text-sm text-red-600 font-medium">
                ❌ Changes rejected
              </div>
            )}
          
          </div>
        </CardContent>
      )}
    </Card>
  );
}
