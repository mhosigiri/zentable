
'use client';

import { FC, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Common status types used across components
export type ToolStatus = 'pending' | 'running' | 'success' | 'error' | 'approved' | 'rejected';

// Status badge component used across multiple files
interface StatusBadgeProps {
  status: ToolStatus;
  className?: string;
}

export const StatusBadge: FC<StatusBadgeProps> = ({ status, className }) => {
  const getStatusConfig = (status: ToolStatus) => {
    switch (status) {
      case 'running':
      case 'pending':
        return {
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          text: status === 'running' ? 'running' : 'pending'
        };
      case 'success':
      case 'approved':
        return {
          className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          text: status === 'success' ? 'success' : 'approved'
        };
      case 'error':
      case 'rejected':
        return {
          className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          text: status === 'error' ? 'error' : 'rejected'
        };
      default:
        return {
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          text: status
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={cn(
      'rounded-full px-1.5 py-0.5 text-[10px]',
      config.className,
      className
    )}>
      {config.text}
    </span>
  );
};

// Common tool container component
interface ToolContainerProps {
  children: ReactNode;
  className?: string;
}

export const ToolContainer: FC<ToolContainerProps> = ({ children, className }) => (
  <div className={cn(
    'mt-2 rounded-md border bg-muted/50 p-2 text-xs',
    className
  )}>
    {children}
  </div>
);

// Common tool header component
interface ToolHeaderProps {
  title: string;
  status: ToolStatus;
  icon?: ReactNode;
  className?: string;
}

export const ToolHeader: FC<ToolHeaderProps> = ({ title, status, icon, className }) => (
  <div className={cn('mb-1 flex items-center gap-2', className)}>
    {icon}
    <span className="font-medium">{title}</span>
    <StatusBadge status={status} />
  </div>
);

// Custom icons extracted from thread.tsx
export const CircleStopIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
      fill="currentColor"
    />
    <path
      d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6Z"
      fill="currentColor"
    />
  </svg>
);

export const XIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Common tool name mapping
export const getUserFriendlyToolName = (toolName: string): string => {
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

// Common tool icon mapping
export const getToolIcon = (toolName: string) => {
  const { Sparkles, Wand2, Search, Clock } = require('lucide-react');
  
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

// Common glass morphism container component
interface GlassContainerProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'hover' | 'focus';
}

export const GlassContainer: FC<GlassContainerProps> = ({ 
  children, 
  className, 
  variant = 'default' 
}) => {
  const baseClasses = 'bg-white/10 backdrop-blur border border-white/20';
  const variantClasses = {
    default: 'shadow-lg',
    hover: 'hover:bg-white/20 transition-colors ease-in',
    focus: 'focus-within:border-white/30 transition-colors ease-in'
  };

  return (
    <div className={cn(
      baseClasses,
      variantClasses[variant],
      className
    )}>
      {children}
    </div>
  );
}; 
 