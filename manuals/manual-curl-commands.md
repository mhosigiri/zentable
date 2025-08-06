# Manual curl Commands for Azure OpenAI Testing

Replace the placeholders with your actual values:
- `YOUR_API_KEY`: Your Azure OpenAI API key
- `YOUR_ENDPOINT`: Your Azure OpenAI endpoint (e.g., `https://openai-mpl-eastus.openai.azure.com/`)
- `YOUR_DEPLOYMENT`: Your deployment name

## 1. List Available Deployments

This will show you all deployments in your Azure OpenAI resource:

```bash
curl -X GET \
  "YOUR_ENDPOINT/openai/deployments?api-version=2024-07-18" \
  -H "api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json"
```

**Example:**
```bash
curl -X GET \
  "https://openai-mpl-eastus.openai.azure.com/openai/deployments?api-version=2024-07-18" \
  -H "api-key: your_actual_api_key_here" \
  -H "Content-Type: application/json"
```

## 2. Test Chat Completion

Test if your deployment works:

```bash
curl -X POST \
  "YOUR_ENDPOINT/openai/deployments/YOUR_DEPLOYMENT/chat/completions?api-version=2024-07-18" \
  -H "api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "YOUR_DEPLOYMENT",
    "messages": [
      {
        "role": "user", 
        "content": "Hello!"
      }
    ],
    "max_tokens": 20
  }'
```

**Example with your endpoint:**
```bash
curl -X POST \
  "https://openai-mpl-eastus.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-07-18" \
  -H "api-key: your_actual_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "user", 
        "content": "Hello!"
      }
    ],
    "max_tokens": 20
  }'
```

## 3. Try Different API Version

If the above fails, try with a different API version:

```bash
curl -X POST \
  "https://openai-mpl-eastus.openai.azure.com/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-10-01-preview" \
  -H "api-key: your_actual_api_key_here" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-mini",
    "messages": [
      {
        "role": "user", 
        "content": "Hello!"
      }
    ],
    "max_tokens": 20
  }'
```

## What to Look For:

### ✅ Success Response:
```json
{
  "choices": [
    {
      "message": {
        "content": "Hello! How can I help you today?",
        "role": "assistant"
      },
      "index": 0,
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 8,
    "completion_tokens": 10,
    "total_tokens": 18
  }
}
```

### ❌ Common Error Responses:

**404 - Resource not found:**
```json
{"error":{"code":"404","message": "Resource not found"}}
```
- **Cause**: Wrong deployment name or endpoint URL

**401 - Unauthorized:**
```json
{"error":{"code":"401","message": "Unauthorized"}}
```
- **Cause**: Wrong API key

**400 - Bad Request:**
```json
{"error":{"code":"400","message": "Invalid request"}}
```
- **Cause**: Wrong API version or request format 