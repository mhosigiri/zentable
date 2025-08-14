#!/bin/bash

# Zentable MCP Server Launcher
# This script ensures proper ES module loading for the standalone MCP server

cd "$(dirname "$0")"

# Check if environment variables are set
if [ -z "$ZENTABLE_API_KEY" ]; then
    echo "❌ Error: ZENTABLE_API_KEY environment variable is required"
    echo "Get your API key from: https://zentableai.com/dashboard/settings"
    exit 1
fi

# Set default server URL if not provided
export ZENTABLE_SERVER_URL=${ZENTABLE_SERVER_URL:-"https://zentableai.com"}

# Launch the MCP server with ES module support
exec node zentable-mcp.mjs 