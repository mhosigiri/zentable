# Enhanced Brainstorming Interface - Implementation Plan

## Vision Statement
Create a comprehensive AI-powered brainstorming interface that leverages MCP (Model Context Protocol) integration to connect multiple tools, services, and data sources. This feature will serve as the core differentiator, allowing users to collect ideas in an organized idea bank, track sources, interact with AI agents, and seamlessly transition from brainstorming to presentation generation.

## Core Features Overview

### 1. **AI-Powered Idea Bank System**
- **Smart Idea Collection**: Capture ideas from multiple sources (text, audio, images, web links, files)
- **Automatic Categorization**: AI-powered tagging and classification of ideas
- **Source Tracking**: Complete provenance tracking for all ideas with metadata
- **Semantic Search**: Find related ideas using natural language queries
- **Idea Relationships**: Visual mapping of connections between concepts

### 2. **MCP-Enabled Tool Integration**
- **Multi-Tool Orchestration**: Connect to external APIs, databases, and services
- **Real-time Data Access**: Pull fresh information from connected sources
- **Custom MCP Servers**: Build specialized connectors for specific workflows
- **AI Agent Coordination**: Multiple AI personas for different brainstorming approaches

### 3. **Interactive AI Conversation & Canvas**
- **AI Chat Interface**: Kibo-UI powered conversation with AI assistant
- **MCP Tool Integration**: AI can call external tools for live data and actions
- **Drag-Drop Ideas Canvas**: Visual organization of AI-generated ideas
- **Contextual AI**: AI aware of existing ideas and conversation history
- **Multi-Modal AI Responses**: Text, structured data, and actionable ideas

### 4. **Source Intelligence & Attribution**
- **Automatic Source Capture**: URLs, documents, conversations, meetings
- **Citation Management**: Academic-style referencing with auto-formatting
- **Credibility Scoring**: AI assessment of source reliability and relevance
- **Plagiarism Detection**: Ensure originality of generated content
- **Rights Management**: Track usage permissions and licensing

## Technical Architecture

### Database Schema Extensions
```sql
-- New tables for Enhanced Brainstorming Interface

-- Brainstorming Sessions
CREATE TABLE brainstorming_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    session_type VARCHAR(50) DEFAULT 'freeform', -- freeform, structured, collaborative
    template_id UUID REFERENCES brainstorming_templates(id),
    canvas_data JSONB, -- Mind map/canvas state
    settings JSONB, -- AI preferences, privacy settings
    thread_id UUID REFERENCES copilot_threads(id), -- Link to conversation thread
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    archived_at TIMESTAMP WITH TIME ZONE
);

-- Option 1: Reuse existing copilot tables with type distinction
-- Add to copilot_threads table (or use existing):
-- thread_type VARCHAR(50) DEFAULT 'copilot' -- 'copilot' or 'brainstorming'

-- Option 2: Create dedicated brainstorming conversation tables
CREATE TABLE brainstorming_conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES brainstorming_sessions(id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE brainstorming_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES brainstorming_conversations(id),
    role VARCHAR(50) NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    tool_calls JSONB, -- MCP tool calls made by AI
    generated_ideas JSONB, -- Ideas generated in this message
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Idea Bank
CREATE TABLE ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES brainstorming_sessions(id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    content_type VARCHAR(50) DEFAULT 'text', -- text, image, audio, file, link
    metadata JSONB, -- Rich metadata for different content types
    ai_generated BOOLEAN DEFAULT FALSE,
    ai_model VARCHAR(100), -- Track which AI model generated the idea
    parent_idea_id UUID REFERENCES ideas(id), -- For idea evolution/refinement
    position JSONB, -- Canvas position data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Source Tracking
CREATE TABLE idea_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES ideas(id),
    source_type VARCHAR(50) NOT NULL, -- url, document, conversation, mcp_tool
    source_url TEXT,
    source_title VARCHAR(500),
    source_description TEXT,
    author VARCHAR(255),
    published_date TIMESTAMP WITH TIME ZONE,
    credibility_score DECIMAL(3,2), -- AI-assessed credibility (0-1)
    access_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB -- Tool-specific metadata
);

-- AI Tags and Categories
CREATE TABLE idea_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES ideas(id),
    tag VARCHAR(100) NOT NULL,
    confidence DECIMAL(3,2), -- AI confidence in tag relevance
    tag_type VARCHAR(50) DEFAULT 'semantic', -- semantic, user, category
    created_by VARCHAR(50) DEFAULT 'ai' -- ai, user, system
);

-- MCP Tool Registry
CREATE TABLE mcp_tools (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    endpoint_url TEXT NOT NULL,
    auth_config JSONB, -- Encrypted authentication details
    capabilities JSONB, -- What the tool can do
    enabled BOOLEAN DEFAULT TRUE,
    last_used TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER DEFAULT 0
);

-- Future: Collaboration and Sharing (Phase 2+)
-- CREATE TABLE session_collaborators (
--     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
--     session_id UUID NOT NULL REFERENCES brainstorming_sessions(id),
--     user_id UUID NOT NULL REFERENCES auth.users(id),
--     permission_level VARCHAR(50) DEFAULT 'editor', -- viewer, editor, admin
--     invited_by UUID REFERENCES auth.users(id),
--     joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
-- );
```

### Architecture: Database Service Pattern

Following your established codebase patterns, the Enhanced Brainstorming Interface uses a **database service layer** approach instead of multiple API routes:

```typescript
// lib/brainstorming-database.ts - Single service class handles all operations
export class BrainstormingDatabaseService {
  // Session management
  async createSession(userId: string, title: string): Promise<BrainstormingSession | null>
  async getUserSessions(userId: string): Promise<BrainstormingSession[]>
  async getSession(sessionId: string, userId: string): Promise<BrainstormingSession | null>
  
  // Conversation management (Option 1: Reuse copilot tables)
  async createConversationThread(sessionId: string, userId: string): Promise<string | null>
  async saveMessage(threadId: string, role: string, content: string, toolCalls?: any): Promise<string | null>
  async getConversationHistory(threadId: string): Promise<CopilotMessage[]>
  
  // Idea management  
  async createIdea(sessionId: string, userId: string, content: string): Promise<Idea | null>
  async addIdeaToCanvas(sessionId: string, ideaContent: string, position: {x: number, y: number}): Promise<Idea | null>
  async getCanvasIdeas(sessionId: string, userId: string): Promise<Idea[]> // Only canvas ideas
  async updateIdea(ideaId: string, updates: IdeaUpdate): Promise<boolean>
  
  // AI integration
  async generateIdeasFromPrompt(sessionId: string, userId: string, prompt: string): Promise<Idea[]>
  async generateTagsForIdea(ideaId: string, content: string): Promise<IdeaTag[]>
  
  // Export
  async exportSessionToPresentation(sessionId: string, userId: string): Promise<string>
}
```

**Benefits of this approach:**
- **Consistent with existing codebase** (follows `lib/database.ts` and `lib/mcp-database.ts` patterns)
- **Better testability** (test service methods directly)
- **Reusable across UI and MCP** (same service used by components and MCP tools)
- **Type safety** (full TypeScript support)
- **Simpler architecture** (no intermediate API layer needed)

### Component Architecture
```
/components/brainstorming/
├── BrainstormingCanvas.tsx       # Main canvas component with AI chat + ideas canvas
├── AIConversation/
│   ├── AIConversation.tsx       # Main AI chat interface (Kibo-UI)
│   ├── AIInput.tsx             # AI input component (Kibo-UI)
│   ├── AIMessage.tsx           # AI message display (Kibo-UI)
│   ├── AIResponse.tsx          # AI response formatting (Kibo-UI)
│   ├── AIReasoning.tsx         # AI reasoning display (Kibo-UI)
│   ├── AISource.tsx            # AI source attribution (Kibo-UI)
│   ├── AISuggestion.tsx        # AI suggestions (Kibo-UI)
│   └── AITool.tsx              # AI tool calls display (Kibo-UI)
├── IdeasCanvas/
│   ├── IdeasCanvas.tsx         # Drag-drop canvas for ideas
│   ├── DraggableIdeaCard.tsx   # Draggable idea from AI responses
│   ├── IdeaCard.tsx            # Individual idea display
│   └── CanvasControls.tsx      # Canvas zoom, pan, organize controls
├── SessionManagement/
│   ├── SessionList.tsx         # List of brainstorming sessions
│   ├── CreateSessionDialog.tsx  # Create new session
│   └── SessionHeader.tsx       # Session title and metadata
├── SourceTracking/
│   ├── SourceInput.tsx         # Manual source addition
│   ├── SourceList.tsx          # Display idea sources
│   └── SourceTracker.tsx       # Automatic source detection
└── Future/
    └── CollaborationFeatures/  # Future collaboration components
```

## Step-by-Step Implementation with Testing

This implementation follows a strict test-driven approach where each step is validated before moving to the next. Every database change, API route, and component is tested both automatically and manually to ensure the system works at each increment.

### Step 1: Database Foundation (Week 1)

#### 1.1 Create Basic Session Table
**Implementation:**
```sql
CREATE TABLE brainstorming_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thread_id UUID REFERENCES copilot_threads(id), -- Link to conversation
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Automated Tests:**
- Database migration runs successfully
- Table exists with correct schema
- Foreign key constraint to auth.users works
- UUID generation works

**Manual Tests:**
- Connect to database and verify table exists
- Insert a test record manually
- Verify user_id references work

**Success Criteria:** ✅ Session table exists and accepts valid data

#### 1.2 Create Basic Ideas Table
**Implementation:**
```sql
CREATE TABLE ideas (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES brainstorming_sessions(id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Automated Tests:**
- Ideas table creation
- Foreign key relationships work
- Basic CRUD operations

**Manual Tests:**
- Create session, then create idea linked to it
- Verify cascade behavior when session is deleted

**Success Criteria:** ✅ Ideas can be linked to sessions properly

### Step 2: Database Service Layer (Week 2)

#### 2.1 Create Brainstorming Database Service
**Implementation:**
```typescript
// lib/brainstorming-database.ts
export class BrainstormingDatabaseService {
  private supabaseClient: SupabaseClient

  // Session management
  async createSession(userId: string, title: string, description?: string): Promise<BrainstormingSession | null>
  async getUserSessions(userId: string): Promise<BrainstormingSession[]>
  async getSession(sessionId: string, userId: string): Promise<BrainstormingSession | null>
  async updateSession(sessionId: string, updates: SessionUpdate): Promise<boolean>
  async deleteSession(sessionId: string, userId: string): Promise<boolean>

  // Idea management
  async createIdea(sessionId: string, userId: string, content: string): Promise<Idea | null>
  async getSessionIdeas(sessionId: string, userId: string): Promise<Idea[]>
  async updateIdea(ideaId: string, updates: IdeaUpdate): Promise<boolean>
  async deleteIdea(ideaId: string, userId: string): Promise<boolean>
}
```

**Automated Tests:**
```typescript
// __tests__/lib/brainstorming-database.test.ts
describe('BrainstormingDatabaseService', () => {
  test('createSession creates session with correct user_id', async () => {});
  test('getUserSessions returns only user sessions', async () => {});
  test('getSession enforces user ownership', async () => {});
  test('ideas belong to correct session and user', async () => {});
});
```

**Manual Tests:**
- Create database service instance
- Test session CRUD operations in Node.js console
- Verify user isolation works correctly
- Test foreign key constraints

**Success Criteria:** ✅ All database operations work through service layer

#### 2.2 Extend DatabaseService Types
**Implementation:**
```typescript
// lib/database.ts - Add new types
export type BrainstormingSession = Database['public']['Tables']['brainstorming_sessions']['Row']
export type BrainstormingSessionInsert = Database['public']['Tables']['brainstorming_sessions']['Insert']
export type BrainstormingSessionUpdate = Database['public']['Tables']['brainstorming_sessions']['Update']

export type Idea = Database['public']['Tables']['ideas']['Row']
export type IdeaInsert = Database['public']['Tables']['ideas']['Insert']
export type IdeaUpdate = Database['public']['Tables']['ideas']['Update']
```

**Manual Tests:**
- Verify TypeScript types are correct
- Test type checking with sample data
- Ensure compatibility with existing patterns

**Success Criteria:** ✅ Type system supports new brainstorming entities

### Step 3: Basic UI Components (Week 3)

#### 3.1 Create Page Integration & Routing
**Implementation:**
```typescript
// app/create/page.tsx - Update third card to enable brainstorming
// Remove disabled state from "Start with AI Brainstorming" card
// Link to /create/brainstorm

// app/create/brainstorm/page.tsx - New brainstorming page
// Main entry point for brainstorming feature
// Creates new session automatically on load
```

**Manual Tests:**
- Navigate to /create page
- Click "Start with AI Brainstorming" (third card)
- Verify redirects to /create/brainstorm
- Verify new session is created automatically

**Success Criteria:** ✅ Brainstorming accessible from /create page third card

#### 3.3 Basic Brainstorming Canvas Structure
**Implementation:**
```typescript
// components/brainstorming/BrainstormingCanvas.tsx
// Split screen: AI conversation on left, ideas canvas on right
// Uses brainstormingDb.getSessionIdeas() for canvas ideas only

// app/create/brainstorm/[sessionId]/page.tsx
// Main brainstorming interface with both AI chat and canvas
```

**Manual Tests:**
- Navigate to /create/brainstorm/[sessionId]
- Verify split screen layout appears
- Verify AI conversation panel on left
- Verify ideas canvas on right

**Success Criteria:** ✅ Basic brainstorming interface structure is ready

### Step 4: Source Tracking Foundation (Week 4)

#### 4.1 Sources Database Schema & Service Methods
**Implementation:**
```sql
CREATE TABLE idea_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES ideas(id),
    source_type VARCHAR(50) NOT NULL,
    source_url TEXT,
    source_title VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

```typescript
// Add to lib/brainstorming-database.ts
async createIdeaSource(ideaId: string, sourceData: IdeaSourceInsert): Promise<IdeaSource | null>
async getIdeaSources(ideaId: string): Promise<IdeaSource[]>
async deleteIdeaSource(sourceId: string): Promise<boolean>
```

**Tests:** Database service methods for source management

**Success Criteria:** ✅ Ideas can have multiple sources via database service

#### 4.2 Basic Source Attribution UI
**Implementation:**
```typescript
// components/brainstorming/SourceInput.tsx - Uses brainstormingDb.createIdeaSource()
// components/brainstorming/SourceList.tsx - Uses brainstormingDb.getIdeaSources()
// Integrate with IdeaCard component
```

**Manual Tests:**
- Add source when creating idea (via database service)
- View source information
- Edit source details
- Delete sources

**Success Criteria:** ✅ Users can manually add sources to ideas using database service

### Step 5: AI Integration - Basic (Week 5)

#### 5.1 Simple AI Idea Generation
**Implementation:**
```typescript
// Add to lib/brainstorming-database.ts
async generateIdeasFromPrompt(
  sessionId: string, 
  userId: string, 
  prompt: string
): Promise<Idea[]> {
  // Use existing Groq integration from lib/ai/generation.ts
  // Generate 3-5 ideas
  // Save to conversation history (not directly to canvas)
  // Return created ideas for user to drag to canvas
}

// Ideas only saved to canvas when user drags them
async addIdeaToCanvas(
  sessionId: string,
  userId: string, 
  ideaContent: string,
  position: { x: number, y: number }
): Promise<Idea | null> {
  // Save idea with canvas position
  // This is what gets used for presentation generation
}
```

**Note:** Only ideas explicitly added to the canvas (via drag-drop) will be used for presentation generation.

**Manual Tests:**
- Enter prompt "Marketing strategies for coffee shop"
- Verify AI generates 3-5 ideas in conversation
- Drag one idea to canvas
- Verify only canvas idea persists in database
- Verify only canvas ideas appear in export

**Success Criteria:** ✅ AI generates ideas in conversation, user controls which go to canvas

#### 5.2 AI-Powered Tagging
**Implementation:**
```sql
CREATE TABLE idea_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    idea_id UUID NOT NULL REFERENCES ideas(id),
    tag VARCHAR(100) NOT NULL,
    confidence DECIMAL(3,2),
    created_by VARCHAR(50) DEFAULT 'ai'
);
```

```typescript
// Add to lib/brainstorming-database.ts
async generateTagsForIdea(ideaId: string, content: string): Promise<IdeaTag[]> {
  // Use existing Groq integration to analyze content
  // Generate relevant tags with confidence scores
  // Save to database
  // Return created tags
}
```

**Manual Tests:**
- Create ideas with different content
- Verify AI automatically suggests tags via database service
- Test tag accuracy and relevance
- Verify tags persist in database

**Success Criteria:** ✅ Ideas get automatically tagged by AI using database service

### Step 6: AI Conversation Interface with Kibo-UI (Week 6)

#### 6.1 Install and Setup Kibo-UI Components
**Implementation:**
```bash
# Install kibo-ui components
npm install @kibo-ui/ai
# Or copy components from the repository structure:
# - packages/ai/conversation.tsx
# - packages/ai/input.tsx
# - packages/ai/message.tsx
# - packages/ai/reasoning.tsx
# - packages/ai/response.tsx
# - packages/ai/source.tsx
# - packages/ai/suggestion.tsx
# - packages/ai/tool.tsx
```

```typescript
// components/brainstorming/AIConversation.tsx
import { AIConversation, AIInput, AIMessage, AIResponse } from '@kibo-ui/ai'

export function BrainstormingAIChat({ sessionId }: { sessionId: string }) {
  // Implement AI conversation interface
  // Use existing Groq integration for AI responses
  // Support markdown rendering and tool calls
}
```

**Manual Tests:**
- Setup kibo-ui components in project
- Create basic AI conversation interface
- Test input/response cycle
- Verify markdown rendering works

**Success Criteria:** ✅ Kibo-UI AI conversation interface is functional

#### 6.2 AI Chat with MCP Tool Integration
**Implementation:**
```typescript
// lib/mcp-client.ts - New MCP client service
export class McpClientService {
  async discoverAvailableTools(): Promise<McpTool[]>
  async executeToolCall(toolName: string, parameters: any): Promise<any>
  async connectToMcpServer(serverUrl: string): Promise<boolean>
}

// Add to lib/brainstorming-database.ts
async createAIConversation(
  sessionId: string,
  userId: string,
  userMessage: string
): Promise<{
  aiResponse: string,
  generatedIdeas?: Idea[],
  toolCalls?: any[],
  sources?: string[]
}> {
  // Get or create conversation thread
  const session = await this.getSession(sessionId, userId);
  let threadId = session.thread_id;
  
  if (!threadId) {
    // Create thread using existing DatabaseService
    threadId = await db.createThread(sessionId, 'Brainstorming Session', userId);
    // Update session with thread_id
  }
  
  // Save user message
  await db.createMessage(threadId, 'user', userMessage);
  
  // Send to AI (Groq)
  const aiResponse = await generateAIResponse(userMessage);
  
  // Save AI response with tool calls and generated ideas
  await db.createMessage(threadId, 'assistant', aiResponse.content, {
    toolCalls: aiResponse.toolCalls,
    generatedIdeas: aiResponse.ideas
  });
  
  return aiResponse;
}
```

**Manual Tests:**
- Test AI conversation with tool calling capability
- Verify AI can call external MCP tools
- Test idea generation as JSON response
- Verify conversation history persists

**Success Criteria:** ✅ AI conversation supports MCP tool calling and idea generation

### Step 7: Drag-Drop Ideas Canvas (Week 7)

#### 7.1 Interactive Ideas Canvas
**Implementation:**
```typescript
// components/brainstorming/IdeasCanvas.tsx
export function IdeasCanvas({ sessionId }: { sessionId: string }) {
  // Canvas where users can drag AI-generated ideas
  // Ideas from AI conversation appear as draggable cards
  // Support positioning ideas on canvas
  // Auto-save positions to database
}

// components/brainstorming/DraggableIdeaCard.tsx
export function DraggableIdeaCard({ idea, onDrop }: IdeaCardProps) {
  // Draggable idea card from AI responses
  // Can be dropped onto canvas
  // Maintains idea content and metadata
}
```

**Manual Tests:**
- AI generates ideas in conversation
- Ideas appear as draggable cards
- Drag ideas to canvas positions
- Verify positions persist after refresh
- Test with multiple ideas

**Success Criteria:** ✅ Users can drag AI-generated ideas to organized canvas

#### 7.2 AI Conversation with Contextual Awareness
**Implementation:**
```typescript
// Add to lib/brainstorming-database.ts
async getConversationContext(sessionId: string): Promise<{
  existingIdeas: Idea[],
  conversationHistory: AIMessage[],
  sessionGoals: string[]
}> {
  // Provide AI with context about current session
  // Include existing ideas on canvas
  // Include conversation history
  // Help AI generate relevant suggestions
}
```

**Manual Tests:**
- AI should be aware of existing ideas on canvas
- AI suggestions should build on previous conversation
- Test contextual relevance of AI responses
- Verify AI doesn't duplicate existing ideas

**Success Criteria:** ✅ AI conversation is contextually aware of session state

### Step 8: Export to Presentations (Week 8)

#### 8.1 Export Using Existing Generation Flow
**Implementation:**
```typescript
// Add to lib/brainstorming-database.ts
async exportSessionToPresentation(
  sessionId: string, 
  userId: string,
  exportOptions?: {
    title?: string,
    style?: string,
    slideCount?: number
  }
): Promise<string> {
  // Get ONLY canvas ideas (not all conversation ideas)
  const canvasIdeas = await this.getCanvasIdeas(sessionId, userId);
  
  // Convert canvas ideas to prompt
  const prompt = this.convertIdeasToPrompt(canvasIdeas);
  
  // Use existing flow from /create/generate:
  // 1. Generate outline using existing AI tools
  // 2. Generate slides from outline
  // 3. Use existing db.createPresentation() and db.saveSlides()
  
  // Alternative: Use existing MCP create_presentation tool
  // await mcpServer.tools.create_presentation({ prompt, ... })
  
  return presentationId;
}
```

**Note:** Reuses well-tested code from `/create/generate` flow for outline → presentation generation.

**Manual Tests:**
- Add 5+ ideas to canvas (drag from AI conversation)
- Click "Export to Presentation"
- Verify uses same generation flow as /create/generate
- Verify only canvas ideas are included
- Check presentation quality matches existing flow

**Success Criteria:** ✅ Canvas ideas export using proven generation pipeline

### Step 9: Polish and Integration (Week 9)

#### 9.1 UI/UX Improvements
- Visual polish for canvas
- Better idea organization
- Drag and drop functionality

#### 9.2 Performance Testing
**Tests:**
- Load session with 100+ ideas
- Test search performance
- Verify AI response times

**Success Criteria:** ✅ System performs well under realistic load

## Testing Strategy

### Automated Testing
```bash
# Run after each step
npm run test                    # Unit tests
npm run test:integration       # API integration tests
npm run test:e2e              # End-to-end tests
npm run lint                  # Code quality
npm run build                 # Build verification
```

### Manual Testing Checklist
Each step includes a manual testing section that you should complete before moving to the next step. This ensures:

1. **Functionality Works**: The feature actually does what it's supposed to do
2. **User Experience**: The interface is intuitive and responsive
3. **Data Persistence**: Changes are saved and retrieved correctly
4. **Error Handling**: System gracefully handles edge cases
5. **Performance**: Features work smoothly under normal use

### Success Gates
Each step has clear **Success Criteria** that must be met before proceeding. If any criteria isn't met, we fix the issues before moving forward.

### Rollback Strategy
If a step fails after implementation:
1. Roll back database migrations
2. Revert code changes to last working state  
3. Identify and fix root cause
4. Re-implement step with fixes

This approach ensures we build a solid foundation at each step rather than creating a fragile system that breaks under real use.

## Key Differentiators

### 1. **AI-First Brainstorming with MCP Tool Integration**
- Kibo-UI powered conversational interface with AI assistant
- AI can call external MCP tools for live data access and actions
- Platform acts as MCP client, not server - connecting to external tools
- Real-time data integration through AI tool calling

### 2. **Conversational Idea Generation**
- Natural language brainstorming through AI chat
- AI generates structured ideas as JSON responses
- Drag-drop interface for organizing AI-generated ideas
- Contextual awareness of existing ideas and conversation history

### 3. **Interactive Ideas Canvas**
- Visual organization of ideas through drag-drop interface
- Ideas generated from AI conversation can be positioned on canvas
- Persistent positioning and organization
- Canvas-based workflow instead of traditional mind mapping

### 4. **Seamless Export Integration**
- Direct export from organized ideas canvas to presentation generation
- Preserve idea context and AI conversation history
- Source attribution from AI responses and tool calls
- Maintain workflow continuity from brainstorming to presentation

## Success Metrics

### User Engagement
- AI conversation session duration and frequency
- Ideas generated per conversation
- Canvas interaction and idea organization
- Export to presentation conversion rate
- MCP tool usage through AI calls

### AI Effectiveness
- AI conversation quality and relevance
- Idea generation acceptance rate from AI responses
- MCP tool call success rate and usefulness
- User satisfaction with AI brainstorming assistance
- Contextual awareness and conversation continuity

### Future Collaboration Metrics (Post-MVP)
- Multi-user session participation
- Idea building and refinement cycles
- Knowledge sharing between team members
- Decision-making speed improvement

## Technical Considerations

### Performance
- Efficient canvas rendering for large idea collections
- Intelligent caching for AI-generated content
- Progressive loading for source-heavy sessions
- Optimized MCP tool connection pooling

### Security
- Secure MCP tool authentication and authorization (leveraging existing API key system)
- Data privacy controls for personal brainstorming sessions
- Audit logging for idea sources and AI interactions
- Rate limiting for MCP tool usage

### Scalability
- Efficient vector storage for semantic search
- Background processing for AI operations
- CDN optimization for media-rich content
- Database optimization for large idea collections

## MCP Client Integration Architecture

The Enhanced Brainstorming Interface acts as an **MCP client** (not server), connecting to external MCP tools through the AI conversation interface:

### MCP Client Pattern
- **Client-side Integration**: Platform connects TO external MCP servers
- **AI-Mediated Tool Calling**: AI assistant calls MCP tools during conversation
- **Kibo-UI Integration**: Tool calls displayed through AITool component
- **Real-time Data Access**: AI can fetch live data through connected MCP tools

### MCP Client Service Architecture
```typescript
// lib/mcp-client.ts - New MCP client service
export class McpClientService {
  async discoverTools(serverUrl: string): Promise<McpTool[]>
  async executeToolCall(toolName: string, params: any): Promise<any>
  async connectToServer(serverUrl: string): Promise<boolean>
  async listConnectedServers(): Promise<McpServer[]>
}
```

### Integration with AI Conversation
1. **Tool Discovery**: AI can discover available MCP tools
2. **Contextual Tool Calling**: AI decides when to call tools based on conversation
3. **Results Integration**: Tool results become part of AI response and idea generation
4. **Source Attribution**: Tool calls are tracked as sources for generated ideas

This implementation plan positions the Enhanced Brainstorming Interface as a unique, AI-first conversational brainstorming platform that leverages MCP client integration and Kibo-UI components to create an unprecedented brainstorming experience where users chat with AI, AI calls external tools for live data, and ideas are organized through an intuitive drag-drop canvas interface.