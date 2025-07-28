'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidesHeader } from '@/components/ui/slides-header';
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
import { db, DocumentData } from '@/lib/database';
import { themes, getThemesByCategory, Theme, defaultTheme } from '@/lib/themes';
import { AppHeader } from '@/components/ui/app-header';

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
      <Card className="bg-white/90 backdrop-blur-sm border border-blue-200/50 hover:border-blue-300/70 transition-all shadow-sm hover:shadow-md">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="flex items-center gap-2 pt-1">
              <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing opacity-60 hover:opacity-100 transition-opacity">
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
                    className="font-semibold text-gray-900 text-base h-9"
                    autoFocus
                  />
                </div>
              ) : (
                <div 
                  className="flex items-start justify-between mb-3 group/title cursor-pointer"
                  onClick={() => setIsEditingTitle(true)}
                >
                  <h3 className="font-semibold text-gray-800 text-base leading-tight pr-2">
                    {section.title}
                  </h3>
                  <Edit3 className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover/title:opacity-100 transition-opacity flex-shrink-0" />
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
                  className="text-sm text-gray-600 min-h-[80px] resize-none bg-blue-50/50 rounded-md p-2"
                  placeholder="Enter bullet points (one per line)"
                  autoFocus
                />
              ) : (
                <div 
                  className="group/bullets cursor-pointer relative min-h-[40px] rounded-md p-2 hover:bg-gray-100/70 transition-colors"
                  onClick={() => setIsEditingBullets(true)}
                >
                  <ul className="space-y-1.5">
                    {(section.bulletPoints || []).map((point, pointIndex) => (
                      <li key={pointIndex} className="text-sm text-gray-700 flex items-start">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 mr-2.5 flex-shrink-0"></span>
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                  <Edit3 className="w-3.5 h-3.5 text-gray-400 opacity-0 group-hover/bullets:opacity-100 transition-opacity absolute top-2 right-2" />
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
  const [isDatabaseReady, setIsDatabaseReady] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [cardCount, setCardCount] = useState('8');
  const [style, setStyle] = useState('professional');
  const [language, setLanguage] = useState('en');

  // Add new state variables for content configuration
  const [contentLength, setContentLength] = useState('brief');
  const [selectedTheme, setSelectedTheme] = useState<Theme>(defaultTheme);
  const [imageStyle, setImageStyle] = useState('');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check if database record is ready
  useEffect(() => {
    const checkDatabaseReady = async () => {
      const stored = localStorage.getItem(documentId);
      if (stored) {
        const data: DocumentData = JSON.parse(stored);
        if (data.databaseId) {
          try {
            // Try to fetch the presentation from database to confirm it exists
            const presentation = await db.getPresentation(data.databaseId);
            if (presentation) {
              console.log('✅ Database record confirmed ready:', data.databaseId);
              setIsDatabaseReady(true);
            } else {
              // Record doesn't exist yet, retry after a short delay
              console.log('⏳ Database record not found, retrying in 500ms...');
              setTimeout(() => checkDatabaseReady(), 500);
            }
          } catch (error) {
            console.warn('⚠️ Database check failed, retrying in 1000ms:', error);
            setTimeout(() => checkDatabaseReady(), 1000);
          }
        } else {
          // No database ID, assume legacy mode
          setIsDatabaseReady(true);
        }
      }
    };

    checkDatabaseReady();
  }, [documentId]);

  // Load document data and theme from localStorage
  useEffect(() => {
    const loadDocumentData = () => {
      const stored = localStorage.getItem(documentId);
      if (stored) {
        const data: DocumentData = JSON.parse(stored);
        setDocumentData(data);
        setPrompt(data.prompt);
        setCardCount(data.cardCount.toString());
        setStyle(data.style);
        setLanguage(data.language);
        
        // Load new configuration values
        setContentLength(data.contentLength || 'brief');
        
        // Load theme
        if (data.theme) {
          const theme = themes.find(t => t.id === data.theme) || defaultTheme;
          setSelectedTheme(theme);
        }
        
        setImageStyle(data.imageStyle || '');
        
        if (data.outline) {
          setGeneratedOutline(data.outline);
        }
        // Note: Outline generation moved to separate effect below
      }
    };

    loadDocumentData();
  }, [documentId]);

  // Generate outline only after database is ready and document data is loaded
  useEffect(() => {
    if (documentData && isDatabaseReady && !generatedOutline && !isGenerating) {
      console.log('🚀 Starting outline generation - database ready and no existing outline');
      generateOutline(documentData);
    }
  }, [documentData, isDatabaseReady, generatedOutline, isGenerating]);

  // Save document data to localStorage
  const saveDocumentData = (data: Partial<DocumentData>) => {
    if (!documentData) return;
    
    const updatedData = { ...documentData, ...data };
    setDocumentData(updatedData);
    localStorage.setItem(documentId, JSON.stringify(updatedData));
  };

  // New function: Save to database in background
  const saveToDatabase = async (data: Partial<DocumentData>) => {
    try {
      // Use the database ID if available, otherwise skip database sync
      const databaseId = documentData?.databaseId;
      if (!databaseId) {
        console.log('No database ID available, skipping database sync');
        return;
      }

      await db.updatePresentation(databaseId, {
        prompt: data.prompt || documentData?.prompt,
        card_count: data.cardCount || documentData?.cardCount,
        style: (data.style || documentData?.style) as any,
        language: data.language || documentData?.language,
        content_length: (data.contentLength || documentData?.contentLength) as any,
        theme_id: data.theme || documentData?.theme || 'default',
        image_style: data.imageStyle || documentData?.imageStyle || null,
        status: (data.status || documentData?.status) as any,
        outline: data.outline || documentData?.outline
      });
      console.log('✅ Data synced to database with UUID:', databaseId);
    } catch (error) {
      console.warn('⚠️ Database sync failed:', error);
    }
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
          contentLength: contentLength // Include content length
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate outline');
      }

      const generatedData = await response.json();
      console.log('Received outline data:', generatedData);
      
      setGeneratedOutline(generatedData);
      
      // Save to localStorage (keep existing)
      const updatedData = {
        outline: generatedData,
        status: 'completed',
        contentLength,
        theme: selectedTheme.id,
        imageStyle
      };
      saveDocumentData(updatedData);
      
      // Also save to database when LLM response completes (new addition)
      await saveToDatabase(updatedData);
      
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
        contentLength,
        theme: selectedTheme.id,
        imageStyle,
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

  const handleGenerateSlides = async () => {
    if (generatedOutline && documentData) {
      // Save the final outline state and content configuration
      const finalData = {
        outline: generatedOutline,
        status: 'completed',
        generatedSlides: undefined,
        contentLength,
        theme: selectedTheme.id,
        imageStyle
      };
      
      // Save to localStorage (keep existing)
      saveDocumentData(finalData);
      
      // Save to database before navigation (new addition)
      await saveToDatabase(finalData);
      
      // Navigate to the presentation page
      router.push(`/docs/${documentId}`);
    }
  };

  // Add immediate saving when configuration changes
  const handleContentLengthChange = (value: string) => {
    setContentLength(value);
    // Immediately save to localStorage and database
    const updatedData = { contentLength: value };
    saveDocumentData(updatedData);
    saveToDatabase(updatedData);
  };

  const handleThemeChange = (theme: Theme) => {
    setSelectedTheme(theme);
    // Immediately save to localStorage and database
    const updatedData = { theme: theme.id };
    saveDocumentData(updatedData);
    saveToDatabase(updatedData);
    console.log('✅ Theme changed and saved:', theme.id);
  };

  const handleImageStyleChange = (value: string) => {
    setImageStyle(value);
  };

  // Debounced effect for image style saving
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (imageStyle !== (documentData?.imageStyle || '')) {
        const updatedData = { imageStyle };
        saveDocumentData(updatedData);
        saveToDatabase(updatedData);
      }
    }, 1000);
    
    return () => clearTimeout(timeoutId);
  }, [imageStyle, documentData?.imageStyle]);

  if (!documentData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <SlidesHeader title="Generate Outline" showHomeButton={true} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-500" />
            <p className="text-gray-500">Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
      <AppHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Prompt Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Finalize Your Presentation
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Review your outline, choose a style, and generate your slides.
          </p>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-gray-200/80 mb-8 shadow-sm">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <Input
                placeholder="Describe what you'd like to make"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="text-lg bg-transparent border-none text-gray-800 placeholder:text-gray-400 flex-1 focus-visible:ring-0 focus-visible:ring-offset-0"
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
                className="text-gray-500 hover:text-gray-800 hover:bg-gray-100"
              >
                {isGenerating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Outline */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Presentation Outline</h2>
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
                  <div className="space-y-4">
                    {generatedOutline.sections
                      .filter(section => section && section.title)
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
              <div className="space-y-4">
                {(generatedOutline?.sections && generatedOutline.sections.length > 0 ? generatedOutline.sections : Array.from({ length: 5 }, (_, i) => ({ id: `skeleton-${i}` }))).map((section, index) => (
                  <Card key={section?.id || index} className="bg-white/90 backdrop-blur-sm border border-blue-200/50 animate-pulse">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-gray-200 rounded-md flex-shrink-0"></div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-full"></div>
                          <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Configuration */}
          <div className="lg:col-span-1 space-y-6 sticky top-24">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200/80 shadow-sm">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuration</h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Content Length</label>
                    <div className="flex gap-2">
                      {[
                        { value: 'brief', label: 'Brief' },
                        { value: 'medium', label: 'Medium' },
                        { value: 'detailed', label: 'Detailed' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleContentLengthChange(option.value)}
                          className={`flex-1 py-2 px-2 rounded-md border text-center text-sm transition-all ${
                            contentLength === option.value
                              ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                              : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-600'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                    <div className="grid grid-cols-4 gap-2">
                      {themes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => handleThemeChange(theme)}
                          className={`relative aspect-square rounded-md border-2 transition-all hover:scale-105 ${
                            selectedTheme.id === theme.id
                              ? 'border-blue-500 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          style={{ background: theme.background }}
                        >
                          {selectedTheme.id === theme.id && (
                            <div className="absolute top-1 right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image Style (Optional)</label>
                    <Textarea
                      placeholder="e.g., 'modern minimalist', 'photorealistic'"
                      value={imageStyle}
                      onChange={(e) => handleImageStyleChange(e.target.value)}
                      className="min-h-[80px] resize-none text-sm"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {generatedOutline && !isGenerating && (
              <Button 
                onClick={handleGenerateSlides}
                size="lg"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Slides
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
