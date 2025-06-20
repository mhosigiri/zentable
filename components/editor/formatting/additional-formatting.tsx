"use client";

import { Strikethrough, Underline, Code } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdditionalFormattingProps {
  editor: any;
}

export function AdditionalFormatting({ editor }: AdditionalFormattingProps) {
  if (!editor) return null;

  const formatButtons = [
    {
      name: "strikethrough",
      icon: Strikethrough,
      isActive: () => editor.isActive("strike"),
      command: () => editor.chain().focus().toggleStrike().run()
    },
    {
      name: "underline", 
      icon: Underline,
      isActive: () => editor.isActive("underline"),
      command: () => editor.chain().focus().toggleUnderline().run()
    },
    {
      name: "code",
      icon: Code,
      isActive: () => editor.isActive("code"),
      command: () => editor.chain().focus().toggleCode().run()
    }
  ];

  return (
    <div className="flex items-center">
      {formatButtons.map((button) => (
        <Button
          key={button.name}
          variant="ghost"
          size="sm"
          onClick={button.command}
          className={`h-8 w-8 p-0 ${
            button.isActive() ? 'bg-gray-100 text-blue-500' : ''
          }`}
        >
          <button.icon className="h-4 w-4" />
        </Button>
      ))}
    </div>
  );
} 