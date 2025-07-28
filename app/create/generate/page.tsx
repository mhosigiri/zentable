'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppHeader } from '@/components/ui/app-header';
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
  Loader2
} from 'lucide-react';
import { db } from '@/lib/database';
import { generateUUID, generatePrefixedId } from '@/lib/uuid';
import { createClient } from '@/lib/supabase/client';

export default function GeneratePage() {
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('presentation');
  const [prompt, setPrompt] = useState('');
  const [cardCount, setCardCount] = useState('8');
  const [style, setStyle] = useState('professional');
  const [language, setLanguage] = useState('en');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      console.log('👤 User on page load:', user);
    };
    fetchUser();
  }, []);

  const examplePrompts = [
    {
      icon: FileText,
      title: "Developing and delivering workshops or training programs on specific topics or skills",
      category: "Training"
    },
    {
      icon: GraduationCap,
      title: "Student learning assessments",
      category: "Education"
    },
    {
      icon: Waves,
      title: "Monsters of the deep oceans",
      category: "Science"
    },
    {
      icon: MessageSquare,
      title: "The best and worst slang gen Z",
      category: "Culture"
    },
    {
      icon: Flask,
      title: "Research proposal",
      category: "Academic"
    },
    {
      icon: DollarSign,
      title: "Sales proposal for professional web services",
      category: "Business"
    }
  ];

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
        status: 'generating'
      };
      
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
          contentLength: 'medium',
          themeId: 'default',
          imageStyle: '',
          userId: userId // Pass the user ID
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
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          <Select value={cardCount} onValueChange={setCardCount}>
            <SelectTrigger className="w-32 bg-gradient-to-r from-white/80 to-white/60 dark:from-zinc-800/80 dark:to-zinc-700/60 backdrop-blur-xl border-2 border-white/30 dark:border-white/20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="6">6 slides</SelectItem>
              <SelectItem value="8">8 slides</SelectItem>
              <SelectItem value="10">10 slides</SelectItem>
              <SelectItem value="12">12 slides</SelectItem>
              <SelectItem value="15">15 slides</SelectItem>
            </SelectContent>
          </Select>

          <Select value={style} onValueChange={setStyle}>
            <SelectTrigger className="w-40 bg-gradient-to-r from-white/80 to-white/60 dark:from-zinc-800/80 dark:to-zinc-700/60 backdrop-blur-xl border-2 border-white/30 dark:border-white/20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300">
              <SelectValue />
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
          <div className="flex items-center justify-center mb-8">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
            <span className="px-6 text-gray-500 font-medium bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 rounded-full py-2">
              Example prompts
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {examplePrompts.map((example, index) => (
              <Card 
                key={index} 
                className="bg-gradient-to-br from-white/90 to-white/80 dark:from-zinc-800/90 dark:to-zinc-700/80 backdrop-blur-xl border-2 border-white/30 dark:border-white/20 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer group transform hover:scale-[1.02] hover:-translate-y-1 rounded-2xl"
                onClick={() => setPrompt(example.title)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-800/50 dark:to-purple-800/50 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                      <example.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{example.category}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-colors">
                        {example.title}
                      </p>
                    </div>
                    <Plus className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-all duration-300 transform group-hover:rotate-90 group-hover:scale-110 flex-shrink-0" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Shuffle Button - Modern */}
          <div className="text-center">
            <Button 
              variant="outline" 
              className="bg-gradient-to-r from-white/80 to-white/60 dark:from-zinc-800/80 dark:to-zinc-700/60 backdrop-blur-xl border-2 border-white/30 dark:border-white/20 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Shuffle className="w-5 h-5 mr-2" />
              Shuffle Prompts
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
