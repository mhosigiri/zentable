'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AppHeader } from '@/components/ui/app-header';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { 
  FileText, 
  ArrowRight,
  Lightbulb,
  Loader2
} from 'lucide-react';
import { DatabaseService } from '@/lib/database';
import { generateUUID, generatePrefixedId } from '@/lib/uuid';
import { createClient } from '@/lib/supabase/client';

export default function PastePage() {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [cardCount, setCardCount] = useState('8');
  const [style, setStyle] = useState('professional');
  const [language, setLanguage] = useState('en');
  const [pasteAction, setPasteAction] = useState('generate');
  const [isProcessing, setIsProcessing] = useState(false);

  const generateDocumentId = () => {
    return generatePrefixedId('doc');
  };

  const parseTextToSlides = (text: string) => {
    const sections = text.split('---').map(section => section.trim()).filter(section => section.length > 0);
    
    return sections.map((section, index) => {
      const lines = section.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      const title = lines[0] || `Slide ${index + 1}`;
      const content = lines.slice(1).join('\n');
      
      return {
        id: generateUUID(),
        title,
        content,
        template: 'title-with-bullets',
        order: index
      };
    });
  };

  const handleContinue = async () => {
    if (!content.trim()) return;

    setIsProcessing(true);
    
    try {
      const documentId = generateDocumentId();
      const databaseId = generateUUID();

      if (pasteAction === 'generate') {
        // Option 1: Generate or Summarize - use AI processing
        const documentData = {
          id: documentId,
          databaseId: databaseId,
          prompt: content.trim(),
          cardCount: parseInt(cardCount),
          style,
          language,
          createdAt: new Date().toISOString(),
          status: 'generating'
        };
        
        localStorage.setItem(`document_${documentId}`, JSON.stringify(documentData));
        
        // Save to database
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          const userId = user?.id || null;
          
          const dbService = new DatabaseService(supabase);
          await dbService.createPresentation({
            id: databaseId,
            prompt: content.trim(),
            cardCount: parseInt(cardCount),
            style,
            language,
            contentLength: 'medium',
            themeId: 'default',
            imageStyle: '',
            userId: userId
          });
          console.log('✅ Presentation saved to database');
        } catch (dbError) {
          console.warn('⚠️ Database save failed, continuing with localStorage:', dbError);
        }
        
        router.push(`/create/generate/${documentId}`);
        
      } else {
        // Option 2: Preserve exact text - parse and create slides directly
        const slides = parseTextToSlides(content);
        
        const documentData = {
          id: documentId,
          databaseId: databaseId,
          prompt: `Presentation created from pasted content`,
          cardCount: slides.length,
          style,
          language,
          createdAt: new Date().toISOString(),
          status: 'completed',
          generatedSlides: slides,
          outline: {
            title: 'Your Presentation',
            sections: slides.map(slide => ({
              id: slide.id,
              title: slide.title,
              bulletPoints: slide.content.split('\n').filter(Boolean),
              templateType: 'title-with-bullets',
            }))
          }
        };
        
        localStorage.setItem(`document_${documentId}`, JSON.stringify(documentData));
        
        // Save to database
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          const userId = user?.id || null;
          
          const dbService = new DatabaseService(supabase);
          await dbService.createPresentation({
            id: databaseId,
            prompt: documentData.prompt,
            cardCount: slides.length,
            style,
            language,
            contentLength: 'medium',
            themeId: 'default',
            imageStyle: '',
            userId: userId
          });
          
          // Save slides to database
          await dbService.saveSlides(databaseId, slides);
          console.log('✅ Presentation and slides saved to database');
        } catch (dbError) {
          console.warn('⚠️ Database save failed, continuing with localStorage:', dbError);
        }
        
        router.push(`/create/generate/${documentId}`);
      }
      
    } catch (error) {
      console.error('Error processing content:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <AppHeader />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-blue-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Paste in text</h1>
          </div>
          <p className="text-xl text-gray-600">
            Paste in your content and choose an action.
          </p>
        </div>

        {/* Action Options - Moved to top */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            What do you want to do with this content?
          </h3>
          
          <RadioGroup value={pasteAction} onValueChange={setPasteAction} className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <Label htmlFor="action-generate" className="cursor-pointer">
              <Card className={`bg-white/60 backdrop-blur-sm border-2 ${pasteAction === 'generate' ? 'border-blue-500' : 'border-white/20'} hover:shadow-md transition-all h-full`}>
                <CardContent className="flex items-start p-4">
                  <RadioGroupItem value="generate" id="action-generate" className="mr-4 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Generate or Summarize</h4>
                    <p className="text-sm text-gray-600">Turn notes, an outline, or a long document into a beautiful presentation.</p>
                  </div>
                </CardContent>
              </Card>
            </Label>

            <Label htmlFor="action-preserve" className="cursor-pointer">
              <Card className={`bg-white/60 backdrop-blur-sm border-2 ${pasteAction === 'preserve' ? 'border-blue-500' : 'border-white/20'} hover:shadow-md transition-all h-full`}>
                <CardContent className="flex items-start p-4">
                  <RadioGroupItem value="preserve" id="action-preserve" className="mr-4 mt-1" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">Preserve this exact text</h4>
                    <p className="text-sm text-gray-600">Create using your text, exactly as you've written it</p>
                  </div>
                </CardContent>
              </Card>
            </Label>
          </RadioGroup>
        </div>

        {/* Options Row - Conditional display */}
        <div className="flex justify-center gap-4 mb-8">
          {pasteAction === 'generate' && (
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
          )}

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

        {/* Main Content Area */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <p className="text-gray-700">
              Paste in the notes, outline or text content you'd like to use
            </p>
            {pasteAction === 'preserve' && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Lightbulb className="w-4 h-4 mr-2" />
                    Tip
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Card-by-card control</DialogTitle>
                  </DialogHeader>
                  <p className="text-sm text-gray-600 mb-4">
                    Use three dashes `---` between sections to create separate slides.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Example:</p>
                    <div className="text-xs text-gray-600 space-y-2">
                      <div>
                        <p className="font-medium">Intro to our new strategy</p>
                        <ul className="list-disc list-inside ml-2 space-y-1">
                          <li>Key point 1</li>
                          <li>Key point 2</li>
                          <li>Key point 3</li>
                        </ul>
                      </div>
                      <div className="border-t border-gray-200 my-1">---</div>
                      <div>
                        <p className="font-medium">Key metrics from Q1</p>
                        <ul className="list-disc list-inside ml-2 space-y-1">
                          <li>Key point 1</li>
                          <li>Key point 2</li>
                        </ul>
                      </div>
                       <div className="border-t border-gray-200 my-1">---</div>
                      <div>
                        <p className="font-medium">Next steps + ownership</p>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <Card className="bg-white/60 backdrop-blur-sm border-white/20">
            <CardContent className="p-2">
              <Textarea
                placeholder="Type or paste in content here"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[300px] bg-transparent border-none resize-none text-gray-700 placeholder:text-gray-400 focus-visible:ring-0"
              />
            </CardContent>
          </Card>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full" 
            disabled={!content.trim() || isProcessing}
            onClick={handleContinue}
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  );
}