"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import { useChatRuntime, AssistantChatTransport } from "@assistant-ui/react-ai-sdk";

export function MyRuntimeProvider({
  children,
  presentationId,
}: {
  children: React.ReactNode;
  presentationId?: string;
}) {
  const runtime = useChatRuntime({
    transport: new AssistantChatTransport({
      api: "/api/assistant-chat",
      headers: {
        'Content-Type': 'application/json',
      },
      // Include credentials to send cookies for authentication
      credentials: 'include',
      // Pass the presentation context in the body
      body: presentationId ? { context: { presentationId } } : undefined,
    }),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
