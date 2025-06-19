'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from './button';
import { Presentation } from 'lucide-react';

export function LandingHeader() {
  return (
    <header className="border-b border-gray-200/20 backdrop-blur-sm bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Presentation className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">PresentAI</span>
          </div>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-600 hover:text-gray-900 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900 transition-colors">
              Pricing
            </Link>
            <Link href="#about" className="text-gray-600 hover:text-gray-900 transition-colors">
              About
            </Link>
            <Link href="/create">
              <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                Get Started
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
} 