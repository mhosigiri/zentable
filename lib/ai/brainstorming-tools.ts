import { tool } from 'ai';
import { z } from 'zod';

export const brainstormingTools = {

  createIdea: tool({
    description: 'Create a new idea in the brainstorming session',
    inputSchema: z.object({
      title: z.string().describe('The title of the idea'),
      description: z.string().describe('A brief description of the idea'),
      content: z.string().optional().describe('Detailed content or explanation'),
      category: z.string().optional().describe('Category for the idea'),
      tags: z.array(z.string()).optional().describe('Tags for categorization'),
      priority: z.number().min(1).max(5).optional().describe('Priority level 1-5'),
      parentIdeaId: z.string().optional().describe('ID of parent idea if this is a sub-idea')
    }),
    execute: async ({ title, description, content, category, tags, priority, parentIdeaId }) => {
      return {
        action: 'create_idea',
        data: {
          title,
          description,
          content,
          category,
          tags,
          priority,
          parent_idea_id: parentIdeaId
        }
      };
    }
  }),

  suggestIdeas: tool({
    description: 'Generate and provide multiple diverse, specific, and actionable ideas based on the user\'s request. Use this tool to create structured, saveable ideas that users can add to their idea bank.',
    inputSchema: z.object({
      theme: z.string().describe('The specific topic, challenge, or domain to generate ideas for'),
      ideas: z.array(z.object({
        title: z.string().describe('A specific, actionable title for the idea'),
        description: z.string().describe('Detailed description of how to implement this idea'),
        category: z.string().describe('Category that best fits this idea (e.g., "marketing", "product", "operations")'),
        priority: z.number().min(1).max(5).describe('Priority level based on impact and feasibility (1=low, 5=high)')
      })).min(1).max(8).describe('Array of generated ideas that are specific, actionable, and diverse'),
      context: z.string().optional().describe('Additional context, constraints, or requirements'),
      targetAudience: z.string().optional().describe('Who these ideas are for (e.g., "small business owners", "content creators", "tech startups")'),
      goalType: z.enum(['increase', 'reduce', 'improve', 'create', 'optimize', 'solve']).optional().describe('The primary goal type')
    }),
    execute: async ({ theme, ideas, context, targetAudience, goalType }) => {
      return {
        action: 'suggest_ideas',
        data: { 
          theme,
          ideas,
          count: ideas.length,
          context,
          targetAudience,
          goalType
        }
      };
    }
  }),

  categorizeIdeas: tool({
    description: 'Organize and categorize existing ideas',
    inputSchema: z.object({
      ideaIds: z.array(z.string()).describe('IDs of ideas to categorize'),
      categories: z.array(z.string()).describe('Suggested categories')
    }),
    execute: async ({ ideaIds, categories }) => {
      return {
        action: 'categorize_ideas',
        data: { ideaIds, categories }
      };
    }
  }),

  evaluateIdea: tool({
    description: 'Evaluate an idea based on various criteria',
    inputSchema: z.object({
      ideaId: z.string().describe('ID of the idea to evaluate'),
      criteria: z.array(z.enum([
        'feasibility',
        'impact',
        'originality',
        'cost',
        'timeframe',
        'resources'
      ])).describe('Evaluation criteria to use')
    }),
    execute: async ({ ideaId, criteria }) => {
      return {
        action: 'evaluate_idea',
        data: { ideaId, criteria }
      };
    }
  }),

  findConnections: tool({
    description: 'Find connections and relationships between different ideas',
    inputSchema: z.object({
      ideaIds: z.array(z.string()).min(2).describe('IDs of ideas to find connections between')
    }),
    execute: async ({ ideaIds }) => {
      return {
        action: 'find_connections',
        data: { ideaIds }
      };
    }
  }),

  summarizeSession: tool({
    description: 'Create a summary of the brainstorming session',
    inputSchema: z.object({
      format: z.enum(['brief', 'detailed', 'actionable']).optional()
        .describe('Format of the summary'),
      includeNext: z.boolean().optional()
        .describe('Include suggested next steps')
    }),
    execute: async ({ format, includeNext }) => {
      return {
        action: 'summarize_session',
        data: { format: format || 'brief', includeNext: includeNext || false }
      };
    }
  }),

  createActionItems: tool({
    description: 'Convert ideas into actionable tasks',
    inputSchema: z.object({
      ideaIds: z.array(z.string()).describe('IDs of ideas to convert to actions'),
      timeline: z.enum(['immediate', 'short-term', 'long-term']).optional()
        .describe('Timeline for the action items')
    }),
    execute: async ({ ideaIds, timeline }) => {
      return {
        action: 'create_action_items',
        data: { ideaIds, timeline }
      };
    }
  }),

  generateTags: tool({
    description: 'Generate relevant tags for ideas to help with organization and categorization',
    inputSchema: z.object({
      ideaId: z.string().describe('ID of the idea to generate tags for'),
      content: z.string().describe('Content of the idea to analyze'),
      tagTypes: z.array(z.enum(['domain', 'action', 'priority', 'semantic']))
        .optional().describe('Types of tags to generate')
    }),
    execute: async ({ ideaId, content, tagTypes }) => {
      return {
        action: 'generate_tags',
        data: { 
          ideaId, 
          content,
          tagTypes: tagTypes || ['domain', 'action', 'semantic']
        }
      };
    }
  }),

  mcpToolCall: tool({
    description: 'Call external MCP tools for additional data or functionality during brainstorming',
    inputSchema: z.object({
      toolName: z.string().describe('Name of the MCP tool to call'),
      parameters: z.record(z.any()).describe('Parameters to pass to the MCP tool'),
      context: z.string().optional().describe('Context about why this tool is being called')
    }),
    execute: async ({ toolName, parameters, context }) => {
      // Simulate MCP tool call - in real implementation this would connect to actual MCP servers
      const mockMcpResults = {
        'web_search': {
          results: [
            { title: 'Industry trends and insights', url: 'https://example.com/trends', relevance: 0.9 },
            { title: 'Best practices guide', url: 'https://example.com/practices', relevance: 0.8 }
          ]
        },
        'data_analysis': {
          insights: ['Market growth of 15% in target segment', 'Customer satisfaction score: 8.2/10'],
          recommendations: ['Focus on mobile experience', 'Implement customer feedback loop']
        },
        'competitor_analysis': {
          competitors: ['Company A', 'Company B', 'Company C'],
          opportunities: ['Gap in mid-market pricing', 'Underserved customer segment']
        }
      };

      const result = mockMcpResults[toolName as keyof typeof mockMcpResults] || {
        message: `Tool ${toolName} executed successfully`,
        parameters
      };

      return {
        action: 'mcp_tool_call',
        data: {
          toolName,
          parameters,
          context,
          result,
          timestamp: new Date().toISOString(),
          status: 'completed'
        }
      };
    }
  }),

  enhanceWithExternalData: tool({
    description: 'Enhance brainstorming session with external data sources through MCP integration',
    inputSchema: z.object({
      dataSource: z.enum(['market_research', 'competitor_data', 'industry_trends', 'customer_feedback'])
        .describe('Type of external data to fetch'),
      topic: z.string().describe('The brainstorming topic to enhance'),
      specificity: z.enum(['general', 'specific', 'detailed']).default('general')
        .describe('Level of detail required')
    }),
    execute: async ({ dataSource, topic, specificity }) => {
      // Simulate fetching external data
      const enhancementData = {
        market_research: {
          insights: [`${topic} market size: $2.3B`, `Growth rate: 12% annually`],
          trends: ['Increasing demand for automation', 'Focus on sustainability']
        },
        competitor_data: {
          analysis: [`3 main competitors in ${topic} space`, 'Average pricing: $50-200/month'],
          gaps: ['Limited mobile solutions', 'Poor customer onboarding']
        },
        industry_trends: {
          emerging: ['AI integration', 'Remote-first solutions'],
          declining: ['Legacy desktop apps', 'Complex enterprise tools']
        },
        customer_feedback: {
          pain_points: ['Too complicated to use', 'Expensive pricing'],
          desires: ['Better integration', 'Mobile app', 'Faster support']
        }
      };

      return {
        action: 'enhance_with_data',
        data: {
          dataSource,
          topic,
          specificity,
          enhancement: enhancementData[dataSource],
          suggestions: [
            `Consider ${topic} solutions that address customer pain points`,
            `Leverage industry trends in your ${topic} approach`,
            `Explore opportunities in competitor gaps`
          ]
        }
      };
    }
  })
};