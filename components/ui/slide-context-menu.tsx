'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Files, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Download,
  Eye
} from 'lucide-react';

interface SlideContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  slideIndex: number;
  totalSlides: number;
  onDuplicate?: (index: number) => void;
  onDelete?: (index: number) => void;
  onMoveUp?: (index: number) => void;
  onMoveDown?: (index: number) => void;
  onHide?: (index: number) => void;
  onExport?: (index: number) => void;
  variant?: 'sidebar' | 'main'; // Different layouts for different contexts
}

export function SlideContextMenu({
  isOpen,
  position,
  onClose,
  slideIndex,
  totalSlides,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onHide,
  onExport,
  variant = 'sidebar'
}: SlideContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const menuItems = [
    {
      icon: Files,
      label: 'Duplicate',
      onClick: () => { onDuplicate?.(slideIndex); onClose(); },
      enabled: true
    },
    { divider: true },
    {
      icon: ArrowUp,
      label: 'Move up',
      onClick: () => { onMoveUp?.(slideIndex); onClose(); },
      enabled: slideIndex > 0
    },
    {
      icon: ArrowDown,
      label: 'Move down',
      onClick: () => { onMoveDown?.(slideIndex); onClose(); },
      enabled: slideIndex < totalSlides - 1
    },
    { divider: true },
    {
      icon: Download,
      label: 'Export slide',
      onClick: () => { onExport?.(slideIndex); onClose(); },
      enabled: true
    },
    {
      icon: Eye,
      label: 'Hide slide',
      onClick: () => { onHide?.(slideIndex); onClose(); },
      enabled: true
    },
    { divider: true },
    {
      icon: Trash2,
      label: 'Delete',
      onClick: () => { onDelete?.(slideIndex); onClose(); },
      enabled: totalSlides > 1,
      destructive: true
    }
  ].filter(item => item.divider || item.enabled);

  return (
    <div
      ref={menuRef}
      className={`fixed z-50 bg-white/90 backdrop-blur-md border border-white/20 rounded-lg shadow-xl py-1 ${
        variant === 'main' ? 'min-w-0' : 'min-w-[200px]'
      }`}
      style={{
        left: position.x + 2,
        top: position.y + 2,
      }}
    >
      {variant === 'main' ? (
        // Icon-based layout for main slides area - compact version
        <TooltipProvider>
          <div className="grid grid-cols-3 gap-0.5 p-1.5">
            {menuItems.filter(item => !item.divider && item.enabled && item.icon).map((item, index) => {
              const IconComponent = item.icon!;
              return (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={item.onClick}
                      disabled={!item.enabled}
                      className={`
                        h-8 w-8 p-0 rounded-md
                        ${item.destructive 
                          ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                          : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                        }
                      `}
                    >
                      <IconComponent className="w-3.5 h-3.5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>
      ) : (
        // Text-based layout for sidebar
        <>
          {menuItems.map((item, index) => (
            item.divider ? (
              <div key={index} className="h-px bg-white/20 my-1" />
            ) : (
              <button
                key={index}
                onClick={item.onClick}
                disabled={!item.enabled}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 text-sm
                  ${item.enabled 
                    ? `${item.destructive 
                        ? 'text-red-600 hover:text-red-700 hover:bg-red-50' 
                        : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                      }` 
                    : 'text-gray-400 cursor-not-allowed'
                  }
                  transition-colors
                `}
              >
                {item.icon && (() => {
                  const IconComponent = item.icon;
                  return <IconComponent className="w-4 h-4" />;
                })()}
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            )
          ))}
        </>
      )}
    </div>
  );
} 