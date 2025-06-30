#!/bin/bash

# SlidesAI MCP Server Launcher
# This script ensures proper ES module loading for the standalone MCP server

cd "$(dirname "$0")"

# Check if environment variables are set
if [ -z "$SLIDES_AI_API_KEY" ]; then
    echo "❌ Error: SLIDES_AI_API_KEY environment variable is required"
    echo "Get your API key from your SlidesAI dashboard settings"
    exit 1
fi

# Set default server URL if not provided
export SLIDES_AI_SERVER_URL=${SLIDES_AI_SERVER_URL:-"http://localhost:3000"}

# Launch the MCP server with ES module support
exec node slides-ai-mcp.mjs 