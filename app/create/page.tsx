'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AppHeader } from '@/components/ui/app-header';
import { 
  FileText, 
  Sparkles, 
  Upload, 
  Home,
  ArrowRight,
  Clock,
  BrainCircuit
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { DatabaseService, Presentation } from '@/lib/database';
import { createClient } from '@/lib/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';


export default function CreatePage() {
  const [recentPrompts, setRecentPrompts] = useState<Presentation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentPrompts = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const dbService = new DatabaseService(supabase);
        const presentations = await dbService.getUserPresentations(user.id);
        // get the 6 most recent for the modern carousel
        setRecentPrompts(presentations.slice(0, 6));
      }
      setIsLoading(false);
    };

    fetchRecentPrompts();
  }, []);


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-900 dark:via-purple-950 dark:to-slate-900">
      <AppHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Create with AI
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            How would you like to get started?
          </p>
        </div>

        {/* Creation Options */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {/* Paste in text */}
          <Link href="/create/paste" className="group">
            <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white/90 via-purple-50/80 to-pink-50/90 dark:from-zinc-800/90 dark:via-purple-900/50 dark:to-pink-900/50 backdrop-blur-xl border-2 border-white/20 dark:border-white/10 shadow-xl hover:shadow-purple-500/20 rounded-2xl transform hover:scale-[1.03]">
              <CardHeader className="pb-4">
                <div className="w-full h-48 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/30 via-purple-500/30 to-pink-500/30 animate-pulse"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                  <span className="text-5xl font-bold text-white relative z-10 drop-shadow-2xl">Aa</span>
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Start with text</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 text-lg">
                  Create from notes, an outline, or existing content
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          {/* Generate */}
          <Link href="/create/generate" className="group">
            <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-white/90 via-blue-50/80 to-cyan-50/90 dark:from-zinc-800/90 dark:via-blue-900/50 dark:to-cyan-900/50 backdrop-blur-xl border-2 border-white/20 dark:border-white/10 shadow-xl hover:shadow-blue-500/20 rounded-2xl transform hover:scale-[1.03]">
              <Badge className="absolute -top-3 left-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none shadow-lg z-10">
                ⚡ POPULAR
              </Badge>
              <CardHeader className="pb-4">
                <div className="w-full h-48 bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-400/30 via-cyan-500/30 to-blue-500/30 animate-pulse"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                  <Sparkles className="w-16 h-16 text-white relative z-10 drop-shadow-2xl animate-pulse" />
                </div>
                <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Generate</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600 dark:text-gray-300 text-lg">
                  Create from a one-line prompt in a few seconds
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          {/* Brainstorm with AI */}
          <div className="relative">
            <Badge className="absolute -top-3 left-6 bg-gradient-to-r from-gray-500 to-gray-600 text-white border-none shadow-lg z-10">
              COMING SOON
            </Badge>
            <Card className="group cursor-not-allowed opacity-60 bg-gradient-to-br from-gray-100/90 to-gray-200/90 dark:from-gray-800/90 dark:to-gray-700/90 backdrop-blur-xl border-2 border-gray-300/20 dark:border-gray-600/20 rounded-2xl h-full">
              <CardHeader className="pb-4">
                <div className="w-full h-48 bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-xl"></div>
                  <div className="bg-white/90 rounded-xl p-4 relative z-10">
                    <BrainCircuit className="w-12 h-12 text-gray-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl font-bold text-gray-600">Brainstorm with AI</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-500 dark:text-gray-400 text-lg">
                  Collaborate with an AI partner to generate and refine ideas
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Prompts - Modern Carousel */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
              Recent Creations
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              Continue where you left off
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <Card key={i} className="bg-gradient-to-br from-gray-100/80 to-gray-200/80 dark:from-gray-800/80 dark:to-gray-700/80 backdrop-blur-xl border-0 shadow-lg rounded-2xl">
                  <CardContent className="p-6">
                    <Skeleton className="h-4 w-3/4 mb-3 rounded-lg" />
                    <Skeleton className="h-3 w-1/2 mb-2 rounded-lg" />
                    <Skeleton className="h-3 w-1/3 rounded-lg" />
                  </CardContent>
                </Card>
              ))
            ) : recentPrompts.length > 0 ? (
              recentPrompts.map((prompt) => (
                <Link href={`/create/generate/${prompt.id}`} key={prompt.id} className="group">
                  <Card className="group cursor-pointer hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white/90 via-purple-50/80 to-pink-50/90 dark:from-zinc-800/90 dark:via-purple-900/50 dark:to-pink-900/50 backdrop-blur-xl border-2 border-white/20 dark:border-white/10 shadow-xl hover:shadow-purple-500/20 rounded-2xl transform hover:scale-[1.03] hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2">
                            {prompt.prompt}
                          </h3>
                          <div className="flex items-center gap-3 text-sm">
                            <Badge variant="outline" className="bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-800/50 dark:to-cyan-800/50 border-blue-300 dark:border-blue-600 text-blue-800 dark:text-blue-300 capitalize">
                              {prompt.style}
                            </Badge>
                            <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatDistanceToNow(new Date(prompt.created_at), { addSuffix: true })}
                            </span>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-all duration-300 transform group-hover:translate-x-1 flex-shrink-0" />
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-800/50 dark:to-emerald-800/50">
                          {prompt.card_count} slides
                        </Badge>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {prompt.status}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <div className="max-w-md mx-auto">
                  <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">No recent creations yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Start your first presentation to see it here</p>
                  <Button
                    onClick={() => window.location.href = '/create/generate'}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg"
                  >
                    Create Your First Presentation
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}