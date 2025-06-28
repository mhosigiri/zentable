'use client';

import { FC } from "react";

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
    <div className="mt-2 rounded-md border bg-muted/50 p-2 text-xs">
      <div className="mb-1 flex items-center gap-2">
        <span className="font-medium">{name}</span>
        <span
          className={`rounded-full px-1.5 py-0.5 text-[10px] ${
            status === "running"
              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
              : status === "success"
              ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
              : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
          }`}
        >
          {status}
        </span>
      </div>

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
    </div>
  );
};
