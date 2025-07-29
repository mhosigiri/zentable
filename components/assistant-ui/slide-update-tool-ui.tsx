'use client';

import { FC } from "react";
import { ToolContainer, ToolHeader, getToolIcon } from "./shared";

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
    <ToolContainer>
      <ToolHeader 
        title="Update Slide" 
        status={status} 
        icon={getToolIcon('updateSlideContent')}
      />

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
    </ToolContainer>
  );
};
