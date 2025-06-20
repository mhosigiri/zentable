import { ArrowDownWideNarrow, CheckCheck, RefreshCcwDot, StepForward, WrapText } from "lucide-react";
import { Button } from "@/components/ui/button";

const options = [
  {
    value: "improve",
    label: "Improve writing",
    icon: RefreshCcwDot,
    description: "Enhance clarity and impact"
  },
  {
    value: "fix",
    label: "Fix grammar",
    icon: CheckCheck,
    description: "Correct grammar and spelling"
  },
  {
    value: "shorter",
    label: "Make shorter",
    icon: ArrowDownWideNarrow,
    description: "Condense while keeping key points"
  },
  {
    value: "longer",
    label: "Make longer",
    icon: WrapText,
    description: "Expand with more detail"
  },
];

interface AISelectorCommandsProps {
  selectedText: string;
  onSelect: (text: string, command: string) => void;
}

export function AISelectorCommands({ selectedText, onSelect }: AISelectorCommandsProps) {
  const hasSelectedText = selectedText.trim().length > 0;

  return (
    <div className="space-y-1">
      {/* Edit or review selection section */}
      {hasSelectedText && (
        <div className="space-y-1">
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Edit or review selection
          </div>
          {options.map((option) => (
            <Button
              key={option.value}
              variant="ghost"
              className="w-full justify-start gap-3 h-auto py-2 px-3 text-left"
              onClick={() => onSelect(selectedText, option.value)}
            >
              <option.icon className="h-4 w-4 text-purple-500 flex-shrink-0" />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium">{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.description}</span>
              </div>
            </Button>
          ))}
        </div>
      )}

      {/* Separator */}
      {hasSelectedText && (
        <div className="h-px bg-border my-2" />
      )}

      {/* Use AI to do more section */}
      <div className="space-y-1">
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          Use AI to do more
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-auto py-2 px-3 text-left"
          onClick={() => onSelect(selectedText, "continue")}
        >
          <StepForward className="h-4 w-4 text-purple-500 flex-shrink-0" />
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium">Continue writing</span>
            <span className="text-xs text-muted-foreground">
              {hasSelectedText ? "Continue from selection" : "Continue writing"}
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
} 