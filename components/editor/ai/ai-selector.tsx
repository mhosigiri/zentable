"use client";

import { useState } from "react";
import { useCompletion } from "ai/react";
import { ArrowUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { AISelectorCommands } from "./ai-selector-commands";
import { AICompletionCommands } from "./ai-completion-commands";
import { MagicIcon } from "./magic-icon";

interface AISelectorProps {
  selectedText: string;
  slideId?: string;
  presentationId?: string;
  templateType?: string;
  fullContent?: string;
  selectedHtml?: string;
  onReplace: (content: string) => void;
  onInsert: (content: string) => void;
  onClose: () => void;
}

export function AISelector({ 
  selectedText,
  slideId,
  presentationId,
  templateType,
  fullContent,
  selectedHtml,
  onReplace, 
  onInsert, 
  onClose 
}: AISelectorProps) {
  const [inputValue, setInputValue] = useState("");
  const [showCommands, setShowCommands] = useState(true);

  const { completion, complete, isLoading, setCompletion } = useCompletion({
    api: '/api/ai-text-completion',
    onResponse: (response) => {
      if (response.status === 429) {
        toast.error("You have reached your request limit for the day.");
        return;
      }
      if (!response.ok) {
        toast.error("Failed to generate AI completion. Please try again.");
        return;
      }
      setShowCommands(false);
    },
    onError: (error) => {
      // console.error('AI completion error:', error);
      toast.error("Failed to generate AI completion. Please try again.");
    },
    onFinish: () => {
      setInputValue("");
    }
  });

  const hasCompletion = completion.length > 0;

  const handleCommandSelect = async (text: string, command: string) => {
    setShowCommands(false);
    try {
      await complete("", {
        body: { 
          text: text || selectedText, 
          command,
          option: command,
          slideId,
          presentationId,
          templateType,
          fullContent,
          selectedHtml
        }
      });
    } catch (error) {
      // console.error('Error executing command:', error);
      toast.error("Failed to execute AI command. Please try again.");
      setShowCommands(true);
    }
  };

  const handleCustomCommand = async () => {
    if (!inputValue.trim()) return;
    
    setShowCommands(false);
    try {
      await complete("", {
        body: { 
          text: selectedText, 
          command: "zap",
          option: inputValue.trim(),
          slideId,
          presentationId,
          templateType,
          fullContent,
          selectedHtml
        }
      });
    } catch (error) {
      // console.error('Error executing custom command:', error);
      toast.error("Failed to execute AI command. Please try again.");
      setShowCommands(true);
    }
  };

  const handleReplace = () => {
    onReplace(completion);
    handleDiscard();
  };

  const handleInsert = () => {
    onInsert(completion);
    handleDiscard();
  };

  const handleDiscard = () => {
    setCompletion("");
    setInputValue("");
    setShowCommands(true);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleCustomCommand();
    }
    if (e.key === 'Escape') {
      handleDiscard();
    }
  };

  return (
    <div className="w-[380px] bg-background border rounded-lg shadow-xl z-[160] relative">
      {/* AI Response */}
      {hasCompletion && (
        <div className="max-h-[200px] border-b overflow-hidden">
          <ScrollArea className="h-full max-h-[200px]">
            <div className="p-4">
              <div 
                className="prose prose-sm max-w-none dark:prose-invert 
                  prose-headings:font-semibold prose-headings:mb-2 
                  prose-h3:text-base prose-h4:text-sm 
                  prose-p:text-sm prose-p:mb-2 prose-p:leading-relaxed
                  prose-ul:text-sm prose-ul:my-2 prose-ul:space-y-1
                  prose-li:text-sm prose-li:leading-relaxed
                  prose-strong:font-semibold prose-em:italic
                  text-gray-700 dark:text-gray-300"
                dangerouslySetInnerHTML={{ __html: completion }}
              />
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center gap-2 p-4 text-sm font-medium text-purple-600 border-b">
          <MagicIcon className="h-4 w-4" />
          <span>AI is thinking</span>
          <Loader2 className="h-4 w-4 animate-spin ml-auto" />
        </div>
      )}

      {/* Commands or Completion Actions */}
      <div className="p-3 max-h-[300px] overflow-y-auto">
        {showCommands && !isLoading ? (
          <AISelectorCommands
            selectedText={selectedText}
            onSelect={handleCommandSelect}
          />
        ) : hasCompletion ? (
          <AICompletionCommands
            completion={completion}
            onReplace={handleReplace}
            onInsert={handleInsert}
            onDiscard={handleDiscard}
          />
        ) : null}
      </div>

      {/* Custom Command Input */}
      {!hasCompletion && (
        <div className="p-3 border-t">
          <div className="relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={hasCompletion ? "Tell AI what to do next" : "Ask AI to edit or generate..."}
              className="pr-10"
              disabled={isLoading}
            />
            <Button
              size="icon"
              variant="ghost"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-purple-100 hover:bg-purple-200 text-purple-600"
              onClick={handleCustomCommand}
              disabled={!inputValue.trim() || isLoading}
            >
              <ArrowUp className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 