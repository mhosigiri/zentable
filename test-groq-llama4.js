const { config } = require('dotenv');
const { createGroq } = require('@ai-sdk/groq');
const { generateText, generateObject } = require('ai');
const { z } = require('zod');

// Load environment variables from .env.local
config({ path: '.env.local' });

// Configure Groq with Llama 4 Scout
const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const modelName = 'meta-llama/llama-4-scout-17b-16e-instruct';

console.log('🔍 Testing Groq Llama 4 Scout Configuration...');
console.log('API Key:', process.env.GROQ_API_KEY ? '✅ Set' : '❌ Missing');
console.log('Model:', modelName);
console.log('---\n');

// Test 1: Basic text generation
async function testBasicGeneration() {
  console.log('🧪 Test 1: Basic Text Generation');
  try {
    const result = await generateText({
      model: groq(modelName),
      prompt: 'Explain the benefits of mixture-of-experts architecture in AI models in 2 sentences.',
      maxTokens: 100,
    });
    
    console.log('✅ Success!');
    console.log('Response:', result.text);
    console.log('Usage:', result.usage);
    console.log('---\n');
    return true;
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('---\n');
    return false;
  }
}

// Test 2: Structured object generation (like for slides)
async function testStructuredGeneration() {
  console.log('🧪 Test 2: Structured Object Generation (Slide Content)');
  try {
    const slideSchema = z.object({
      title: z.string().describe('A compelling slide title'),
      content: z.string().describe('Main slide content in HTML format'),
      bulletPoints: z.array(z.string()).describe('Key bullet points for the slide'),
      imagePrompt: z.string().describe('A detailed prompt for generating an image for this slide'),
    });

    const result = await generateObject({
      model: groq(modelName),
      schema: slideSchema,
      prompt: 'Create a slide about the benefits of renewable energy sources. Make it engaging and informative.',
      maxTokens: 300,
    });
    
    console.log('✅ Success!');
    console.log('Generated Slide:');
    console.log('Title:', result.object.title);
    console.log('Content:', result.object.content.substring(0, 100) + '...');
    console.log('Bullet Points:', result.object.bulletPoints);
    console.log('Image Prompt:', result.object.imagePrompt);
    console.log('Usage:', result.usage);
    console.log('---\n');
    return true;
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('---\n');
    return false;
  }
}

// Test 3: Outline generation (mimic your app's workflow)
async function testOutlineGeneration() {
  console.log('🧪 Test 3: Presentation Outline Generation');
  try {
    const outlineSchema = z.object({
      title: z.string().describe('Presentation title'),
      sections: z.array(z.object({
        sectionTitle: z.string().describe('Section title'),
        bulletPoints: z.array(z.string()).describe('Key points for this section'),
        estimatedMinutes: z.number().describe('Estimated time for this section'),
      })).describe('Array of presentation sections'),
    });

    const result = await generateObject({
      model: groq(modelName),
      schema: outlineSchema,
      prompt: 'Create an outline for a 10-minute presentation about "The Future of AI in Healthcare". Include 3-4 main sections with bullet points.',
      maxTokens: 500,
    });
    
    console.log('✅ Success!');
    console.log('Generated Outline:');
    console.log('Title:', result.object.title);
    console.log('Sections:', result.object.sections.length);
    result.object.sections.forEach((section, index) => {
      console.log(`  ${index + 1}. ${section.sectionTitle} (${section.estimatedMinutes} min)`);
      console.log(`     Bullet Points: ${section.bulletPoints.length}`);
    });
    console.log('Usage:', result.usage);
    console.log('---\n');
    return true;
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('---\n');
    return false;
  }
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting Groq Llama 4 Scout Tests...\n');
  
  const test1 = await testBasicGeneration();
  const test2 = await testStructuredGeneration();
  const test3 = await testOutlineGeneration();
  
  const successCount = [test1, test2, test3].filter(Boolean).length;
  console.log(`📊 Results: ${successCount}/3 tests passed`);
  
  if (successCount === 3) {
    console.log('🎉 All tests passed! Groq Llama 4 Scout is working perfectly!');
    console.log('💡 You can now update your API routes to use Groq instead of Azure OpenAI.');
  } else {
    console.log('❌ Some tests failed. Please check your GROQ_API_KEY and try again.');
  }
}

runAllTests().catch((err) => {
  console.error('🚨 Unexpected error:', err);
}); 