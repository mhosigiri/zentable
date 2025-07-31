# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev        # Start development server (Next.js)
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Run ESLint
```

### Testing & MCP
```bash
npm run test:mcp             # Test MCP integration
npm run test:standalone-mcp  # Test standalone MCP server
npm run mcp:serve           # Start MCP server
```

### Running Tests
- Test pages available at: `/test-title-bullets-image`, `/test-text-image`, `/test-image-text`
- No unit test framework configured - use manual testing with test pages

## Architecture Overview

### Tech Stack
- **Next.js 13.5.1** with App Router (React 18.2.0)
- **Supabase** for database and authentication (PostgreSQL with RLS)
- **AI Integration**: Vercel AI SDK with Groq (Llama 3), OpenAI, Azure, Replicate
- **UI**: Tailwind CSS, Radix UI/shadcn components, TipTap editor
- **State**: React hooks, Context API, localStorage for drafts

### Key Patterns

**API Routes Structure**:
- `/app/api/generate-outline` - Presentation outline generation
- `/app/api/generate-slide` - Individual slide generation (with streaming)
- `/app/api/generate-image` - AI image generation (Replicate Flux)
- `/app/api/mcp/*` - Model Context Protocol endpoints

**Database Schema** (Supabase):
- `presentations` - Main presentation data
- `slides` - Individual slides with content
- `slide_images` - Multiple images per slide support
- `profiles` - User profiles with subscription tiers
- `api_keys` - Hashed API keys for MCP access

**AI Integration Pattern**:
```typescript
// Streaming responses with cost optimization
const result = streamText({
  model: groq('llama-3.3-70b-versatile'),
  messages,
  tools: slideTools,
  maxSteps: 5
});
return result.toDataStreamResponse();
```

**Image Generation Optimization**:
- Images generated ONLY after streaming completes
- Duplicate call prevention with `isGeneratingImage` flag
- Single API call per slide to minimize costs

### Component Organization
- `/components/slides/` - 18+ slide templates (e.g., TitleWithBulletsAndImage)
- `/components/dashboard/` - Dashboard UI with analytics
- `/components/editor/` - TipTap rich text editor setup
- `/components/assistant-ui/` - AI chat interface components
- `/lib/ai/` - AI tools, prompts, and generation logic
- `/lib/supabase/` - Database utilities and auth

### Authentication Flow
1. Supabase Auth with OAuth support
2. Middleware-based session management (`middleware.ts`)
3. Protected routes redirect to `/auth/login`
4. API key auth for MCP endpoints (SHA-256 hashed)

### Development Standards
- Strict TypeScript with Zod schema validation
- Component patterns follow shadcn/ui conventions
- AI tools defined with clear descriptions and parameters
- Error handling with structured responses
- No proactive documentation generation unless requested

### Environment Variables Required
```
SUPABASE_URL
SUPABASE_ANON_KEY
GROQ_API_KEY
OPENAI_API_KEY (optional)
AZURE_OPENAI_* (optional, see AZURE_SETUP.md)
REPLICATE_API_TOKEN
```

### Important Notes
- Theme system: 27+ themes in `/lib/themes.ts`
- Export to PDF via jsPDF
- MCP integration allows usage from any MCP-compatible tool
- Cost optimization: Image generation happens post-streaming
- RLS policies enforce multi-tenancy in Supabase

### Avatar Storage Setup
To enable avatar uploads in user profile settings, create a storage bucket in Supabase:
1. Go to Supabase Dashboard > Storage
2. Create a new bucket named "avatars"
3. Set the bucket to public (for avatar URLs to work)
4. Add RLS policies to allow authenticated users to upload their own avatars