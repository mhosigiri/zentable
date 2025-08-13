"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BorderBeam } from "@/components/ui/border-beam";
import { 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  Monitor, 
  Smartphone, 
  Tablet,
  Eye,
  Edit3,
  Sparkles,
  ArrowRight,
  BarChart3,
  Image as ImageIcon,
  Type,
  Layout
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function ShowcaseSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const slideExamples = [
    {
      id: 1,
      title: "Business Presentation",
      description: "Professional quarterly review with dynamic charts and insights",
      preview: "/api/placeholder/600/400",
      type: "Business"
    },
    {
      id: 2,
      title: "Creative Pitch",
      description: "Stunning visual storytelling for creative projects",
      preview: "/api/placeholder/600/400",
      type: "Creative"
    },
    {
      id: 3,
      title: "Educational Content",
      description: "Interactive learning materials with clear visual hierarchy",
      preview: "/api/placeholder/600/400",
      type: "Education"
    },
    {
      id: 4,
      title: "Startup Deck",
      description: "Investor-ready presentation with compelling data visualization",
      preview: "/api/placeholder/600/400",
      type: "Startup"
    }
  ];

  const editorFeatures = [
    {
      icon: <Edit3 className="h-6 w-6" />,
      title: "Smart Text Editor",
      description: "AI-powered writing assistance with real-time suggestions"
    },
    {
      icon: <Layout className="h-6 w-6" />,
      title: "Dynamic Layouts",
      description: "Intelligent layout suggestions based on your content"
    },
    {
      icon: <ImageIcon className="h-6 w-6" />,
      title: "AI Image Generation",
      description: "Create custom visuals that perfectly match your content"
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "Data Visualization",
      description: "Transform data into compelling visual stories"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideExamples.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideExamples.length) % slideExamples.length);
  };

  return (
    <section className="py-12 sm:py-24 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-20"
        >
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
            <Eye className="w-4 h-4 mr-2" />
            See It In Action
          </div>
          
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              From Concept
            </span>
            <br />
            <span className="text-gray-900">To Masterpiece</span>
          </h2>
          
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
            Witness the magic of AI-powered presentation creation. See how ideas transform 
            into professional presentations with just a few clicks.
          </p>
        </motion.div>

        {/* Slide Showcase */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="relative max-w-5xl mx-auto">
            <Card className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
              <BorderBeam size={300} duration={15} colorFrom="#3B82F6" colorTo="#8B5CF6" />
              
              <CardContent className="p-4 sm:p-6 md:p-8">
                <div className="flex items-center mb-4 sm:mb-6">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="flex space-x-2">
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="text-xs sm:text-sm text-gray-600">Presentation Studio</div>
                  </div>
                </div>

                <div className="flex justify-center mb-4 sm:mb-6">
                  <div className="relative bg-white rounded-lg shadow-lg overflow-hidden scale-75 sm:scale-100" style={{ aspectRatio: '16/9', minHeight: '250px', width: '100%', maxWidth: '600px' }}>
                  {/* Slide Preview */}
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50"
                  >
                    <div className="text-center p-4 sm:p-6 md:p-8">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl mx-auto mb-3 sm:mb-4 md:mb-6 flex items-center justify-center">
                        <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-white" />
                      </div>
                      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
                        {slideExamples[currentSlide].title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                        {slideExamples[currentSlide].description}
                      </p>
                      <div className="inline-flex items-center px-2 sm:px-3 py-1 rounded-full bg-purple-100 text-purple-800 text-xs sm:text-sm font-medium">
                        {slideExamples[currentSlide].type}
                      </div>
                    </div>
                  </motion.div>

                  {/* Navigation */}
                  <button
                    onClick={prevSlide}
                    className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 sm:p-2 shadow-lg transition-all duration-200"
                  >
                    <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 sm:p-2 shadow-lg transition-all duration-200"
                  >
                    <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  </div>
                </div>

                {/* Slide Indicators */}
                <div className="flex justify-center space-x-2">
                  {slideExamples.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        index === currentSlide 
                          ? 'bg-purple-500 w-8' 
                          : 'bg-gray-300 hover:bg-gray-400'
                      }`}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Editor Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Intelligent Editing Experience
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our AI-powered editor anticipates your needs and provides intelligent assistance every step of the way.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {editorFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <Card className="relative h-full p-6 bg-gradient-to-br from-white to-gray-50 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-purple-200">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl mx-auto mb-4 flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                    <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ready to Create Your Own?
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Experience the future of presentation creation. Start building stunning presentations 
              that captivate your audience and bring your ideas to life.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/dashboard">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg">
                  <Sparkles className="w-5 h-5 mr-2" />
                  Try It Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              {/* <Button size="lg" variant="outline" className="px-8 py-4 text-lg border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50">
                <Eye className="w-5 h-5 mr-2" />
                Watch Demo
              </Button> */}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 