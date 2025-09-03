'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, getToolName, isToolUIPart } from 'ai';
import { slideTools } from '@/lib/ai/slide-tools';
import { APPROVAL, getToolsRequiringConfirmation } from '@/lib/ai/hitl-utils';
import { useTheme } from '@/contexts/ThemeContext';
import { getThemeById } from '@/lib/themes';
import { HumanInTheLoopUIMessage, SlideTools } from '@/lib/ai/hitl-types';
import { useState } from 'react';

interface HITLChatProps {
  presentationId: string;
  className?: string;
}

export function HITLChat({ presentationId, className }: HITLChatProps) {
  const [input, setInput] = useState('');
  const { setTheme } = useTheme();
  const { messages, sendMessage, addToolResult } =
    useChat<HumanInTheLoopUIMessage>({
      transport: new DefaultChatTransport({
        api: '/api/assistant-chat',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: { context: { presentationId } },
      }),
    });

  const toolsRequiringConfirmation = getToolsRequiringConfirmation(slideTools);
  
  // Debug logging
  console.log('🔍 HITL Debug:', {
    toolsRequiringConfirmation,
    messagesCount: messages?.length,
    lastMessageParts: messages?.[messages.length - 1]?.parts,
  });

  const pendingToolCallConfirmation = messages.some(m =>
    m.parts?.some(
      part =>
        isToolUIPart(part) &&
        part.state === 'input-available' &&
        toolsRequiringConfirmation.includes(getToolName(part)),
    ),
  );
  
  console.log('🔍 Pending confirmation:', pendingToolCallConfirmation);

  return (
    <div className={`flex flex-col w-full max-w-2xl mx-auto ${className}`}>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages?.map(m => (
          <div key={m.id} className="whitespace-pre-wrap">
            <strong>{`${m.role}: `}</strong>
            {m.parts?.map((part, i) => {
              if (part.type === 'text') {
                return <div key={i}>{part.text}</div>;
              }
              if (isToolUIPart<SlideTools>(part)) {
                const toolInvocation = part;
                const toolName = getToolName(toolInvocation);
                const toolCallId = toolInvocation.toolCallId;
                const dynamicInfoStyles = 'font-mono bg-zinc-100 p-1 text-sm';

                console.log('🔍 Tool part:', {
                  toolName,
                  state: toolInvocation.state,
                  requiresConfirmation: toolsRequiringConfirmation.includes(toolName),
                  shouldShowApproval: toolsRequiringConfirmation.includes(toolName),
                  allStates: ['input-streaming', 'output-available', 'output-error'],
                  currentState: toolInvocation.state,
                  toolInvocation: toolInvocation
                });

                // Render confirmation tool (client-side tool with user interaction)
                // Show approval buttons for any tool that requires confirmation, regardless of state
                if (toolsRequiringConfirmation.includes(toolName)) {
                  return (
                    <div key={toolCallId} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="mb-2">
                        <span className="font-semibold">Tool Approval Required:</span>
                      </div>
                      <div className="mb-2">
                        Run <span className={dynamicInfoStyles}>{toolName}</span> with args:
                      </div>
                      <div className="mb-4">
                        <pre className={dynamicInfoStyles + ' p-2 rounded text-xs overflow-x-auto'}>
                          {JSON.stringify(toolInvocation.input, null, 2)}
                        </pre>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 transition-colors"
                          onClick={async () => {
                            // Handle theme application on client side
                            if (toolName === 'applyTheme' && toolInvocation.input && 'themeId' in toolInvocation.input && toolInvocation.input.themeId) {
                              const theme = getThemeById(toolInvocation.input.themeId);
                              if (theme) {
                                console.log(`🎨 HITL applying theme for presentationId: ${presentationId}`);
                                setTheme(theme, presentationId);
                              }
                            }
                            
                            await addToolResult({
                              toolCallId,
                              tool: toolName,
                              output: APPROVAL.YES,
                            });
                            // trigger new message
                            sendMessage();
                          }}
                        >
                          ✅ Approve
                        </button>
                        <button
                          className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 transition-colors"
                          onClick={async () => {
                            await addToolResult({
                              toolCallId,
                              tool: toolName,
                              output: APPROVAL.NO,
                            });
                            // trigger new message
                            sendMessage();
                          }}
                        >
                          ❌ Deny
                        </button>
                      </div>
                    </div>
                  );
                }
                
                // Render tool execution status
                return (
                  <div key={toolCallId} className="border border-gray-200 rounded-lg p-3 bg-blue-50">
                    <div className="font-mono text-sm">
                      <span className="font-semibold">
                        {toolInvocation.state === 'output-available' ? '✅ Executed' : '🔄 Executing'}{' '}
                        {toolName}
                      </span>
                      {part.output && (
                        <div className="mt-2 p-2 bg-white rounded border">
                          <pre className="text-xs overflow-x-auto">
                            {JSON.stringify(part.output, null, 2)}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            })}
            <br />
          </div>
        ))}
      </div>

      <form
        className="border-t border-gray-200 p-4"
        onSubmit={e => {
          e.preventDefault();
          if (input.trim()) {
            sendMessage({ text: input });
            setInput('');
          }
        }}
      >
        <div className="flex gap-2">
          <input
            disabled={pendingToolCallConfirmation}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            value={input}
            placeholder={
              pendingToolCallConfirmation 
                ? "Please approve or deny the pending tool call first..." 
                : "Ask me to help with your presentation..."
            }
            onChange={e => setInput(e.target.value)}
          />
          <button
            type="submit"
            disabled={pendingToolCallConfirmation || !input.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            Send
          </button>
        </div>
        {pendingToolCallConfirmation && (
          <div className="mt-2 text-sm text-orange-600">
            ⚠️ Please approve or deny the pending tool call before sending a new message.
          </div>
        )}
      </form>
    </div>
  );
}
