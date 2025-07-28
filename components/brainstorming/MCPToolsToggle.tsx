'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { 
  Settings, 
  Terminal, 
  CheckCircle, 
  Circle,
  ExternalLink,
  AlertCircle
} from 'lucide-react';
import { MCPToolsService, type MCPTool, type BrainstormingMCPSetting } from '@/lib/mcp-tools-database';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface MCPToolsToggleProps {
  sessionId?: string;
  onToolsChange?: (activeMCPTools: MCPTool[]) => void;
}

export function MCPToolsToggle({ sessionId, onToolsChange }: MCPToolsToggleProps) {
  const [mcpTools, setMcpTools] = useState<MCPTool[]>([]);
  const [mcpSettings, setMcpSettings] = useState<BrainstormingMCPSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const mcpService = new MCPToolsService();

  useEffect(() => {
    loadMCPData();
  }, [sessionId]);

  const loadMCPData = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const [tools, settings] = await Promise.all([
        mcpService.getUserMCPTools(user.id),
        mcpService.getBrainstormingMCPSettings(user.id, sessionId || null)
      ]);
      
      setMcpTools(tools.filter(tool => tool.is_enabled));
      setMcpSettings(settings);
      
      // Notify parent of active tools
      const activeTools = tools.filter(tool => {
        const setting = settings.find(s => s.mcp_tool_id === tool.id);
        return tool.is_enabled && setting?.is_active;
      });
      onToolsChange?.(activeTools);
      
    } catch (error) {
      console.error('Error loading MCP data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (tool: MCPTool, isActive: boolean) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('Please log in to manage MCP tools');
      return;
    }

    try {
      await mcpService.toggleBrainstormingMCPTool(
        user.id,
        sessionId || null,
        tool.id,
        isActive
      );
      
      await loadMCPData(); // Reload to get updated state
      
      toast.success(
        isActive 
          ? `${tool.name} enabled for this session`
          : `${tool.name} disabled for this session`
      );
    } catch (error) {
      console.error('Error toggling MCP tool:', error);
      toast.error('Failed to toggle MCP tool');
    }
  };

  const isToolActive = (toolId: string): boolean => {
    const setting = mcpSettings.find(s => s.mcp_tool_id === toolId);
    return setting?.is_active || false;
  };

  const activeCount = mcpSettings.filter(s => s.is_active).length;

  if (mcpTools.length === 0) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="sm" disabled>
            <Terminal className="h-4 w-4 mr-2" />
            MCP Tools
            <Badge variant="secondary" className="ml-2">0</Badge>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>No MCP tools configured. Go to Settings to add some.</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm">
          <Terminal className="h-4 w-4 mr-2" />
          MCP Tools
          <Badge 
            variant={activeCount > 0 ? "default" : "secondary"} 
            className="ml-2"
          >
            {activeCount}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">MCP Tools for this Session</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                window.open('/dashboard/settings', '_blank');
              }}
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Toggle which MCP tools are available for AI assistance in this brainstorming session.
          </p>

          {isLoading ? (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            </div>
          ) : (
            <ScrollArea className="max-h-[300px]">
              <div className="space-y-3">
                {mcpTools.map((tool) => {
                  const isActive = isToolActive(tool.id);
                  
                  return (
                    <div
                      key={tool.id}
                      className="flex items-start justify-between p-3 rounded-lg border bg-card"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="font-medium text-sm truncate">
                            {tool.name}
                          </h5>
                          {isActive ? (
                            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                        </div>
                        
                        {tool.description && (
                          <p className="text-xs text-muted-foreground mb-1 line-clamp-2">
                            {tool.description}
                          </p>
                        )}
                        
                        <div className="text-xs text-muted-foreground font-mono bg-muted/50 rounded px-2 py-1 truncate">
                          {tool.server_config.command}
                          {tool.server_config.args && ` ${tool.server_config.args.join(' ')}`}
                        </div>
                      </div>
                      
                      <div className="ml-3 flex-shrink-0">
                        <Switch
                          checked={isActive}
                          onCheckedChange={(checked) => handleToggle(tool, checked)}
                          size="sm"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          )}

          {activeCount > 0 && (
            <div className="pt-2 border-t">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-500" />
                {activeCount} tool{activeCount !== 1 ? 's' : ''} active for this session
              </div>
            </div>
          )}
          
          <div className="pt-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => {
                window.open('/dashboard/settings', '_blank');
                setIsOpen(false);
              }}
            >
              <Settings className="h-4 w-4 mr-2" />
              Manage MCP Tools
              <ExternalLink className="h-3 w-3 ml-auto" />
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}