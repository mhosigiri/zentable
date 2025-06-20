"use client";

import { ChevronDown, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ColorSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor: any;
}

const TEXT_COLORS = [
  { name: "Default", color: "#000000" },
  { name: "Gray", color: "#6B7280" },
  { name: "Red", color: "#EF4444" },
  { name: "Orange", color: "#F97316" },
  { name: "Yellow", color: "#EAB308" },
  { name: "Green", color: "#22C55E" },
  { name: "Blue", color: "#3B82F6" },
  { name: "Purple", color: "#8B5CF6" },
  { name: "Pink", color: "#EC4899" }
];

const HIGHLIGHT_COLORS = [
  { name: "Default", color: "transparent" },
  { name: "Gray", color: "#F3F4F6" },
  { name: "Red", color: "#FEE2E2" },
  { name: "Orange", color: "#FED7AA" },
  { name: "Yellow", color: "#FEF3C7" },
  { name: "Green", color: "#D1FAE5" },
  { name: "Blue", color: "#DBEAFE" },
  { name: "Purple", color: "#E9D5FF" },
  { name: "Pink", color: "#FCE7F3" }
];

export function EnhancedColorSelector({ open, onOpenChange, editor }: ColorSelectorProps) {
  if (!editor) return null;

  const currentTextColor = editor.getAttributes('textStyle')?.color || '#000000';
  
  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 rounded-none border-none hover:bg-accent h-8 px-2"
        >
          <Palette className="h-4 w-4" />
          <ChevronDown className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        sideOffset={5} 
        align="start" 
        className="w-64 p-3 z-[170]"
      >
        <Tabs defaultValue="text" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="highlight">Highlight</TabsTrigger>
          </TabsList>
          
          <TabsContent value="text" className="mt-3">
            <div className="grid grid-cols-3 gap-2">
              {TEXT_COLORS.map((color) => (
                <button
                  key={color.name}
                  className="flex flex-col items-center p-2 rounded hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    if (color.color === '#000000') {
                      editor.chain().focus().unsetColor().run();
                    } else {
                      editor.chain().focus().setColor(color.color).run();
                    }
                    onOpenChange(false);
                  }}
                >
                  <div 
                    className="w-6 h-6 rounded border-2 border-gray-200 mb-1"
                    style={{ backgroundColor: color.color === '#000000' ? '#000' : color.color }}
                  />
                  <span className="text-xs text-gray-600">{color.name}</span>
                </button>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="highlight" className="mt-3">
            <div className="grid grid-cols-3 gap-2">
              {HIGHLIGHT_COLORS.map((color) => (
                <button
                  key={color.name}
                  className="flex flex-col items-center p-2 rounded hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    if (color.color === 'transparent') {
                      editor.chain().focus().unsetHighlight().run();
                    } else {
                      editor.chain().focus().setHighlight({ color: color.color }).run();
                    }
                    onOpenChange(false);
                  }}
                >
                  <div 
                    className="w-6 h-6 rounded border-2 border-gray-200 mb-1"
                    style={{ 
                      backgroundColor: color.color,
                      border: color.color === 'transparent' ? '2px dashed #ccc' : '2px solid #ddd'
                    }}
                  />
                  <span className="text-xs text-gray-600">{color.name}</span>
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
} 