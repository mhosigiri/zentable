'use client';

import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Wand2, 
  Sparkles, 
  Search,
  ChevronDown,
  ChevronUp,
  Loader2,
  FileText,
  Image,
  Palette,
  Copy,
  Trash2,
  Move
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface ToolCallDisplayProps {
  toolName: string;
  args?: Record<string, any>;
  result?: any;
  status?: 'pending' | 'running' | 'completed' | 'failed' | 'requires-approval';
  onApprove?: () => void;
  onReject?: () => void;
  children?: React.ReactNode;
}

const toolMetadata: Record<string, { 
  label: string; 
  icon: React.ComponentType<{ className?: string }>; 
  color: string;
  description?: string;
}> = {
  updateSlideImage: {
    label: 'Update Image',
    icon: Image,
    color: 'text-purple-500',
    description: 'Generating new image for slide'
  },
  applyTheme: {
    label: 'Apply Theme',
    icon: Palette,
    color: 'text-indigo-500',
    description: 'Changing presentation theme'
  },
  changeSlideTemplate: {
    label: 'Change Template',
    icon: FileText,
    color: 'text-blue-500',
    description: 'Updating slide layout'
  },
  createSlide: {
    label: 'Create Slide',
    icon: Wand2,
    color: 'text-green-500',
    description: 'Adding new slide'
  },
  createSlideWithAI: {
    label: 'Generate Slide',
    icon: Sparkles,
    color: 'text-purple-500',
    description: 'Creating AI-powered slide'
  },
  deleteSlide: {
    label: 'Delete Slide',
    icon: Trash2,
    color: 'text-red-500',
    description: 'Removing slide'
  },
  duplicateSlide: {
    label: 'Duplicate Slide',
    icon: Copy,
    color: 'text-blue-500',
    description: 'Creating slide copy'
  },
  moveSlide: {
    label: 'Move Slide',
    icon: Move,
    color: 'text-orange-500',
    description: 'Reordering slides'
  },
  getSlideContent: {
    label: 'Get Content',
    icon: Search,
    color: 'text-gray-500',
    description: 'Retrieving slide data'
  },
  updateSlideContent: {
    label: 'Update Content',
    icon: FileText,
    color: 'text-blue-500',
    description: 'Modifying slide content'
  },
  getSlideIdByNumber: {
    label: 'Find Slide',
    icon: Search,
    color: 'text-gray-500',
    description: 'Locating slide'
  },
  getSlideById: {
    label: 'Retrieve Slide',
    icon: Search,
    color: 'text-gray-500',
    description: 'Loading slide data'
  },
  getAllSlides: {
    label: 'List Slides',
    icon: FileText,
    color: 'text-gray-500',
    description: 'Getting all slides'
  },
  getOutline: {
    label: 'Get Outline',
    icon: FileText,
    color: 'text-gray-500',
    description: 'Retrieving presentation structure'
  },
  generateImage: {
    label: 'Generate Image',
    icon: Sparkles,
    color: 'text-purple-500',
    description: 'Creating AI image'
  }
};

export function ToolCallDisplay({
  toolName,
  args,
  result,
  status = 'pending',
  onApprove,
  onReject,
  children
}: ToolCallDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const metadata = toolMetadata[toolName] || {
    label: toolName,
    icon: Clock,
    color: 'text-gray-500'
  };

  const Icon = metadata.icon;
  
  const getStatusIcon = () => {
    switch (status) {
      case 'running':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <XCircle className="w-4 h-4 text-red-500" />;
      case 'requires-approval':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const showDetails = args && Object.keys(args).length > 0;

  return (
    <div className={cn(
      "rounded-lg border transition-all duration-200",
      status === 'running' && "border-blue-500/50 bg-blue-50/10 dark:bg-blue-950/10",
      status === 'completed' && "border-green-500/30 bg-green-50/10 dark:bg-green-950/10",
      status === 'failed' && "border-red-500/30 bg-red-50/10 dark:bg-red-950/10",
      status === 'requires-approval' && "border-yellow-500/50 bg-yellow-50/10 dark:bg-yellow-950/10",
      status === 'pending' && "border-gray-200 dark:border-gray-700"
    )}>
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className={cn("p-1.5 rounded-md bg-white dark:bg-gray-900 shadow-sm", metadata.color)}>
          <Icon className="w-4 h-4" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{metadata.label}</span>
            {metadata.description && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {metadata.description}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {getStatusIcon()}
          
          {showDetails && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
            >
              {isExpanded ? (
                <ChevronUp className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Expandable Details */}
      {isExpanded && showDetails && (
        <div className="px-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          <div className="mt-3 space-y-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Parameters
            </div>
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-3">
              <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
                {JSON.stringify(args, null, 2)}
              </pre>
            </div>
          </div>
          
          {result && (
            <div className="mt-3 space-y-2">
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Result
              </div>
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-md p-3">
                <pre className="text-xs text-gray-700 dark:text-gray-300 overflow-x-auto">
                  {typeof result === 'string' ? result : JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Custom Content (like slide previews) */}
      {children && (
        <div className="px-4 pb-3 border-t border-gray-200 dark:border-gray-700">
          <div className="mt-3">
            {children}
          </div>
        </div>
      )}

      {/* Approval Actions */}
      {status === 'requires-approval' && (onApprove || onReject) && (
        <div className="flex items-center gap-2 px-4 py-3 border-t border-gray-200 dark:border-gray-700">
          {onApprove && (
            <Button
              onClick={onApprove}
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
              Apply
            </Button>
          )}
          {onReject && (
            <Button
              onClick={onReject}
              size="sm"
              variant="outline"
              className="border-red-500/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
            >
              <XCircle className="w-3.5 h-3.5 mr-1" />
              Reject
            </Button>
          )}
        </div>
      )}
    </div>
  );
}