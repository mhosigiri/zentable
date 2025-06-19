'use client';

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
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

interface TiptapEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  className?: string;
  variant?: 'title' | 'subtitle' | 'body' | 'default';
}

function getEditorClasses(variant: string): string {
  const baseClasses = 'tiptap-editor focus:outline-none min-h-[60px] p-3';
  
  switch (variant) {
    case 'title':
      return `${baseClasses} text-3xl md:text-4xl font-bold text-gray-900 leading-tight`;
    case 'subtitle':
      return `${baseClasses} text-xl md:text-2xl font-semibold text-gray-900 leading-tight`;
    case 'body':
      return `${baseClasses} text-base md:text-lg text-gray-700 leading-relaxed`;
    default:
      return `${baseClasses} prose prose-sm sm:prose lg:prose-lg max-w-none`;
  }
}

export function TiptapEditor({ content, onChange, placeholder, className, variant = 'default' }: TiptapEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const isUserTypingRef = useRef(false);
  const lastContentRef = useRef(content);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
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
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Start typing...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
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

  return (
    <div className={`relative ${className}`}>
      {/* Bubble Menu */}
      <BubbleMenu
        editor={editor}
        tippyOptions={{ duration: 100 }}
        className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center space-x-1 z-50"
      >
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
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`h-8 w-8 p-0 ${editor.isActive('underline') ? 'bg-gray-100' : ''}`}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>

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

        <div className="w-px h-6 bg-gray-300 mx-1" />

        <div className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="h-8 w-8 p-0"
          >
            <Palette className="h-4 w-4" />
          </Button>
          
          {showColorPicker && (
            <div className="absolute top-10 left-0 bg-white border border-gray-200 rounded-lg shadow-lg p-2 grid grid-cols-4 gap-1 z-50">
              {colors.map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded border border-gray-200 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color }}
                  onClick={() => {
                    editor.chain().focus().setColor(color).run();
                    setShowColorPicker(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`h-8 w-8 p-0 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-100' : ''}`}
        >
          <Type className="h-4 w-4" />
        </Button>
      </BubbleMenu>

      {/* Editor Content */}
      <EditorContent 
        editor={editor} 
        className="min-h-[60px] cursor-text"
      />
    </div>
  );
}