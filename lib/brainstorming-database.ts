import { createClient } from '@/lib/supabase/client';
import { SupabaseClient } from '@supabase/supabase-js';
// import { Database } from '@/lib/supabase';

// Temporarily using any types until Database types are updated with brainstorming tables
type BrainstormingSession = any;
type BrainstormingSessionInsert = any;
type BrainstormingSessionUpdate = any;

type Idea = any;
type IdeaInsert = any;
type IdeaUpdate = any;

type IdeaSource = any;
type IdeaSourceInsert = any;

type IdeaTag = any;
type IdeaTagInsert = any;

type BrainstormingThread = any;
type BrainstormingMessage = any;

export class BrainstormingDatabaseService {
  private supabaseClient: SupabaseClient;

  constructor(supabaseClient?: SupabaseClient) {
    this.supabaseClient = supabaseClient || createClient();
  }

  // Session management
  async createSession(
    userId: string, 
    title: string, 
    description?: string,
    sessionType: string = 'freeform'
  ): Promise<BrainstormingSession | null> {
    try {
      const { data, error } = await this.supabaseClient
        .from('brainstorming_sessions')
        .insert({
          user_id: userId,
          title,
          description,
          session_type: sessionType,
          status: 'active'
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating brainstorming session:', error);
      return null;
    }
  }

  async getUserSessions(userId: string): Promise<BrainstormingSession[]> {
    try {
      const { data, error } = await this.supabaseClient
        .from('brainstorming_sessions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      return [];
    }
  }

  async getSession(sessionId: string, userId: string): Promise<BrainstormingSession | null> {
    try {
      const { data, error } = await this.supabaseClient
        .from('brainstorming_sessions')
        .select('*')
        .eq('id', sessionId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching session:', error);
      return null;
    }
  }

  async updateSession(
    sessionId: string, 
    userId: string, 
    updates: Partial<BrainstormingSessionUpdate>
  ): Promise<boolean> {
    try {
      const { error } = await this.supabaseClient
        .from('brainstorming_sessions')
        .update(updates)
        .eq('id', sessionId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating session:', error);
      return false;
    }
  }

  async deleteSession(sessionId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await this.supabaseClient
        .from('brainstorming_sessions')
        .delete()
        .eq('id', sessionId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      return false;
    }
  }

  // Idea management
  async createIdea(
    sessionId: string, 
    userId: string, 
    description: string,
    ideaData?: any
  ): Promise<Idea | null> {
    try {
      const { data, error } = await this.supabaseClient
        .from('ideas')
        .insert({
          session_id: sessionId,
          user_id: userId,
          title: ideaData?.title || description.substring(0, 100),
          description,
          category: ideaData?.category || 'general',
          priority: ideaData?.priority || 3
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating idea:', error);
      return null;
    }
  }

  async addIdeaToCanvas(
    sessionId: string,
    userId: string,
    ideaContent: string,
    position: { x: number, y: number }
  ): Promise<Idea | null> {
    try {
      const { data, error } = await this.supabaseClient
        .from('ideas')
        .insert({
          session_id: sessionId,
          user_id: userId,
          title: ideaContent.substring(0, 100),
          description: ideaContent
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding idea to canvas:', error);
      return null;
    }
  }

  async getSessionIdeas(sessionId: string, userId: string): Promise<Idea[]> {
    try {
      const { data, error } = await this.supabaseClient
        .from('ideas')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching session ideas:', error);
      return [];
    }
  }

  async getCanvasIdeas(sessionId: string, userId: string): Promise<Idea[]> {
    try {
      const { data, error } = await this.supabaseClient
        .from('ideas')
        .select('*')
        .eq('session_id', sessionId)
        .not('metadata->canvas_position', 'is', null)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching canvas ideas:', error);
      return [];
    }
  }

  async updateIdea(ideaId: string, updates: Partial<IdeaUpdate>): Promise<boolean> {
    try {
      const { error } = await this.supabaseClient
        .from('ideas')
        .update(updates)
        .eq('id', ideaId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating idea:', error);
      return false;
    }
  }

  async deleteIdea(ideaId: string, userId: string): Promise<boolean> {
    try {
      const { error } = await this.supabaseClient
        .from('ideas')
        .delete()
        .eq('id', ideaId)
        .eq('user_id', userId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting idea:', error);
      return false;
    }
  }

  // Source management
  async createIdeaSource(ideaId: string, sourceData: Omit<IdeaSourceInsert, 'idea_id'>): Promise<IdeaSource | null> {
    try {
      const { data, error } = await this.supabaseClient
        .from('idea_sources')
        .insert({
          idea_id: ideaId,
          ...sourceData
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating idea source:', error);
      return null;
    }
  }

  async getIdeaSources(ideaId: string): Promise<IdeaSource[]> {
    try {
      const { data, error } = await this.supabaseClient
        .from('idea_sources')
        .select('*')
        .eq('idea_id', ideaId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching idea sources:', error);
      return [];
    }
  }

  async deleteIdeaSource(sourceId: string): Promise<boolean> {
    try {
      const { error } = await this.supabaseClient
        .from('idea_sources')
        .delete()
        .eq('id', sourceId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting idea source:', error);
      return false;
    }
  }

  // AI integration methods
  async generateIdeasFromPrompt(
    sessionId: string, 
    userId: string, 
    prompt: string,
    count: number = 5,
    style: 'creative' | 'practical' | 'analytical' | 'innovative' = 'creative'
  ): Promise<Idea[]> {
    try {
      // Get existing ideas for context
      const existingIdeas = await this.getSessionIdeas(sessionId, userId);
      const context = existingIdeas.length > 0 
        ? existingIdeas.slice(0, 3).map(idea => idea.title).join(', ')
        : undefined;

      // This would integrate with the brainstorming tools
      // For now, generate structured ideas based on the prompt
      const ideas: Idea[] = [];
      const categories = ['strategy', 'innovation', 'implementation', 'research', 'design'];
      
      for (let i = 0; i < count; i++) {
        const category = categories[i % categories.length];
        const ideaContent = `${style.charAt(0).toUpperCase() + style.slice(1)} approach to ${prompt} - idea ${i + 1}`;
        
        const idea = await this.createIdea(
          sessionId,
          userId,
          ideaContent,
          {
            ai_generated: true,
            ai_model: 'groq/llama-3.3-70b',
            category,
            style,
            generation_prompt: prompt
          }
        );
        
        if (idea) {
          ideas.push(idea);
        }
      }

      return ideas;
    } catch (error) {
      console.error('Error generating ideas from prompt:', error);
      return [];
    }
  }

  async generateTagsForIdea(ideaId: string, content: string): Promise<IdeaTag[]> {
    try {
      // Enhanced AI-powered tag generation
      const tags = this.generateSmartTags(content);
      
      const tagInserts: IdeaTagInsert[] = tags.map(({ tag, confidence, type }) => ({
        idea_id: ideaId,
        tag,
        confidence,
        tag_type: type,
        created_by: 'ai'
      }));

      const { data, error } = await this.supabaseClient
        .from('idea_tags')
        .insert(tagInserts)
        .select();

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error generating tags for idea:', error);
      return [];
    }
  }

  async autoTagAllIdeas(sessionId: string, userId: string): Promise<void> {
    try {
      const ideas = await this.getSessionIdeas(sessionId, userId);
      
      for (const idea of ideas) {
        // Check if idea already has tags
        const existingTags = await this.getIdeaTags(idea.id);
        if (existingTags.length === 0) {
          await this.generateTagsForIdea(idea.id, idea.content);
        }
      }
    } catch (error) {
      console.error('Error auto-tagging ideas:', error);
    }
  }

  async getIdeaTags(ideaId: string): Promise<IdeaTag[]> {
    try {
      const { data, error } = await this.supabaseClient
        .from('idea_tags')
        .select('*')
        .eq('idea_id', ideaId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching idea tags:', error);
      return [];
    }
  }

  // Export functionality
  async exportSessionToPresentation(
    sessionId: string, 
    userId: string,
    exportOptions?: {
      title?: string,
      style?: string,
      slideCount?: number
    }
  ): Promise<string | null> {
    try {
      // Get ONLY canvas ideas (not all conversation ideas)
      const canvasIdeas = await this.getCanvasIdeas(sessionId, userId);
      
      if (canvasIdeas.length === 0) {
        throw new Error('No ideas on canvas to export');
      }

      // Convert canvas ideas to prompt
      const prompt = this.convertIdeasToPrompt(canvasIdeas, exportOptions?.title);
      
      // This would integrate with existing presentation generation flow
      // For now, return the prompt that would be used
      return prompt;
    } catch (error) {
      console.error('Error exporting session to presentation:', error);
      return null;
    }
  }

  // Helper methods
  private extractTagsFromContent(content: string): string[] {
    // Simple tag extraction - in real implementation, use AI
    const words = content.toLowerCase().split(/\s+/);
    const tags = words
      .filter(word => word.length > 3)
      .slice(0, 5); // Max 5 tags
    return tags;
  }

  private generateSmartTags(content: string): Array<{ tag: string; confidence: number; type: string }> {
    // Enhanced tag generation with multiple types and confidence scores
    const tags: Array<{ tag: string; confidence: number; type: string }> = [];
    
    // Business domain tags
    const businessTerms = {
      'strategy': ['strategy', 'plan', 'strategic', 'approach', 'method'],
      'innovation': ['innovation', 'creative', 'new', 'novel', 'disruptive'],
      'technology': ['tech', 'digital', 'software', 'system', 'platform'],
      'marketing': ['market', 'customer', 'brand', 'promotion', 'sales'],
      'finance': ['cost', 'budget', 'revenue', 'profit', 'investment'],
      'operations': ['process', 'workflow', 'efficiency', 'optimization'],
      'research': ['research', 'analysis', 'study', 'investigation', 'data']
    };

    // Action-oriented tags
    const actionTerms = {
      'implementation': ['implement', 'execute', 'deploy', 'launch'],
      'evaluation': ['evaluate', 'assess', 'measure', 'analyze'],
      'development': ['develop', 'build', 'create', 'design'],
      'collaboration': ['collaborate', 'team', 'together', 'shared']
    };

    // Priority indicators
    const priorityTerms = {
      'urgent': ['urgent', 'critical', 'immediate', 'asap'],
      'important': ['important', 'key', 'essential', 'vital'],
      'future': ['future', 'long-term', 'eventually', 'later']
    };

    const lowerContent = content.toLowerCase();

    // Check business domain tags
    Object.entries(businessTerms).forEach(([category, keywords]) => {
      const matches = keywords.filter(keyword => lowerContent.includes(keyword));
      if (matches.length > 0) {
        const confidence = Math.min(0.9, 0.6 + (matches.length * 0.1));
        tags.push({ tag: category, confidence, type: 'domain' });
      }
    });

    // Check action tags
    Object.entries(actionTerms).forEach(([action, keywords]) => {
      const matches = keywords.filter(keyword => lowerContent.includes(keyword));
      if (matches.length > 0) {
        const confidence = Math.min(0.8, 0.5 + (matches.length * 0.15));
        tags.push({ tag: action, confidence, type: 'action' });
      }
    });

    // Check priority tags
    Object.entries(priorityTerms).forEach(([priority, keywords]) => {
      const matches = keywords.filter(keyword => lowerContent.includes(keyword));
      if (matches.length > 0) {
        const confidence = Math.min(0.85, 0.6 + (matches.length * 0.1));
        tags.push({ tag: priority, confidence, type: 'priority' });
      }
    });

    // Extract key nouns as semantic tags
    const words = content.split(/\s+/);
    const keyWords = words
      .filter(word => word.length > 4 && /^[a-zA-Z]+$/.test(word))
      .map(word => word.toLowerCase())
      .slice(0, 3);

    keyWords.forEach(word => {
      tags.push({ tag: word, confidence: 0.7, type: 'semantic' });
    });

    // Remove duplicates and limit to 8 tags
    const uniqueTags = tags.filter((tag, index, self) => 
      index === self.findIndex(t => t.tag === tag.tag)
    ).slice(0, 8);

    return uniqueTags;
  }

  private convertIdeasToPrompt(ideas: Idea[], title?: string): string {
    const ideaTexts = ideas.map(idea => `• ${idea.content}`).join('\n');
    
    return `Create a presentation${title ? ` titled "${title}"` : ''} based on these brainstormed ideas:

${ideaTexts}

Please organize these ideas into a logical flow and create engaging slides that tell a coherent story.`;
  }
}