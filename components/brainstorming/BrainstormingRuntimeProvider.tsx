"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";

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
    transport: new AssistantChatTransport({
      api: "/api/brainstorming/chat",
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: {
        context: {
          sessionId,
          activeMCPTools
        }
      }
    }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}