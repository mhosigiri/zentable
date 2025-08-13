'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppHeader } from '@/components/ui/app-header';
import { 
  Brain,
  Lightbulb,
  Sparkles,
  Loader2
} from 'lucide-react';
import { BrainstormingRuntimeProvider } from './BrainstormingRuntimeProvider';
import { BrainstormingThread } from './BrainstormingThread';
import { MCPToolsToggle } from './MCPToolsToggle';
import { BrainstormingDatabaseService } from '@/lib/brainstorming-database';
import { createClient } from '@/lib/supabase/client';
import { TooltipProvider } from '@/components/ui/tooltip';
import { generateUUID } from '@/lib/uuid';
import { DatabaseService } from '@/lib/database';

// Create database service with proper user-authenticated client
const browserClient = createClient();
const db = new DatabaseService(browserClient);

interface Idea {
  id: string;
  title: string;
  description: string;
  category?: string;
  priority?: number;
  tags?: Array<{
    tag: string;
    confidence: number;
    tag_type: string;
    created_by: string;
  }>;
}

export function BrainstormingInterface() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [savedIdeas, setSavedIdeas] = useState<Idea[]>([]);
  const [activeMCPTools, setActiveMCPTools] = useState<any[]>([]);
  
  // Presentation generation options
  const [cardCount, setCardCount] = useState('5');
  const [style, setStyle] = useState('professional');
  const [language, setLanguage] = useState('en');
  const [contentLength, setContentLength] = useState('brief');
  
  const brainstormingDb = new BrainstormingDatabaseService();
  
  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
        return;
      }
      
      const session = await brainstormingDb.createSession(
        user.id, 
        'AI Brainstorming Session',
        'Creative brainstorming with AI assistance',
        'general'
      );
      
      if (session) {
        setSessionId(session.id);
        // Store session ID in sessionStorage for use in thread
        window.sessionStorage.setItem('brainstorming-session-id', session.id);
        // Load existing ideas for this session
        const ideas = await brainstormingDb.getSessionIdeas(session.id, user.id);
        setSavedIdeas(ideas || []);
      }
    } catch (error) {
      console.error('Failed to initialize session:', error);
    }
  };


  const refreshIdeas = async () => {
    const currentSessionId = sessionId || window.sessionStorage.getItem('brainstorming-session-id');
    if (!currentSessionId) return;
    
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const ideas = await brainstormingDb.getSessionIdeas(currentSessionId, user.id);
      setSavedIdeas(ideas || []);
    } catch (error) {
      console.error('Failed to refresh ideas:', error);
    }
  };

  // Refresh ideas periodically
  useEffect(() => {
    if (!sessionId) return;
    
    const interval = setInterval(refreshIdeas, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [sessionId]);

  const [isGeneratingPresentation, setIsGeneratingPresentation] = useState(false);

  const handleGeneratePresentation = async () => {
    if (savedIdeas.length === 0) {
      return; // Don't navigate if no ideas
    }
    
    setIsGeneratingPresentation(true);
    
    try {
      // Create a prompt from the saved ideas
      const ideasSummary = savedIdeas.map(idea => `${idea.title}: ${idea.description}`).join('\n');
      const prompt = `Create a presentation based on these brainstormed ideas:\n\n${ideasSummary}`;
      
      // Call the generate-outline API
      const response = await fetch('/api/generate-outline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          prompt,
          cardCount: parseInt(cardCount),
          style,
          language
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate outline');
      }
      
      const outline = await response.json();
      
      // Create presentation in database
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        console.error('User not authenticated, cannot create presentation.');
        setIsGeneratingPresentation(false);
        return;
      }

      const newPresentation = await db.createPresentation({
        prompt,
        cardCount: parseInt(cardCount, 10),
        style,
        language,
        contentLength: contentLength,
        themeId: 'default',
        imageStyle: '',
        userId: user.id
      });

      if (!newPresentation) {
        console.error('Failed to create presentation in database.');
        setIsGeneratingPresentation(false);
        return;
      }
      
      // Store the outline in localStorage for the generate page
      const documentData = {
        id: newPresentation.id,
        databaseId: newPresentation.id,
        prompt: prompt,
        cardCount: parseInt(cardCount, 10),
        style: style,
        language: language,
        contentLength: contentLength,
        createdAt: new Date().toISOString(),
        status: 'generating',
        outline
      };
      localStorage.setItem(newPresentation.id, JSON.stringify(documentData));
      
      // Navigate to the generated presentation
      router.push(`/create/generate/${newPresentation.id}`);
      
    } catch (error) {
      console.error('Error generating presentation:', error);
      // Fallback: navigate to generate page with prompt
      const ideasSummary = savedIdeas.map(idea => `${idea.title}: ${idea.description}`).join('\n');
      const prompt = `Create a presentation based on these brainstormed ideas:\n\n${ideasSummary}`;
      const encodedPrompt = encodeURIComponent(prompt);
      router.push(`/create/generate?prompt=${encodedPrompt}`);
    } finally {
      setIsGeneratingPresentation(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
        <AppHeader />
        
        <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-primary" />
              <h1 className="text-3xl font-bold">AI Brainstorming Studio</h1>
            </div>
            <MCPToolsToggle 
              sessionId={sessionId || undefined}
              onToolsChange={setActiveMCPTools}
            />
          </div>
          <p className="text-muted-foreground">
            Collaborate with AI to generate, organize and refine your ideas
          </p>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[700px] overflow-hidden">
          {/* Left Column - AI Conversation */}
          <Card className="flex flex-col h-full overflow-hidden">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  AI Brainstorming Assistant
                </div>
                <Badge variant={activeMCPTools.length > 0 ? "default" : "secondary"} className="text-xs">
                  {activeMCPTools.length > 0 ? "GPT-4o + MCP" : "GPT-OSS 20B"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 min-h-0 overflow-hidden">
              <BrainstormingRuntimeProvider
                sessionId={sessionId}
                activeMCPTools={activeMCPTools}
              >
                {sessionId && <BrainstormingThread onIdeaSaved={refreshIdeas} />}
              </BrainstormingRuntimeProvider>
            </CardContent>
          </Card>

          {/* Right Column - Ideas */}
          <Card className="flex flex-col h-full overflow-hidden">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Ideas ({savedIdeas.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 overflow-hidden">
              <ScrollArea className="h-full">
                {savedIdeas.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-4">
                    <Lightbulb className="h-8 w-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">
                      Ideas from your chat will appear here
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {savedIdeas.map((idea) => (
                      <Card key={idea.id} className="p-3">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{idea.title}</h4>
                            <p className="text-sm text-muted-foreground">{idea.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {idea.category && (
                                <Badge variant="outline" className="text-xs">
                                  {idea.category}
                                </Badge>
                              )}
                              {idea.tags && idea.tags.slice(0, 4).map((tag, idx) => (
                                <Badge 
                                  key={idx} 
                                  variant={tag.tag_type === 'domain' ? 'default' : 'secondary'}
                                  className="text-xs"
                                >
                                  {tag.tag}
                                </Badge>
                              ))}
                              {idea.tags && idea.tags.length > 4 && (
                                <Badge variant="outline" className="text-xs">
                                  +{idea.tags.length - 4}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* Presentation Options */}
        <div className="mt-6">
          <div className="text-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Presentation Settings
            </h3>
            <p className="text-sm text-muted-foreground">
              Customize your presentation before generating
            </p>
          </div>
          
          <div className="flex flex-wrap gap-4 mb-6 justify-center">
            <Select value={cardCount} onValueChange={setCardCount}>
              <SelectTrigger className="w-40 bg-gradient-to-r from-white/80 to-white/60 dark:from-zinc-800/80 dark:to-zinc-700/60 backdrop-blur-xl border-2 border-white/30 dark:border-white/20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <SelectValue placeholder="Number of slides" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((i) => (
                  <SelectItem key={i} value={String(i)}>
                    {i} slide{i > 1 ? 's' : ''}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={style} onValueChange={setStyle}>
              <SelectTrigger className="w-40 bg-gradient-to-r from-white/80 to-white/60 dark:from-zinc-800/80 dark:to-zinc-700/60 backdrop-blur-xl border-2 border-white/30 dark:border-white/20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <SelectValue placeholder="Style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="minimalist">Minimalist</SelectItem>
                <SelectItem value="playful">Playful</SelectItem>
                <SelectItem value="formal">Formal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="w-40 bg-gradient-to-r from-white/80 to-white/60 dark:from-zinc-800/80 dark:to-zinc-700/60 backdrop-blur-xl border-2 border-white/30 dark:border-white/20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <SelectValue placeholder="Language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English (US)</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={contentLength} onValueChange={setContentLength}>
              <SelectTrigger className="w-40 bg-gradient-to-r from-white/80 to-white/60 dark:from-zinc-800/80 dark:to-zinc-700/60 backdrop-blur-xl border-2 border-white/30 dark:border-white/20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
                <SelectValue placeholder="Content length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="brief">Brief</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="detailed">Detailed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Generate Presentation Button */}
        <div className="mt-6 text-center">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            onClick={handleGeneratePresentation}
            disabled={savedIdeas.length === 0 || isGeneratingPresentation}
          >
            {isGeneratingPresentation ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Generating Presentation...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-2" />
                Generate Presentation from Ideas ({savedIdeas.length})
              </>
            )}
          </Button>
        </div>
        </div>
      </div>
    </TooltipProvider>
  );
}