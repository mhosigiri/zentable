"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime } from "@assistant-ui/react-ai-sdk";
import { useCreditErrorHandler } from '@/hooks/use-credit-error-handler';

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
  const { handleApiResponse } = useCreditErrorHandler();
  
  const runtime = useChatRuntime({
    api: "/api/brainstorming/chat",
    body: {
      context: {
        sessionId,
        activeMCPTools
      }
    },
    onResponse: async (response) => {
      // Handle 402 errors (insufficient credits)
      if (response.status === 402) {
        await handleApiResponse(response);
        return;
      }
    }
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}