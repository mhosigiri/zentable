'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Sparkles, ChevronRight } from 'lucide-react';
import { PureMultimodalInput } from './multimodal-ai-chat-input';

interface SlideOption {
  text: string;
  slideId: string;
}

interface SlideOptionWithImage {
  text: string;
  slideId: string;
  imageUrl: string;
}

const slideOptions: SlideOptionWithImage[] = [
  {
    text: "The importance of plants",
    slideId: "85db442c-016b-409c-8083-0e4efed38222",
    imageUrl: "/assets/Trees.png"
  },
  {
    text: "The Science Behind the Sunrise", 
    slideId: "6fb99311-2792-4d02-abe4-e4c4728e918c",
    imageUrl: "/assets/Sunrise.png"
  },
  {
    text: "Discover Stanley Park",
    slideId: "c9473bfb-c308-4a88-942f-cea8f60ba604",
    imageUrl: "/assets/Stanley Park.png"
  },
  {
    text: "Gen Z Language Learning App",
    slideId: "gen-z-learning-demo",
    imageUrl: "/assets/Genz learning.png"
  }
];

// Types for the input component
interface Attachment {
  url: string;
  name: string;
  contentType: string;
  size: number;
}

interface UIMessage {
  id: string;
  content: string;
  role: string;
  attachments?: Attachment[];
}

export function InteractiveSlidePreview() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedSlide, setSelectedSlide] = useState<any>(null);
  const [generatingText, setGeneratingText] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [messages] = useState<UIMessage[]>([]);

  const handleOptionClick = async (option: SlideOptionWithImage) => {
    setIsGenerating(true);
    setGeneratingText(option.text);
    setSelectedSlide(null);

    try {
      // Simulate generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Instead of fetching from database, use the static image
      setSelectedSlide({
        text: option.text,
        imageUrl: option.imageUrl,
        slideId: option.slideId
      });
    } catch (error) {
      console.error('Error showing slide:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const resetPreview = () => {
    setSelectedSlide(null);
  };

  const handleSendMessage = useCallback(({ input }: { input: string; attachments: Attachment[] }) => {
    // Only allow selection from predefined options
    const exactMatch = slideOptions.find(option => 
      option.text.toLowerCase() === input.toLowerCase()
    );

    if (exactMatch) {
      handleOptionClick(exactMatch);
    }
    // If no exact match, do nothing (user must select from suggestions)
  }, []);

  const handleStopGenerating = useCallback(() => {
    setIsGenerating(false);
  }, []);

  // Create suggested actions based on slide options - add one more to make it 4 total
  const customSuggestedActions = slideOptions.map(option => ({
    title: '',
    label: `"${option.text}"`,
    action: option.text,
  }));

  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      <AnimatePresence mode="wait">
        {!selectedSlide && !isGenerating && (
          <motion.div
            key="options"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center"
          >
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-800 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Try It Live
            </div>
            
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Watch AI Create
              </span>
              <br />
              <span className="text-gray-900">Your Presentation</span>
            </h2>
            
            <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12 px-4">
              Select a topic from the suggestions below to see how Zentable transforms ideas into stunning slides.
            </p>

            {/* Custom Input Component */}
            <div className="max-w-2xl mx-auto">
              <PureMultimodalInput
                chatId="slide-preview"
                messages={messages}
                attachments={[]}
                setAttachments={() => {}}
                onSendMessage={handleSendMessage}
                onStopGenerating={handleStopGenerating}
                isGenerating={isGenerating}
                canSend={true}
                selectedVisibilityType="public"
                customSuggestedActions={customSuggestedActions}
                placeholder="Please select a topic from the suggestions above..."
                hideAttachments={true}
                readOnlyInput={true}
                className="text-base sm:text-lg"
              />
            </div>
          </motion.div>
        )}

        {isGenerating && (
          <motion.div
            key="generating"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 sm:py-20 px-4"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-6"
              >
                <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-purple-600" />
              </motion.div>
              
              <div className="space-y-4">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900">
                  Creating your presentation...
                </h3>
                <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto">
                  Generating slides for "{generatingText}"
                </p>
                
                <div className="flex justify-center">
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 1, 0.3]
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2
                        }}
                        className="w-2 h-2 bg-purple-500 rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {selectedSlide && (
          <motion.div
            key="slide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6 px-4"
          >
            <div className="text-center">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                ✨ Your slide is ready!
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 max-w-2xl mx-auto">
                This is how your slide looks with our AI generation: "{selectedSlide.text}"
              </p>
            </div>

            <div className="relative bg-gray-100 rounded-2xl p-4 sm:p-8 shadow-2xl">
              <div className="max-w-4xl mx-auto overflow-hidden rounded-xl">
                <img
                  src={selectedSlide.imageUrl}
                  alt={`Generated slide: ${selectedSlide.text}`}
                  className="w-full h-auto object-cover"
                  style={{ aspectRatio: '16/9' }}
                />
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={resetPreview}
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-200"
              >
                Try Another Topic
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}