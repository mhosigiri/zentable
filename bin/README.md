# Zentable MCP Server

Generate presentations directly from your favorite AI tools using the Model Context Protocol (MCP).

## Installation

No installation required! Just use npx:

```bash
npx @menlopark/zentable-mcp
```

## Quick Setup

1. **Get your API key** from [Zentable Dashboard](https://zentableai.com/dashboard/settings)
2. **Configure your AI tool** with the MCP server
3. **Start creating presentations** with natural language

## Supported AI Tools

- **Claude Code**: Natural language presentation generation
- **Cursor**: AI-powered code editor with MCP support
- **Windsurf**: Codeium's AI development environment  
- **Claude Desktop**: Anthropic's desktop AI assistant
- **VS Code Copilot**: GitHub Copilot with MCP integration

## Configuration Examples

### Claude Code (.claude/mcp.json)
```json
{
  "mcpServers": {
    "zentable": {
      "command": "npx",
      "args": ["-y", "@menlopark/zentable-mcp@latest"],
      "env": {
        "ZENTABLE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Cursor (.cursor/mcp.json)
```json
{
  "mcpServers": {
    "zentable": {
      "command": "npx",
      "args": ["-y", "@menlopark/zentable-mcp@latest"],
      "env": {
        "ZENTABLE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Windsurf (mcp.json)
```json
{
  "mcpServers": {
    "zentable": {
      "command": "npx",
      "args": ["-y", "@menlopark/zentable-mcp@latest"],
      "env": {
        "ZENTABLE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### Claude Desktop (claude_desktop_config.json)
```json
{
  "mcpServers": {
    "zentable": {
      "command": "npx",
      "args": ["-y", "@menlopark/zentable-mcp@latest"],
      "env": {
        "ZENTABLE_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

### VS Code Copilot (.vscode/mcp.json)
```json
{
  "inputs": [
    {
      "type": "promptString",
      "id": "zentable-api-key",
      "description": "Zentable API Key",
      "password": true
    }
  ],
  "servers": {
    "zentable": {
      "command": "npx",
      "args": ["-y", "@menlopark/zentable-mcp@latest"],
      "env": {
        "ZENTABLE_API_KEY": "${input:zentable-api-key}"
      }
    }
  }
}
```

## Usage Examples

Once configured, you can generate presentations with natural language:

- "Create a presentation about Machine Learning with 8 slides"
- "Generate a professional presentation on Climate Change"
- "Make a detailed presentation about Web Development Best Practices"

## Features

- **15+ Professional Templates**: Choose from modern, minimal, creative styles
- **Smart Content Generation**: AI-powered slide content and structure
- **Multiple Languages**: Generate presentations in any language
- **Flexible Length**: Brief, medium, or detailed content options
- **3-20 Slides**: Customizable presentation length

## Environment Variables

- `ZENTABLE_API_KEY`: Your Zentable API key (required)
- `ZENTABLE_SERVER_URL`: Server URL (optional, defaults to https://zentableai.com)

## Support

- **Documentation**: [Zentable MCP Guide](https://zentableai.com/dashboard/settings)
- **API Keys**: [Get your API key](https://zentableai.com/dashboard/settings)
- **Website**: [zentableai.com](https://zentableai.com)

## License

MIT