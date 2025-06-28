'use client';

import { FC } from "react";

interface SlideUpdateToolUIProps {
  status?: "running" | "success" | "error";
  input?: {
    slideId?: string;
    content?: string;
  };
  output?: {
    success?: boolean;
    error?: string;
  };
}

export const SlideUpdateToolUI: FC<SlideUpdateToolUIProps> = ({ 
  status = "running",
  input,
  output
}) => {
  return (
    <div className="mt-2 rounded-md border bg-muted/50 p-2 text-xs">
      <div className="mb-1 flex items-center gap-2">
        <span className="font-medium">Update Slide</span>
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
          Updating slide content...
        </div>
      )}

      {status === "error" && (
        <div className="text-red-600 dark:text-red-400">
          {output?.error || "Failed to update slide content"}
        </div>
      )}

      {status === "success" && (
        <div className="text-muted-foreground">
          {output?.success 
            ? "✓ Slide content updated successfully" 
            : `Failed to update slide: ${output?.error || "Unknown error"}`}
        </div>
      )}
    </div>
  );
};
