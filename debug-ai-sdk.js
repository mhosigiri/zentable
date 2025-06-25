const { config } = require('dotenv');
const { createAzure } = require('@ai-sdk/azure');
const { generateText } = require('ai');

// Load environment variables from .env.local
config({ path: '.env.local' });

const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY;

console.log('🔍 Debugging AI SDK Configuration...');
console.log('Endpoint from env:', endpoint);
console.log('API Key length:', apiKey?.length || 0);
console.log('---\n');

// Test different AI SDK configurations
async function testDifferentConfigurations() {
  const configurationsToTest = [
    {
      name: 'Using resourceName only (correct approach)',
      config: {
        apiKey: apiKey,
        apiVersion: '2024-04-01-preview',
        resourceName: 'openai-mpl-eastus',  // extracted from your endpoint URL
      }
    },
    {
      name: 'Current app config (baseURL) - Known to fail',
      config: {
        apiKey: apiKey,
        apiVersion: '2024-04-01-preview',
        baseURL: endpoint,
      }
    },
    {
      name: 'Direct endpoint construction',
      config: {
        apiKey: apiKey,
        apiVersion: '2024-04-01-preview',
        baseURL: 'https://openai-mpl-eastus.openai.azure.com/',
      }
    },
    {
      name: 'Without trailing slash',
      config: {
        apiKey: apiKey,
        apiVersion: '2024-04-01-preview',
        baseURL: 'https://openai-mpl-eastus.openai.azure.com',
      }
    },
    {
      name: 'Different API version with resourceName',
      config: {
        apiKey: apiKey,
        apiVersion: '2025-01-01-preview',
        resourceName: 'openai-mpl-eastus',
      }
    }
  ];

  for (const testConfig of configurationsToTest) {
    console.log(`🧪 Testing: ${testConfig.name}`);
    console.log('Config:', JSON.stringify(testConfig.config, null, 2));
    
    try {
      const azureOpenAI = createAzure(testConfig.config);
      
      const { text } = await generateText({
        model: azureOpenAI('gpt-4o-mini'),
        prompt: 'Say hello briefly.',
        maxTokens: 10,
        temperature: 0.1,
      });
      
      console.log('✅ SUCCESS!');
      console.log('Response:', text);
      console.log('🎉 This configuration works!\n');
      break; // Stop on first success
      
    } catch (error) {
      console.log('❌ FAILED');
      console.log('Error:', error.message);
      if (error.cause) {
        console.log('Cause:', error.cause.message);
      }
      if (error.cause?.response) {
        console.log('Response Status:', error.cause.response?.status);
        console.log('Response URL:', error.cause.response?.url);
      }
      console.log('---\n');
    }
  }
}

// Compare with working native SDK setup
function showNativeSDKSetup() {
  console.log('📋 Working Native SDK Setup:');
  console.log('const client = new AzureOpenAI({');
  console.log('  endpoint: "' + endpoint + '",');
  console.log('  apiKey: "' + (apiKey ? '[HIDDEN]' : 'MISSING') + '",');
  console.log('  deployment: "gpt-4o-mini",');
  console.log('  apiVersion: "2024-04-01-preview"');
  console.log('});\n');
  
  console.log('🔗 This creates requests to:');
  console.log(endpoint + '/openai/deployments/gpt-4o-mini/chat/completions?api-version=2024-04-01-preview');
  console.log('---\n');
}

async function runDebug() {
  showNativeSDKSetup();
  await testDifferentConfigurations();
}

runDebug().catch(console.error); 