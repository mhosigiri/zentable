'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  FolderOpen,
  Home,
  ArrowRight,
  Upload,
  Search,
  Plus,
  Clock,
  CheckCircle,
  FileText,
  Globe
} from 'lucide-react';

export default function ImportPage() {
  const recentPrompts = [
    {
      title: "Student learning assessments",
      type: "Generate",
      time: "2 hours ago",
      status: "DRAFT"
    },
    {
      title: "Persuasive presentation", 
      type: "Generate",
      time: "12 days ago",
      status: null
    },
    {
      title: "Resume for an influencer",
      type: "Generate", 
      time: "12 days ago",
      status: null
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-sm bg-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link href="/create" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <Home className="w-5 h-5 mr-2" />
              Create
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Import with AI</h1>
          </div>
          <p className="text-xl text-gray-600">
            Select the file you'd like to transform
          </p>
        </div>

        {/* Import Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Upload a file */}
          <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0">
            <CardHeader className="pb-4">
              <div className="w-full h-40 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20"></div>
                <FolderOpen className="w-12 h-12 text-white relative z-10" />
              </div>
              <CardTitle className="text-xl font-semibold">Upload a file</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Powerpoint PPTX
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Word docs
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  PDFs
                </div>
              </div>
              <div className="flex justify-center">
                <Upload className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Import from Drive */}
          <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0">
            <CardHeader className="pb-4">
              <div className="w-full h-40 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20"></div>
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center relative z-10">
                  <div className="w-8 h-8 bg-blue-500 rounded transform rotate-45"></div>
                </div>
              </div>
              <CardTitle className="text-xl font-semibold">Import from Drive</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Google Slides
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Google Docs
                </div>
              </div>
              <div className="flex justify-center">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>

          {/* Import from URL */}
          <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-0">
            <CardHeader className="pb-4">
              <div className="w-full h-40 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 to-teal-500/20"></div>
                <Globe className="w-12 h-12 text-white relative z-10" />
              </div>
              <CardTitle className="text-xl font-semibold">Import from URL</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Webpages
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Blog posts or articles
                </div>
                <div className="flex items-center text-sm text-green-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Notion docs (public only)
                </div>
              </div>
              <div className="flex justify-center">
                <Plus className="w-5 h-5 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alternative Option */}
        <div className="text-center mb-16">
          <p className="text-gray-600">
            If your file isn't supported, you can also{' '}
            <Link href="/create/paste" className="text-blue-600 hover:text-blue-700 underline">
              paste in text
            </Link>
          </p>
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
                    <div className="flex items-center mb-1">
                      <h3 className="font-medium text-gray-900 mr-2">{prompt.title}</h3>
                      {prompt.status && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                          {prompt.status}
                        </Badge>
                      )}
                    </div>
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