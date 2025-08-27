'use client';

import React from 'react';
import {
  Tool,
  ToolContent,
  ToolHeader,
  ToolInput,
  ToolOutput,
} from '@/components/ai-elements/tool';
import { CodeBlock } from '@/components/ai-elements/code-block';

interface ToolCallResult {
  toolName: string;
  args: Record<string, any>;
  result: any;
}

interface ToolResultProps {
  toolCall: ToolCallResult;
}

export function ToolResult({ toolCall }: ToolResultProps) {
  return (
    <Tool className="my-4">
      <ToolHeader type={toolCall.toolName} state="output-available" />
      <ToolContent>
        {toolCall.args && Object.keys(toolCall.args).length > 0 && (
          <ToolInput input={toolCall.args} />
        )}
        {toolCall.result && (
          <ToolOutput 
            output={
              <div className="p-3">
                <CodeBlock 
                  code={JSON.stringify(toolCall.result, null, 2)} 
                  language="json" 
                />
              </div>
            }
          />
        )}
      </ToolContent>
    </Tool>
  );
}
