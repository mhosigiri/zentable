'use client';

import { FC } from "react";
import { ToolContainer, ToolHeader, getToolIcon, getUserFriendlyToolName } from "./shared";

interface ToolFallbackProps {
  name: string;
  status?: "running" | "success" | "error";
  input?: Record<string, any>;
  output?: Record<string, any>;
}

// Simple tool fallback component that works with any tool
export const ToolFallback: FC<ToolFallbackProps> = ({ 
  name,
  status = "running",
  input,
  output
}) => {
  return (
    <ToolContainer>
      <ToolHeader 
        title={getUserFriendlyToolName(name)} 
        status={status} 
        icon={getToolIcon(name)}
      />

      {status === "running" && (
        <div className="animate-pulse text-muted-foreground">
          Processing...
        </div>
      )}

      {status === "error" && (
        <div className="text-red-600 dark:text-red-400">
          {output?.error || "An error occurred"}
        </div>
      )}

      {status === "success" && (
        <>
          {name === "getSlideIdByNumber" && (
            <div className="text-muted-foreground">
              Found slide ID: <span className="font-mono">{output?.slideId}</span>
            </div>
          )}

          {name !== "getSlideIdByNumber" && (
            <div className="text-muted-foreground">
              {output?.success ? "Completed successfully" : "Operation completed"}
            </div>
          )}
        </>
      )}
    </ToolContainer>
  );
};
