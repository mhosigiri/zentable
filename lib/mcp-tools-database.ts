import { createClient } from '@/lib/supabase/client';
import type { SupabaseClient } from '@supabase/supabase-js';

export interface MCPTool {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  server_config: {
    command: string;
    args?: string[];
    env?: Record<string, string>;
  };
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface BrainstormingMCPSetting {
  id: string;
  user_id: string;
  session_id: string | null;
  mcp_tool_id: string;
  is_active: boolean;
  created_at: string;
  mcp_tool?: MCPTool;
}

export class MCPToolsService {
  private supabase: SupabaseClient;

  constructor(supabaseClient?: SupabaseClient) {
    this.supabase = supabaseClient || createClient();
  }

  // MCP Tools Management
  async getUserMCPTools(userId: string): Promise<MCPTool[]> {
    const { data, error } = await this.supabase
      .from('user_mcp_tools')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user MCP tools:', error);
      throw error;
    }

    return data || [];
  }

  async createMCPTool(
    userId: string,
    name: string,
    description: string | null,
    serverConfig: MCPTool['server_config']
  ): Promise<MCPTool | null> {
    const { data, error } = await this.supabase
      .from('user_mcp_tools')
      .insert({
        user_id: userId,
        name,
        description,
        server_config: serverConfig,
        is_enabled: true
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating MCP tool:', error);
      throw error;
    }

    return data;
  }

  async updateMCPTool(
    toolId: string,
    userId: string,
    updates: Partial<Pick<MCPTool, 'name' | 'description' | 'server_config' | 'is_enabled'>>
  ): Promise<MCPTool | null> {
    const { data, error } = await this.supabase
      .from('user_mcp_tools')
      .update(updates)
      .eq('id', toolId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating MCP tool:', error);
      throw error;
    }

    return data;
  }

  async deleteMCPTool(toolId: string, userId: string): Promise<void> {
    const { error } = await this.supabase
      .from('user_mcp_tools')
      .delete()
      .eq('id', toolId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting MCP tool:', error);
      throw error;
    }
  }

  // Brainstorming MCP Settings
  async getBrainstormingMCPSettings(
    userId: string,
    sessionId?: string
  ): Promise<BrainstormingMCPSetting[]> {
    let query = this.supabase
      .from('user_brainstorming_mcp_settings')
      .select(`
        *,
        mcp_tool:user_mcp_tools(*)
      `)
      .eq('user_id', userId);

    if (sessionId) {
      query = query.eq('session_id', sessionId);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching brainstorming MCP settings:', error);
      throw error;
    }

    return data || [];
  }

  async toggleBrainstormingMCPTool(
    userId: string,
    sessionId: string | null,
    mcpToolId: string,
    isActive: boolean
  ): Promise<BrainstormingMCPSetting | null> {
    // Try to update existing setting first
    const { data: existing } = await this.supabase
      .from('user_brainstorming_mcp_settings')
      .select('id')
      .eq('user_id', userId)
      .eq('session_id', sessionId)
      .eq('mcp_tool_id', mcpToolId)
      .single();

    if (existing) {
      // Update existing setting
      const { data, error } = await this.supabase
        .from('user_brainstorming_mcp_settings')
        .update({ is_active: isActive })
        .eq('id', existing.id)
        .select(`
          *,
          mcp_tool:user_mcp_tools(*)
        `)
        .single();

      if (error) {
        console.error('Error updating brainstorming MCP setting:', error);
        throw error;
      }

      return data;
    } else {
      // Create new setting
      const { data, error } = await this.supabase
        .from('user_brainstorming_mcp_settings')
        .insert({
          user_id: userId,
          session_id: sessionId,
          mcp_tool_id: mcpToolId,
          is_active: isActive
        })
        .select(`
          *,
          mcp_tool:user_mcp_tools(*)
        `)
        .single();

      if (error) {
        console.error('Error creating brainstorming MCP setting:', error);
        throw error;
      }

      return data;
    }
  }

  async getActiveBrainstormingMCPTools(
    userId: string,
    sessionId?: string
  ): Promise<MCPTool[]> {
    const settings = await this.getBrainstormingMCPSettings(userId, sessionId);
    return settings
      .filter(setting => setting.is_active && setting.mcp_tool?.is_enabled)
      .map(setting => setting.mcp_tool!)
      .filter(Boolean);
  }
}