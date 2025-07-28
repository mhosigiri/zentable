"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";

interface BrainstormingRuntimeProviderProps {
  children: React.ReactNode;
  sessionId?: string | null;
  activeMCPTools?: any[];
}

export function BrainstormingRuntimeProvider({ 
  children, 
  sessionId,
  activeMCPTools = []
}: BrainstormingRuntimeProviderProps) {
  const runtime = useChatRuntime({
    api: "/api/brainstorming/chat",
    body: {
      context: {
        sessionId,
        activeMCPTools
      }
    }
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}