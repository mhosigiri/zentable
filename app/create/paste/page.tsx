'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Globe, 
  File, 
  Share2,
  Home,
  ArrowRight,
  List,
  FileCheck,
  Copy
} from 'lucide-react';

export default function PastePage() {
  const [selectedType, setSelectedType] = useState('presentation');
  const [content, setContent] = useState('');

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

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <FileText className="w-8 h-8 text-blue-500 mr-3" />
            <h1 className="text-4xl font-bold text-gray-900">Paste in text</h1>
          </div>
          <p className="text-xl text-gray-600">
            What would you like to create?
          </p>
        </div>

        {/* Content Type Selection */}
        <div className="flex justify-center mb-8">
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
            <button
              onClick={() => setSelectedType('webpage')}
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                selectedType === 'webpage'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Globe className="w-4 h-4 mr-2" />
              Webpage
            </button>
            <button
              onClick={() => setSelectedType('document')}
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                selectedType === 'document'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <File className="w-4 h-4 mr-2" />
              Document
            </button>
            <button
              onClick={() => setSelectedType('social')}
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                selectedType === 'social'
                  ? 'bg-blue-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Share2 className="w-4 h-4 mr-2" />
              Social
            </button>
          </div>
        </div>

        {/* Template Selection */}
        <div className="flex justify-center mb-8">
          <Select defaultValue="default">
            <SelectTrigger className="w-48 bg-white/60 backdrop-blur-sm border-white/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="minimal">Minimal</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <p className="text-gray-700 text-center mb-4">
                Paste in the notes, outline or text content you&apos;d like to use
              </p>
              
              <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                <CardContent className="p-6">
                  <Textarea
                    placeholder="Type or paste in content here"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="min-h-[300px] bg-transparent border-none resize-none text-gray-700 placeholder:text-gray-400"
                  />
                </CardContent>
              </Card>
            </div>

            {/* Action Options */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                What do you want to do with this content?
              </h3>
              
              <div className="space-y-3">
                <Card className="bg-white/60 backdrop-blur-sm border-white/20 cursor-pointer hover:shadow-md transition-all">
                  <CardContent className="flex items-center p-4">
                    <List className="w-5 h-5 text-blue-500 mr-4" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Generate from notes or an outline</h4>
                      <p className="text-sm text-gray-600">Turn rough ideas, bullet points, or outlines into beautiful content</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm border-white/20 cursor-pointer hover:shadow-md transition-all">
                  <CardContent className="flex items-center p-4">
                    <FileCheck className="w-5 h-5 text-green-500 mr-4" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Summarize long text or document</h4>
                      <p className="text-sm text-gray-600">Great for condensing detailed content into something more presentable</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/60 backdrop-blur-sm border-white/20 cursor-pointer hover:shadow-md transition-all">
                  <CardContent className="flex items-center p-4">
                    <Copy className="w-5 h-5 text-purple-500 mr-4" />
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">Preserve this exact text</h4>
                      <p className="text-sm text-gray-600">Create using your text, exactly as you&apos;ve written it</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Continue Button */}
            <div className="text-center">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded-full">
                Continue to prompt editor
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-sm">💡</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Optional: card-by-card control</h3>
                </div>
                
                <p className="text-sm text-gray-600 mb-4">
                  Know what you want on each card? Add three dashes ---- between each section.
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
                    
                    <div className="border-t pt-2">
                      <p className="font-medium">Key metrics from Q1</p>
                      <ul className="list-disc list-inside ml-2 space-y-1">
                        <li>Key point 1</li>
                        <li>Key point 2</li>
                        <li>Key point 3</li>
                      </ul>
                    </div>
                    
                    <div className="border-t pt-2">
                      <p className="font-medium">Next steps + ownership</p>
                      <ul className="list-disc list-inside ml-2 space-y-1">
                        <li>Key point 1</li>
                        <li>...</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}