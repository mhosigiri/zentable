import { Check, TextQuote, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AICompletionCommandsProps {
  completion: string;
  onReplace: () => void;
  onInsert: () => void;
  onDiscard: () => void;
}

export function AICompletionCommands({ 
  completion, 
  onReplace, 
  onInsert, 
  onDiscard 
}: AICompletionCommandsProps) {
  if (!completion.trim()) return null;

  return (
    <div className="space-y-1">
      {/* Action buttons */}
      <div className="space-y-1">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-auto py-2 px-3 text-left"
          onClick={onReplace}
        >
          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">Replace selection</span>
            <span className="text-xs text-muted-foreground">Replace with AI suggestion</span>
          </div>
        </Button>
        
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-auto py-2 px-3 text-left"
          onClick={onInsert}
        >
          <TextQuote className="h-4 w-4 text-blue-500 flex-shrink-0" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">Insert below</span>
            <span className="text-xs text-muted-foreground">Add after current selection</span>
          </div>
        </Button>
      </div>

      {/* Separator */}
      <div className="h-px bg-border my-2" />

      {/* Discard option */}
      <Button
        variant="ghost"
        className="w-full justify-start gap-3 h-auto py-2 px-3 text-left text-red-600 hover:text-red-700 hover:bg-red-50"
        onClick={onDiscard}
      >
        <TrashIcon className="h-4 w-4 flex-shrink-0" />
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium">Discard</span>
          <span className="text-xs text-muted-foreground">Remove AI suggestion</span>
        </div>
      </Button>
    </div>
  );
} 