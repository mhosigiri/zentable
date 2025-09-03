import { tool } from 'ai';
import { getSlideById, getSlidesByPresentation } from '@/lib/slides';
import { generateUUID } from '@/lib/uuid';
import { themes, getThemeById } from '@/lib/themes';
import { z } from 'zod';
import { fetchGeneratedSlideForServer } from './generation';

// Approval constants for HITL
export const APPROVAL = {
  YES: 'Yes, confirmed.',
  NO: 'No, denied.',
} as const;

export const getSlideContent = tool({
  description: "Get a slide's full HTML content, title, and template type for 'view only' requests.",
  inputSchema: z.object({
    slideId: z.string().describe("The ID of the slide to get content for"),
  }),
  execute: async ({ slideId }) => {
    console.log("🔍 Tool called: getSlideContent");
    console.log("📝 SlideID:", slideId);

    try {
      const slide = await getSlideById(slideId);

      if (!slide) {
        console.error("❌ Slide not found with ID:", slideId);
        return {
          success: false,
          error: "Slide not found",
          slideId,
          message: "The requested slide could not be found. Please check the slide ID or try a different slide.",
        };
      }

      console.log("✅ Found slide - returning content for display");

      // Get slide position for better context
      const allSlides = await getSlidesByPresentation(slide.presentation_id);
      const slidePosition = allSlides.findIndex(s => s.id === slideId) + 1;
      const totalSlides = allSlides.length;

      return {
        success: true,
        slideId: slide.id,
        slidePosition,
        totalSlides,
        title: slide.title,
        templateType: slide.template_type,
        content: slide.content,
        imageUrl: slide.image_url,
        imagePrompt: slide.image_prompt,
        contentLength: slide.content?.length || 0,
        hasImage: !!slide.image_url,
        message: `Successfully retrieved Slide ${slidePosition} of ${totalSlides}. The slide uses the "${slide.template_type}" template and contains ${slide.content?.length || 0} characters of content.`,
      };
    } catch (error) {
      console.error("❌ Exception in getSlideContent tool:", error);
      return {
        success: false,
        error: "An exception occurred when getting slide content",
        slideId,
        message: "There was an error retrieving the slide content. Please try again.",
      };
    }
  },
});

// HITL: This tool requires human approval - NO execute function
export const updateSlideContent = tool({
  description: 'Update the content of a slide with new HTML content. This requires user approval.',
  inputSchema: z.object({
    slideId: z.string().describe('The ID of the slide to update'),
    content: z.string().describe('The new HTML content for the slide'),
  }),
  // NO execute function - requires human approval
  // In AI SDK v5, tools without execute functions automatically require approval
});

// HITL: This tool requires human approval - NO execute function  
export const createSlide = tool({
  description: 'Create a new slide with specified template type and content. This requires user approval.',
  inputSchema: z.object({
    presentationId: z.string().describe('The ID of the presentation to add the slide to'),
    templateType: z.string().describe('The template type for the new slide'),
    title: z.string().describe('The title for the new slide'),
    content: z.string().optional().describe('Optional content for the new slide'),
    position: z.number().optional().describe('Optional position to insert the slide (0-based)'),
  }),
  // NO execute function - requires human approval
});

// HITL: This tool requires human approval - NO execute function
export const deleteSlide = tool({
  description: 'Delete a slide from the presentation. This requires user approval.',
  inputSchema: z.object({
    slideId: z.string().describe('The ID of the slide to delete'),
  }),
  // NO execute function - requires human approval
});

// HITL: This tool requires human approval - NO execute function
export const duplicateSlide = tool({
  description: 'Create a copy of an existing slide. This requires user approval.',
  inputSchema: z.object({
    slideId: z.string().describe('The ID of the slide to duplicate'),
    position: z.number().optional().describe('Optional position to insert the duplicated slide'),
  }),
  // NO execute function - requires human approval
});

// HITL: This tool requires human approval - NO execute function
export const moveSlide = tool({
  description: 'Move a slide to a new position in the presentation. This requires user approval.',
  inputSchema: z.object({
    slideId: z.string().describe('The ID of the slide to move'),
    newPosition: z.number().describe('The new position for the slide (0-based)'),
  }),
  // NO execute function - requires human approval
});

// HITL: This tool requires human approval - NO execute function
export const changeSlideTemplate = tool({
  description: 'Change the template type of an existing slide while preserving content. This requires user approval.',
  inputSchema: z.object({
    slideId: z.string().describe('The ID of the slide to change template for'),
    newTemplateType: z.string().describe('The new template type'),
    preserveContent: z.boolean().optional().describe('Whether to preserve existing content during template change'),
  }),
  // NO execute function - requires human approval
});

// HITL: This tool requires human approval - NO execute function
export const updateSlideImage = tool({
  description: 'Update or generate a new image for a slide using an image prompt. This requires user approval.',
  inputSchema: z.object({
    slideId: z.string().describe('The ID of the slide to update image for'),
    imagePrompt: z.string().describe('The prompt to generate the image'),
    action: z.enum(['generate', 'remove']).describe('Whether to generate a new image or remove existing image'),
  }),
  // NO execute function - requires human approval
});

// HITL: This tool requires human approval - NO execute function
export const applyTheme = tool({
  description: 'Apply a theme to the entire presentation. This requires user approval.',
  inputSchema: z.object({
    presentationId: z.string().describe('The ID of the presentation to apply theme to'),
    themeId: z.string().describe('The ID of the theme to apply'),
  }),
  // NO execute function - requires human approval
});

// This tool runs automatically - has execute function
export const getSlideIdByNumber = tool({
  description: "Get the ID of a slide by its number in the presentation",
  inputSchema: z.object({
    presentationId: z.string().describe("The ID of the presentation"),
    slideNumber: z
      .number()
      .describe("The number of the slide (1-based index)"),
  }),
  execute: async ({ presentationId, slideNumber }) => {
    console.log("🔍 Tool called: getSlideIdByNumber");
    console.log("📝 PresentationID:", presentationId);
    console.log("📝 SlideNumber:", slideNumber);

    try {
      const slides = await getSlidesByPresentation(presentationId);

      if (!slides || slides.length === 0) {
        console.error("❌ No slides found for presentation:", presentationId);
        return {
          success: false,
          error: "No slides found for this presentation",
          presentationId,
          slideNumber,
          message: "No slides found for this presentation. Please check the presentation ID.",
        };
      }

      if (slideNumber < 1 || slideNumber > slides.length) {
        console.error("❌ Invalid slide number:", slideNumber, "for presentation with", slides.length, "slides");
        return {
          success: false,
          error: "Invalid slide number",
          presentationId,
          slideNumber,
          totalSlides: slides.length,
          message: `Invalid slide number ${slideNumber}. This presentation has ${slides.length} slides (numbered 1-${slides.length}).`,
        };
      }

      const slide = slides[slideNumber - 1]; // Convert to 0-based index
      console.log("✅ Found slide:", slide.id);

      return {
        success: true,
        slideId: slide.id,
        slideNumber,
        totalSlides: slides.length,
        slideTitle: slide.title,
        templateType: slide.template_type,
        message: `Found Slide ${slideNumber} of ${slides.length}: "${slide.title}" (ID: ${slide.id})`,
      };
    } catch (error) {
      console.error("❌ Exception in getSlideIdByNumber tool:", error);
      return {
        success: false,
        error: "An exception occurred when getting slide ID by number",
        presentationId,
        slideNumber,
        message: "There was an error finding the slide. Please try again.",
      };
    }
  },
});

export const createSlideWithAI = tool({
  description: 'Create a new slide with AI-generated content based on a title and bullet points.',
  inputSchema: z.object({
    presentationId: z.string().describe('The ID of the presentation to add the slide to'),
    templateType: z.string().describe('The template type for the new slide (e.g., "title-with-bullets", "image-and-text", "two-columns", etc.)'),
    title: z.string().describe('The title for the new slide - will be used to generate content'),
    bulletPoints: z.array(z.string()).describe('Key points to include in the slide content'),
    position: z.number().optional().describe('The position to insert the new slide at (0-indexed)'),
  }),
  execute: async ({ presentationId, templateType, title, bulletPoints, position }) => {
    try {
      console.log(`🎯 Creating slide with AI. Template: ${templateType}, Title: ${title}`);

      // Combine title and bullet points into a single prompt to align with UI behavior
      const prompt = `${title}\n\n${bulletPoints.map(bp => `- ${bp}`).join('\n')}`;

      const generatedData = await fetchGeneratedSlideForServer(
        { 
          title: prompt, // Use the combined prompt
          bulletPoints: [], // Send an empty array to ensure title and content are generated
          templateType 
        },
        { style: 'default', language: 'en', contentLength: 'medium', imageStyle: 'professional' }
      );

      const newSlide = {
        id: generateUUID(),
        presentation_id: presentationId,
        template_type: templateType,
        title: generatedData.title || title,
        content: generatedData.content || '',
        position: position,
        bulletPoints: generatedData.bulletPoints || bulletPoints,
        imagePrompt: generatedData.imagePrompt || null,
        imageUrl: null,
        isGeneratingImage: !!generatedData.imagePrompt,
        isHidden: false,
        isGenerating: false,
      };

      console.log(`✅ Slide creation successful with template: ${templateType}`);

      return {
        success: true,
        message: 'Slide creation proposed with AI-generated content. Ready to be added.',
        newSlide,
        requiresApproval: true,
      };
    } catch (error) {
      console.error('❌ Error creating slide with AI:', error);
      return {
        success: false,
        message: 'Failed to create slide with AI-generated content',
        error: String(error),
      };
    }
  },
});

export const slideTools = {
  getSlideContent: getSlideContent,
  updateSlideContent: updateSlideContent,
  getSlideIdByNumber: getSlideIdByNumber,
  createSlide: createSlide,
  deleteSlide: deleteSlide,
  duplicateSlide: duplicateSlide,
  moveSlide: moveSlide,
  applyTheme: applyTheme,
  updateSlideImage: updateSlideImage,
  changeSlideTemplate: changeSlideTemplate,
}; 