const { config } = require('dotenv');
const { AzureOpenAI } = require('openai');

// Load environment variables from .env.local
config({ path: '.env.local' });

// Azure OpenAI configuration (from official Azure docs)
const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
const apiKey = process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY;
const modelName = "gpt-4o-mini";
const deployment = "gpt-4o-mini";
const apiVersion = "2024-04-01-preview"; // From Azure docs

console.log('🔍 Testing Azure OpenAI with Official SDK...');
console.log('Endpoint:', endpoint);
console.log('API Key:', apiKey ? '✅ Set' : '❌ Missing');
console.log('Model/Deployment:', deployment);
console.log('API Version:', apiVersion);
console.log('---\n');

// Test 1: Basic chat completion (from Azure docs)
async function testBasicChat() {
  console.log('💬 Test 1: Basic Chat Completion (Azure SDK)');
  
  try {
    const options = { endpoint, apiKey, deployment, apiVersion };
    const client = new AzureOpenAI(options);

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Say hello from Azure OpenAI in 10 words or less." }
      ],
      max_tokens: 50,
      temperature: 0.2,
      model: modelName
    });

    if (response?.error !== undefined && response.status !== "200") {
      throw response.error;
    }

    console.log('✅ Basic Chat Success!');
    console.log('Response:', response.choices[0].message.content);
    return true;

  } catch (error) {
    console.error('❌ Basic Chat Failed:', error.message || error);
    if (error.status) {
      console.error('Status:', error.status);
    }
    if (error.code) {
      console.error('Code:', error.code);
    }
    return false;
  }
}

// Test 2: Multi-turn conversation
async function testMultiTurn() {
  console.log('\n🗣️ Test 2: Multi-turn Conversation');
  
  try {
    const options = { endpoint, apiKey, deployment, apiVersion };
    const client = new AzureOpenAI(options);

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a presentation expert." },
        { role: "user", content: "What are the key elements of a good presentation?" },
        { role: "assistant", content: "Key elements include clear structure, engaging visuals, and concise content." },
        { role: "user", content: "How many slides should a 10-minute presentation have?" }
      ],
      max_tokens: 100,
      temperature: 0.3,
      model: modelName
    });

    if (response?.error !== undefined && response.status !== "200") {
      throw response.error;
    }

    console.log('✅ Multi-turn Success!');
    console.log('Response:', response.choices[0].message.content);
    return true;

  } catch (error) {
    console.error('❌ Multi-turn Failed:', error.message || error);
    return false;
  }
}

// Test 3: Streaming response
async function testStreaming() {
  console.log('\n🌊 Test 3: Streaming Response');
  
  try {
    const options = { endpoint, apiKey, deployment, apiVersion };
    const client = new AzureOpenAI(options);

    const response = await client.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: "Write a very short poem about presentations." }
      ],
      stream: true,
      max_tokens: 100,
      temperature: 0.7,
      model: modelName
    });

    console.log('✅ Streaming Success!');
    console.log('Streamed Response: ', end='');
    
    let fullResponse = '';
    for await (const part of response) {
      const content = part.choices[0]?.delta?.content || '';
      process.stdout.write(content);
      fullResponse += content;
    }
    
    console.log('\n✅ Streaming Complete!');
    return true;

  } catch (error) {
    console.error('❌ Streaming Failed:', error.message || error);
    return false;
  }
}

// Test 4: Different API versions
async function testDifferentApiVersions() {
  console.log('\n🔄 Test 4: Testing Different API Versions');
  
  const versionsToTest = [
    "2024-04-01-preview",
    "2025-01-01-preview", 
    "2024-10-01-preview",
    "2024-08-01-preview"
  ];

  for (const version of versionsToTest) {
    try {
      console.log(`Testing API version: ${version}`);
      
      const options = { endpoint, apiKey, deployment, apiVersion: version };
      const client = new AzureOpenAI(options);

      const response = await client.chat.completions.create({
        messages: [
          { role: "user", content: "Hello!" }
        ],
        max_tokens: 10,
        model: modelName
      });

      if (response?.error !== undefined && response.status !== "200") {
        throw response.error;
      }

      console.log(`✅ ${version}: SUCCESS`);
      console.log(`Response: ${response.choices[0].message.content}\n`);
      
    } catch (error) {
      console.log(`❌ ${version}: FAILED - ${error.message}\n`);
    }
  }
  
  return true;
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Azure OpenAI Native SDK Tests...\n');
  
  const test1 = await testBasicChat();
  const test2 = await testMultiTurn();
  const test3 = await testStreaming();
  await testDifferentApiVersions();
  
  console.log('\n📊 Test Results:');
  console.log('Basic Chat:', test1 ? '✅ PASS' : '❌ FAIL');
  console.log('Multi-turn:', test2 ? '✅ PASS' : '❌ FAIL');
  console.log('Streaming:', test3 ? '✅ PASS' : '❌ FAIL');
  
  const coreTestsPassed = test1 && test2 && test3;
  console.log('\n🎯 Overall Result:', coreTestsPassed ? '✅ CORE TESTS PASSED' : '❌ SOME CORE TESTS FAILED');
  
  if (coreTestsPassed) {
    console.log('🎉 Your Azure OpenAI credentials are working correctly!');
    console.log('The issue is likely with the AI SDK configuration, not your Azure setup.');
  } else {
    console.log('🔧 There may be an issue with your Azure OpenAI configuration.');
  }
}

runAllTests().catch(console.error); 