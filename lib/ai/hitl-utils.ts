import {
  convertToModelMessages,
  Tool,
  ToolCallOptions,
  ToolSet,
  UIMessageStreamWriter,
  getToolName,
  isToolUIPart,
} from 'ai';
import { getSlideById, updateSlideContent, getSlidesByPresentation } from '@/lib/slides';
import { generateUUID } from '@/lib/uuid';
import { themes, getThemeById } from '@/lib/themes';

// Approval constants for HITL
export const APPROVAL = {
  YES: 'Yes, confirmed.',
  NO: 'No, denied.',
} as const;

function isValidToolName<K extends PropertyKey, T extends object>(
  key: K,
  obj: T,
): key is K & keyof T {
  return key in obj;
}

/**
 * Processes tool invocations where human input is required, executing tools when authorized.
 * This function handles the human-in-the-loop approval flow for slide operations.
 */
export async function processToolCalls<
  Tools extends ToolSet,
  ExecutableTools extends {
    [Tool in keyof Tools as Tools[Tool] extends { execute: Function }
      ? never
      : Tool]: Tools[Tool];
  },
>(
  {
    writer,
    messages,
  }: {
    tools: Tools; // used for type inference
    writer: UIMessageStreamWriter;
    messages: any[]; // Replace with your specific message type
  },
  executeFunctions: {
    [K in keyof Tools & keyof ExecutableTools]?: (
      args: ExecutableTools[K] extends Tool<infer P> ? P : never,
      context: ToolCallOptions,
    ) => Promise<any>;
  },
): Promise<any[]> {
  const lastMessage = messages[messages.length - 1];
  const parts = lastMessage.parts;
  if (!parts) return messages;

  const processedParts = await Promise.all(
    parts.map(async (part: any) => {
      // Only process tool invocations parts
      if (!isToolUIPart(part)) return part;

      const toolName = getToolName(part);

      // Only continue if we have an execute function for the tool (meaning it requires confirmation) and it's in a 'output-available' state
      if (!(toolName in executeFunctions) || part.state !== 'output-available')
        return part;

      let result;

      if (part.output === APPROVAL.YES) {
        // Get the tool and check if the tool has an execute function.
        if (
          !isValidToolName(toolName, executeFunctions) ||
          part.state !== 'output-available'
        ) {
          return part;
        }

        const toolInstance = executeFunctions[toolName] as Tool['execute'];
        if (toolInstance) {
          result = await toolInstance(part.input, {
            messages: convertToModelMessages(messages),
            toolCallId: part.toolCallId,
          });
        } else {
          result = 'Error: No execute function found on tool';
        }
      } else if (part.output === APPROVAL.NO) {
        result = 'Error: User denied access to tool execution';
      } else {
        // For any unhandled responses, return the original part.
        return part;
      }

      // Forward updated tool result to the client.
      writer.write({
        type: 'tool-output-available',
        toolCallId: part.toolCallId,
        output: result,
      });

      // Return updated toolInvocation with the actual result.
      return {
        ...part,
        output: result,
      };
    }),
  );

  // Finally return the processed messages
  return [...messages.slice(0, -1), { ...lastMessage, parts: processedParts }];
}

export function getToolsRequiringConfirmation<T extends ToolSet>(
  tools: T,
): string[] {
  const toolsRequiringConfirmation = (Object.keys(tools) as (keyof T)[]).filter(key => {
    const maybeTool = tools[key];
    // In AI SDK v5, tools without execute functions require approval
    return typeof maybeTool.execute !== 'function';
  }) as string[];
  
  console.log('🔍 Tools requiring confirmation:', toolsRequiringConfirmation);
  return toolsRequiringConfirmation;
}

// Execute functions for tools that require approval
export const slideExecuteFunctions = {
  updateSlideContent: async ({ slideId, content }: { slideId: string; content: string }) => {
    console.log('🔍 Executing updateSlideContent after approval');
    console.log(`📝 SlideID: ${slideId}`);
    console.log(`📄 Content length: ${content.length} characters`);
    
    try {
      const slide = await getSlideById(slideId);
      
      if (!slide) {
        return {
          success: false,
          error: "Slide not found",
          slideId
        };
      }
      
      const success = await updateSlideContent(slideId, content);
      
      if (success) {
        return {
          success: true,
          slideId,
          message: "Slide content updated successfully"
        };
      } else {
        return {
          success: false,
          error: "Failed to update slide content",
          slideId
        };
      }
    } catch (error) {
      console.error('❌ Exception in updateSlideContent execution:', error);
      return {
        success: false,
        error: "An exception occurred when updating slide content",
        slideId
      };
    }
  },

  createSlide: async ({ presentationId, templateType, title, content, position }: {
    presentationId: string;
    templateType: string;
    title: string;
    content?: string;
    position?: number;
  }) => {
    console.log('🔍 Executing createSlide after approval');
    
    try {
      const allSlides = await getSlidesByPresentation(presentationId);
      const currentSlideCount = allSlides.length;
      const newPosition = position !== undefined ? position : currentSlideCount;
      
      const newSlide = {
        id: generateUUID(),
        presentation_id: presentationId,
        template_type: templateType,
        title: title || 'New Slide',
        content: content || '',
        position: newPosition,
        bulletPoints: [],
        imagePrompt: null,
        imageUrl: null,
        isGeneratingImage: false,
        isHidden: false,
        isGenerating: false,
      };

      // Here you would call your actual slide creation function
      // For now, we'll return the prepared slide data
      return {
        success: true,
        message: `Created new slide with "${templateType}" template as slide ${newPosition + 1}`,
        newSlide,
        templateType,
        slideTitle: newSlide.title,
        position: newPosition,
        totalSlidesAfterCreation: currentSlideCount + 1,
      };
    } catch (error) {
      console.error('❌ Exception in createSlide execution:', error);
      return {
        success: false,
        error: "Failed to create slide",
        message: "There was an error creating the new slide. Please try again.",
      };
    }
  },

  deleteSlide: async ({ slideId }: { slideId: string }) => {
    console.log('🔍 Executing deleteSlide after approval');
    
    try {
      const slide = await getSlideById(slideId);
      if (!slide) {
        return { 
          success: false, 
          error: 'Slide not found',
          slideId,
          message: "The slide you're trying to delete could not be found.",
        };
      }

      const allSlides = await getSlidesByPresentation(slide.presentation_id);
      const slidePosition = allSlides.findIndex(s => s.id === slideId) + 1;
      const totalSlides = allSlides.length;

      if (totalSlides === 1) {
        return {
          success: false,
          error: 'Cannot delete the last slide',
          slideId,
          message: "You cannot delete the last slide in your presentation.",
        };
      }

      // Here you would call your actual slide deletion function
      return {
        success: true,
        message: `Deleted Slide ${slidePosition}: "${slide.title || 'Untitled'}"`,
        slideId,
        slideTitle: slide.title,
        slidePosition,
        totalSlides,
        templateType: slide.template_type,
      };
    } catch (error) {
      console.error('❌ Exception in deleteSlide execution:', error);
      return {
        success: false,
        error: "Failed to delete slide",
        slideId,
        message: "There was an error deleting the slide. Please try again.",
      };
    }
  },

  duplicateSlide: async ({ slideId, position }: { slideId: string; position?: number }) => {
    console.log('🔍 Executing duplicateSlide after approval');
    
    try {
      const originalSlide = await getSlideById(slideId);
      if (!originalSlide) {
        return { 
          success: false, 
          error: 'Original slide not found',
          slideId,
        };
      }

      const duplicatedSlide = {
        ...originalSlide,
        id: generateUUID(),
        position: position !== undefined ? position : originalSlide.position + 1,
      };

      // Here you would call your actual slide duplication function
      return {
        success: true,
        message: 'Slide duplicated successfully',
        duplicatedSlide,
        originalSlideId: slideId,
      };
    } catch (error) {
      console.error('❌ Exception in duplicateSlide execution:', error);
      return {
        success: false,
        error: "Failed to duplicate slide",
        slideId,
        message: "There was an error duplicating the slide. Please try again.",
      };
    }
  },

  moveSlide: async ({ slideId, newPosition }: { slideId: string; newPosition: number }) => {
    console.log('🔍 Executing moveSlide after approval');
    
    try {
      const slide = await getSlideById(slideId);
      if (!slide) {
        return { 
          success: false, 
          error: 'Slide not found',
          slideId,
        };
      }

      // Here you would call your actual slide move function
      return {
        success: true,
        message: `Moved slide to position ${newPosition + 1}`,
        slideId,
        newPosition,
      };
    } catch (error) {
      console.error('❌ Exception in moveSlide execution:', error);
      return {
        success: false,
        error: "Failed to move slide",
        slideId,
        message: "There was an error moving the slide. Please try again.",
      };
    }
  },

  changeSlideTemplate: async ({ slideId, newTemplateType, preserveContent }: {
    slideId: string;
    newTemplateType: string;
    preserveContent?: boolean;
  }) => {
    console.log('🔍 Executing changeSlideTemplate after approval');
    
    try {
      const slide = await getSlideById(slideId);
      if (!slide) {
        return { 
          success: false, 
          error: 'Slide not found',
          slideId,
        };
      }

      // Here you would call your actual template change function
      return {
        success: true,
        message: `Changed slide template to "${newTemplateType}"`,
        slideId,
        newTemplateType,
        preserveContent: preserveContent ?? true,
      };
    } catch (error) {
      console.error('❌ Exception in changeSlideTemplate execution:', error);
      return {
        success: false,
        error: "Failed to change slide template",
        slideId,
        message: "There was an error changing the slide template. Please try again.",
      };
    }
  },

  updateSlideImage: async ({ slideId, imagePrompt, action }: {
    slideId: string;
    imagePrompt: string;
    action: 'generate' | 'remove';
  }) => {
    console.log('🔍 Executing updateSlideImage after approval');
    
    try {
      const slide = await getSlideById(slideId);
      if (!slide) {
        return { 
          success: false, 
          error: 'Slide not found',
          slideId,
        };
      }

      if (action === 'remove') {
        // Here you would call your actual image removal function
        return {
          success: true,
          message: 'Image removed from slide',
          slideId,
          action: 'remove',
        };
      } else {
        // Here you would call your actual image generation function
        return {
          success: true,
          message: `Generated new image with prompt: "${imagePrompt}"`,
          slideId,
          imagePrompt,
          action: 'generate',
        };
      }
    } catch (error) {
      console.error('❌ Exception in updateSlideImage execution:', error);
      return {
        success: false,
        error: "Failed to update slide image",
        slideId,
        message: "There was an error updating the slide image. Please try again.",
      };
    }
  },

  applyTheme: async ({ presentationId, themeId }: {
    presentationId: string;
    themeId: string;
  }) => {
    console.log('🔍 Executing applyTheme after approval');
    
    try {
      const theme = getThemeById(themeId);
      if (!theme) {
        return { 
          success: false, 
          error: 'Theme not found',
          themeId,
        };
      }

      // Apply the theme using the same logic as tool-result.tsx
      console.log(`🎨 HITL applying theme for presentationId: ${presentationId}`);
      
      // Store in localStorage (this is what the theme context reads from)
      localStorage.setItem(`theme_${presentationId}`, theme.id);
      
      // Also update the database if possible
      try {
        const { DatabaseService } = await import('@/lib/database');
        const { createClient } = await import('@/lib/supabase/client');
        const db = new DatabaseService(createClient());
        await db.updatePresentation(presentationId, { theme_id: theme.id });
      } catch (dbError) {
        console.warn('Failed to update theme in database, but applied to localStorage:', dbError);
      }

      // Trigger theme change event to refresh UI
      window.dispatchEvent(new CustomEvent('themeChanged', { 
        detail: { presentationId, themeId: theme.id, themeName: theme.name } 
      }));

      return {
        success: true,
        message: `Applied theme "${theme.name}" to presentation`,
        presentationId,
        themeId: theme.id,
        themeName: theme.name,
      };
    } catch (error) {
      console.error('❌ Exception in applyTheme execution:', error);
      return {
        success: false,
        error: "Failed to apply theme",
        presentationId,
        message: "There was an error applying the theme. Please try again.",
      };
    }
  },
};
