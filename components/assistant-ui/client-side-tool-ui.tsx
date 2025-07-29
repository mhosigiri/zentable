'use client';

import { FC, useState } from 'react';
import { useMyRuntime } from '@/app/docs/[id]/MyRuntimeProvider';
import { Button } from '@/components/ui/button';
import { UseSlidesReturn } from '@/hooks/useSlides';
import { ToolContainer, ToolHeader, getToolIcon, getUserFriendlyToolName } from './shared';

// Define the structure of arguments for each tool
type ToolArguments = {
  slideId?: string;
  content?: string;
  // Add other potential arguments here
};

interface SlideUpdateToolProps {
  toolName: string;
  args: ToolArguments;
  onDone: () => void; // Callback to signal completion
}

export const ClientSideToolUI: FC<SlideUpdateToolProps> = ({ toolName, args, onDone }) => {
  const slideManager = useMyRuntime();
  const [status, setStatus] = useState<'requires_action' | 'running' | 'success' | 'error'>('requires_action');
  const [error, setError] = useState<string | null>(null);

  const handleApprove = async () => {
    setStatus('running');
    try {
      // Find the corresponding function in the slide manager
      const toolFunction = (slideManager as any)[toolName];
      if (typeof toolFunction !== 'function') {
        throw new Error(`Tool "${toolName}" is not implemented on the client.`);
      }

      // Execute the function with the provided arguments
      // This is a simplified example. A real implementation would need more robust
      // argument mapping. For now, we'll assume a simple mapping.
      if (toolName === 'updateSlideContent' && args.slideId && args.content) {
        await slideManager.updateSlideById(args.slideId, { content: args.content });
      } else if (toolName === 'deleteSlide' && args.slideId) {
        const slideIndex = slideManager.slides.findIndex(s => s.id === args.slideId);
        if (slideIndex === -1) throw new Error('Slide not found');
        slideManager.deleteSlide(slideIndex);
      }
      // Add more tool mappings here...
      else {
          throw new Error(`Execution logic for tool "${toolName}" not implemented.`);
      }

      setStatus('success');
    } catch (e: any) {
      setError(e.message);
      setStatus('error');
    } finally {
      onDone(); // Notify the system that the tool call is complete
    }
  };

  if (status === 'success') {
    return (
        <div className="mt-2 rounded-md border bg-green-900/20 p-2 text-xs text-green-400">
            ✓ {getUserFriendlyToolName(toolName)} executed successfully.
        </div>
    );
  }

  if (status === 'error') {
    return (
        <div className="mt-2 rounded-md border bg-red-900/20 p-2 text-xs text-red-400">
            <strong>Error:</strong> {error}
        </div>
    );
  }

  return (
    <ToolContainer className="p-3 text-sm">
      <ToolHeader 
        title="Approval Required" 
        status="pending" 
        icon={getToolIcon(toolName)}
      />
      <div className="mb-3 text-xs text-muted-foreground">
        The assistant wants to run the following command:
        <pre className="mt-1 rounded bg-black/20 p-2 font-mono text-white">
          {toolName}({JSON.stringify(args, null, 2)})
        </pre>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={onDone}>Reject</Button>
        <Button variant="default" size="sm" onClick={handleApprove} disabled={status === 'running'}>
          {status === 'running' ? 'Running...' : 'Approve'}
        </Button>
      </div>
    </ToolContainer>
  );
}; 