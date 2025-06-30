# SlidesAI MCP Server Implementation

A minimal, production-ready implementation of Model Context Protocol (MCP) server for the SlidesAI presentation generator.

## 🎯 Overview

This implementation allows users to generate presentations from any MCP-compatible AI tool (Claude Desktop, Cursor, Windsurf, VS Code Copilot, etc.) using a simple API key authentication system.

We provide two deployment options:
1. **Standalone npm package** (recommended) - Can be used with `npx` like other MCP servers
2. **HTTP API endpoint** - For custom integrations

## 📁 Implementation Structure

```
├── app/api/
│   ├── api-keys/route.ts          # API key CRUD operations
│   ├── mcp/route.ts               # Main MCP server endpoint
│   └── mcp/test/route.ts          # Test endpoint for validation
├── bin/
│   └── slides-ai-mcp.js           # Standalone MCP server (npm package)
├── components/dashboard/
│   ├── api-keys-section.tsx       # API key management UI
│   └── mcp-integration-guide.tsx  # User-friendly setup guide
├── lib/
│   ├── api-keys.ts               # API key utilities (generation, hashing)
│   └── database.ts               # Database methods (already had MCP methods)
├── supabase/migrations/
│   └── 20241220_add_api_keys.sql # Database schema for API keys
├── scripts/
│   ├── test-mcp.js               # HTTP API test script
│   └── test-standalone-mcp.js    # Standalone server test script
└── docs/
    └── MCP_INTEGRATION.md        # Developer documentation
```

## 🔧 Key Features

### ✅ **Secure Authentication**
- API keys are hashed using SHA-256 before storage
- Keys have format `slai_[64-character-hex]` for easy identification
- Row Level Security (RLS) policies ensure users only see their own keys

### ✅ **Stateless MCP Server**
- Uses HTTP transport (not stdio/SSE) for better compatibility
- Stateless design - each request is independent
- Proper JSON-RPC 2.0 implementation

### ✅ **Single Tool: `create_presentation`**
- Combines outline generation + slide creation in one tool
- Accepts parameters: prompt, slideCount, style, language, contentLength
- Saves presentations directly to user's dashboard

### ✅ **User-Friendly Documentation**
- Comprehensive setup guide in dashboard
- Tool-specific configuration examples
- Copy-paste ready JSON configurations

### ✅ **Testing & Validation**
- Test endpoint at `/api/mcp/test`
- Command-line test script
- API key validation with helpful error messages

## 🚀 Quick Setup

1. **Database Migration** (Already done)
   ```sql
   -- Creates api_keys table with RLS policies
   ```

2. **Create API Key**
   - Go to Dashboard → Settings
   - Click "Create API Key"
   - Copy the key (shown only once)

3. **Configure AI Tool**

   **Option A: Standalone Server (Recommended)**
   ```json
   {
     "mcpServers": {
       "slides-ai": {
         "command": "npx",
         "args": ["-y", "@your-company/slides-ai-mcp@latest"],
         "env": {
           "SLIDES_AI_API_KEY": "YOUR_API_KEY",
           "SLIDES_AI_SERVER_URL": "https://your-domain.com"
         }
       }
     }
   }
   ```

   **Option B: HTTP API (Custom)**
   ```json
   {
     "mcpServers": {
       "slides-ai": {
         "command": "curl",
         "args": [
           "-X", "POST",
           "-H", "Content-Type: application/json", 
           "-H", "Authorization: Bearer YOUR_API_KEY",
           "-d", "@-",
           "https://your-domain.com/api/mcp"
         ]
       }
     }
   }
   ```

4. **Test Connection**
   ```bash
   # Test standalone server
   npm run test:standalone-mcp YOUR_API_KEY
   
   # Test HTTP API
   npm run test:mcp YOUR_API_KEY
   ```

## 🎛️ API Endpoints

### `/api/mcp` (POST)
Main MCP server endpoint. Accepts JSON-RPC 2.0 requests.

**Supported Methods:**
- `tools/list` - Returns available tools
- `tools/call` - Execute the create_presentation tool

### `/api/mcp/test` (GET/POST)  
Test endpoint for validation.
- GET: Returns server status
- POST: Validates API key authentication

### `/api/api-keys` (GET/POST/DELETE)
CRUD operations for API key management.

## 🛠️ Tool Parameters

The `create_presentation` tool accepts:

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `prompt` | string | required | Topic or content description |
| `slideCount` | number | 5 | Number of slides (3-20) |
| `style` | enum | professional | Presentation style |
| `language` | string | en | Content language |
| `contentLength` | enum | medium | Detail level (brief/medium/detailed) |

## 🧪 Testing

```bash
# Test with API key
npm run test:mcp slai_abc123...

# Test basic connectivity
curl https://your-domain.com/api/mcp/test

# Test with authentication
curl -X POST https://your-domain.com/api/mcp/test \
  -H "Authorization: Bearer slai_abc123..."
```

## 🔐 Security Features

- **Hashed Storage**: API keys are SHA-256 hashed, never stored in plaintext
- **RLS Policies**: Database-level security ensuring user isolation  
- **Key Prefixes**: Visible prefixes for user identification without exposing full key
- **Format Validation**: Strict API key format validation
- **Usage Tracking**: Last used timestamps for monitoring

## 🎯 KISS Principle Applied

This implementation follows the "Keep It Simple, Stupid" principle:

1. **Single Tool**: Only `create_presentation` - covers 80% of use cases
2. **Stateless Design**: No session management complexity
3. **Standard Transport**: HTTP instead of custom protocols
4. **Existing Infrastructure**: Leverages current database and AI setup
5. **Minimal Dependencies**: Uses existing Supabase + Vercel AI SDK

## 🔄 Future Enhancements

Potential additions (keeping it simple):
- Rate limiting per API key
- Usage analytics/metrics
- Additional tools (edit_slide, delete_presentation)
- Webhook notifications for presentation completion

## 📖 User Documentation

The dashboard includes comprehensive setup guides for:
- **Cursor**: `.cursor/mcp.json` configuration
- **Windsurf**: MCP server configuration
- **Claude Desktop**: `claude_desktop_config.json` setup  
- **VS Code Copilot**: `.vscode/mcp.json` with input prompts

## 🎉 Success Criteria

✅ Users can create API keys easily  
✅ Setup guides are clear and copy-pastable  
✅ MCP integration works with major AI tools  
✅ Presentations appear in user dashboard immediately  
✅ Error messages are helpful and actionable  
✅ Implementation is maintainable and extensible

---

*Implementation follows [Supabase MCP patterns](https://supabase.com/docs/guides/getting-started/mcp) and [Stripe LLM best practices](https://docs.stripe.com/building-with-llms)* 