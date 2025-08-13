"use client";

import { useEffect } from "react";
import Link from "next/link";
import { renderCanvas } from "@/components/ui/canvas";
import { Button } from "@/components/ui/button";
import { Brain, Lightbulb, Presentation, Sparkles, ArrowRight, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export function Hero() {
  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      {/* Canvas Background */}
      <canvas
        className="pointer-events-none absolute inset-0 mx-auto"
        id="canvas"
      ></canvas>

      {/* Hero Content */}
      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 text-center">
        
        {/* Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8 mt-10"
        >
          <div className="relative flex flex-wrap items-center justify-center gap-1 sm:gap-2 rounded-full border border-purple-200/50 bg-white/10 backdrop-blur-md px-3 sm:px-4 py-2 text-xs sm:text-sm leading-6 text-primary/80 shadow-lg max-w-sm sm:max-w-none mx-auto">
            <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 flex-shrink-0" />
            <span className="text-center">Introducing AI-Powered Presentation Magic</span>
            <Link
              href="/dashboard"
              className="hover:text-purple-600 flex items-center font-semibold transition-colors flex-shrink-0"
            >
              <span>Try Now</span>
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
            </Link>
          </div>
        </motion.div>

        {/* Main Heading */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8 px-4"
        >
          <div className="relative mx-auto max-w-6xl">
            <h1 className="flex select-none flex-col text-center text-3xl sm:text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Ideas Spark.
              </span>
              <span className="bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                Presentations Flow.
              </span>
            </h1>
            
            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -left-8 -top-8 hidden md:block"
            >
              <div className="rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-3 backdrop-blur-sm">
                <Brain className="h-8 w-8 text-purple-500" />
              </div>
            </motion.div>
            
            <motion.div
              animate={{
                y: [0, 10, 0],
                rotate: [0, -5, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -right-8 -bottom-8 hidden md:block"
            >
              <div className="rounded-2xl bg-gradient-to-br from-cyan-500/20 to-green-500/20 p-3 backdrop-blur-sm">
                <Lightbulb className="h-8 w-8 text-cyan-500" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Status Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex items-center justify-center gap-2 mb-6"
        >
          <span className="relative flex h-3 w-3 items-center justify-center">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
          </span>
          <p className="text-sm text-green-600 font-medium">Live & Ready for Magic</p>
        </motion.div>

        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mb-12 px-4"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-medium text-gray-700 dark:text-gray-300 mb-4">
            Where <span className="font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Ideas Transform</span> into Stunning Presentations
          </h2>
          
          <p className="mx-auto max-w-3xl text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
            Harness the power of AI to transform your thoughts into captivating visual stories. 
            From concept to presentation in seconds - because your ideas deserve the perfect stage.
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 px-4"
        >
          <Link href="/dashboard">
            <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
              <Sparkles className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
              Start Creating Magic
              <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
            </Button>
          </Link>
          <Link href="/docs-section">
            <Button variant="outline" size="lg" className="px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg rounded-full border-2 border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 w-full sm:w-auto">
              <Presentation className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
              See Examples
            </Button>
          </Link>
        </motion.div>

        {/* Feature Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto text-center px-4"
        >
          <div className="group">
            <div className="flex items-center justify-center mb-2">
              <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">10x</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Faster Creation</div>
          </div>
          <div className="group">
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-500 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">95%</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Time Saved</div>
          </div>
          <div className="group">
            <div className="flex items-center justify-center mb-2">
              <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">∞</div>
            <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Possibilities</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 