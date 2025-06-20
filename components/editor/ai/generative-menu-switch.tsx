"use client";

import { ReactNode, Fragment } from "react";
import { Button } from "@/components/ui/button";
import { MagicIcon } from "./magic-icon";
import { AISelector } from "./ai-selector";

interface GenerativeMenuSwitchProps {
  children: ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedText: string;
  onReplace: (content: string) => void;
  onInsert: (content: string) => void;
}

export function GenerativeMenuSwitch({ 
  children, 
  open, 
  onOpenChange, 
  selectedText,
  onReplace,
  onInsert
}: GenerativeMenuSwitchProps) {
  return (
    <>
      {open && (
        <AISelector
          selectedText={selectedText}
          onReplace={onReplace}
          onInsert={onInsert}
          onClose={() => onOpenChange(false)}
        />
      )}
      {!open && (
        <Fragment>
          <Button
            variant="ghost"
            size="sm"
            className="rounded-none text-purple-500 hover:text-purple-600 hover:bg-purple-50 h-8 w-8 p-0 flex items-center justify-center"
            onClick={() => onOpenChange(true)}
          >
            <MagicIcon className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-gray-300 mx-1" />
          {children}
        </Fragment>
      )}
    </>
  );
} 