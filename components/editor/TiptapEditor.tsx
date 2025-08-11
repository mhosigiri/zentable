'use client';

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Highlight from '@tiptap/extension-highlight';
import Blockquote from '@tiptap/extension-blockquote';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableHeader from '@tiptap/extension-table-header';
import TableCell from '@tiptap/extension-table-cell';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Palette,
  Type,
  List,
  ListOrdered
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { parseMarkdownToHtml, hasMarkdownFormatting } from '@/lib/utils';
import { GenerativeMenuSwitch } from './ai/generative-menu-switch';
import { useAIKeyboardShortcuts } from './ai/keyboard-shortcuts';
import { TextTypeSelector } from './formatting/text-type-selector';
import { AdditionalFormatting } from './formatting/additional-formatting';
import { EnhancedColorSelector } from './formatting/enhanced-color-selector';

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  variant?: 'title' | 'subtitle' | 'body' | 'default';
  editable?: boolean;
  slideId?: string;
  presentationId?: string;
  templateType?: string;
}

function getEditorClasses(variant: string): string {
  const baseClasses = 'tiptap-editor focus:outline-none min-h-[60px] p-3';
  
  switch (variant) {
    case 'title':
      return `${baseClasses} text-3xl md:text-4xl font-bold leading-tight`;
    case 'subtitle':
      return `${baseClasses} text-xl md:text-2xl font-semibold leading-tight`;
    case 'body':
      return `${baseClasses} text-base md:text-lg leading-relaxed`;
    default:
      // Enhanced prose styling for slide content using typography plugin
      return `${baseClasses} prose prose-lg max-w-none prose-headings:font-bold prose-h1:text-3xl prose-h1:md:text-4xl prose-h1:mb-6 prose-h2:text-2xl prose-h2:md:text-3xl prose-h2:mb-4 prose-h3:text-xl prose-h3:md:text-2xl prose-h3:mb-3 prose-h4:text-lg prose-h4:md:text-xl prose-h4:mb-2 prose-h4:font-semibold prose-p:text-base prose-p:md:text-lg prose-p:leading-relaxed prose-ul:space-y-3 prose-li:text-base prose-li:md:text-lg`;
  }
}

export function TiptapEditor({ 
  content, 
  onChange, 
  placeholder, 
  className, 
  variant = 'default', 
  editable = true,
  slideId,
  presentationId,
  templateType
}: TiptapEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [showTextType, setShowTextType] = useState(false);
  const [showEnhancedColor, setShowEnhancedColor] = useState(false);
  const isUserTypingRef = useRef(false);
  const lastContentRef = useRef(content);

  // Add keyboard shortcuts
  useAIKeyboardShortcuts({
    onToggleAI: () => setShowAI(!showAI),
    isAIOpen: showAI,
    onCloseAI: () => setShowAI(false)
  });

  // Reset all dropdowns when AI is open or when selection changes
  useEffect(() => {
    if (showAI) {
      setShowColorPicker(false);
      setShowTextType(false);
      setShowEnhancedColor(false);
    }
  }, [showAI]);

  // Close dropdowns when new text is selected
  const resetDropdowns = () => {
    setShowColorPicker(false);
    setShowTextType(false);
    setShowEnhancedColor(false);
    setShowAI(false);
  };

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
        bulletList: {
          HTMLAttributes: {
            class: 'tiptap-bullet-list',
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: 'tiptap-ordered-list',
          },
        },
        listItem: {
          HTMLAttributes: {
            class: 'tiptap-list-item',
          },
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
      Blockquote,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'tiptap-table border-collapse w-full',
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          class: 'tiptap-table-row',
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          class: 'tiptap-table-header',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'tiptap-table-cell',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start typing...',
      }),
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      if (!editable) return;
      isUserTypingRef.current = true;
      const newContent = editor.getHTML();
      lastContentRef.current = newContent;
      onChange(newContent);
      
      // Reset the flag after a short delay
      setTimeout(() => {
        isUserTypingRef.current = false;
      }, 100);
    },
    editorProps: {
      attributes: {
        class: getEditorClasses(variant),
      },
    },
  });

  // Update editor content when prop changes, but preserve cursor position
  useEffect(() => {
    if (editor && content !== lastContentRef.current && !isUserTypingRef.current) {
      // Save current selection/cursor position
      const { from, to } = editor.state.selection;
      const wasEditorFocused = editor.isFocused;
      
      // Check if content contains markdown and parse it
      const processedContent = hasMarkdownFormatting(content) 
        ? parseMarkdownToHtml(content) 
        : content;
      
      // Update content without triggering onChange
      editor.commands.setContent(processedContent, false);
      
      // Restore cursor position if editor was focused and position is valid
      if (wasEditorFocused) {
        const docSize = editor.state.doc.content.size;
        const safeFrom = Math.min(from, docSize);
        const safeTo = Math.min(to, docSize);
        
        // Use setTimeout to ensure the content update is complete
        setTimeout(() => {
          try {
            editor.commands.setTextSelection({ from: safeFrom, to: safeTo });
            editor.commands.focus();
          } catch (error) {
            // If position restoration fails, just focus at the end
            editor.commands.focus('end');
          }
        }, 0);
      }
      
      lastContentRef.current = content;
    }
  }, [content, editor]);

  if (!editor) {
    return (
      <div className="min-h-[60px] p-3 border border-gray-200 rounded-lg bg-gray-50 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      </div>
    );
  }

  const colors = [
    '#000000', '#374151', '#6B7280', '#9CA3AF',
    '#EF4444', '#F97316', '#EAB308', '#22C55E',
    '#3B82F6', '#8B5CF6', '#EC4899', '#F43F5E'
  ];

  // Get selected text for AI features
  const getSelectedText = () => {
    if (!editor) return '';
    const { from, to } = editor.state.selection;
    return editor.state.doc.textBetween(from, to, ' ');
  };

  // Handle AI content replacement
  const handleAIReplace = (aiContent: string) => {
    if (!editor) return;
    const { from, to } = editor.state.selection;
    editor.chain().focus().insertContentAt({ from, to }, aiContent).run();
  };

  // Handle AI content insertion
  const handleAIInsert = (aiContent: string) => {
    if (!editor) return;
    const { to } = editor.state.selection;
    editor.chain().focus().insertContentAt(to + 1, aiContent).run();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Enhanced Bubble Menu with AI - only show when editable */}
      {editable && <BubbleMenu
        editor={editor}
        tippyOptions={{ 
          duration: 100,
          placement: showAI ? "bottom-start" : "top",
          onHidden: () => {
            setShowAI(false);
            setShowColorPicker(false);
            setShowTextType(false);
            setShowEnhancedColor(false);
          },
        }}
        className="flex items-center w-fit max-w-[90vw] overflow-hidden rounded-md border border-gray-200 bg-white shadow-xl z-[150]"
      >
        <GenerativeMenuSwitch
          open={showAI}
          onOpenChange={setShowAI}
          selectedText={getSelectedText()}
          slideId={slideId}
          presentationId={presentationId}
          templateType={templateType}
          fullContent={editor?.getHTML()}
          selectedHtml={editor?.state.selection.empty ? '' : editor?.getHTML()}
          onReplace={handleAIReplace}
          onInsert={handleAIInsert}
        >
          {/* Enhanced formatting tools */}
          <div className="flex items-center space-x-1 p-2">
            {/* Text Type Selector */}
            <TextTypeSelector
              open={showTextType}
              onOpenChange={(open) => {
                setShowTextType(open);
                if (open) {
                  setShowColorPicker(false);
                  setShowEnhancedColor(false);
                }
              }}
              editor={editor}
            />

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Basic formatting */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`h-8 w-8 p-0 ${editor.isActive('bold') ? 'bg-gray-100' : ''}`}
            >
              <Bold className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`h-8 w-8 p-0 ${editor.isActive('italic') ? 'bg-gray-100' : ''}`}
            >
              <Italic className="h-4 w-4" />
            </Button>

            {/* Additional formatting options */}
            <AdditionalFormatting editor={editor} />

            <div className="w-px h-6 bg-gray-300 mx-1" />

            {/* Enhanced Color Selector */}
            <EnhancedColorSelector
              open={showEnhancedColor}
              onOpenChange={(open) => {
                setShowEnhancedColor(open);
                if (open) {
                  setShowColorPicker(false);
                  setShowTextType(false);
                }
              }}
              editor={editor}
            />

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('left').run()}
              className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-100' : ''}`}
            >
              <AlignLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('center').run()}
              className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-100' : ''}`}
            >
              <AlignCenter className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().setTextAlign('right').run()}
              className={`h-8 w-8 p-0 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-100' : ''}`}
            >
              <AlignRight className="h-4 w-4" />
            </Button>

            <div className="w-px h-6 bg-gray-300 mx-1" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`h-8 w-8 p-0 ${editor.isActive('bulletList') ? 'bg-gray-100' : ''}`}
            >
              <List className="h-4 w-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`h-8 w-8 p-0 ${editor.isActive('orderedList') ? 'bg-gray-100' : ''}`}
            >
              <ListOrdered className="h-4 w-4" />
            </Button>


          </div>
        </GenerativeMenuSwitch>
      </BubbleMenu>}

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="min-h-[60px] cursor-text"
      />
    </div>
  );
}