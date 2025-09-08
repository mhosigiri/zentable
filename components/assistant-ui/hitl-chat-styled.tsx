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
import { CheckCircle2, XCircle, SendHorizontal, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TooltipIconButton } from '@/components/assistant-ui/tooltip-icon-button';
import { CopyIcon, RefreshCwIcon } from 'lucide-react';
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from '@/components/ai-elements/tool';
import { CodeBlock } from '@/components/ai-elements/code-block';

// Convert technical tool names to user-friendly descriptions
const getUserFriendlyToolName = (toolName: string): string => {
  const toolNameMap: Record<string, string> = {
    'updateSlideImage': 'Update Slide Image',
    'applyTheme': 'Apply Theme',
    'changeSlideTemplate': 'Change Slide Template',
    'createSlide': 'Create Slide',
    'createSlideWithAI': 'Generate AI Slide',
    'deleteSlide': 'Delete Slide',
    'duplicateSlide': 'Duplicate Slide',
    'moveSlide': 'Move Slide',
    'getSlideContent': 'Get Slide Content',
    'updateSlideContent': 'Update Slide Content',
    'getSlideIdByNumber': 'Find Slide',
    'getSlideById': 'Retrieve Slide',
    'getAllSlides': 'List All Slides',
    'getOutline': 'Get Outline',
    'generateImage': 'Generate Image',
  };
  
  return toolNameMap[toolName] || toolName;
};

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

  // Check if AI is processing (last message is from user and no assistant response yet)
  const isAIProcessing = messages.length > 0 && 
    messages[messages.length - 1]?.role === 'user' && 
    !pendingToolCallConfirmation;

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        sendMessage({ text: input });
        setInput('');
      }
    }
  };

  return (
    <div className={cn(
      "bg-white/10 backdrop-blur box-border flex h-full flex-col overflow-hidden overflow-x-hidden rounded-lg border border-white/20 shadow-lg",
      className
    )}>
      <div className="flex h-full flex-col overflow-y-scroll overflow-x-hidden scroll-smooth bg-inherit px-4 pt-8 pb-10">
        {/* Welcome Message */}
        {messages.length === 0 && (
          <div className="flex w-full max-w-[42rem] flex-grow flex-col">
            <div className="flex w-full flex-grow flex-col items-center justify-center">
              <p className="font-medium text-center">How can I help with your presentation?</p>
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 w-full space-y-4">
          {messages?.map((message, index) => (
            <div key={message.id} className="w-full">
              {message.role === 'user' && (
                <div className="grid w-full max-w-[42rem] auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 py-4 [&:where(>*)]:col-start-2">
                  <div className="bg-primary text-primary-foreground col-start-2 row-start-2 max-w-[calc(42rem*0.8)] break-words rounded-3xl px-5 py-2.5">
                    {message.parts?.map((part, i) => (
                      part.type === 'text' && <div key={i}>{part.text}</div>
                    ))}
                  </div>
                </div>
              )}

              {message.role === 'assistant' && (
                <div className="relative grid w-full max-w-[42rem] grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] py-4">
                  <div className="text-foreground col-span-2 col-start-2 row-start-1 my-1.5 max-w-[calc(42rem*0.8)] break-words leading-7">
                    {message.parts?.map((part, i) => {
                      if (part.type === 'text') {
                        return (
                          <div key={i} className="break-words">
                            {part.text}
                          </div>
                        );
                      }

                      if (isToolUIPart<SlideTools>(part)) {
                        const toolInvocation = part;
                        const toolName = getToolName(toolInvocation);
                        const toolCallId = toolInvocation.toolCallId;

                        // Determine tool state
                        const toolState = toolInvocation.state === 'output-available' ? 'output-available' : 
                                         toolInvocation.state === 'output-error' ? 'output-error' :
                                         toolsRequiringConfirmation.includes(toolName) ? 'input-available' : 'input-streaming';

                        // Determine if tool should be open by default
                        const defaultOpen = toolState === 'output-available' || toolState === 'output-error' || toolState === 'input-available';

                        return (
                          <div key={toolCallId} className="my-4">
                            <Tool defaultOpen={defaultOpen}>
                              <ToolHeader 
                                type={getUserFriendlyToolName(toolName)} 
                                state={toolState}
                              />
                              <ToolContent>
                                {/* Show input parameters */}
                                {toolInvocation.input && Object.keys(toolInvocation.input).length > 0 && (
                                  <ToolInput input={toolInvocation.input} />
                                )}
                                
                                {/* Show output if available */}
                                {part.output && (
                                  <ToolOutput 
                                    output={
                                      <div className="p-3">
                                        {toolName === 'updateSlideImage' && typeof part.output === 'object' && part.output !== null && 'imagePrompt' in part.output && (part.output as any).imagePrompt && (
                                          <p className="text-sm">Generate image with prompt: <em>&quot;{(part.output as any).imagePrompt}&quot;</em></p>
                                        )}
                                        {toolName === 'changeSlideTemplate' && typeof part.output === 'object' && part.output !== null && 'newTemplateType' in part.output && (part.output as any).newTemplateType && (
                                          <p className="text-sm">Change template to <strong>{(part.output as any).newTemplateType}</strong></p>
                                        )}
                                        {toolName === 'applyTheme' && (
                                          <p className="text-sm">
                                            {typeof part.output === 'object' && part.output !== null && 'themeId' in part.output ? (
                                              <>Applied theme: <strong>{(part.output as any).themeId}</strong></>
                                            ) : (
                                              <>Theme applied successfully</>
                                            )}
                                          </p>
                                        )}
                                        {/* For other tools, show JSON result */}
                                        {!['updateSlideImage', 'changeSlideTemplate', 'applyTheme'].includes(toolName) && (
                                          <CodeBlock 
                                            code={JSON.stringify(part.output, null, 2)} 
                                            language="json" 
                                          />
                                        )}
                                      </div>
                                    }
                                  />
                                )}
                                
                                {/* Action Buttons for approval */}
                                {toolsRequiringConfirmation.includes(toolName) && toolState === 'input-available' && (
                                  <div className="flex gap-2 px-4 pb-4">
                                    <Button 
                                      onClick={() => handleApprove(toolCallId, toolName, toolInvocation.input)}
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                    >
                                      <CheckCircle2 className="w-4 h-4 mr-1" />
                                      Apply Changes
                                    </Button>
                                    <Button 
                                      onClick={() => handleReject(toolCallId, toolName)}
                                      variant="outline"
                                      size="sm"
                                      className="border-red-500/50 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                    >
                                      <XCircle className="w-4 h-4 mr-1" />
                                      Reject
                                    </Button>
                                  </div>
                                )}
                              </ToolContent>
                            </Tool>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>

                  {/* Action Bar with Copy and Refresh */}
                  <div className="text-muted-foreground col-start-3 row-start-2 -ml-1 flex gap-1">
                    <TooltipIconButton tooltip="Copy">
                      <CopyIcon />
                    </TooltipIconButton>
                    <TooltipIconButton tooltip="Refresh">
                      <RefreshCwIcon />
                    </TooltipIconButton>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator when AI is processing */}
          {isAIProcessing && (
            <div className="relative grid w-full max-w-[42rem] grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] py-4">
              <div className="text-foreground col-span-2 col-start-2 row-start-1 my-1.5 max-w-[calc(42rem*0.8)] break-words leading-7">
                <div className="flex items-center gap-2 text-gray-500">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

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
              onKeyDown={handleKeyDown}
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
        </div>
      </div>
    </div>
  );
}
