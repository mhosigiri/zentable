'use client';

import { LandingHeader } from '@/components/ui/landing-header';
import { Hero } from '@/components/ui/hero';
import { FeaturesSection } from '@/components/ui/features-section';
import { ShowcaseSection } from '@/components/ui/showcase-section';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      
      {/* Hero Section with Canvas Animation */}
      <Hero />
      
      {/* Features Section with Advanced Animations */}
      <FeaturesSection />
      
      {/* Showcase Section with Slide Examples */}
      <ShowcaseSection />
      
      {/* Footer */}
      <footer className="w-full bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white py-12 sm:py-20">
        <div className="w-full px-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                The Future of Presentations
              </span>
              <br />
              <span className="text-white">Starts Today</span>
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed">
              Join the revolution in presentation creation. Where artificial intelligence meets human creativity 
              to produce experiences that inspire, engage, and transform ideas into impact.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto mb-12 sm:mb-16">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-cyan-400 mb-2">∞</div>
                <div className="text-sm sm:text-base text-gray-300">Unlimited Creativity</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-2">10x</div>
                <div className="text-sm sm:text-base text-gray-300">Faster Production</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-2">100%</div>
                <div className="text-sm sm:text-base text-gray-300">Professional Quality</div>
              </div>
            </div>
            
            <div className="border-t border-gray-700 pt-6 sm:pt-8">
              <p className="text-sm sm:text-base text-gray-400">
                © 2024 Zentable. Empowering ideas through AI.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}