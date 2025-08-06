# Azure OpenAI Setup Guide

This guide will help you configure your Azure OpenAI environment variables correctly for your slides application.

## Required Environment Variables

Add these variables to your `.env.local` file in the root of your project:

```bash
# Azure OpenAI Configuration
AZURE_OPENAI_API_KEY=your_azure_openai_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource-name.openai.azure.com/

# Alternative variable names (the app checks both)
AZURE_API_KEY=your_azure_openai_api_key_here

# Note: The app now uses API version 2025-01-01-preview
```

## How to Get Your Azure OpenAI Credentials

1. **Go to the Azure Portal**: Navigate to [portal.azure.com](https://portal.azure.com)

2. **Find your Azure OpenAI resource**: Look for your Azure OpenAI service in your resource group

3. **Get your API Key**:
   - In your Azure OpenAI resource, go to **"Keys and Endpoints"** in the left sidebar
   - Copy either **KEY 1** or **KEY 2**
   - Use this as your `AZURE_OPENAI_API_KEY`

4. **Get your Endpoint**:
   - In the same **"Keys and Endpoints"** section, copy the **Endpoint** URL
   - It should look like: `https://your-resource-name.openai.azure.com/`
   - Use this as your `AZURE_OPENAI_ENDPOINT`

5. **Ensure you have a GPT-4o-mini deployment**:
   - Go to **"Model deployments"** in your Azure OpenAI resource
   - Make sure you have deployed the `gpt-4o-mini` model
   - Note the deployment name (it can be different from the model name)

## Model Deployment Name

The application uses `gpt-4o-mini` as the model name. If your deployment has a different name, you'll need to update the model references in:

- `app/api/generate-outline/route.ts`
- `app/api/ai-text-completion/route.ts`
- `app/api/generate-slide/route.ts`

Replace `azureOpenAI('gpt-4o-mini')` with `azureOpenAI('your-deployment-name')`.

## Example .env.local file

```bash
# Azure OpenAI Configuration
AZURE_OPENAI_API_KEY=1234567890abcdef1234567890abcdef
AZURE_OPENAI_ENDPOINT=https://mycompany-openai.openai.azure.com/

# Optional: If using different deployment names
# Update the code to use these deployment names instead of 'gpt-4o-mini'
```

## Testing Your Configuration

To test if your configuration is working:

1. Start your development server: `npm run dev`
2. Navigate to the create page in your app
3. Try generating an outline
4. Check the console for any errors related to Azure OpenAI

## Troubleshooting

### Common Error: "Azure OpenAI API key is missing"
- Make sure your `.env.local` file is in the root directory of your project
- Restart your development server after adding environment variables
- Check that your variable names match exactly (case-sensitive)

### Common Error: "Resource not found" (404)
- Verify your endpoint URL is correct
- Make sure you have the correct API version (`2024-10-01-preview`)
- Ensure your deployment name matches what you're using in the code

### Common Error: "Invalid API key" (401)
- Double-check your API key from the Azure portal
- Make sure you're using the correct key (not a different Azure service key)
- Verify the key hasn't expired or been regenerated

## Security Note

Never commit your `.env.local` file to version control. The `.env.local` file should be in your `.gitignore` file to prevent accidentally sharing your API keys. 