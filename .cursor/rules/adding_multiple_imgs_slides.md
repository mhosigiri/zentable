# Adding Multiple Images to Slides: Developer Guide

This guide explains how to create new slide templates that support multiple images using our enhanced slide management system.

## Table of Contents
- [Background](#background)
- [System Architecture](#system-architecture)
- [Creating Multi-Image Templates](#creating-multi-image-templates)
- [Frontend Integration](#frontend-integration)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)

## Background

Our slide system has been enhanced to support multiple images per slide while maintaining backward compatibility with legacy slides. The system now uses a dedicated `slide_images` table to store image data, with various image types and positions.

## System Architecture

### Database Schema
- **slides**: Contains slide content and references to images
  - `primary_image_id`: FK to `slide_images` for quick access to main image
  - `has_multiple_images`: Boolean flag for slides with >1 image
  
- **slide_images**: Stores all image data
  - `id`: UUID primary key
  - `slide_id`: Reference to parent slide
  - `image_url`: URL to image (can be null if only prompt exists)
  - `image_prompt`: AI prompt that generated the image
  - `image_type`: Type of image ('primary', 'secondary', 'background', 'accent')
  - `position`: Integer for ordering multiple images
  - `aspect_ratio`: String representing image dimensions (e.g., '16:9')
  - `style_metadata`: JSON for additional styling info

- **slides_with_images**: View joining slides with their images

### Libraries and Utilities
- `lib/slide-images.ts`: Core functions for managing slide images
- `lib/migrate-images.ts`: Migration and validation utilities
- `hooks/useSlideImages.ts`: React hooks for frontend integration

## Creating Multi-Image Templates

### 1. Define Template Requirements

First, plan how your template will use multiple images:

```typescript
interface MultiImageTemplateConfig {
  name: string;           // e.g., 'side-by-side'
  imageTypes: {           // Define each image slot
    primary: {
      aspectRatio: string;  // e.g., '1:1', '16:9', '4:3'
      position: 'left' | 'right' | 'top' | 'bottom';
      required: boolean;
    },
    secondary?: {
      aspectRatio: string;
      position: 'left' | 'right' | 'top' | 'bottom';
      required: boolean;
    },
    background?: {
      aspectRatio: string;
      opacity?: number;
      required: boolean;
    }
  }
}
```

### 2. Create Template Component

Add a new template component in the appropriate directory:

```tsx
// components/slides/templates/SideBySideTemplate.tsx
import React from 'react';
import { SlideWithImages } from '@/lib/supabase';

interface SideBySideTemplateProps {
  slide: SlideWithImages;
  editable?: boolean;
}

export function SideBySideTemplate({ slide, editable = false }: SideBySideTemplateProps) {
  // Get typed images
  const primaryImage = slide.images?.find(img => img.image_type === 'primary');
  const secondaryImage = slide.images?.find(img => img.image_type === 'secondary');
  
  return (
    <div className="grid grid-cols-2 h-full">
      {/* Left side - Primary Image */}
      <div className="relative">
        {primaryImage ? (
          <img 
            src={primaryImage.image_url || '/placeholder.png'} 
            alt={slide.title}
            className="w-full h-full object-cover"
          />
        ) : editable ? (
          <div className="flex items-center justify-center h-full bg-gray-100">
            <p>Add primary image</p>
          </div>
        ) : null}
      </div>
      
      {/* Right side - Content + Secondary Image */}
      <div className="p-8 flex flex-col">
        <h3 className="text-2xl font-bold mb-4">{slide.title}</h3>
        
        <div className="mb-6">
          {slide.bullet_points?.map((point, i) => (
            <li key={i} className="mb-2">{point}</li>
          ))}
        </div>
        
        {secondaryImage && (
          <div className="mt-auto">
            <img 
              src={secondaryImage.image_url || '/placeholder.png'} 
              alt="Supporting visual"
              className="w-full max-h-48 object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}
```

### 3. Register Template in Template Selector

Update the template selector to include your new template:

```tsx
// components/slides/SlideTemplateSelector.tsx

// Import your new template
import { SideBySideTemplate } from './templates/SideBySideTemplate';

// In your template mapping
const templates = {
  // ... existing templates
  'side-by-side': SideBySideTemplate,
};
```

### 4. Update Prompt Schema

Update the prompt schema to support generating image prompts for multiple images:

```typescript
// lib/prompts/slide-prompts.ts
export const multiImagePromptSchema = z.object({
  primaryImagePrompt: z.string().min(10).max(1000),
  secondaryImagePrompt: z.string().optional(),
  backgroundImagePrompt: z.string().optional(),
});
```

### 5. Create Image Generation Handler

Implement a handler for generating multiple images:

```typescript
// In your slide editor component

import { useSlideImages } from '@/hooks/useSlideImages';

// In your component
const { addImage, updateImage, deleteImage, reorderImages, setPrimaryImage } = useSlideImages(slideId);

// Generate multiple images
const handleGenerateImages = async () => {
  const imagePrompts = [
    { prompt: primaryPrompt, position: 1, imageType: 'primary' },
    { prompt: secondaryPrompt, position: 2, imageType: 'secondary' }
  ].filter(p => p.prompt); // Filter out empty prompts
  
  if (imagePrompts.length === 0) return;
  
  setGenerating(true);
  
  try {
    const response = await fetch(`/api/slides/${slideId}/generate-images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imagePrompts }),
    });
    
    if (!response.ok) throw new Error('Failed to generate images');
    
    const data = await response.json();
    // Handle successful generation
    refreshSlide();
  } catch (error) {
    console.error('Error generating images:', error);
  } finally {
    setGenerating(false);
  }
};
```

## Frontend Integration

### Image Management UI

Example of an image management component:

```tsx
function SlideImageManager({ slideId }) {
  const { 
    images, 
    loading, 
    addImage, 
    deleteImage, 
    reorderImages, 
    setPrimaryImage 
  } = useSlideImages(slideId);

  return (
    <div className="p-4 border rounded">
      <h3 className="text-lg font-medium mb-4">Slide Images</h3>
      
      {loading ? (
        <p>Loading images...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {images.map((image) => (
              <div 
                key={image.id} 
                className={`relative border rounded p-2 ${
                  image.image_type === 'primary' ? 'ring-2 ring-blue-500' : ''
                }`}
              >
                {image.image_url && (
                  <img 
                    src={image.image_url} 
                    alt={image.image_prompt || 'Slide image'} 
                    className="w-full h-32 object-cover mb-2"
                  />
                )}
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => setPrimaryImage(image.id)}
                    className="text-xs px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Set as primary
                  </button>
                  <button 
                    onClick={() => deleteImage(image.id)}
                    className="text-xs px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
                
                <div className="text-xs mt-1">
                  Type: {image.image_type}
                </div>
              </div>
            ))}
          </div>
          
          <button 
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={() => {/* Show add image modal */}}
          >
            Add Image
          </button>
        </>
      )}
    </div>
  );
}
```

## API Reference

### Endpoints

- `GET /api/slides/[id]/images` - Get all images for a slide
- `POST /api/slides/[id]/images` - Add a new image
- `PUT /api/slides/[id]/images` - Bulk operations (reorder, set primary)
- `PUT /api/slides/[id]/images/[imageId]` - Update individual image
- `DELETE /api/slides/[id]/images/[imageId]` - Delete individual image
- `POST /api/slides/[id]/generate-images` - Generate multiple images from prompts

### Hooks

- `useSlideImages(slideId)` - Hook for image operations
- `useSlideWithImages(slideId)` - Hook to get slide with all images

## Best Practices

1. **Image Types**: Use consistent image types across templates
   - `primary`: Main slide image
   - `secondary`: Supporting visuals
   - `background`: Full-slide background images
   - `accent`: Decorative elements

2. **Responsive Design**: Ensure templates work with variable image dimensions

3. **Fallbacks**: Always handle missing images gracefully

4. **Lazy Loading**: For slides with multiple images, consider lazy loading

5. **Primary Image**: Always designate one image as primary for backward compatibility

6. **Image Position**: Use the position field to maintain consistent ordering

7. **Migration**: When creating new templates, consider how existing slides might convert to them