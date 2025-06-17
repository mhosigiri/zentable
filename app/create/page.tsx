'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Sparkles, 
  Upload, 
  Home,
  ArrowRight,
  Clock
} from 'lucide-react';

export default function CreatePage() {
  const recentPrompts = [
    {
      title: "Persuasive presentation",
      type: "Generate",
      time: "12 days ago"
    },
    {
      title: "Resume for an influencer",
      type: "Generate", 
      time: "12 days ago"
    },
    {
      title: "Introduction",
      type: "Paste text",
      time: "3 months ago"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-sm bg-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <Home className="w-5 h-5 mr-2" />
              Home
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Create with AI
          </h1>
          <p className="text-xl text-gray-600">
            How would you like to get started?
          </p>
        </div>

        {/* Creation Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {/* Paste in text */}
          <Link href="/create/paste">
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0">
              <CardHeader className="pb-4">
                <div className="w-full h-40 bg-gradient-to-br from-gray-900 via-purple-900 to-pink-900 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20"></div>
                  <span className="text-4xl font-bold text-white relative z-10">Aa</span>
                </div>
                <CardTitle className="text-xl font-semibold">Paste in text</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Create from notes, an outline, or existing content
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          {/* Generate */}
          <Link href="/create/generate">
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0 relative">
              <Badge className="absolute -top-2 left-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
                ⚡ POPULAR
              </Badge>
              <CardHeader className="pb-4">
                <div className="w-full h-40 bg-gradient-to-br from-blue-500 via-purple-500 to-orange-500 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-orange-400/20"></div>
                  <Sparkles className="w-12 h-12 text-white relative z-10" />
                </div>
                <CardTitle className="text-xl font-semibold">Generate</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Create from a one-line prompt in a few seconds
                </CardDescription>
              </CardContent>
            </Card>
          </Link>

          {/* Import file or URL */}
          <Link href="/create/import">
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0">
              <CardHeader className="pb-4">
                <div className="w-full h-40 bg-gradient-to-br from-blue-600 via-green-500 to-orange-400 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-lg"></div>
                  <div className="bg-white rounded-lg p-3 relative z-10">
                    <Upload className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <CardTitle className="text-xl font-semibold">Import file or URL</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Enhance existing docs, presentations, or webpages
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Prompts */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Your recent prompts
          </h2>
          
          <div className="space-y-3">
            {recentPrompts.map((prompt, index) => (
              <Card key={index} className="group cursor-pointer hover:shadow-md transition-all duration-200 bg-white/60 backdrop-blur-sm border-0">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{prompt.title}</h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className="mr-3">{prompt.type}</span>
                      <Clock className="w-3 h-3 mr-1" />
                      <span>{prompt.time}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}