'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BorderBeam } from '@/components/ui/border-beam';
import { renderCanvas } from '@/components/ui/canvas';
import { motion } from 'framer-motion';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Page({ searchParams }: { searchParams: Promise<{ error: string }> }) {
  const [params, setParams] = useState<{ error: string } | null>(null);

  useEffect(() => {
    renderCanvas();
    
    searchParams.then(setParams);
  }, [searchParams]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Canvas Background */}
      <canvas
        className="pointer-events-none absolute inset-0 mx-auto"
        id="canvas"
      ></canvas>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-900/10 via-orange-900/10 to-yellow-900/10" />
      
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
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="relative overflow-hidden bg-white/80 backdrop-blur-sm border-white/20 shadow-2xl">
              <BorderBeam size={250} duration={12} colorFrom="#EF4444" colorTo="#F59E0B" />
              
              <CardHeader className="text-center space-y-4">
                <div className="flex items-center justify-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 text-white flex items-center justify-center mb-4">
                    <AlertTriangle className="h-6 w-6" />
                  </div>
                </div>
                
                <CardTitle className="text-2xl text-gray-900">
                  Oops! Something went wrong
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-6 text-center">
                <div className="p-4 rounded-lg bg-red-50 border border-red-200">
                  {params?.error ? (
                    <p className="text-sm text-red-600">
                      <strong>Error:</strong> {params.error}
                    </p>
                  ) : (
                    <p className="text-sm text-red-600">
                      An unexpected error occurred during authentication.
                    </p>
                  )}
                </div>
                
                <p className="text-gray-600">
                  Don&apos;t worry! Let&apos;s get you back on track to creating amazing presentations.
                </p>
                
                <div className="space-y-3">
                  <Link href="/auth/login">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                      Try Again
                    </Button>
                  </Link>
                  
                  <Link href="/">
                    <Button variant="outline" className="w-full">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
