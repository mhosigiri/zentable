# Video Script and Audio Generation Implementation Guide

## Overview

This guide provides detailed instructions for implementing video script generation and text-to-speech (TTS) audio features for the presentation application. The implementation is designed to be modular, scalable, and optimized for cost efficiency.

## Core Features

1. **Video Script Generation**: Automatically generate presenter scripts for each slide during slide creation
2. **On-Demand Audio Generation**: Generate TTS audio only when user requests "Video Overview" mode
3. **Smart Caching**: Store generated audio files to avoid regeneration
4. **Multi-Provider Support**: Modular architecture supporting multiple TTS providers
5. **Change Detection**: Only regenerate audio when scripts are modified

## Database Schema Updates

### 1. Update `slides` Table

Add the following columns to the existing `slides` table:

```sql
ALTER TABLE slides
ADD COLUMN video_script TEXT,
ADD COLUMN video_script_updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN video_script_hash VARCHAR(64);

-- Create an index for efficient hash lookups
CREATE INDEX idx_slides_video_script_hash ON slides(video_script_hash);
```

### 2. Create `slide_audio_files` Table

Create a new table to store audio file metadata:

```sql
CREATE TABLE slide_audio_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slide_id UUID NOT NULL REFERENCES slides(id) ON DELETE CASCADE,
  presentation_id UUID NOT NULL REFERENCES presentations(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'groq', 'openai', 'elevenlabs'
  provider_model VARCHAR(100), -- 'distil-whisper-large-v3-en'
  language VARCHAR(10) NOT NULL DEFAULT 'en',
  voice_id VARCHAR(100) NOT NULL,
  audio_url TEXT NOT NULL,
  duration_seconds FLOAT,
  file_size_bytes INTEGER,
  script_hash VARCHAR(64) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  
  -- Ensure unique audio per slide/provider/voice/script combination
  UNIQUE(slide_id, provider, voice_id, script_hash)
);

-- Create indexes for efficient lookups
CREATE INDEX idx_slide_audio_files_lookup 
ON slide_audio_files(slide_id, provider, voice_id, script_hash);

CREATE INDEX idx_slide_audio_files_presentation 
ON slide_audio_files(presentation_id);
```

### 3. Supabase Storage Bucket Setup

Create a storage bucket for audio files:

```sql
-- Run in Supabase SQL Editor
INSERT INTO storage.buckets (id, name, public)
VALUES ('presentation-audio', 'presentation-audio', true);

-- Set up RLS policies for the bucket
CREATE POLICY "Authenticated users can upload audio"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'presentation-audio');

CREATE POLICY "Anyone can view audio"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'presentation-audio');

CREATE POLICY "Authenticated users can delete their audio"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'presentation-audio' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## API Implementation

### 1. Update `/app/api/generate-slide/route.ts`

Add `videoScript` to all template schemas. Here's an example for one schema:

```typescript
// Add to each schema definition
const BlankCardSchema = z.object({
  content: z.string().describe('Complete HTML content...'),
  videoScript: z.string().describe('Natural speaking script for presenting this slide. Write conversationally as if speaking to an audience. Include transitions, emphasis, and pauses. Target 30-60 seconds of speaking time. Do not include stage directions.')
});

// Update all other schemas similarly:
// ImageAndTextSchema, TwoColumnsSchema, BulletsSchema, etc.
```

Update the system prompt to include video script generation:

```typescript
const systemPrompt = `${existingPrompt}

VIDEO SCRIPT REQUIREMENTS:
- Generate a natural, conversational script for presenting this slide verbally
- Write in first person as the presenter speaking to an audience
- Include smooth transitions between points
- Add natural emphasis and pauses where appropriate
- Target 30-60 seconds of speaking time per slide
- Match the ${writingStyle} tone of the presentation
- Do not include stage directions or [pause] markers - write naturally
- Connect this slide's content to the overall presentation narrative`;
```

### 2. Create `/app/api/generate-audio/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { withCreditCheck } from '@/lib/credits';
import { TTSProviderFactory } from '@/lib/tts/factory';
import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds timeout for audio generation

interface GenerateAudioRequest {
  presentationId: string;
  slideIds?: string[];
  provider: 'groq' | 'openai' | 'elevenlabs';
  voice: string;
  language: string;
  regenerate?: boolean;
}

export async function POST(req: Request) {
  try {
    const body: GenerateAudioRequest = await req.json();
    const { presentationId, slideIds, provider, voice, language, regenerate } = body;

    // Validate request
    if (!presentationId || !provider || !voice) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user from session
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user owns the presentation
    const { data: presentation, error: presentationError } = await supabase
      .from('presentations')
      .select('id, user_id')
      .eq('id', presentationId)
      .single();

    if (presentationError || !presentation || presentation.user_id !== user.id) {
      return Response.json({ error: 'Presentation not found' }, { status: 404 });
    }

    // Get slides to process
    let slidesQuery = supabase
      .from('slides')
      .select('id, video_script, video_script_hash, order_index')
      .eq('presentation_id', presentationId)
      .order('order_index');

    if (slideIds && slideIds.length > 0) {
      slidesQuery = slidesQuery.in('id', slideIds);
    }

    const { data: slides, error: slidesError } = await slidesQuery;

    if (slidesError || !slides || slides.length === 0) {
      return Response.json({ error: 'No slides found' }, { status: 404 });
    }

    // Check credits (1 credit per slide for audio generation)
    const creditResult = await withCreditCheck(user.id, 'audio_generate', {
      presentationId,
      slideCount: slides.length,
      provider,
      voice,
      language
    });

    if (!creditResult.success) {
      return Response.json({ 
        error: creditResult.error,
        creditsRequired: slides.length,
        currentBalance: creditResult.currentBalance
      }, { status: 402 });
    }

    // Initialize TTS provider
    const ttsProvider = TTSProviderFactory.create(provider);
    
    // Process each slide
    const results = [];
    
    for (const slide of slides) {
      if (!slide.video_script) {
        results.push({
          slideId: slide.id,
          error: 'No video script available'
        });
        continue;
      }

      // Calculate script hash
      const scriptHash = createHash('sha256')
        .update(slide.video_script)
        .digest('hex');

      // Update hash in database if needed
      if (scriptHash !== slide.video_script_hash) {
        await supabase
          .from('slides')
          .update({ video_script_hash: scriptHash })
          .eq('id', slide.id);
      }

      // Check for existing audio
      if (!regenerate) {
        const { data: existingAudio } = await supabase
          .from('slide_audio_files')
          .select('audio_url, duration_seconds')
          .eq('slide_id', slide.id)
          .eq('provider', provider)
          .eq('voice_id', voice)
          .eq('script_hash', scriptHash)
          .single();

        if (existingAudio) {
          results.push({
            slideId: slide.id,
            audioUrl: existingAudio.audio_url,
            duration: existingAudio.duration_seconds,
            cached: true
          });
          continue;
        }
      }

      try {
        // Generate audio
        const audioResult = await ttsProvider.generateAudio(slide.video_script, {
          voice,
          language,
          speed: 1.0
        });

        // Upload to Supabase Storage
        const fileName = `${presentationId}/${slide.id}/${provider}_${voice}_${scriptHash}.mp3`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('presentation-audio')
          .upload(fileName, audioResult.audioBuffer, {
            contentType: 'audio/mpeg',
            upsert: true
          });

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('presentation-audio')
          .getPublicUrl(fileName);

        // Save metadata
        const { error: dbError } = await supabase
          .from('slide_audio_files')
          .upsert({
            slide_id: slide.id,
            presentation_id: presentationId,
            provider,
            provider_model: audioResult.metadata?.model,
            language,
            voice_id: voice,
            audio_url: publicUrl,
            duration_seconds: audioResult.duration,
            file_size_bytes: audioResult.audioBuffer.length,
            script_hash: scriptHash,
            metadata: audioResult.metadata
          }, {
            onConflict: 'slide_id,provider,voice_id,script_hash'
          });

        if (dbError) throw dbError;

        results.push({
          slideId: slide.id,
          audioUrl: publicUrl,
          duration: audioResult.duration,
          cached: false
        });

      } catch (error) {
        console.error(`Error generating audio for slide ${slide.id}:`, error);
        results.push({
          slideId: slide.id,
          error: 'Failed to generate audio'
        });
      }
    }

    return Response.json({
      success: true,
      results,
      creditsRemaining: creditResult.newBalance
    });

  } catch (error) {
    console.error('Error in generate-audio:', error);
    return Response.json(
      { error: 'Failed to generate audio' },
      { status: 500 }
    );
  }
}
```

### 3. Create `/app/api/slides/[slideId]/video-script/route.ts`

```typescript
import { createClient } from '@/lib/supabase/server';
import { createHash } from 'crypto';

export async function PUT(
  req: Request,
  { params }: { params: { slideId: string } }
) {
  try {
    const { videoScript, regenerateAudio } = await req.json();
    const { slideId } = params;

    if (!videoScript) {
      return Response.json({ error: 'Video script is required' }, { status: 400 });
    }

    // Get user from session
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify user owns the slide
    const { data: slide, error: slideError } = await supabase
      .from('slides')
      .select('id, presentation_id, presentations!inner(user_id)')
      .eq('id', slideId)
      .single();

    if (slideError || !slide || slide.presentations.user_id !== user.id) {
      return Response.json({ error: 'Slide not found' }, { status: 404 });
    }

    // Calculate new hash
    const scriptHash = createHash('sha256')
      .update(videoScript)
      .digest('hex');

    // Update slide
    const { error: updateError } = await supabase
      .from('slides')
      .update({
        video_script: videoScript,
        video_script_hash: scriptHash,
        video_script_updated_at: new Date().toISOString()
      })
      .eq('id', slideId);

    if (updateError) throw updateError;

    // If requested, mark audio for regeneration by deleting existing entries
    if (regenerateAudio) {
      await supabase
        .from('slide_audio_files')
        .delete()
        .eq('slide_id', slideId);
    }

    return Response.json({
      success: true,
      scriptHash
    });

  } catch (error) {
    console.error('Error updating video script:', error);
    return Response.json(
      { error: 'Failed to update video script' },
      { status: 500 }
    );
  }
}
```

## TTS Provider Implementation

### 1. Create `/lib/tts/types.ts`

```typescript
export interface TTSProvider {
  name: string;
  generateAudio(text: string, options: TTSOptions): Promise<AudioResult>;
  getVoices(): Promise<Voice[]>;
  estimateCost(text: string): number;
  estimateDuration(text: string): number;
}

export interface TTSOptions {
  voice: string;
  language: string;
  speed?: number;
  pitch?: number;
}

export interface AudioResult {
  audioBuffer: Buffer;
  duration: number;
  format: 'mp3' | 'wav';
  metadata: Record<string, any>;
}

export interface Voice {
  id: string;
  name: string;
  language: string;
  gender?: 'male' | 'female' | 'neutral';
  preview?: string;
}
```

### 2. Create `/lib/tts/providers/groq.ts`

```typescript
import { TTSProvider, TTSOptions, AudioResult, Voice } from '../types';

export class GroqTTSProvider implements TTSProvider {
  name = 'groq';
  private apiKey: string;

  constructor() {
    if (!process.env.GROQ_API_KEY) {
      throw new Error('GROQ_API_KEY is not set');
    }
    this.apiKey = process.env.GROQ_API_KEY;
  }

  async generateAudio(text: string, options: TTSOptions): Promise<AudioResult> {
    const response = await fetch('https://api.groq.com/openai/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'distil-whisper-large-v3-en',
        input: text,
        voice: options.voice || 'alloy',
        response_format: 'mp3',
        speed: options.speed || 1.0
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Groq TTS API error: ${error}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const duration = this.estimateDuration(text);

    return {
      audioBuffer: Buffer.from(audioBuffer),
      duration,
      format: 'mp3',
      metadata: {
        provider: 'groq',
        model: 'distil-whisper-large-v3-en',
        voice: options.voice,
        language: options.language
      }
    };
  }

  async getVoices(): Promise<Voice[]> {
    // Groq voices based on documentation
    return [
      { id: 'alloy', name: 'Alloy', language: 'en', gender: 'neutral' },
      { id: 'echo', name: 'Echo', language: 'en', gender: 'male' },
      { id: 'fable', name: 'Fable', language: 'en', gender: 'neutral' },
      { id: 'onyx', name: 'Onyx', language: 'en', gender: 'male' },
      { id: 'nova', name: 'Nova', language: 'en', gender: 'female' },
      { id: 'shimmer', name: 'Shimmer', language: 'en', gender: 'female' }
    ];
  }

  estimateCost(text: string): number {
    // Groq pricing: $0.02 per 1M characters
    const characters = text.length;
    return (characters / 1000000) * 0.02;
  }

  estimateDuration(text: string): number {
    // Rough estimate: 150 words per minute
    const words = text.split(/\s+/).length;
    return (words / 150) * 60; // seconds
  }
}
```

### 3. Create `/lib/tts/factory.ts`

```typescript
import { TTSProvider } from './types';
import { GroqTTSProvider } from './providers/groq';
// Import future providers here
// import { OpenAITTSProvider } from './providers/openai';
// import { ElevenLabsTTSProvider } from './providers/elevenlabs';

export class TTSProviderFactory {
  private static providers: Map<string, TTSProvider> = new Map();

  static {
    // Register providers
    this.registerProvider('groq', new GroqTTSProvider());
    // this.registerProvider('openai', new OpenAITTSProvider());
    // this.registerProvider('elevenlabs', new ElevenLabsTTSProvider());
  }

  static registerProvider(name: string, provider: TTSProvider) {
    this.providers.set(name, provider);
  }

  static create(name: string): TTSProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new Error(`TTS provider '${name}' not found`);
    }
    return provider;
  }

  static getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }
}
```

## Frontend Implementation

### 1. Update Slide Component

Add video script display and edit functionality to your slide editor component:

```typescript
// components/slides/VideoScriptButton.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Mic, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface VideoScriptButtonProps {
  slideId: string;
  initialScript?: string;
  onScriptUpdate?: (script: string) => void;
}

export function VideoScriptButton({ 
  slideId, 
  initialScript = '', 
  onScriptUpdate 
}: VideoScriptButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [script, setScript] = useState(initialScript);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/slides/${slideId}/video-script`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          videoScript: script,
          regenerateAudio: true 
        })
      });

      if (!response.ok) throw new Error('Failed to save script');

      toast({
        title: 'Script saved',
        description: 'Audio will be regenerated on next preview'
      });

      if (onScriptUpdate) onScriptUpdate(script);
      setIsOpen(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save script',
        variant: 'destructive'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const wordCount = script.split(/\s+/).filter(word => word.length > 0).length;
  const estimatedSeconds = Math.round((wordCount / 150) * 60);

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="rounded-full"
        onClick={() => setIsOpen(true)}
      >
        <Mic className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Video Script</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <Textarea
              value={script}
              onChange={(e) => setScript(e.target.value)}
              placeholder="Enter the script for presenting this slide..."
              className="min-h-[200px] resize-none"
            />
            
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{wordCount} words</span>
              <span>~{estimatedSeconds} seconds</span>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="mr-2 h-4 w-4" />
                Save Script
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
```

### 2. Update Presentation Mode

Add Video Overview option to presentation mode:

```typescript
// components/presentation/VideoOverviewMode.tsx
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface VideoOverviewModeProps {
  presentationId: string;
  slides: Array<{
    id: string;
    content: string;
    videoScript?: string;
  }>;
  onSlideChange: (index: number) => void;
}

export function VideoOverviewMode({ 
  presentationId, 
  slides, 
  onSlideChange 
}: VideoOverviewModeProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioUrls, setAudioUrls] = useState<Record<string, string>>({});
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [provider, setProvider] = useState('groq');
  const [voice, setVoice] = useState('alloy');
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const generateAudio = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          presentationId,
          provider,
          voice,
          language: 'en'
        })
      });

      if (!response.ok) throw new Error('Failed to generate audio');

      const data = await response.json();
      const urls: Record<string, string> = {};
      
      data.results.forEach((result: any) => {
        if (result.audioUrl) {
          urls[result.slideId] = result.audioUrl;
        }
      });

      setAudioUrls(urls);
    } catch (error) {
      console.error('Error generating audio:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const playSlide = (index: number) => {
    if (!audioRef.current) return;
    
    const slide = slides[index];
    const audioUrl = audioUrls[slide.id];
    
    if (!audioUrl) {
      // Move to next slide if no audio
      if (index < slides.length - 1) {
        playSlide(index + 1);
      }
      return;
    }

    audioRef.current.src = audioUrl;
    audioRef.current.play();
    setCurrentSlideIndex(index);
    onSlideChange(index);
    setIsPlaying(true);
  };

  const handleAudioEnded = () => {
    if (currentSlideIndex < slides.length - 1) {
      playSlide(currentSlideIndex + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      if (audioRef.current.src) {
        audioRef.current.play();
      } else {
        playSlide(currentSlideIndex);
      }
      setIsPlaying(true);
    }
  };

  const skipToSlide = (direction: 'prev' | 'next') => {
    const newIndex = direction === 'prev' 
      ? Math.max(0, currentSlideIndex - 1)
      : Math.min(slides.length - 1, currentSlideIndex + 1);
    
    playSlide(newIndex);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      if (audio.duration) {
        setProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleAudioEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleAudioEnded);
    };
  }, [currentSlideIndex]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4">
      <audio ref={audioRef} />
      
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Provider and Voice Selection */}
        <div className="flex gap-4 items-center">
          <Select value={provider} onValueChange={setProvider}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="groq">Groq</SelectItem>
              <SelectItem value="openai" disabled>OpenAI (Coming Soon)</SelectItem>
              <SelectItem value="elevenlabs" disabled>ElevenLabs (Coming Soon)</SelectItem>
            </SelectContent>
          </Select>

          <Select value={voice} onValueChange={setVoice}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alloy">Alloy</SelectItem>
              <SelectItem value="echo">Echo</SelectItem>
              <SelectItem value="fable">Fable</SelectItem>
              <SelectItem value="onyx">Onyx</SelectItem>
              <SelectItem value="nova">Nova</SelectItem>
              <SelectItem value="shimmer">Shimmer</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            onClick={generateAudio} 
            disabled={isGenerating}
            variant="outline"
          >
            <Volume2 className="mr-2 h-4 w-4" />
            {isGenerating ? 'Generating...' : 'Generate Audio'}
          </Button>
        </div>

        {/* Playback Controls */}
        <div className="space-y-2">
          <Progress value={progress} className="h-2" />
          
          <div className="flex items-center justify-center gap-4">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => skipToSlide('prev')}
              disabled={currentSlideIndex === 0}
            >
              <SkipBack className="h-4 w-4" />
            </Button>

            <Button
              size="icon"
              onClick={togglePlayPause}
              disabled={Object.keys(audioUrls).length === 0}
            >
              {isPlaying ? (
                <Pause className="h-5 w-5" />
              ) : (
                <Play className="h-5 w-5" />
              )}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={() => skipToSlide('next')}
              disabled={currentSlideIndex === slides.length - 1}
            >
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Slide {currentSlideIndex + 1} of {slides.length}
          </div>
        </div>
      </div>
    </div>
  );
}
```

## Implementation Checklist

### Phase 1: Backend Foundation
- [ ] Run database migrations to add video_script columns to slides table
- [ ] Create slide_audio_files table
- [ ] Set up Supabase storage bucket for audio files
- [ ] Update generate-slide API to include videoScript in all schemas
- [ ] Update system prompt to generate video scripts

### Phase 2: Audio Generation
- [ ] Implement TTS provider interface and types
- [ ] Create Groq TTS provider implementation
- [ ] Build TTS provider factory
- [ ] Create generate-audio API endpoint
- [ ] Implement audio caching logic

### Phase 3: Script Management
- [ ] Create video-script update API endpoint
- [ ] Implement script hash calculation
- [ ] Add change detection for regeneration

### Phase 4: Frontend Integration
- [ ] Add VideoScriptButton component to slide editor
- [ ] Create script editing dialog
- [ ] Implement VideoOverviewMode component
- [ ] Add audio playback controls
- [ ] Integrate with presentation mode

### Phase 5: Testing & Optimization
- [ ] Test audio generation for various script lengths
- [ ] Verify caching works correctly
- [ ] Test regeneration on script changes
- [ ] Optimize audio file sizes
- [ ] Add error handling and retry logic

## Cost Considerations

### Groq TTS Pricing
- $0.02 per 1M characters
- Average slide script: ~150 words (~750 characters)
- Cost per slide: ~$0.000015
- 10-slide presentation: ~$0.00015

### Storage Costs
- Supabase storage: $0.021 per GB per month
- Average audio file: ~500KB per slide
- 10-slide presentation: ~5MB
- Storage cost negligible

### Credit System
- Charge 1 credit per slide for audio generation
- Only charge when generating new audio (not cached)
- Consider bulk generation discounts

## Future Enhancements

### Additional TTS Providers
1. **OpenAI TTS**
   - Higher quality voices
   - More language options
   - Higher cost

2. **ElevenLabs**
   - Voice cloning capabilities
   - Emotional control
   - Premium pricing

3. **Amazon Polly**
   - Cost-effective
   - Neural voices
   - SSML support

### Advanced Features
1. **SSML Support**: Add emphasis, pauses, pronunciation
2. **Voice Cloning**: Custom presenter voices
3. **Background Music**: Mix with TTS audio
4. **Multi-language**: Generate in multiple languages
5. **Export Options**: Download audio files
6. **Analytics**: Track playback completion rates

## Security Considerations

1. **File Access**: Ensure users can only access their own audio files
2. **Rate Limiting**: Prevent abuse of audio generation
3. **Input Validation**: Sanitize video scripts before TTS
4. **Storage Cleanup**: Delete old/unused audio files
5. **API Key Security**: Secure storage of provider API keys

## Error Handling

1. **Generation Failures**: Retry with exponential backoff
2. **Network Issues**: Cache audio locally during playback
3. **Provider Outages**: Fallback to alternative providers
4. **Script Too Long**: Split into chunks if needed
5. **Unsupported Languages**: Graceful degradation

## Performance Optimization

1. **Parallel Generation**: Generate multiple slides concurrently
2. **Progressive Loading**: Start playback while generating remaining slides
3. **CDN Integration**: Serve audio files through CDN
4. **Compression**: Use optimal audio compression settings
5. **Preloading**: Preload next slide's audio during playback

This implementation guide provides a complete roadmap for adding video script and audio generation features to the presentation application. The modular architecture ensures easy addition of new TTS providers while maintaining efficient caching and cost optimization.