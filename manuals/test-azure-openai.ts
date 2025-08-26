import { config } from 'dotenv';
import { createAzure } from '@ai-sdk/azure';
import { generateText, generateObject } from 'ai';
import { z } from 'zod';

// Load environment variables from .env.local
config({ path: '.env.local' });

// Configure Azure OpenAI (same as your app)
const azureOpenAI = createAzure({
  apiKey: process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY,
  apiVersion: '2024-07-18', // Same as your app
  baseURL: process.env.AZURE_OPENAI_ENDPOINT,
});

const deploymentName = 'gpt-4o-mini'; // Change this to match your actual deployment name

console.log('🔍 Testing Azure OpenAI Configuration...');
console.log('API Key:', process.env.AZURE_OPENAI_API_KEY ? '✅ Set' : '❌ Missing');
console.log('Endpoint:', process.env.AZURE_OPENAI_ENDPOINT || '❌ Missing');
console.log('Deployment:', deploymentName);
console.log('---');

// Test 1: Simple text generation (like ai-text-completion route)
async function testTextGeneration() {
  console.log('📝 Test 1: Simple Text Generation');
  try {
    const { text } = await generateText({
      model: azureOpenAI(deploymentName),
      prompt: 'Say hello from Azure OpenAI in 10 words or less.',
      temperature: 0.2,
    });
    
    console.log('✅ Text Generation Success!');
    console.log('Response:', text);
    return true;
  } catch (error: any) {
    console.error('❌ Text Generation Failed:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause.message);
    }
    return false;
  }
}

// Test 2: Structured object generation (like generate-outline route)
async function testObjectGeneration() {
  console.log('\n🏗️ Test 2: Structured Object Generation');
  
  const TestSchema = z.object({
    message: z.string().describe('A greeting message'),
    success: z.boolean().describe('Whether this test was successful'),
    timestamp: z.string().describe('Current timestamp in ISO format'),
  });

  try {
    const { object } = await generateObject({
      model: azureOpenAI(deploymentName),
      system: 'You are a helpful test assistant. Always respond with valid JSON.',
      prompt: 'Create a test response with a greeting, success status, and current timestamp.',
      schema: TestSchema,
    });
    
    console.log('✅ Object Generation Success!');
    console.log('Response:', JSON.stringify(object, null, 2));
    return true;
  } catch (error: any) {
    console.error('❌ Object Generation Failed:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause.message);
    }
    return false;
  }
}

// Test 3: Mini outline generation (like your actual use case)
async function testOutlineGeneration() {
  console.log('\n📋 Test 3: Mini Outline Generation (like your app)');
  
  const MiniOutlineSchema = z.object({
    title: z.string().describe('A presentation title'),
    sections: z.array(
      z.object({
        title: z.string().describe('Section title'),
        bulletPoints: z.array(z.string()).describe('2-3 bullet points'),
      })
    ).describe('2-3 presentation sections')
  });

  try {
    const { object } = await generateObject({
      model: azureOpenAI(deploymentName),
      system: 'You are an expert presentation designer. Create concise, professional presentation content.',
      prompt: 'Create a mini presentation outline about "Benefits of Cloud Computing" with 2-3 sections.',
      schema: MiniOutlineSchema,
    });
    
    console.log('✅ Outline Generation Success!');
    console.log('Response:', JSON.stringify(object, null, 2));
    return true;
  } catch (error: any) {
    console.error('❌ Outline Generation Failed:', error.message);
    if (error.cause) {
      console.error('Cause:', error.cause.message);
    }
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Azure OpenAI Tests with AI SDK...\n');
  
  const test1 = await testTextGeneration();
  const test2 = await testObjectGeneration();
  const test3 = await testOutlineGeneration();
  
  console.log('\n📊 Test Results:');
  console.log('Text Generation:', test1 ? '✅ PASS' : '❌ FAIL');
  console.log('Object Generation:', test2 ? '✅ PASS' : '❌ FAIL');
  console.log('Outline Generation:', test3 ? '✅ PASS' : '❌ FAIL');
  
  const allPassed = test1 && test2 && test3;
  console.log('\n🎯 Overall Result:', allPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED');
  
  if (allPassed) {
    console.log('🎉 Your Azure OpenAI setup is working correctly!');
    console.log('Your slides app should now work properly.');
  } else {
    console.log('🔧 Please check your Azure OpenAI configuration:');
    console.log('1. Verify your API key in .env.local');
    console.log('2. Check your endpoint URL');
    console.log('3. Ensure your deployment name is correct');
    console.log('4. Verify your model deployment is active in Azure portal');
  }
}

runAllTests().catch(console.error); 