'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Clock, Edit, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AssistantSlidePreview } from '@/components/assistant-ui/assistant-slide-preview';

// Convert technical tool names to user-friendly descriptions
const getUserFriendlyToolName = (toolName: string): string => {
  const toolNameMap: Record<string, string> = {
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
    case 'updateSlideContent':
      return <Edit className="w-4 h-4" />;
    case 'getSlideIdByNumber':
      return <Search className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getToolColor = (toolName: string) => {
  switch (toolName) {
    case 'updateSlideContent':
      return 'bg-blue-500';
    case 'getSlideIdByNumber':
      return 'bg-green-500';
    default:
      return 'bg-gray-500';
  }
};

export function ToolResult({ toolCall, onApprove, onReject }: ToolResultProps) {
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  
  const handleApprove = () => {
    setStatus('approved');
    onApprove?.(toolCall);
  };
  
  const handleReject = () => {
    setStatus('rejected');
    onReject?.(toolCall);
  };

  const isUpdateSlideContent = toolCall.toolName === 'updateSlideContent';
  
  return (
    <Card className="my-4 border-l-4 border-l-blue-500">
      <CardHeader className="pb-3">
        <div className="flex items-center gap-3">
          <div className={cn(
            "p-2 rounded-md text-white",
            getToolColor(toolCall.toolName)
          )}>
            {getToolIcon(toolCall.toolName)}
          </div>
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
            {status === 'approved' && <CheckCircle className="w-3 h-3" />}
            {status === 'rejected' && <XCircle className="w-3 h-3" />}
            {!status && toolCall.result && <CheckCircle className="w-3 h-3" />}
            {!status && !toolCall.result && (
              <svg className="w-3 h-3 animate-spin text-gray-400" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            )}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
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
          {/* Action Buttons */}
          {status === 'pending' && isUpdateSlideContent && (
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
