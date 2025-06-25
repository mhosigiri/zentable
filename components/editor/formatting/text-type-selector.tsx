"use client";

import {
  Check,
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Type,
  List,
  ListOrdered,
  Quote
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export interface TextTypeItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  command: () => void;
  isActive: () => boolean;
}

interface TextTypeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editor: any;
}

export function TextTypeSelector({ open, onOpenChange, editor }: TextTypeSelectorProps) {
  if (!editor) return null;

  const items: TextTypeItem[] = [
    {
      name: "Text",
      icon: Type,
      command: () => editor.chain().focus().clearNodes().run(),
      isActive: () =>
        editor.isActive("paragraph") && 
        !editor.isActive("bulletList") && 
        !editor.isActive("orderedList") &&
        !editor.isActive("heading")
    },
    {
      name: "Heading 1",
      icon: Heading1,
      command: () => editor.chain().focus().clearNodes().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 })
    },
    {
      name: "Heading 2",
      icon: Heading2,
      command: () => editor.chain().focus().clearNodes().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 })
    },
    {
      name: "Heading 3",
      icon: Heading3,
      command: () => editor.chain().focus().clearNodes().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 })
    },
    {
      name: "Heading 4",
      icon: Heading4,
      command: () => editor.chain().focus().clearNodes().toggleHeading({ level: 4 }).run(),
      isActive: () => editor.isActive("heading", { level: 4 })
    },
    {
      name: "Bullet List",
      icon: List,
      command: () => editor.chain().focus().clearNodes().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList")
    },
    {
      name: "Numbered List",
      icon: ListOrdered,
      command: () => editor.chain().focus().clearNodes().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList")
    },
    {
      name: "Quote",
      icon: Quote,
      command: () => editor.chain().focus().clearNodes().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote")
    }
  ];

  const activeItem = items.find(item => item.isActive()) ?? items[0];

  return (
    <Popover open={open} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-1 rounded-none border-none hover:bg-accent h-8 px-2"
        >
          <activeItem.icon className="h-4 w-4" />
          <ChevronDown className="h-3 w-3" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        sideOffset={5} 
        align="start" 
        className="w-48 p-1 z-[170]"
      >
        {items.map((item) => (
          <button
            key={item.name}
            className="flex cursor-pointer items-center justify-between rounded-sm px-2 py-1 text-sm hover:bg-accent w-full text-left"
            onClick={() => {
              item.command();
              onOpenChange(false);
            }}
          >
            <div className="flex items-center space-x-2">
              <div className="rounded-sm border p-1">
                <item.icon className="h-3 w-3" />
              </div>
              <span>{item.name}</span>
            </div>
            {activeItem.name === item.name && <Check className="h-4 w-4" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
} 