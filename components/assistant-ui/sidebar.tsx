'use client';

import React, { FC, useState, useEffect, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight, Wand2, GripVertical, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { HITLChatStyled } from "./hitl-chat-styled";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { useAssistantLayout } from "@/components/ui/assistant-layout";

interface AssistantSidebarProps {
  presentationId: string;
  className?: string;
  onSlideUpdate?: (slideId: string, newContent: string | null) => void;
}

export const AssistantSidebar: FC<AssistantSidebarProps> = ({
  presentationId,
  className,
  onSlideUpdate,
}) => {
  const { sidebarOpen: isOpen, setSidebarOpen: setIsOpen, sidebarWidth: width, setSidebarWidth: setWidth } = useAssistantLayout();
  
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isResizing = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  
  // State for thread management
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);
  
  // Handle resize
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizing.current = true;
    startX.current = e.clientX;
    startWidth.current = width;
    
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [width]);
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      
      const diff = startX.current - e.clientX;
      const newWidth = Math.min(Math.max(startWidth.current + diff, 320), 800);
      setWidth(newWidth);
    };
    
    const handleMouseUp = () => {
      if (isResizing.current) {
        isResizing.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  // On mount, clear threadId for this presentation to force new thread on reload
  useEffect(() => {
    localStorage.removeItem(`thread_${presentationId}`);
    setCurrentThreadId(null);
  }, [presentationId]);

  // When threadId changes, persist it in localStorage
  useEffect(() => {
    if (currentThreadId) {
      localStorage.setItem(`threadId_${presentationId}`, currentThreadId);
    }
  }, [currentThreadId, presentationId]);

  // If presentationId changes, reset threadId
  useEffect(() => {
    setCurrentThreadId(localStorage.getItem(`threadId_${presentationId}`) || null);
  }, [presentationId]);


  
  // Set up effect to listen for slide update messages from approved tool calls
  React.useEffect(() => {
    // Skip if onSlideUpdate callback isn't provided
    if (!onSlideUpdate) return;
    
    // Function to handle message events
    const handleMessage = (event: MessageEvent) => {
      // Check if this is a slideUpdated event from approved tool calls
      if (event.data?.type === 'slideUpdated' && event.data?.slideId) {
        // console.log("✅ Approved slide update detected:", event.data);
        
        // Trigger slide refresh by calling onSlideUpdate with the slideId
        // This will refresh the slide from database
        onSlideUpdate(event.data.slideId, null);
      }
    };
    
    // Add event listener
    window.addEventListener('message', handleMessage);
    
    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [onSlideUpdate]);

  return (
    <TooltipProvider>
      <div
        ref={sidebarRef}
        className={cn(
          'h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700',
          'flex flex-col relative',
          className
        )}
      >
        {/* Resize handle */}
        <div
          onMouseDown={handleMouseDown}
          className="absolute left-0 top-0 w-1 h-full cursor-col-resize group hover:bg-blue-500/50 transition-colors z-10"
        >
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-12 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-gray-400" />
          </div>
        </div>
        
        {/* Toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "absolute top-1/2 -translate-y-1/2 z-20",
            "bg-white/10 dark:bg-black/10 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-black/20",
            "border border-white/20 dark:border-zinc-800/20",
            "shadow-2xl transition-all duration-300 ease-in-out",
            isOpen ? "rounded-l-lg p-2 -left-10" : "rounded-xl py-6 px-3 -left-[4.5rem] group h-40"
          )}
          aria-label={isOpen ? "Close assistant sidebar" : "Open assistant sidebar"}
        >
          {isOpen ? (
            <ChevronRight className="w-5 h-5 text-white" />
          ) : (
            <div className="relative w-full h-full flex items-center justify-center text-white">
              <div className="absolute left-1/2 -translate-x-8 w-6 h-6 rounded-full border border-white/50 flex items-center justify-center">
                <ChevronLeft className="w-4 h-4" />
              </div>
              <div className="flex items-center gap-2 [writing-mode:vertical-rl]">
                <Wand2 className="w-5 h-5 animate-pulse" />
                <span className="text-xs whitespace-nowrap">AI Assistant</span>
              </div>
            </div>
          )}
        </button>

        {/* Header */}
        <div className="h-16 flex items-center justify-center px-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-100/40 via-purple-50/20 to-transparent dark:from-purple-900/30 dark:via-purple-900/10 dark:to-transparent"></div>
          <div className="flex items-center gap-2 relative z-10">
            <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
            <h3 className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              AI Assistant
            </h3>
          </div>
        </div>
        
        {/* Chat thread */}
        <div className="flex-1 overflow-hidden">
          <HITLChatStyled presentationId={presentationId} onSlideUpdate={onSlideUpdate} />
        </div>
      </div>
    </TooltipProvider>
  );
};
