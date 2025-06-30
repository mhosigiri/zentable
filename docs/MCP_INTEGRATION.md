# MCP Integration Guide

This guide explains how to use your SlidesAI app as an MCP (Model Context Protocol) server to create presentations from other applications like Claude Desktop, Cursor, Windsurf, etc.

## Quick Start

1. **Create an API Key**
   - Go to [Dashboard Settings](/dashboard/settings)
   - Click "Create API Key"
   - Give it a name (e.g., "Claude Desktop")
   - Copy and save the key (you'll only see it once!)

2. **Configure Your MCP Client**
   - **Server URL:** `https://your-domain.com/api/mcp`
   - **Authentication:** `Bearer YOUR_API_KEY`

## Supported Tools

### `create_presentation`
Generate a complete presentation with multiple slides.

**Parameters:**
- `prompt` (string, required): The topic or content description
- `slideCount` (number, 3-20, default: 5): Number of slides to generate
- `style` (enum, default: "professional"): One of: default, modern, minimal, creative, professional
- `language` (string, default: "en"): Language for the content
- `contentLength` (enum, default: "medium"): One of: brief, medium, detailed

**Example:**
```json
{
  "name": "create_presentation",
  "arguments": {
    "prompt": "Introduction to Machine Learning",
    "slideCount": 8,
    "style": "professional",
    "language": "en",
    "contentLength": "detailed"
  }
}
```

## MCP Client Configuration

### Claude Desktop

Add to your `claude_desktop_config.json`:

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

### Cursor/Windsurf

Configure in your MCP settings with:
- Server URL: `https://your-domain.com/api/mcp`
- Authorization Header: `Bearer YOUR_API_KEY`

## Usage Examples

### In Claude Desktop
```
@slides-ai create a presentation about "The Future of Remote Work" with 6 slides in a modern style
```

### In Cursor
Use the MCP integration to call:
```typescript
await mcp.callTool('create_presentation', {
  prompt: 'Data Science Best Practices',
  slideCount: 10,
  style: 'professional',
  contentLength: 'detailed'
})
```

## Features

- ✅ **Secure Authentication** - API key-based authentication
- ✅ **Multiple Templates** - 15+ slide templates automatically selected
- ✅ **AI-Generated Content** - Rich, presentation-ready content
- ✅ **Dashboard Integration** - All presentations appear in your dashboard
- ✅ **Export Options** - PDF export, sharing, editing
- ✅ **Theme Support** - Multiple visual themes

## Troubleshooting

### Invalid API Key
- Ensure you're using the correct API key
- Check that the key is active in Dashboard Settings
- Verify the Authorization header format: `Bearer slai_...`

### Network Issues
- Confirm your server URL is correct
- Check firewall/proxy settings
- Verify HTTPS is working

### Tool Not Found
- Ensure you're calling `create_presentation` (exact name)
- Check the MCP client configuration
- Verify the server is responding to tools/list

## Testing

Run the test script to verify everything works:

```bash
node scripts/test-mcp.js YOUR_API_KEY
```

## Rate Limits

- API keys are tracked for usage monitoring
- No hard rate limits currently (subject to change)
- Be respectful with usage

## Security

- API keys are hashed and stored securely
- Keys can be revoked immediately from the dashboard
- All presentations are private to your account

## Support

If you encounter issues:
1. Check your API key is active in Dashboard Settings
2. Run the test script to isolate the problem
3. Check browser network tab for error details
4. Create an issue with error logs and steps to reproduce 