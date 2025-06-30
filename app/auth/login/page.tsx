'use client';

import { useEffect } from 'react';
import { LoginForm } from '@/components/dashboard/login-form';
import { renderCanvas } from '@/components/ui/canvas';
import { motion } from 'framer-motion';
import { Brain, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  useEffect(() => {
    renderCanvas();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Canvas Background */}
      <canvas
        className="pointer-events-none absolute inset-0 mx-auto"
        id="canvas"
      ></canvas>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-blue-900/10 to-cyan-900/10" />
      
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <img 
                src="/assets/Zent_icon.png" 
                alt="Zent Logo" 
                className="h-10 w-10"
              />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Zent
              </span>
            </div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Welcome to the Future
                </span>
                <br />
                of Presentations
              </h1>
              
              {/* Floating Brain Icon */}
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
                className="absolute -left-8 -top-4 hidden md:block"
              >
                <div className="rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 p-2 backdrop-blur-sm">
                  <Brain className="h-6 w-6 text-purple-500" />
                </div>
              </motion.div>
              
              {/* Floating Sparkles Icon */}
              <motion.div
                animate={{
                  y: [0, 8, 0],
                  rotate: [0, -5, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1
                }}
                className="absolute -right-8 -bottom-4 hidden md:block"
              >
                <div className="rounded-xl bg-gradient-to-br from-cyan-500/20 to-green-500/20 p-2 backdrop-blur-sm">
                  <Sparkles className="h-6 w-6 text-cyan-500" />
                </div>
              </motion.div>
            </motion.div>
            
            <p className="text-gray-600 text-lg">
              Transform your ideas into stunning presentations with AI
            </p>
          </motion.div>
          
          {/* Login Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <LoginForm />
          </motion.div>
          
          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-500">
              New to Zent?{' '}
              <Link href="/" className="text-purple-600 hover:text-purple-700 font-medium transition-colors">
                Learn more
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
