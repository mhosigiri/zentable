"use client";

import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import type { FC } from "react";
import {
  ArrowDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PencilIcon,
  RefreshCwIcon,
  SendHorizontalIcon,
  Brain,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { useState } from "react";
import { BrainstormingDatabaseService } from "@/lib/brainstorming-database";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

interface BrainstormingThreadProps {
  onIdeaSaved?: () => void;
}

export const BrainstormingThread: FC<BrainstormingThreadProps> = ({ onIdeaSaved }) => {
  return (
    <ThreadPrimitive.Root
      className="bg-white/10 backdrop-blur box-border flex h-full flex-col overflow-hidden rounded-lg border border-white/20 shadow-lg"
      style={{
        ["--thread-max-width" as string]: "42rem",
      }}
    >
      <ThreadPrimitive.Viewport className="flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-8 pb-10 scrollbar-hide">
        <ThreadWelcome />

        <ThreadPrimitive.Messages
          components={{
            UserMessage: UserMessage,
            EditComposer: EditComposer,
            AssistantMessage: (props) => <AssistantMessage {...props} onIdeaSaved={onIdeaSaved} />,
          }}
        />

        <ThreadPrimitive.If empty={false}>
          <div className="min-h-8 flex-grow" />
        </ThreadPrimitive.If>

        <div className="sticky bottom-0 mt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end rounded-t-lg bg-inherit pb-6 z-10">
          <ThreadScrollToBottom />
          <Composer />
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="absolute -top-8 rounded-full disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ThreadWelcome: FC = () => {
  return (
    <ThreadPrimitive.Empty>
      <div className="flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col">
        <div className="flex w-full flex-grow flex-col items-center justify-center">
          <Brain className="h-12 w-12 text-primary mb-4" />
          <h2 className="text-2xl font-bold mb-2">AI Brainstorming Studio</h2>
          <p className="mt-4 font-medium text-center text-muted-foreground">
            What would you like to brainstorm about today?
          </p>
        </div>
        <ThreadWelcomeSuggestions />
      </div>
    </ThreadPrimitive.Empty>
  );
};

const ThreadWelcomeSuggestions: FC = () => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
      <ThreadPrimitive.Suggestion
        className="hover:bg-muted/80 flex flex-col items-start justify-center rounded-lg border p-4 transition-colors ease-in text-left"
        prompt="Help me brainstorm ideas for a new product launch campaign"
        method="replace"
        autoSend
      >
        <span className="line-clamp-2 text-ellipsis text-sm font-semibold">
          Product Launch Campaign
        </span>
        <span className="text-xs text-muted-foreground mt-1">
          Generate marketing and promotional ideas
        </span>
      </ThreadPrimitive.Suggestion>
      
      <ThreadPrimitive.Suggestion
        className="hover:bg-muted/80 flex flex-col items-start justify-center rounded-lg border p-4 transition-colors ease-in text-left"
        prompt="I need creative content ideas for social media posts"
        method="replace"
        autoSend
      >
        <span className="line-clamp-2 text-ellipsis text-sm font-semibold">
          Social Media Content
        </span>
        <span className="text-xs text-muted-foreground mt-1">
          Brainstorm engaging post ideas
        </span>
      </ThreadPrimitive.Suggestion>
      
      <ThreadPrimitive.Suggestion
        className="hover:bg-muted/80 flex flex-col items-start justify-center rounded-lg border p-4 transition-colors ease-in text-left"
        prompt="Help me generate ways to improve team productivity and collaboration"
        method="replace"
        autoSend
      >
        <span className="line-clamp-2 text-ellipsis text-sm font-semibold">
          Team Productivity
        </span>
        <span className="text-xs text-muted-foreground mt-1">
          Ideas for better collaboration
        </span>
      </ThreadPrimitive.Suggestion>
      
      <ThreadPrimitive.Suggestion
        className="hover:bg-muted/80 flex flex-col items-start justify-center rounded-lg border p-4 transition-colors ease-in text-left"
        prompt="I want to brainstorm innovative solutions for reducing costs in my business"
        method="replace"
        autoSend
      >
        <span className="line-clamp-2 text-ellipsis text-sm font-semibold">
          Cost Reduction Solutions
        </span>
        <span className="text-xs text-muted-foreground mt-1">
          Find ways to optimize expenses
        </span>
      </ThreadPrimitive.Suggestion>
    </div>
  );
};

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="focus-within:border-white/30 flex w-full flex-wrap items-end rounded-lg border border-white/20 bg-white/10 px-2.5 shadow transition-colors ease-in backdrop-blur">
      <ComposerPrimitive.Input
        rows={1}
        autoFocus
        placeholder="Describe what you want to brainstorm about..."
        className="placeholder:text-muted-foreground max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
      />
      <ComposerAction />
    </ComposerPrimitive.Root>
  );
};

const ComposerAction: FC = () => {
  return (
    <>
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip="Send"
            variant="default"
            className="my-2.5 size-8 p-2 transition-opacity ease-in"
          >
            <SendHorizontalIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>
      <ThreadPrimitive.If running={true}>
        <ComposerPrimitive.Cancel asChild>
          <TooltipIconButton
            tooltip="Cancel"
            variant="default"
            className="my-2.5 size-8 p-2 transition-opacity ease-in"
          >
            <CircleStopIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid w-full max-w-[var(--thread-max-width)] auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 py-4 [&:where(>*)]:col-start-2">
      <UserActionBar />

      <div className="bg-primary text-primary-foreground col-start-2 row-start-2 max-w-[calc(var(--thread-max-width)*0.8)] break-words rounded-3xl px-5 py-2.5">
        <MessagePrimitive.Content />
      </div>

      <BranchPicker className="col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="col-start-1 row-start-2 mr-3 mt-2.5 flex flex-col items-end"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  return (
    <ComposerPrimitive.Root className="flex w-full items-end rounded-lg border border-white/20 bg-white/10 p-2.5 shadow backdrop-blur">
      <ComposerPrimitive.Input className="max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-1.5 text-sm outline-none focus:ring-0" />
      <ComposerPrimitive.Cancel asChild>
        <TooltipIconButton tooltip="Cancel">
          <XIcon />
        </TooltipIconButton>
      </ComposerPrimitive.Cancel>
      <ComposerPrimitive.Send asChild>
        <TooltipIconButton tooltip="Save">
          <CheckIcon />
        </TooltipIconButton>
      </ComposerPrimitive.Send>
    </ComposerPrimitive.Root>
  );
};

interface AssistantMessageProps {
  onIdeaSaved?: () => void;
}

const AssistantMessage: FC<AssistantMessageProps> = ({ onIdeaSaved }) => {
  const [savedIdeas, setSavedIdeas] = useState<any[]>([]);

  const handleSaveIdea = async (idea: any) => {
    // Optimistic UI update - add idea immediately
    const optimisticIdea = {
      ...idea,
      id: `temp-${Date.now()}`, // Temporary ID
      saving: true // Flag to show loading state
    };
    setSavedIdeas(prev => [...prev, optimisticIdea]);
    toast.success('Idea saved to your idea bank!');

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // Remove optimistic update on error
        setSavedIdeas(prev => prev.filter(i => i.id !== optimisticIdea.id));
        toast.error('Please log in to save ideas');
        return;
      }
      
      const brainstormingDb = new BrainstormingDatabaseService();
      
      // Get session ID from sessionStorage
      let sessionId = window.sessionStorage.getItem('brainstorming-session-id');
      
      if (!sessionId) {
        // Create a new session if none exists
        const session = await brainstormingDb.createSession(
          user.id,
          'AI Brainstorming Session',
          'Creative brainstorming with AI assistance',
          'general'
        );
        if (session && session.id) {
          sessionId = session.id;
          window.sessionStorage.setItem('brainstorming-session-id', session.id);
        }
      }
      
      if (!sessionId) {
        setSavedIdeas(prev => prev.filter(i => i.id !== optimisticIdea.id));
        toast.error('Failed to initialize session');
        return;
      }
      
      const createdIdea = await brainstormingDb.createIdea(
        sessionId,
        user.id,
        idea.description,
        {
          title: idea.title,
          category: idea.category || 'general',
          priority: idea.priority || 3
        }
      );
      
      if (createdIdea) {
        // Replace optimistic update with real data
        setSavedIdeas(prev => prev.map(i => 
          i.id === optimisticIdea.id ? { ...createdIdea, saving: false } : i
        ));
        // Trigger refresh of ideas in parent component
        onIdeaSaved?.();
      } else {
        // Remove optimistic update on failure
        setSavedIdeas(prev => prev.filter(i => i.id !== optimisticIdea.id));
        toast.error('Failed to save idea');
      }
    } catch (error) {
      console.error('Failed to save idea:', error);
      // Remove optimistic update on error
      setSavedIdeas(prev => prev.filter(i => i.id !== optimisticIdea.id));
      toast.error('Failed to save idea');
    }
  };

  return (
    <MessagePrimitive.Root className="relative grid w-full max-w-[var(--thread-max-width)] grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] py-4">
      <div className="text-foreground col-span-2 col-start-2 row-start-1 my-1.5 max-w-[calc(var(--thread-max-width)*0.8)] break-words leading-7">
        <MessagePrimitive.Content
          components={{
            Text: MarkdownText,
            tools: {
              by_name: {
                suggestIdeas: (props: any) => (
                  <BrainstormingToolResult
                    toolName="suggestIdeas"
                    result={props.result}
                    args={props.args}
                    onSaveIdea={handleSaveIdea}
                  />
                ),
                createIdea: (props: any) => (
                  <BrainstormingToolResult
                    toolName="createIdea"
                    result={props.result}
                    args={props.args}
                    onSaveIdea={handleSaveIdea}
                  />
                ),
              },
              Fallback: (props: any) => (
                <BrainstormingToolResult
                  toolName={props.toolName}
                  result={props.result}
                  args={props.args}
                  onSaveIdea={handleSaveIdea}
                />
              ),
            }
          }}
        />
      </div>

      <AssistantActionBar />

      <BranchPicker className="col-start-2 row-start-2 -ml-2 mr-2" />
    </MessagePrimitive.Root>
  );
};

const BrainstormingToolResult: FC<{
  toolName: string;
  result: any;
  args?: any;
  onSaveIdea?: (idea: any) => void;
}> = ({ toolName, result, args, onSaveIdea }) => {
  // Add safety checks for result
  if (!result) {
    return (
      <div className="mt-4 p-3 bg-muted/20 rounded-lg">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          Tool: {toolName} (loading...)
        </div>
      </div>
    );
  }

  // Handle suggestIdeas tool result
  if (toolName === 'suggestIdeas' && result?.data?.ideas) {
    return (
      <div className="mt-4 space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          <Lightbulb className="h-4 w-4" />
          Generated Ideas
        </div>
        {result.data.ideas.map((idea: any, index: number) => (
          <div key={index} className="border rounded-lg p-3 bg-muted/20">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h4 className="font-medium">{idea.title || 'Untitled Idea'}</h4>
                <p className="text-sm text-muted-foreground mt-1">{idea.description || 'No description'}</p>
                {idea.category && (
                  <span className="inline-block mt-2 px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                    {idea.category}
                  </span>
                )}
              </div>
              {onSaveIdea && (
                <TooltipIconButton
                  tooltip="Save to idea bank"
                  variant="ghost"
                  size="sm"
                  onClick={() => onSaveIdea(idea)}
                >
                  <ArrowRight className="h-3 w-3" />
                </TooltipIconButton>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Hide other tool results by default (they're internal tools)
  if (toolName === 'enhanceWithExternalData' || toolName === 'generateTags' || toolName === 'categorizeIdeas') {
    return null; // Don't show these tool results
  }

  // For debugging during development - remove in production
  if (process.env.NODE_ENV === 'development') {
    return (
      <details className="mt-4">
        <summary className="cursor-pointer text-xs text-muted-foreground">
          🛠️ Tool: {toolName} (debug)
        </summary>
        <div className="mt-2 p-3 bg-muted/20 rounded-lg space-y-2">
          <div>
            <div className="text-xs font-medium text-muted-foreground">Args:</div>
            <pre className="text-xs overflow-x-auto max-h-20 overflow-y-auto">
              {JSON.stringify(args, null, 2)}
            </pre>
          </div>
          <div>
            <div className="text-xs font-medium text-muted-foreground">Result:</div>
            <pre className="text-xs overflow-x-auto max-h-20 overflow-y-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      </details>
    );
  }

  return null; // Hide all other tools in production
};

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="text-muted-foreground data-[floating]:bg-background col-start-3 row-start-2 -ml-1 flex gap-1 data-[floating]:absolute data-[floating]:rounded-md data-[floating]:border data-[floating]:p-1 data-[floating]:shadow-sm"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy">
          <MessagePrimitive.If copied>
            <CheckIcon />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Refresh">
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "text-muted-foreground inline-flex items-center text-xs",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};

// Circle stop icon
const CircleStopIcon = () => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12Z"
        fill="currentColor"
      />
      <path
        d="M12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6Z"
        fill="currentColor"
      />
    </svg>
  );
};

const XIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18M6 6l12 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);