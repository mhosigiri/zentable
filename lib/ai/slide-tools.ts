import { tool } from 'ai';
import { getSlideById, updateSlideContent, getSlidesByPresentation } from '@/lib/slides';
import { db } from '@/lib/database';
import { generateUUID } from '@/lib/uuid';
import { themes, getThemeById } from '@/lib/themes';
import { z } from 'zod';
import { fetchGeneratedSlideForServer } from './generation';

export const getSlideContent = tool({
  description: "Get a slide's full HTML content, title, and template type for 'view only' requests.",
  parameters: z.object({
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
        };
      }

      console.log("✅ Found slide - returning content for display");

      return {
        success: true,
        slideId: slide.id,
        title: slide.title,
        templateType: slide.template_type,
        content: slide.content,
        message: "Slide content retrieved successfully. Please display it to the user in the chat.",
      };
    } catch (error) {
      console.error("❌ Exception in getSlideContent tool:", error);
      return {
        success: false,
        error: "An exception occurred when getting slide content",
        slideId,
      };
    }
  },
});

// Define the updateSlideContent tool using the AI SDK tool helper
const updateSlideContentTool = tool({
  description: 'Update the content of a slide with new HTML content',
  parameters: z.object({
    slideId: z.string().describe('The ID of the slide to update'),
    content: z.string().describe('The new HTML content for the slide'),
  }),
  execute: async ({ slideId, content }) => {
    console.log('🔍 Tool called: updateSlideContent');
    console.log(`📝 SlideID: ${slideId}`);
    console.log(`📄 Content length: ${content.length} characters`);
    console.log(`📄 Content preview: ${content.substring(0, 100)}...`);
    
    try {
      // Get existing slide first
      console.log('🔍 Fetching slide from database...');
      const slide = await getSlideById(slideId);
      
      if (!slide) {
        console.warn('⚠️ Slide not found with ID:', slideId);
        return {
          success: false,
          error: "Slide not found",
          slideId
        };
      }
      
      console.log('✅ Found slide:');
      console.log(`   - ID: ${slide.id}`);
      console.log(`   - Original content length: ${slide.content?.length || 0} chars`);
      console.log(`   - Original content preview: ${slide.content?.substring(0, 100) || '(empty)'}...`);
      
      // Update the slide content
      console.log('🔄 Calling updateSlideContent function...');
      const success = await updateSlideContent(slideId, content);
      
      if (success) {
        console.log('✅ Database update successful!');
        
        // Verify the update by fetching the slide again
        console.log('🔍 Verifying update by fetching slide again...');
        const updatedSlide = await getSlideById(slideId);
        
        if (updatedSlide && updatedSlide.content === content) {
          console.log('✅ Verification successful - content matches update');
        } else if (updatedSlide) {
          console.warn('⚠️ Verification issue - content doesn\'t match update');
          console.log(`   - Updated content length: ${updatedSlide.content?.length || 0}`);
          console.log(`   - Expected content length: ${content.length}`);
        } else {
          console.error('❌ Verification failed - could not fetch updated slide');
        }
        
        return {
          success: true,
          slideId,
          message: "Slide content updated successfully"
        };
      } else {
        console.error('❌ Database update returned false');
        return {
          success: false,
          error: "Failed to update slide content",
          slideId
        };
      }
    } catch (error) {
      console.error('❌ Exception in updateSlideContent tool:', error);
      return {
        success: false,
        error: "An exception occurred when updating slide content",
        slideId: slideId
      };
    }
  },
});

export const proposeSlideUpdate = tool({
  description:
    "Propose an update to slide content with improved HTML. This will show a preview for user approval.\n\nIMPORTANT: After calling this tool, DO NOT provide any follow-up messages. The user will see an approval interface.",
  parameters: z.object({
    slideId: z.string().describe("The ID of the slide to update"),
    content: z.string().describe("The new HTML content for the slide"),
  }),
  execute: async ({ slideId, content }) => {
    console.log("🔍 Tool called: updateSlideContent (PREVIEW MODE)");
    console.log("📝 SlideID:", slideId);
    console.log("📄 Content length:", content.length, "characters");
    console.log("📄 Content preview:", content.substring(0, 100) + "...");

    try {
      // Get the current slide to show what we're updating
      console.log("🔍 Fetching slide from database...");
      const currentSlide = await getSlideById(slideId);

      if (!currentSlide) {
        console.error("❌ Slide not found with ID:", slideId);
        return {
          success: false,
          error: "Slide not found",
          slideId,
        };
      }

      console.log("✅ Found slide - returning proposed changes for approval");

      // Return proposed changes without updating database
      return {
        success: true,
        message: "Slide content update proposed - awaiting approval",
        slideId,
        currentContent: currentSlide.content,
        proposedContent: content,
        contentLength: content.length,
        slideTitle: currentSlide.title,
        requiresApproval: true,
      };
    } catch (error) {
      console.error("❌ Exception in updateSlideContent tool:", error);
      return {
        success: false,
        error: "An exception occurred when proposing slide content update",
        slideId,
      };
    }
  },
});

export const getSlideIdByNumber = tool({
  description: "Get the ID of a slide by its number in the presentation",
  parameters: z.object({
    presentationId: z.string().describe("The ID of the presentation"),
    slideNumber: z
      .number()
      .describe("The number of the slide (1-based index)"),
  }),
  execute: async ({ presentationId, slideNumber }) => {
    console.log(`🔍 Tool called: getSlideIdByNumber`);
    console.log(`📝 PresentationID: ${presentationId}`);
    console.log(`📄 SlideNumber: ${slideNumber}`);

    try {
      // Get all slides for the presentation
      const slides = await getSlidesByPresentation(presentationId);

      if (!slides || slides.length === 0) {
        console.warn("⚠️ No slides found for presentation:", presentationId);
        return {
          success: false,
          error: "No slides found for this presentation",
          slideNumber,
        };
      }

      console.log(`✅ Found ${slides.length} slides in presentation`);

      // Slide numbers are 1-based, but array is 0-based
      const index = slideNumber - 1;
      if (index < 0 || index >= slides.length) {
        console.warn(
          `⚠️ Invalid slide number: ${slideNumber} (total slides: ${slides.length})`
        );
        return {
          success: false,
          error: `Invalid slide number. Please provide a number between 1 and ${slides.length}`,
          slideNumber,
        };
      }

      const slide = slides[index];
      console.log(`✅ Found slide at position ${slideNumber}:`);
      console.log(`   - ID: ${slide.id}`);
      console.log(`   - Type: ${slide.template_type}`);
      console.log(`   - Title: ${slide.title || "(no title)"}`);

      return {
        success: true,
        slideId: slide.id,
        slideNumber,
        templateType: slide.template_type,
        title: slide.title || null,
      };
    } catch (error) {
      console.error("❌ Exception in getSlideIdByNumber tool:", error);
      return {
        success: false,
        error: "An exception occurred when fetching slide ID",
        slideNumber,
      };
    }
  },
});

export const createSlide = tool({
  description: 'Create a new slide with a specific template and optional content.\n\nIMPORTANT: After calling this tool, DO NOT provide any follow-up messages. The user will see an approval interface.',
  parameters: z.object({
    presentationId: z.string().describe('The ID of the presentation to add the slide to'),
    templateType: z.string().describe('The template type for the new slide (e.g., "title-with-bullets")'),
    title: z.string().optional().describe('The title for the new slide'),
    content: z.string().optional().describe('The HTML content for the new slide'),
    position: z.number().optional().describe('The position to insert the new slide at (0-indexed)'),
  }),
  execute: async ({ presentationId, templateType, title, content, position }) => {
    const newSlide = {
      id: generateUUID(),
      presentation_id: presentationId,
      template_type: templateType,
      title: title || 'New Slide',
      content: content || '',
      position: position,
      // Ensure all other SlideData fields are present
      bulletPoints: [],
      imagePrompt: null,
      imageUrl: null,
      isGeneratingImage: false,
      isHidden: false,
      isGenerating: false,
    };

    return {
      success: true,
      message: 'Slide creation proposed. Ready to be added to UI.',
      newSlide,
      requiresApproval: true,
    };
  },
});

export const createSlideWithAI = tool({
  description: 'Create a new slide with AI-generated content based on a title and bullet points.\n\nIMPORTANT: After calling this tool, DO NOT provide any follow-up messages. The user will see an approval interface.',
  parameters: z.object({
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

export const deleteSlide = tool({
  description: 'Delete a slide from the presentation.\n\nIMPORTANT: After calling this tool, DO NOT provide any follow-up messages. The user will see an approval interface.',
  parameters: z.object({
    slideId: z.string().describe('The ID of the slide to delete'),
  }),
  execute: async ({ slideId }) => {
    // In a real scenario, we'd also need the position. For UI-first,
    // we'll assume the frontend can find the position from the ID.
    return {
      success: true,
      message: 'Slide deletion proposed.',
      slideId,
      requiresApproval: true,
    };
  },
});

export const duplicateSlide = tool({
  description: 'Duplicate an existing slide.\n\nIMPORTANT: After calling this tool, DO NOT provide any follow-up messages. The user will see an approval interface.',
  parameters: z.object({
    slideId: z.string().describe('The ID of the slide to duplicate'),
  }),
  execute: async ({ slideId }) => {
    const originalSlide = await getSlideById(slideId);
    if (!originalSlide) {
      return { success: false, error: 'Original slide not found' };
    }

    const duplicatedSlide = {
      ...originalSlide,
      id: generateUUID(), // New ID for the duplicated slide
    };

    return {
      success: true,
      message: 'Slide duplication proposed.',
      duplicatedSlide,
      originalSlideId: slideId,
      requiresApproval: true,
    };
  },
});

export const moveSlide = tool({
  description: 'Move a slide to a new position.\n\nIMPORTANT: After calling this tool, DO NOT provide any follow-up messages. The user will see an approval interface.',
  parameters: z.object({
    slideId: z.string().describe('The ID of the slide to move'),
    newPosition: z.number().describe('The new position for the slide (0-indexed)'),
  }),
  execute: async ({ slideId, newPosition }) => {
    return {
      success: true,
      message: 'Slide move proposed.',
      slideId,
      newPosition,
      requiresApproval: true,
    };
  },
});

const themeListForDescription = themes
  .map(theme => `- ${theme.name} (ID: ${theme.id})`)
  .join('\n');

export const applyTheme = tool({
  description: `Apply a theme to the presentation. The user can specify a theme by name. Use the following list to find the correct theme ID. Available themes:\n${themeListForDescription}\n\nIMPORTANT: After calling this tool, DO NOT provide any follow-up messages. The user will see an approval interface.`,
  parameters: z.object({
    themeId: z.string().describe('The ID of the theme to apply from the list in the description.'),
  }),
  execute: async ({ themeId }) => {
    console.log('🎨 applyTheme tool called with themeId:', themeId);
    const theme = getThemeById(themeId);
    if (!theme) {
      console.log('❌ Theme not found:', themeId);
      return { success: false, error: 'Theme not found' };
    }
    console.log('✅ Theme found:', theme.name);
    return {
      success: true,
      message: `Theme "${theme.name}" proposed.`,
      themeId: theme.id,
      themeName: theme.name,
      requiresApproval: true,
    };
  },
});

export const updateSlideImage = tool({
  description: 'Generate or update the image for a slide\n\nIMPORTANT: After calling this tool, DO NOT provide any follow-up messages. The user will see an approval interface.',
  parameters: z.object({
    slideId: z.string().describe('The ID of the slide to update the image for'),
    imagePrompt: z.string().describe('The prompt to generate a new image'),
  }),
  execute: async ({ slideId, imagePrompt }) => {
    return {
      success: true,
      message: 'Slide image update proposed.',
      slideId,
      imagePrompt,
      requiresApproval: true,
    };
  },
});

export const changeSlideTemplate = tool({
  description: 'Change the template of a specific slide.\n\nIMPORTANT: After calling this tool, DO NOT provide any follow-up messages. The user will see an approval interface.',
  parameters: z.object({
    slideId: z.string().describe('The ID of the slide to change'),
    newTemplateType: z.string().describe('The new template type for the slide'),
  }),
  execute: async ({ slideId, newTemplateType }) => {
    // We can add validation for templateType if needed
    return {
      success: true,
      message: 'Slide template change proposed.',
      slideId,
      newTemplateType,
      requiresApproval: true,
    };
  },
});

export const slideTools = {
  getSlideContent: getSlideContent,
  updateSlideContent: updateSlideContentTool,
  proposeSlideUpdate: proposeSlideUpdate,
  getSlideIdByNumber: getSlideIdByNumber,
  createSlide: createSlide,
  createSlideWithAI: createSlideWithAI,
  deleteSlide: deleteSlide,
  duplicateSlide: duplicateSlide,
  moveSlide: moveSlide,
  applyTheme: applyTheme,
  updateSlideImage: updateSlideImage,
  changeSlideTemplate: changeSlideTemplate,
}; 