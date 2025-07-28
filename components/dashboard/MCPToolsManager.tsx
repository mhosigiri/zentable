'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Plus, 
  Settings, 
  Trash2, 
  Edit, 
  Terminal,
  AlertCircle,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { MCPToolsService, type MCPTool } from '@/lib/mcp-tools-database';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';

interface MCPToolFormData {
  name: string;
  description: string;
  command: string;
  args: string;
  env: string;
}

export function MCPToolsManager() {
  const [mcpTools, setMcpTools] = useState<MCPTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTool, setEditingTool] = useState<MCPTool | null>(null);
  const [formData, setFormData] = useState<MCPToolFormData>({
    name: '',
    description: '',
    command: '',
    args: '',
    env: '{}'
  });

  const mcpService = new MCPToolsService();

  useEffect(() => {
    loadMCPTools();
  }, []);

  const loadMCPTools = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;
      
      const tools = await mcpService.getUserMCPTools(user.id);
      setMcpTools(tools);
    } catch (error) {
      console.error('Error loading MCP tools:', error);
      toast.error('Failed to load MCP tools');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error('Please log in to manage MCP tools');
      return;
    }

    try {
      // Parse and validate the server config
      let args: string[] = [];
      let env: Record<string, string> = {};
      
      if (formData.args.trim()) {
        try {
          args = JSON.parse(formData.args);
          if (!Array.isArray(args)) {
            throw new Error('Args must be an array');
          }
        } catch {
          args = formData.args.split(' ').filter(arg => arg.trim());
        }
      }
      
      if (formData.env.trim()) {
        try {
          env = JSON.parse(formData.env);
          if (typeof env !== 'object' || Array.isArray(env)) {
            throw new Error('Environment must be an object');
          }
        } catch {
          toast.error('Invalid environment JSON format');
          return;
        }
      }

      const serverConfig = {
        command: formData.command.trim(),
        args: args.length > 0 ? args : undefined,
        env: Object.keys(env).length > 0 ? env : undefined
      };

      if (editingTool) {
        // Update existing tool
        await mcpService.updateMCPTool(editingTool.id, user.id, {
          name: formData.name.trim(),
          description: formData.description.trim() || null,
          server_config: serverConfig
        });
        toast.success('MCP tool updated successfully');
      } else {
        // Create new tool
        await mcpService.createMCPTool(
          user.id,
          formData.name.trim(),
          formData.description.trim() || null,
          serverConfig
        );
        toast.success('MCP tool created successfully');
      }

      setIsDialogOpen(false);
      setEditingTool(null);
      resetForm();
      loadMCPTools();
    } catch (error) {
      console.error('Error saving MCP tool:', error);
      toast.error('Failed to save MCP tool');
    }
  };

  const handleEdit = (tool: MCPTool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name,
      description: tool.description || '',
      command: tool.server_config.command,
      args: tool.server_config.args ? JSON.stringify(tool.server_config.args) : '',
      env: tool.server_config.env ? JSON.stringify(tool.server_config.env, null, 2) : '{}'
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (tool: MCPTool) => {
    if (!confirm(`Are you sure you want to delete "${tool.name}"?`)) return;

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    try {
      await mcpService.deleteMCPTool(tool.id, user.id);
      toast.success('MCP tool deleted successfully');
      loadMCPTools();
    } catch (error) {
      console.error('Error deleting MCP tool:', error);
      toast.error('Failed to delete MCP tool');
    }
  };

  const handleToggle = async (tool: MCPTool) => {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    try {
      await mcpService.updateMCPTool(tool.id, user.id, {
        is_enabled: !tool.is_enabled
      });
      loadMCPTools();
    } catch (error) {
      console.error('Error toggling MCP tool:', error);
      toast.error('Failed to toggle MCP tool');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      command: '',
      args: '',
      env: '{}'
    });
  };

  const handleDialogOpenChange = (open: boolean) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingTool(null);
      resetForm();
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>MCP Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Terminal className="h-5 w-5" />
              MCP Tools
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Manage Model Context Protocol tools for AI assistance
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add MCP Tool
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <form onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>
                    {editingTool ? 'Edit MCP Tool' : 'Add New MCP Tool'}
                  </DialogTitle>
                  <DialogDescription>
                    Configure a Model Context Protocol server to extend AI capabilities.
                    <a 
                      href="https://modelcontextprotocol.io/servers" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline ml-1"
                    >
                      Browse available servers <ExternalLink className="h-3 w-3" />
                    </a>
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Tool Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., GitHub, Weather, Calculator"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="What does this tool do?"
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="command">Command</Label>
                    <Input
                      id="command"
                      value={formData.command}
                      onChange={(e) => setFormData(prev => ({ ...prev, command: e.target.value }))}
                      placeholder="e.g., npx, python, node"
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="args">Arguments</Label>
                    <Input
                      id="args"
                      value={formData.args}
                      onChange={(e) => setFormData(prev => ({ ...prev, args: e.target.value }))}
                      placeholder='e.g., ["@modelcontextprotocol/server-github"] or space-separated'
                    />
                    <p className="text-xs text-muted-foreground">
                      JSON array format or space-separated arguments
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="env">Environment Variables (JSON)</Label>
                    <Textarea
                      id="env"
                      value={formData.env}
                      onChange={(e) => setFormData(prev => ({ ...prev, env: e.target.value }))}
                      placeholder='{"GITHUB_TOKEN": "your-token"}'
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground">
                      JSON object with environment variables for the MCP server
                    </p>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => handleDialogOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingTool ? 'Update Tool' : 'Add Tool'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      
      <CardContent>
        {mcpTools.length === 0 ? (
          <div className="text-center py-8">
            <Terminal className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No MCP Tools Configured</h3>
            <p className="text-muted-foreground mb-4">
              Add MCP tools to extend your AI assistant with external capabilities
            </p>
            <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First MCP Tool
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {mcpTools.map((tool) => (
                <Card key={tool.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{tool.name}</h4>
                        <Badge variant={tool.is_enabled ? "default" : "secondary"}>
                          {tool.is_enabled ? (
                            <>
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Enabled
                            </>
                          ) : (
                            <>
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Disabled
                            </>
                          )}
                        </Badge>
                      </div>
                      
                      {tool.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {tool.description}
                        </p>
                      )}
                      
                      <div className="text-xs text-muted-foreground font-mono bg-muted/50 rounded p-2">
                        {tool.server_config.command}
                        {tool.server_config.args && ` ${tool.server_config.args.join(' ')}`}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={tool.is_enabled}
                        onCheckedChange={() => handleToggle(tool)}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(tool)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(tool)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}