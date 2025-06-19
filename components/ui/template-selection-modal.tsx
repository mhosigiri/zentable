'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface TemplateOption {
  id: string;
  name: string;
  description: string;
  preview: string;
}

interface TemplateSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (templateType: string) => void;
}

const templates: TemplateOption[] = [
  {
    id: 'blank-card',
    name: 'Blank Card',
    description: 'Start with a clean slate',
    preview: 'bg-white/10 border-2 border-dashed border-white/30'
  },
  {
    id: 'title-with-bullets',
    name: 'Title with Bullets',
    description: 'Title and bullet points',
    preview: 'bg-white/10'
  },
  {
    id: 'two-columns',
    name: 'Two Columns',
    description: 'Side-by-side content',
    preview: 'bg-white/10'
  },
  {
    id: 'image-and-text',
    name: 'Image and Text',
    description: 'Image with text content',
    preview: 'bg-white/10'
  },
  {
    id: 'text-and-image',
    name: 'Text and Image',
    description: 'Text with side image',
    preview: 'bg-white/10'
  },
  {
    id: 'three-columns',
    name: 'Three Columns',
    description: 'Triple column layout',
    preview: 'bg-white/10'
  },
  {
    id: 'four-columns',
    name: 'Four Columns',
    description: 'Quad column layout',
    preview: 'bg-white/10'
  },
  {
    id: 'bullets',
    name: 'Bullets',
    description: 'Organized bullet points',
    preview: 'bg-white/10'
  },
  {
    id: 'paragraph',
    name: 'Paragraph',
    description: 'Long form content',
    preview: 'bg-white/10'
  }
];

export function TemplateSelectionModal({ isOpen, onClose, onSelectTemplate }: TemplateSelectionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Choose a template</h2>
              <p className="text-sm text-white/70 mt-1">Select a layout for your new slide</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/70 hover:text-white hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Template Grid */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="grid grid-cols-3 gap-4">
            {templates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  onSelectTemplate(template.id);
                  onClose();
                }}
                className="group p-4 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-200 text-left"
              >
                {/* Template Preview */}
                <div className={`w-full h-24 rounded-md mb-3 ${template.preview} flex items-center justify-center`}>
                  <div className="text-white/60 text-xs">Preview</div>
                </div>
                
                {/* Template Info */}
                <div>
                  <h3 className="text-sm font-medium text-white group-hover:text-white transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs text-white/60 mt-1">
                    {template.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 