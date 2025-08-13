"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";
import { 
  Brain, 
  Wand2, 
  Presentation, 
  Zap, 
  Palette, 
  Code, 
  ArrowRight, 
  Sparkles, 
  Users, 
  Globe, 
  Database,
  MessageSquare,
  TrendingUp,
  Eye,
  Download,
  Share,
  Terminal,
  Lightbulb,
  Bot
} from "lucide-react";
import Link from "next/link";
import { InteractiveSlidePreview } from "./interactive-slide-preview";

export function FeaturesSection() {
  const [activeTab, setActiveTab] = useState("ai-generation");

  const features = {
    "ai-generation": [
      {
        icon: <Brain className="h-8 w-8" />,
        title: "AI-Powered Content Generation",
        description: "Transform simple prompts into comprehensive presentation outlines with intelligent structuring and content suggestions.",
        benefits: ["Natural language processing", "Context-aware content", "Smart slide organization"]
      },
      {
        icon: <Wand2 className="h-8 w-8" />,
        title: "Intelligent Design Assistant",
        description: "AI automatically selects optimal layouts, color schemes, and visual hierarchies based on your content type and audience.",
        benefits: ["Auto-layout selection", "Color harmony", "Visual balance"]
      },
      {
        icon: <Bot className="h-8 w-8" />,
        title: "AI Assistant for Real-time Editing",
        description: "Chat naturally with AI to make instant changes, get suggestions, and enhance your slides with contextual understanding.",
        benefits: ["Natural language editing", "Contextual suggestions", "Smart improvements"]
      }
    ],
    "smart-editing": [
      {
        icon: <Palette className="h-8 w-8" />,
        title: "Context-Aware Styling",
        description: "Smart formatting that adapts to your content, ensuring consistency and professional appearance across all slides.",
        benefits: ["Auto-formatting", "Style consistency", "Brand alignment"]
      },
      {
        icon: <Eye className="h-8 w-8" />,
        title: "Real-time Preview",
        description: "See changes instantly as you edit with our advanced preview system that shows exactly how your presentation will look.",
        benefits: ["Instant feedback", "WYSIWYG editing", "Mobile preview"]
      },
      {
        icon: <Lightbulb className="h-8 w-8" />,
        title: "Interactive Brainstorming Mode",
        description: "Explore ideas with AI before creating presentations. Refine concepts through conversation and discover new angles.",
        benefits: ["Idea exploration", "Topic refinement", "Creative discovery"]
      }
    ],
    "collaboration": [
      {
        icon: <Bot className="h-8 w-8" />,
        title: "AI Assistant Integration",
        description: "Chat naturally with AI to edit slides, get suggestions, and enhance presentations with contextual understanding of your content.",
        benefits: ["Natural language editing", "Contextual suggestions", "Real-time improvements"]
      },
      {
        icon: <Lightbulb className="h-8 w-8" />,
        title: "Interactive Brainstorming",
        description: "Explore ideas with AI before creating presentations. Refine concepts through conversation and discover new creative angles.",
        benefits: ["Idea exploration", "Topic refinement", "Creative discovery"]
      },
      {
        icon: <Terminal className="h-8 w-8" />,
        title: "MCP Developer Integration",
        description: "Create presentations directly from Claude Code, Cursor, Windsurf, and VS Code with Model Context Protocol support.",
        benefits: ["IDE integration", "API access", "Developer workflow"]
      }
    ]
  };

  const stats = [
    { number: "18+", label: "Slide Templates", icon: <Presentation className="h-5 w-5" /> },
    { number: "27+", label: "Professional Themes", icon: <Palette className="h-5 w-5" /> },
    { number: "3", label: "Subscription Plans", icon: <TrendingUp className="h-5 w-5" /> },
    { number: "4+", label: "AI Models", icon: <Brain className="h-5 w-5" /> }
  ];

  return (
    <section id="features" className="py-12 sm:py-24 px-4 bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto">
        
        {/* Interactive Slide Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12 sm:mb-20"
        >
          <InteractiveSlidePreview />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 mb-12 sm:mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="flex items-center justify-center mb-2 text-purple-500">
                {stat.icon}
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
              <div className="text-xs sm:text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8 sm:mb-12 bg-white/60 backdrop-blur-sm border border-purple-100">
              <TabsTrigger 
                value="ai-generation"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3"
              >
                <Brain className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">AI Generation</span>
                <span className="sm:hidden">AI Gen</span>
              </TabsTrigger>
              <TabsTrigger 
                value="smart-editing"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3"
              >
                <Wand2 className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Smart Editing</span>
                <span className="sm:hidden">Editing</span>
              </TabsTrigger>
              <TabsTrigger 
                value="collaboration"
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white text-xs sm:text-sm p-2 sm:p-3"
              >
                <Bot className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">AI Collaboration</span>
                <span className="sm:hidden">AI Collab</span>
              </TabsTrigger>
            </TabsList>

            {Object.entries(features).map(([key, featureList]) => (
              <TabsContent key={key} value={key} className="mt-0">
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-8">
                  {featureList.map((feature, index) => (
                    <motion.div
                      key={feature.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <Card className="relative h-full bg-white/60 backdrop-blur-sm border-white/20 hover:shadow-xl transition-all duration-500 overflow-hidden">
                        <BorderBeam size={250} duration={12} delay={index * 2} />
                        
                        <CardHeader className="pb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 text-white flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                            {feature.icon}
                          </div>
                          <CardTitle className="text-xl font-semibold text-gray-900">
                            {feature.title}
                          </CardTitle>
                        </CardHeader>
                        
                        <CardContent className="pt-0">
                          <CardDescription className="text-gray-600 mb-4 leading-relaxed">
                            {feature.description}
                          </CardDescription>
                          
                          <ul className="space-y-2">
                            {feature.benefits.map((benefit, i) => (
                              <li key={i} className="flex items-center text-sm text-gray-700">
                                <div className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 mr-3" />
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12 sm:mt-20"
        >
          <div className="relative mx-auto max-w-4xl">
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-6 sm:p-12 text-white overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Ready to Transform Your Ideas?
                </h3>
                <p className="text-base sm:text-lg md:text-xl opacity-90 mb-6 sm:mb-8 max-w-2xl mx-auto">
                  Join thousands of creators who are already using AI to build stunning presentations that captivate and inspire.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/dashboard">
                    <Button size="lg" variant="secondary" className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg bg-white text-purple-600 hover:bg-gray-100 w-full sm:w-auto">
                      <Zap className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
                      Start Free Trial
                      <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
                    </Button>
                  </Link>
                  {/* <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-white text-white hover:bg-white/10">
                    <Download className="w-5 h-5 mr-2" />
                    View Examples
                  </Button> */}
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-3xl" />
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 