'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppHeader } from '@/components/ui/app-header';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Sparkles, 
  Home, 
  Plus, 
  Shuffle, 
  FileText, 
  GraduationCap, 
  Waves, 
  MessageSquare, 
  FlaskRound as Flask, 
  DollarSign, 
  RefreshCw, 
  Loader2,
  Globe
} from 'lucide-react';
import { DatabaseService } from '@/lib/database';
import { generateUUID, generatePrefixedId } from '@/lib/uuid';
import { createClient } from '@/lib/supabase/client';

// Create database service with proper user-authenticated client
const browserClient = createClient();
const db = new DatabaseService(browserClient);
import { PresentationExamples, type Example } from '@/components/presentation-examples';

export default function GeneratePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedType, setSelectedType] = useState('presentation');
  const [prompt, setPrompt] = useState('');
  const [cardCount, setCardCount] = useState('5');
  const [style, setStyle] = useState('professional');
  const [language, setLanguage] = useState('en');
  const [contentLength, setContentLength] = useState('brief');
  const [isGenerating, setIsGenerating] = useState(false);
  const [enableBrowserSearch, setEnableBrowserSearch] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 User on page load:', user);
    };
    fetchUser();
    
    // Check for prompt parameter from brainstorming
    const urlPrompt = searchParams.get('prompt');
    if (urlPrompt) {
      setPrompt(decodeURIComponent(urlPrompt));
    }
  }, [searchParams]);

  const handleSelectExample = (example: Example) => {
    setPrompt(example.prompt);
    setCardCount(String(example.cardCount));
    setStyle(example.style);
    setContentLength('brief'); // Default to brief for examples
  };

  const generateDocumentId = () => {
    return generateUUID();
  };

  const handleGenerateOutline = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    try {
      // Generate UUID for both localStorage and database
      const documentId = generateDocumentId(); // Pure UUID for consistency
      const databaseId = documentId; // Use same UUID for database
      
      // Store the initial document data in localStorage (keep existing)
      const documentData = {
        id: documentId,
        databaseId: databaseId, // Store the database ID for future reference
        prompt: prompt.trim(),
        cardCount: parseInt(cardCount),
        style,
        language,
        createdAt: new Date().toISOString(),
        status: 'generating',
        enableBrowserSearch // Store browser search setting
      };
      
      console.log('💾 Saving to localStorage with enableBrowserSearch:', enableBrowserSearch);
      console.log('💾 Full documentData:', documentData);
      localStorage.setItem(documentId, JSON.stringify(documentData));
      
      // Also save to database in the background (new addition)
      try {
        // Get the current user session
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        // console.log('👤 Fetched user session:', user); // DEBUG LOG
        
        const userId = user?.id || null;
        // console.log('🔑 User ID being sent to database:', userId); // DEBUG LOG
        
        await db.createPresentation({
          id: databaseId, // Use proper UUID for database
          prompt: prompt.trim(),
          cardCount: parseInt(cardCount),
          style,
          language,
          contentLength,
          themeId: 'default',
          imageStyle: '',
          userId: userId, // Pass the user ID
          enableBrowserSearch // Pass the browser search setting
        });
        console.log('✅ Presentation saved to database with UUID:', databaseId);
      } catch (dbError) {
        console.warn('⚠️ Database save failed, continuing with localStorage:', dbError);
      }
      
      // Navigate to the outline page using the custom ID (keep existing)
      router.push(`/create/generate/${documentId}`);
      
    } catch (error) {
      console.error('Error starting outline generation:', error);
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Generate Your Presentation
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Describe what you want to create and let AI do the magic
          </p>
        </div>

        {/* Configuration Options - Modern Chips */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
          <Select value={cardCount} onValueChange={setCardCount}>
            <SelectTrigger className="w-[140px] h-12 text-base bg-white/80 backdrop-blur-sm border-gray-200/80">
              <SelectValue placeholder="Number of slides" />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                <SelectItem key={num} value={String(num)}>{num} slide{num > 1 ? 's' : ''}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger className="w-[150px] h-12 text-base bg-white/80 backdrop-blur-sm border-gray-200/80">
              <SelectValue placeholder="Style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="professional">Professional</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
              <SelectItem value="minimalist">Minimalist</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="playful">Playful</SelectItem>
              <SelectItem value="elegant">Elegant</SelectItem>
              <SelectItem value="corporate">Corporate</SelectItem>
            </SelectContent>
          </Select>

          <Select value={contentLength} onValueChange={setContentLength}>
            <SelectTrigger className="w-[130px] h-12 text-base bg-white/80 backdrop-blur-sm border-gray-200/80">
              <SelectValue placeholder="Length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brief">Brief</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="detailed">Detailed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-[150px] h-12 text-base bg-white/80 backdrop-blur-sm border-gray-200/80">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English (US)</SelectItem>
              <SelectItem value="es">Spanish</SelectItem>
              <SelectItem value="fr">French</SelectItem>
              <SelectItem value="de">German</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center space-x-2 px-4 py-3 bg-white/80 backdrop-blur-sm border border-gray-200/80 rounded-lg">
            <Globe className="w-4 h-4 text-gray-600" />
            <Label htmlFor="browser-search" className="text-base font-medium">
              Web Search
            </Label>
            <Switch
              id="browser-search"
              checked={enableBrowserSearch}
              onCheckedChange={setEnableBrowserSearch}
            />
          </div>
        </div>

        {/* Prompt Input - Modern Floating */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-white/90 to-white/80 dark:from-zinc-800/90 dark:to-zinc-700/80 backdrop-blur-2xl border-2 border-white/30 dark:border-white/20 shadow-2xl rounded-2xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    placeholder="Describe what you'd like to create..."
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="text-xl bg-transparent border-none text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 flex-1 focus:outline-none focus:ring-0"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isGenerating) {
                        handleGenerateOutline();
                      }
                    }}
                  />
                </div>
                <RefreshCw className="w-6 h-6 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 cursor-pointer transition-colors duration-300 hover:rotate-180" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generate Button - Modern Gradient */}
        <div className="text-center mb-12">
          <Button 
            onClick={handleGenerateOutline}
            disabled={!prompt.trim() || isGenerating}
            size="lg" 
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white px-12 py-4 rounded-full shadow-2xl hover:shadow-purple-500/30 transition-all duration-500 transform hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                <span className="text-lg">Generating Outline...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 mr-3" />
                <span className="text-lg">Generate Outline</span>
              </>
            )}
          </Button>
        </div>

        {/* Example Prompts - Modern Grid */}
        <div className="mb-12">
          <PresentationExamples onSelectExample={handleSelectExample} />
        </div>
      </main>
    </div>
  );
}
