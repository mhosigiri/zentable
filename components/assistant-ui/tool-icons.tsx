import React from 'react';
import { TOOL_CATEGORIES } from './constants';
import { Clock, Search, Sparkles, Wand2 } from 'lucide-react';

/**
 * Get appropriate icon for a tool based on its category
 */
export const getToolIcon = (toolName: string) => {
  if (TOOL_CATEGORIES.IMAGE_TOOLS.includes(toolName as any)) {
    return <Sparkles className="w-4 h-4" />;
  }
  
  if (TOOL_CATEGORIES.SLIDE_OPERATIONS.includes(toolName as any)) {
    return <Wand2 className="w-4 h-4" />;
  }
  
  if (TOOL_CATEGORIES.CONTENT_VIEWING.includes(toolName as any)) {
    return <Search className="w-4 h-4" />;
  }
  
  return <Clock className="w-4 h-4" />;
}; 