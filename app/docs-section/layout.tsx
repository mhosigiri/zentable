"use client"

import { ReactNode } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Zap, 
  Palette, 
  Bot, 
  Monitor, 
  Download, 
  PlayCircle,
  Edit,
  Home,
  ArrowRight,
  Menu,
  X,
  Terminal,
  BrainCircuit,
  Plug
} from 'lucide-react';
import { useState } from 'react';

interface DocsLayoutProps {
  children: ReactNode;
}

const docsNavigation = [
  {
    title: 'Getting Started',
    href: '/docs-section',
    icon: BookOpen,
    badge: 'Start Here'
  },
  {
    title: 'Features',
    items: [
      {
        title: 'AI Generation',
        href: '/docs-section/features/ai-generation',
        icon: Zap,
        description: 'Create presentations from prompts'
      },
      {
        title: 'Slide Templates',
        href: '/docs-section/features/slide-templates',
        icon: Palette,
        description: '14+ professional layouts'
      },
      {
        title: 'AI Assistant',
        href: '/docs-section/features/ai-assistant',
        icon: Bot,
        description: 'Chat-based slide editing'
      },
      {
        title: 'Themes',
        href: '/docs-section/features/themes',
        icon: Palette,
        description: 'Visual customization options'
      },
      {
        title: 'Presentation Mode',
        href: '/docs-section/features/presentation-mode',
        icon: Monitor,
        description: 'Fullscreen presenting'
      },
      {
        title: 'Export & Sharing',
        href: '/docs-section/features/export',
        icon: Download,
        description: 'PDF export and sharing'
      },
      {
        title: 'MCP Integration',
        href: '/docs-section/features/mcp-integration',
        icon: Terminal,
        description: 'Claude Code, Cursor, VS Code, Windsurf'
      },
      {
        title: 'Brainstorming with AI',
        href: '/docs-section/features/brainstorming',
        icon: BrainCircuit,
        description: 'AI-powered idea generation'
      },
      {
        title: 'Other MCP Providers',
        href: '/docs-section/features/other-mcp-providers',
        icon: Plug,
        description: 'GitHub, PostgreSQL, AWS & more'
      }
    ]
  },
  {
    title: 'Guides',
    items: [
      {
        title: 'Creating Presentations',
        href: '/docs-section/guides/creating-presentations',
        icon: PlayCircle,
        description: 'Step-by-step creation guide'
      },
      {
        title: 'Editing Slides',
        href: '/docs-section/guides/editing-slides',
        icon: Edit,
        description: 'Rich text editing and collaboration'
      }
    ]
  }
];

export default function DocsLayout({ children }: DocsLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-sm bg-white/10 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                <Home className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Home</span>
              </Link>
              <ArrowRight className="w-4 h-4 text-gray-400 hidden sm:block" />
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900">Documentation</h1>
            </div>
            <div className="flex items-center space-x-2">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm border-white/20">
                  <span className="hidden sm:inline">Go to Dashboard</span>
                  <span className="sm:hidden">Dashboard</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="flex flex-col lg:flex-row gap-4 lg:gap-8">
          {/* Mobile Navigation Overlay */}
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
              <div className="fixed left-0 top-0 bottom-0 w-80 max-w-[80vw] bg-white/95 backdrop-blur-sm border-r border-white/20 overflow-y-auto">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-gray-900">Documentation</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  <nav className="space-y-6">
                    {docsNavigation.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        {section.href ? (
                          <Link 
                            href={section.href}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/40 transition-colors group"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <div className="flex items-center">
                              <section.icon className="w-5 h-5 mr-3 text-blue-600" />
                              <span className="font-medium text-gray-900">{section.title}</span>
                            </div>
                            {section.badge && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                {section.badge}
                              </Badge>
                            )}
                          </Link>
                        ) : (
                          <>
                            <h3 className="font-semibold text-gray-900 mb-3">{section.title}</h3>
                            <div className="space-y-1">
                              {section.items?.map((item, itemIndex) => (
                                <Link
                                  key={itemIndex}
                                  href={item.href}
                                  className="block p-3 rounded-lg hover:bg-white/40 transition-colors group"
                                  onClick={() => setIsMobileMenuOpen(false)}
                                >
                                  <div className="flex items-start">
                                    <item.icon className="w-4 h-4 mr-3 mt-0.5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                                    <div>
                                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                      </div>
                                      <div className="text-sm text-gray-600 mt-1">
                                        {item.description}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          )}

          {/* Desktop Sidebar Navigation */}
          <aside className="hidden lg:block w-80 flex-shrink-0">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20 sticky top-24">
              <CardContent className="p-6">
                <div className="h-[calc(100vh-200px)] overflow-y-auto">
                  <nav className="space-y-6">
                    {docsNavigation.map((section, sectionIndex) => (
                      <div key={sectionIndex}>
                        {section.href ? (
                          <Link 
                            href={section.href}
                            className="flex items-center justify-between p-3 rounded-lg hover:bg-white/40 transition-colors group"
                          >
                            <div className="flex items-center">
                              <section.icon className="w-5 h-5 mr-3 text-blue-600" />
                              <span className="font-medium text-gray-900">{section.title}</span>
                            </div>
                            {section.badge && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                                {section.badge}
                              </Badge>
                            )}
                          </Link>
                        ) : (
                          <>
                            <h3 className="font-semibold text-gray-900 mb-3">{section.title}</h3>
                            <div className="space-y-1">
                              {section.items?.map((item, itemIndex) => (
                                <Link
                                  key={itemIndex}
                                  href={item.href}
                                  className="block p-3 rounded-lg hover:bg-white/40 transition-colors group"
                                >
                                  <div className="flex items-start">
                                    <item.icon className="w-4 h-4 mr-3 mt-0.5 text-gray-600 group-hover:text-blue-600 transition-colors" />
                                    <div>
                                      <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                        {item.title}
                                      </div>
                                      <div className="text-sm text-gray-600 mt-1">
                                        {item.description}
                                      </div>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </nav>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Main Content */}
          <main className="flex-1 min-w-0 w-full">
            <Card className="bg-white/60 backdrop-blur-sm border-white/20">
              <CardContent className="p-4 sm:p-6 lg:p-8">
                {children}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
}
