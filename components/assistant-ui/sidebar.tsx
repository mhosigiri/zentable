'use client';

import React, { FC, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Thread } from "@/components/assistant-ui/thread";
import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { TooltipProvider } from "@radix-ui/react-tooltip";

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
  // Initialize collapsed state based on screen size
  const [isOpen, setIsOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1440; // Default to open on larger screens
    }
    return true;
  });
  
  // State for thread management
  const [currentThreadId, setCurrentThreadId] = useState<string | null>(null);

  // On mount, clear threadId for this presentation to force new thread on reload
  useEffect(() => {
    localStorage.removeItem(`threadId_${presentationId}`);
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

  // Initialize the chat runtime with our assistant-chat API endpoint
  const runtime = useChatRuntime({
    api: "/api/assistant-chat",
    body: { 
      context: { presentationId },
      threadId: currentThreadId 
    },
    onResponse: (response) => {
      // Check for thread ID in response headers
      const threadId = response.headers.get('X-Thread-Id');
      if (threadId && threadId !== currentThreadId) {
        setCurrentThreadId(threadId);
        // Persist in localStorage as well
        localStorage.setItem(`threadId_${presentationId}`, threadId);
        console.log('Updated thread ID from response:', threadId);
      }
    }
  });
  
  // Set up effect to listen for slide update messages from approved tool calls
  React.useEffect(() => {
    // Skip if onSlideUpdate callback isn't provided
    if (!onSlideUpdate) return;
    
    // Function to handle message events
    const handleMessage = (event: MessageEvent) => {
      // Check if this is a slideUpdated event from approved tool calls
      if (event.data?.type === 'slideUpdated' && event.data?.slideId) {
        console.log("✅ Approved slide update detected:", event.data);
        
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
        className={cn(
          'h-full fixed right-4 top-[60%] transform -translate-y-1/2 z-50',
          isOpen ? 'w-80' : 'w-12',
          className
        )}
      >
        <div className={cn(
          'bg-white/10 dark:bg-black/10 backdrop-blur-sm border border-white/20 dark:border-zinc-800/20 rounded-xl shadow-2xl',
          'flex flex-col transition-all duration-300 ease-in-out',
          'max-h-[80vh] h-full'
        )}
        >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="absolute top-1/2 -translate-y-1/2 left-[-16px] z-20 bg-white/10 dark:bg-black/10 backdrop-blur-sm hover:bg-white/20 dark:hover:bg-black/20 border border-white/20 dark:border-zinc-800/20 rounded-full p-1.5 shadow-md transition-all duration-300 ease-in-out text-white"
        aria-label={isOpen ? "Close assistant sidebar" : "Open assistant sidebar"}
      >
        {isOpen ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      {isOpen ? (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-xl">
          <div className="flex items-center border-b border-white/20 dark:border-zinc-800/20 p-4">
            <h3 className="text-sm font-semibold text-white">AI Assistant</h3>
          </div>
          <div className={cn("flex h-full flex-col", !isOpen && "hidden")}>
            <AssistantRuntimeProvider runtime={runtime}>
              <Thread />
            </AssistantRuntimeProvider>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="p-3 w-full h-full flex flex-col items-center justify-center hover:bg-white/20 dark:hover:bg-black/20 rounded-xl text-white"
        >
          <div className="flex flex-col items-center gap-3">
            <Wand2 className="h-5 w-5 animate-shimmer" />
            <div className="h-16">
              <span className="text-xs rotate-90 whitespace-nowrap block origin-center translate-y-5">AI Assistant</span>
            </div>
          </div>
        </button>
      )}
        </div>
      </div>
    </TooltipProvider>
  );
};
