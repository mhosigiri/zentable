'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Loader2, Sparkles } from 'lucide-react';

interface AIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGenerate: (prompt: string, templateType: string) => void;
  isGenerating?: boolean;
}

const templates = [
  { id: 'magic', name: 'Magic', icon: '✨' },
  { id: 'title-with-bullets', name: 'Title + Bullets', icon: '📝' },
  { id: 'two-columns', name: 'Two Columns', icon: '📊' },
  { id: 'image-and-text', name: 'Image + Text', icon: '🖼️' },
  { id: 'bullets', name: 'Bullets', icon: '• • •' },
  { id: 'three-columns', name: 'Three Columns', icon: '|||' }
];

export function AIGenerationModal({ isOpen, onClose, onGenerate, isGenerating = false }: AIGenerationModalProps) {
  const [prompt, setPrompt] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('magic');

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (prompt.trim()) {
      onGenerate(prompt.trim(), selectedTemplate);
    }
  };

  const handleClose = () => {
    if (!isGenerating) {
      setPrompt('');
      setSelectedTemplate('magic');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Generate card</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-white/70">💰 290 credits</span>
                  <span className="text-sm text-white/70">🌍 English (US)</span>
                </div>
              </div>
            </div>
            {!isGenerating && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClose}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Prompt Input */}
          <div>
            <div className="relative">
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter your topic or idea..."
                disabled={isGenerating}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 disabled:opacity-50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isGenerating) {
                    handleGenerate();
                  }
                }}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/40 text-sm">
                5 ⚡
              </div>
            </div>
          </div>

          {/* Template Selection */}
          <div>
            <h3 className="text-sm font-medium text-white mb-3">Choose a template</h3>
            <div className="grid grid-cols-3 gap-3">
              {templates.map((template) => (
                <button
                  key={template.id}
                  onClick={() => !isGenerating && setSelectedTemplate(template.id)}
                  disabled={isGenerating}
                  className={`p-4 rounded-lg border transition-all duration-200 text-left disabled:opacity-50 ${
                    selectedTemplate === template.id
                      ? 'border-blue-500/50 bg-blue-500/10'
                      : 'border-white/20 hover:border-white/40 hover:bg-white/10'
                  }`}
                >
                  {/* Template Preview */}
                  <div className={`w-full h-16 rounded-md mb-3 flex items-center justify-center text-2xl ${
                    selectedTemplate === template.id ? 'bg-blue-500/20' : 'bg-white/10'
                  }`}>
                    {template.icon}
                  </div>
                  
                  {/* Template Name */}
                  <div className="text-xs font-medium text-white">
                    {template.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed py-3"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating slide...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate slide
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
} 