'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Home, 
  RefreshCw, 
  Loader2,
  GripVertical,
  Edit3,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface OutlineSection {
  id: string;
  title: string;
  bulletPoints?: string[];
  templateType: string;
}

interface GeneratedOutline {
  title: string;
  sections: OutlineSection[];
}

interface DocumentData {
  id: string;
  prompt: string;
  cardCount: number;
  style: string;
  language: string;
  createdAt: string;
  status: string;
  outline?: GeneratedOutline;
}

function SortableOutlineCard({ section, index, onEdit }: { 
  section: OutlineSection; 
  index: number; 
  onEdit: (id: string, field: 'title' | 'bulletPoints', value: string | string[]) => void;
}) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingBullets, setIsEditingBullets] = useState(false);
  const [editTitle, setEditTitle] = useState(section.title || '');
  const [editBullets, setEditBullets] = useState((section.bulletPoints || []).join('\n'));

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleTitleSave = () => {
    onEdit(section.id, 'title', editTitle);
    setIsEditingTitle(false);
  };

  const handleBulletsSave = () => {
    const bullets = editBullets.split('\n').filter(b => b.trim());
    onEdit(section.id, 'bulletPoints', bullets);
    setIsEditingBullets(false);
  };

  return (
    <div ref={setNodeRef} style={style} className="group">
      <Card className="bg-white/90 backdrop-blur-sm border border-blue-200/50 hover:border-blue-300/70 transition-all">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                {index + 1}
              </div>
              <div 
                {...attributes} 
                {...listeners}
                className="cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <GripVertical className="w-4 h-4 text-gray-400" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <div className="mb-3">
                  <Input
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={handleTitleSave}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleTitleSave();
                      if (e.key === 'Escape') {
                        setEditTitle(section.title);
                        setIsEditingTitle(false);
                      }
                    }}
                    className="font-medium text-gray-900 text-sm"
                    autoFocus
                  />
                </div>
              ) : (
                <div 
                  className="flex items-start justify-between mb-3 group/title cursor-pointer"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <h3 className="font-medium text-gray-900 text-sm leading-tight pr-2">
                    {section.title}
                  </h3>
                  <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover/title:opacity-100 transition-opacity flex-shrink-0" />
                </div>
              )}

              {isEditingBullets ? (
                <Textarea
                  value={editBullets}
                  onChange={(e) => setEditBullets(e.target.value)}
                  onBlur={handleBulletsSave}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') {
                      setEditBullets((section.bulletPoints || []).join('\n'));
                      setIsEditingBullets(false);
                    }
                  }}
                  className="text-sm text-gray-600 min-h-[80px] resize-none"
                  placeholder="Enter bullet points (one per line)"
                  autoFocus
                />
              ) : (
                <div 
                  className="group/bullets cursor-pointer relative"
                  onClick={() => setIsEditingBullets(true)}
                >
                  <ul className="space-y-1">
                    {(section.bulletPoints || []).map((point, pointIndex) => (
                      <li key={pointIndex} className="text-sm text-gray-600 flex items-start">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                  <Edit3 className="w-3 h-3 text-gray-400 opacity-0 group-hover/bullets:opacity-100 transition-opacity absolute top-0 right-0" />
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function OutlinePage() {
  const params = useParams();
  const router = useRouter();
  const documentId = params.id as string;
  
  const [documentData, setDocumentData] = useState<DocumentData | null>(null);
  const [generatedOutline, setGeneratedOutline] = useState<GeneratedOutline | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [cardCount, setCardCount] = useState('8');
  const [style, setStyle] = useState('default');
  const [language, setLanguage] = useState('en');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load document data from localStorage
  useEffect(() => {
    const loadDocumentData = () => {
      const stored = localStorage.getItem(`document_${documentId}`);
      if (stored) {
        const data: DocumentData = JSON.parse(stored);
        setDocumentData(data);
        setPrompt(data.prompt);
        setCardCount(data.cardCount.toString());
        setStyle(data.style);
        setLanguage(data.language);
        
        if (data.outline) {
          setGeneratedOutline(data.outline);
        } else if (data.status === 'generating') {
          // Start generating if not already done
          generateOutline(data);
        }
      }
    };

    loadDocumentData();
  }, [documentId]);

  // Save document data to localStorage
  const saveDocumentData = (data: Partial<DocumentData>) => {
    if (!documentData) return;
    
    const updatedData = { ...documentData, ...data };
    setDocumentData(updatedData);
    localStorage.setItem(`document_${documentId}`, JSON.stringify(updatedData));
  };

  const generateOutline = async (docData?: DocumentData) => {
    const data = docData || documentData;
    if (!data) return;

    setIsGenerating(true);
    setGeneratedOutline(null);
    
    try {
      const response = await fetch('/api/generate-outline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: data.prompt,
          cardCount: data.cardCount,
          style: data.style,
          language: data.language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate outline');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete lines
        const lines = buffer.split('\n');
        buffer = lines.pop() || ''; // Keep incomplete line in buffer
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const streamData = JSON.parse(line.slice(6));
              console.log('Received streaming data:', streamData);
              
              // Update the outline with the latest partial data
              if (streamData.title || streamData.sections) {
                setGeneratedOutline(streamData);
                
                // Save to localStorage
                saveDocumentData({
                  outline: streamData,
                  status: 'completed'
                });
              }
            } catch (e) {
              console.error('Error parsing streaming data:', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error generating outline:', error);
      saveDocumentData({ status: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateOutline = () => {
    if (documentData) {
      const updatedData = {
        ...documentData,
        prompt,
        cardCount: parseInt(cardCount),
        style,
        language,
        status: 'generating'
      };
      saveDocumentData(updatedData);
      generateOutline(updatedData);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && generatedOutline) {
      const oldIndex = generatedOutline.sections.findIndex(section => section.id === active.id);
      const newIndex = generatedOutline.sections.findIndex(section => section.id === over.id);

      const newOutline = {
        ...generatedOutline,
        sections: arrayMove(generatedOutline.sections, oldIndex, newIndex),
      };
      
      setGeneratedOutline(newOutline);
      saveDocumentData({ outline: newOutline });
    }
  };

  const handleEditSection = (id: string, field: 'title' | 'bulletPoints', value: string | string[]) => {
    if (!generatedOutline) return;

    const newOutline = {
      ...generatedOutline,
      sections: generatedOutline.sections.map(section =>
        section.id === id
          ? { ...section, [field]: value }
          : section
      ),
    };
    
    setGeneratedOutline(newOutline);
    saveDocumentData({ outline: newOutline });
  };

  const handleGenerateSlides = () => {
    if (generatedOutline && documentData) {
      // Save the final outline state
      saveDocumentData({ 
        outline: generatedOutline,
        status: 'ready-for-slides'
      });
      
      // Navigate to the presentation page
      router.push(`/docs/${documentId}`);
    }
  };

  if (!documentData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-sm bg-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-4">
            <h1 className="text-lg font-semibold text-gray-900">Generate</h1>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Prompt Section */}
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <div className="text-sm text-gray-600 mb-2">Prompt</div>
            <div className="flex items-center gap-4 mb-4">
              <Select value={cardCount} onValueChange={setCardCount}>
                <SelectTrigger className="w-32 bg-white/80 backdrop-blur-sm border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 cards</SelectItem>
                  <SelectItem value="8">8 cards</SelectItem>
                  <SelectItem value="10">10 cards</SelectItem>
                  <SelectItem value="15">15 cards</SelectItem>
                </SelectContent>
              </Select>

              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="w-32 bg-white/80 backdrop-blur-sm border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="minimal">Minimal</SelectItem>
                  <SelectItem value="creative">Creative</SelectItem>
                </SelectContent>
              </Select>

              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-40 bg-white/80 backdrop-blur-sm border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English (US)</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="bg-white/80 backdrop-blur-sm border-gray-200 mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Input
                  placeholder="Describe what you'd like to make"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="text-lg bg-transparent border-none text-gray-700 placeholder:text-gray-400 flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isGenerating) {
                      handleRegenerateOutline();
                    }
                  }}
                />
                <Button
                  onClick={handleRegenerateOutline}
                  disabled={isGenerating}
                  variant="ghost"
                  size="sm"
                >
                  {isGenerating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Outline Section */}
        {(generatedOutline || isGenerating) && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6 text-center">Outline</h2>
            
            {generatedOutline && !isGenerating ? (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={generatedOutline.sections.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-4 max-w-3xl mx-auto">
                    {generatedOutline.sections
                      .filter(section => section && section.title) // Only render sections with titles
                      .map((section, index) => (
                        <SortableOutlineCard
                          key={section.id}
                          section={section}
                          index={index}
                          onEdit={handleEditSection}
                        />
                      ))}
                  </div>
                </SortableContext>
              </DndContext>
            ) : (
              // Show streaming progress
              <div className="space-y-4 max-w-3xl mx-auto">
                {generatedOutline?.sections?.filter(section => section && section.title).map((section, index) => (
                  <Card key={section.id || index} className="bg-white/90 backdrop-blur-sm border border-blue-200/50 animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm leading-tight mb-3">
                            {section.title || 'Generating...'}
                          </h3>
                          <ul className="space-y-1">
                            {(section.bulletPoints && section.bulletPoints.length > 0) ? 
                              section.bulletPoints.map((point, pointIndex) => (
                                <li key={pointIndex} className="text-sm text-gray-600 flex items-start">
                                  <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                  <span className="leading-relaxed">{point}</span>
                                </li>
                              )) : (
                                <li className="text-sm text-gray-400 flex items-start">
                                  <span className="w-1 h-1 bg-gray-300 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                  <span className="leading-relaxed">Generating bullet points...</span>
                                </li>
                              )
                            }
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )) || (
                  // Show loading state when no sections yet
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
                    <p className="text-gray-600">Generating your outline...</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Generate Slides Button */}
        {generatedOutline && !isGenerating && (
          <div className="text-center">
            <Button 
              onClick={handleGenerateSlides}
              className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Slides
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}