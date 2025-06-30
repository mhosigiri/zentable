'use client';

import { FC, useState } from "react";
import { MessageCircle, X, Minimize, Maximize } from "lucide-react";
import { cn } from "@/lib/utils";
import { Thread } from "./thread";
// Use ThreadProvider from the official Shadcn integration that already works in our app
import { ThreadPrimitive } from "@assistant-ui/react";

interface ChatWidgetProps {
  presentationId: string;
  onSlideUpdate?: () => void;
  className?: string;
}

export const ChatWidget: FC<ChatWidgetProps> = ({
  presentationId,
  onSlideUpdate,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  // Toggle the chat widget open/close state
  const toggleOpen = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setIsMinimized(false);
    }
  };

  // Toggle the minimized state
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Instead of using hooks, we'll rely on the custom Thread component
  // which is already set up to work with our assistant-chat API route
  // Tool call events are handled by the internal Thread component

  return (
    <>
      {!isOpen && (
        <button
          onClick={toggleOpen}
          className="fixed bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          aria-label="Open chat assistant"
        >
          <MessageCircle size={20} />
        </button>
      )}

      {isOpen && (
        <div
          className={cn(
            "fixed right-4 bottom-4 z-50 flex flex-col overflow-hidden rounded-lg border border-white/20 bg-white/20 backdrop-blur shadow-lg transition-all duration-300 ease-in-out",
            isMinimized ? "h-14 w-72" : "h-[80vh] max-h-[600px] w-[350px] sm:w-[400px]",
            className
          )}
        >
          <div className="flex h-14 items-center justify-between border-b px-4">
            <h3 className="text-sm font-medium">AI Assistant</h3>
            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleMinimize}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                aria-label={isMinimized ? "Maximize chat" : "Minimize chat"}
              >
                {isMinimized ? <Maximize size={14} /> : <Minimize size={14} />}
              </button>
              <button
                onClick={toggleOpen}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-destructive"
                aria-label="Close chat"
              >
                <X size={14} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="h-full w-full">
                {/* The Thread component is already configured to work with our API endpoint */}
                <Thread />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
