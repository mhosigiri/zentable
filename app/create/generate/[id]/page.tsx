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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <SlidesHeader title="Generate Outline" showHomeButton={true} />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-gray-700" />
            <p className="text-gray-600">Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <SlidesHeader title="Generate Outline" showHomeButton={true} />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Prompt Section */}
        <div className="text-center mb-8">
          <div className="inline-block mb-6">
            <div className="text-sm text-gray-600 mb-2">Prompt</div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-4">
              <Select value={cardCount} onValueChange={setCardCount}>
                <SelectTrigger className="w-full sm:w-32 bg-white/80 backdrop-blur-sm border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 cards</SelectItem>
                  <SelectItem value="5">5 cards</SelectItem>
                  <SelectItem value="8">8 cards</SelectItem>
                  <SelectItem value="10">10 cards</SelectItem>
                  <SelectItem value="15">15 cards</SelectItem>
                </SelectContent>
              </Select>

              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger className="w-full sm:w-40 bg-white/80 backdrop-blur-sm border-gray-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="fun">Fun</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="formal">Formal</SelectItem>
                </SelectContent>
              </Select>

              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="w-full sm:w-40 bg-white/80 backdrop-blur-sm border-gray-200">
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
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-col gap-4 md:gap-6 max-w-3xl mx-auto">
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

        {/* Separator */}
        {generatedOutline && !isGenerating && (
          <div className="w-full flex justify-center my-10">
            <div className="h-0.5 w-64 bg-gray-200 rounded-full" />
          </div>
        )}

        {/* Content Configuration Card */}
        {generatedOutline && !isGenerating && (
          <div className="mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-gray-200">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Content Configuration</h3>
                
                {/* Content Length Selector */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Content Length</label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    {[
                      { value: 'brief', label: 'Brief', desc: 'Concise points' },
                      { value: 'medium', label: 'Medium', desc: 'Balanced detail' },
                      { value: 'detailed', label: 'Detailed', desc: 'Comprehensive' }
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleContentLengthChange(option.value)}
                        className={`flex-1 p-3 rounded-lg border text-center transition-all ${
                          contentLength === option.value
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-gray-500 mt-1">{option.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Theme Selection Grid */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => handleThemeChange(theme)}
                        className={`relative aspect-square rounded-lg border-2 transition-all hover:scale-105 ${
                          selectedTheme.id === theme.id
                            ? 'border-blue-500 ring-2 ring-blue-200'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        style={{
                          background: theme.background
                        }}
                      >
                        <div className="absolute inset-0 bg-black/10 rounded-lg"></div>
                        <div className="absolute bottom-1 left-1 right-1">
                          <div className="text-xs font-medium text-white drop-shadow-sm truncate">
                            {theme.name}
                          </div>
                        </div>
                        {selectedTheme.id === theme.id && (
                          <div className="absolute top-1 right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full"></div>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Image Style Input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image Style (Optional)</label>
                  <Textarea
                    placeholder="Describe the visual style for generated images (e.g., 'modern minimalist illustrations', 'photorealistic', 'hand-drawn sketches')"
                    value={imageStyle}
                    onChange={(e) => handleImageStyleChange(e.target.value)}
                    className="min-h-[80px] resize-none text-sm"
                  />
                </div>
              </CardContent>
            </Card>
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
