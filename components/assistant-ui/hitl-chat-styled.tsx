'use client';

import React, { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport, getToolName, isToolUIPart } from 'ai';
import { slideTools } from '@/lib/ai/slide-tools';
import { APPROVAL, getToolsRequiringConfirmation } from '@/lib/ai/hitl-utils';
import { useTheme } from '@/contexts/ThemeContext';
import { getThemeById } from '@/lib/themes';
import { HumanInTheLoopUIMessage, SlideTools } from '@/lib/ai/hitl-types';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { CheckCircle2, XCircle, SendHorizontal, Sparkles, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HITLChatStyledProps {
  presentationId: string;
  className?: string;
}

export function HITLChatStyled({ presentationId, className }: HITLChatStyledProps) {
  const [input, setInput] = useState('');
  const { setTheme } = useTheme();
  const { messages, sendMessage, addToolResult } = useChat<HumanInTheLoopUIMessage>({
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
  
  const pendingToolCallConfirmation = messages.some(m =>
    m.parts?.some(
      part =>
        isToolUIPart(part) &&
        part.state === 'input-available' &&
        toolsRequiringConfirmation.includes(getToolName(part)),
    ),
  );

  const handleApprove = async (toolCallId: string, toolName: string, toolInput: any) => {
    // Handle theme application on client side
    if (toolName === 'applyTheme' && toolInput && 'themeId' in toolInput && toolInput.themeId) {
      const theme = getThemeById(toolInput.themeId);
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
    sendMessage();
  };

  const handleReject = async (toolCallId: string, toolName: string) => {
    await addToolResult({
      toolCallId,
      tool: toolName,
      output: APPROVAL.NO,
    });
    sendMessage();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput('');
    }
  };

  return (
    <div className={cn(
      "bg-white/10 backdrop-blur box-border flex h-full flex-col overflow-hidden overflow-x-hidden rounded-lg border border-white/20 shadow-lg",
      className
    )}>
      <div className="flex h-full flex-col overflow-y-scroll overflow-x-hidden scroll-smooth bg-inherit px-4 pt-8 pb-10">
        {/* Welcome Message and Messages */}
        {messages.length === 0 ? (
          <div className="flex w-full max-w-[42rem] flex-grow flex-col">
            <div className="flex w-full flex-grow flex-col items-center justify-center">
              <p className="font-medium text-center">How can I help with your presentation?</p>
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full space-y-4">
            {messages?.map((message, index) => (
              <div key={message.id} className="w-full">
                {message.role === 'user' && (
                  <div className="flex w-full justify-end py-4">
                    <div className="bg-primary text-primary-foreground break-words rounded-3xl px-5 py-2.5 max-w-[80%]">
                      {message.parts?.map((part, i) => (
                        part.type === 'text' && <div key={i}>{part.text}</div>
                      ))}
                    </div>
                  </div>
                )}

                {message.role === 'assistant' && (
                  <div className="flex w-full gap-3 py-4">
                    <div className="flex-shrink-0">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-purple-500 text-white">
                          <Sparkles className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 space-y-3 max-w-[80%]">
                      {message.parts?.map((part, i) => {
                        if (part.type === 'text') {
                          return (
                            <div key={i} className="break-words text-gray-700">
                              {part.text}
                            </div>
                          );
                        }

                        if (isToolUIPart<SlideTools>(part)) {
                          const toolInvocation = part;
                          const toolName = getToolName(toolInvocation);
                          const toolCallId = toolInvocation.toolCallId;

                          // Show approval buttons for tools requiring confirmation
                          if (toolsRequiringConfirmation.includes(toolName)) {
                            return (
                              <div key={toolCallId} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <div className="mb-2">
                                  <span className="font-semibold text-gray-800">Tool Approval Required:</span>
                                </div>
                                <div className="mb-2">
                                  Run <span className="font-mono bg-zinc-100 p-1 text-sm rounded">{toolName}</span> with args:
                                </div>
                                <div className="mb-4">
                                  <pre className="font-mono bg-zinc-100 p-2 rounded text-xs overflow-x-auto">
                                    {JSON.stringify(toolInvocation.input, null, 2)}
                                  </pre>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700 transition-colors"
                                    onClick={() => handleApprove(toolCallId, toolName, toolInvocation.input)}
                                  >
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Approve
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700 transition-colors"
                                    onClick={() => handleReject(toolCallId, toolName)}
                                  >
                                    <XCircle className="w-4 h-4 mr-2" />
                                    Deny
                                  </Button>
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
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Scroll to bottom button */}
        {messages.length > 0 && (
          <div className="sticky bottom-0 mt-3 flex w-full flex-col items-center justify-end rounded-t-lg bg-inherit pb-6 z-10">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full -top-8"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <ArrowDown className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Suggested Actions - above input */}
        {messages.length === 0 && (
          <div className="mt-3 mb-6 flex w-full items-center justify-center gap-4 px-6">
            <Button
              variant="outline"
              className="hover:bg-muted/80 flex w-72 h-16 items-center justify-center rounded-lg border p-3 transition-colors ease-in"
              onClick={() => sendMessage({ text: "Help me improve first slide" })}
            >
              <span className="text-sm font-semibold text-center leading-tight whitespace-normal">
                Help me improve first slide
              </span>
            </Button>
            <Button
              variant="outline"
              className="hover:bg-muted/80 flex w-72 h-16 items-center justify-center rounded-lg border p-3 transition-colors ease-in"
              onClick={() => sendMessage({ text: "Make my slides more engaging" })}
            >
              <span className="text-sm font-semibold text-center leading-tight whitespace-normal">
                Make my slides more engaging
              </span>
            </Button>
          </div>
        )}

        {/* Composer */}
        <div className="sticky bottom-0 w-full">
          <form onSubmit={handleSubmit} className="focus-within:border-white/30 flex w-full flex-wrap items-end rounded-lg border border-white/20 bg-white/10 px-2.5 shadow transition-colors ease-in backdrop-blur">
            <textarea
              rows={1}
              autoFocus
              placeholder="Write a message..."
              className="placeholder:text-muted-foreground max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={pendingToolCallConfirmation}
            />
            <Button
              type="submit"
              disabled={pendingToolCallConfirmation || !input.trim()}
              className="my-2.5 size-12 p-2 transition-opacity ease-in"
            >
              <SendHorizontal className="w-6 h-6" />
            </Button>
          </form>
          
          {pendingToolCallConfirmation && (
            <div className="mt-2 text-sm text-orange-600 text-center">
              ⚠️ Please approve or deny the pending tool call before sending a new message.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
