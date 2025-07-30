#!/bin/bash

# Load environment variables from .env.local
if [ -f .env.local ]; then
    export $(grep -v '^#' .env.local | xargs)
fi

# Check if required variables are set
if [ -z "$AZURE_OPENAI_API_KEY" ] && [ -z "$AZURE_API_KEY" ]; then
    echo "❌ Error: AZURE_OPENAI_API_KEY or AZURE_API_KEY not set"
    exit 1
fi

if [ -z "$AZURE_OPENAI_ENDPOINT" ]; then
    echo "❌ Error: AZURE_OPENAI_ENDPOINT not set"
    exit 1
fi

# Use the first available API key
API_KEY=${AZURE_OPENAI_API_KEY:-$AZURE_API_KEY}
ENDPOINT=$AZURE_OPENAI_ENDPOINT
DEPLOYMENT_NAME="gpt-4o-mini"  # Change this to match your actual deployment
API_VERSION="2024-07-18"

echo "🔍 Testing Azure OpenAI with curl..."
echo "Endpoint: $ENDPOINT"
echo "Deployment: $DEPLOYMENT_NAME"
echo "API Version: $API_VERSION"
echo ""

# Test 1: List deployments (to see what's available)
echo "📋 Test 1: List available deployments"
echo "URL: ${ENDPOINT}openai/deployments?api-version=${API_VERSION}"
echo ""

curl -s -X GET \
  "${ENDPOINT}openai/deployments?api-version=${API_VERSION}" \
  -H "api-key: $API_KEY" \
  -H "Content-Type: application/json" | jq . 2>/dev/null || curl -s -X GET \
  "${ENDPOINT}openai/deployments?api-version=${API_VERSION}" \
  -H "api-key: $API_KEY" \
  -H "Content-Type: application/json"

echo -e "\n" 

# Test 2: Try chat completion with the deployment
echo "💬 Test 2: Test chat completion"
echo "URL: ${ENDPOINT}openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}"
echo ""

curl -s -X POST \
  "${ENDPOINT}openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}" \
  -H "api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "'$DEPLOYMENT_NAME'",
    "messages": [
      {
        "role": "system", 
        "content": "You are a helpful assistant."
      },
      {
        "role": "user", 
        "content": "Say hello from Azure OpenAI!"
      }
    ],
    "max_tokens": 50,
    "temperature": 0.2
  }' | jq . 2>/dev/null || curl -s -X POST \
  "${ENDPOINT}openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION}" \
  -H "api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "'$DEPLOYMENT_NAME'",
    "messages": [
      {
        "role": "system", 
        "content": "You are a helpful assistant."
      },
      {
        "role": "user", 
        "content": "Say hello from Azure OpenAI!"
      }
    ],
    "max_tokens": 50,
    "temperature": 0.2
  }'

echo -e "\n"

# Test 3: Try a different API version
echo "🔄 Test 3: Try with different API version (2024-10-01-preview)"
API_VERSION_ALT="2024-10-01-preview"
echo "URL: ${ENDPOINT}openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION_ALT}"
echo ""

curl -s -X POST \
  "${ENDPOINT}openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION_ALT}" \
  -H "api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "'$DEPLOYMENT_NAME'",
    "messages": [
      {
        "role": "user", 
        "content": "Hello!"
      }
    ],
    "max_tokens": 20
  }' | jq . 2>/dev/null || curl -s -X POST \
  "${ENDPOINT}openai/deployments/${DEPLOYMENT_NAME}/chat/completions?api-version=${API_VERSION_ALT}" \
  -H "api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "'$DEPLOYMENT_NAME'",
    "messages": [
      {
        "role": "user", 
        "content": "Hello!"
      }
    ],
    "max_tokens": 20
  }'

echo -e "\n"
echo "✅ curl tests completed!"
echo ""
echo "📝 Instructions:"
echo "1. Check Test 1 output to see your available deployments"
echo "2. If the deployment name is different, update DEPLOYMENT_NAME in this script"
echo "3. If you get 404 errors, verify your endpoint URL format"
echo "4. If you get 401 errors, check your API key" 