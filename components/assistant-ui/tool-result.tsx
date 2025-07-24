'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Edit, Search, Wand2, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AssistantSlidePreview } from '@/components/assistant-ui/assistant-slide-preview';
import { useMyRuntime } from '@/app/docs/[id]/MyRuntimeProvider';
import { useTheme } from '@/contexts/ThemeContext';
import { getThemeById, applyAndPersistTheme } from '@/lib/themes';

// Convert technical tool names to user-friendly descriptions
const getUserFriendlyToolName = (toolName: string): string => {
  const toolNameMap: Record<string, string> = {
    'updateSlideImage': 'Updating Slide Image',
    'applyTheme': 'Applying Theme',
    'changeSlideTemplate': 'Changing Slide Template',
    'createSlide': 'Creating Slide',
    'createSlideWithAI': 'Creating AI-Generated Slide',
    'deleteSlide': 'Deleting Slide',
    'duplicateSlide': 'Duplicating Slide',
    'moveSlide': 'Moving Slide',
    'getSlideContent': 'Viewing Slide Content',
    'updateSlideContent': 'Updating Slide Content',
    'getSlideIdByNumber': 'Getting Slide Content',
    'getSlideById': 'Retrieving Slide',
    'getAllSlides': 'Getting All Slides',
    'getOutline': 'Retrieving Outline',
    'generateImage': 'Generating Image',
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

const getToolIcon = (toolName: string) => {
  switch (toolName) {
    case 'updateSlideImage':
    case 'generateImage':
      return <Sparkles className="w-4 h-4" />;
    case 'applyTheme':
    case 'changeSlideTemplate':
    case 'updateSlideContent':
    case 'createSlide':
    case 'duplicateSlide':
    case 'moveSlide':
    case 'deleteSlide':
      return <Wand2 className="w-4 h-4" />;
    case 'getSlideContent':
    case 'getSlideIdByNumber':
      return <Search className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
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
  
  return (
    <Card className="sticky bottom-0 bg-white/95 border border-white/20 rounded-lg backdrop-blur shadow-lg z-50">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          {getToolIcon(toolCall.toolName)}
          <div className="flex-1">
            <CardTitle className="text-base font-medium">
              {getUserFriendlyToolName(toolCall.toolName)}
            </CardTitle>
          </div>
          <Badge 
            variant={
              status === 'approved' ? 'default' : 
              status === 'rejected' ? 'destructive' : 
              toolCall.result ? 'default' :
              'secondary'
            }
            className="gap-1"
          >
            {status === 'pending' && !toolCall.result && <Loader2 className="w-3 h-3 animate-spin" />}
            {status === 'pending' && toolCall.result && <CheckCircle className="w-3 h-3" />}
            {status === 'approved' && <CheckCircle className="w-3 h-3" />}
            {status === 'rejected' && <XCircle className="w-3 h-3" />}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
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
    </Card>
  );
}
