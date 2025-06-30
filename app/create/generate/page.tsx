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
    return generatePrefixedId('doc');
  };

  const handleGenerateOutline = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    
    try {
      // Generate both IDs - UUID for database, custom for localStorage
      const documentId = generateDocumentId(); // Keep for localStorage compatibility
      const databaseId = generateUUID(); // Proper UUID for database
      
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
      
      localStorage.setItem(`document_${documentId}`, JSON.stringify(documentData));
      
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AppHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Generate</h1>
          <p className="text-xl text-gray-600">
            What would you like to create today?
          </p>
        </div>

        {/* Content Type Selection */}
        {/* <div className="flex justify-center mb-8">
          <div className="flex bg-white/60 backdrop-blur-sm rounded-lg p-2 border border-white/20">
            <button
              onClick={() => setSelectedType('presentation')}
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                selectedType === 'presentation'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Presentation
            </button>
          </div>
        </div> */}

        {/* Options Row */}
        <div className="flex justify-center gap-4 mb-8">
          <Select value={cardCount} onValueChange={setCardCount}>
            <SelectTrigger className="w-32 bg-white/60 backdrop-blur-sm border-white/20">
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
            <SelectTrigger className="w-40 bg-white/60 backdrop-blur-sm border-white/20">
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
            <SelectTrigger className="w-40 bg-white/60 backdrop-blur-sm border-white/20">
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

        {/* Prompt Input */}
        <div className="mb-8">
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <Input
                  placeholder="Describe what you'd like to make"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="text-lg bg-transparent border-none text-gray-700 placeholder:text-gray-400 flex-1"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !isGenerating) {
                      handleGenerateOutline();
                    }
                  }}
                />
                <RefreshCw className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Generate Button */}
        <div className="text-center mb-8">
          <Button 
            onClick={handleGenerateOutline}
            disabled={!prompt.trim() || isGenerating}
            size="lg" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Generating Outline...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Generate Outline
              </>
            )}
          </Button>
        </div>

        {/* Example Prompts */}
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-4 text-gray-500 font-medium">Example prompts</span>
            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {examplePrompts.map((example, index) => (
              <Card 
                key={index} 
                className="bg-white/60 backdrop-blur-sm border-white/20 cursor-pointer hover:shadow-md transition-all group"
                onClick={() => setPrompt(example.title)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <example.icon className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                        {example.title}
                      </p>
                    </div>
                    <Plus className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Shuffle Button */}
          <div className="text-center">
            <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-white/20">
              <Shuffle className="w-4 h-4 mr-2" />
              Shuffle
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}