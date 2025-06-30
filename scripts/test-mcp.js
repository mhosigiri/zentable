#!/usr/bin/env node

/**
 * Simple test script for MCP server functionality
 * Run with: node scripts/test-mcp.js YOUR_API_KEY
 */

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000'

async function testMcpServer(apiKey) {
  if (!apiKey) {
    console.error('❌ Please provide an API key as an argument')
    console.log('Usage: node scripts/test-mcp.js YOUR_API_KEY')
    process.exit(1)
  }

  console.log('🧪 Testing MCP Server...')
  console.log(`📡 API Base URL: ${API_BASE_URL}`)
  console.log(`🔑 API Key: ${apiKey.substring(0, 12)}...`)

  try {
    // Test 0: Basic connectivity and auth
    console.log('\n0️⃣ Testing basic connectivity...')
    const testResponse = await fetch(`${API_BASE_URL}/api/mcp/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      }
    })

    if (!testResponse.ok) {
      const errorText = await testResponse.text()
      throw new Error(`Test endpoint failed (HTTP ${testResponse.status}): ${errorText}`)
    }

    const testData = await testResponse.json()
    console.log('✅ Basic connectivity test passed:', JSON.stringify(testData, null, 2))

    // Test 1: List tools
    console.log('\n1️⃣ Testing tools/list...')
    const listResponse = await fetch(`${API_BASE_URL}/api/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'tools/list'
      })
    })

    if (!listResponse.ok) {
      throw new Error(`HTTP ${listResponse.status}: ${await listResponse.text()}`)
    }

    const listData = await listResponse.json()
    console.log('✅ Tools list response:', JSON.stringify(listData, null, 2))

    // Test 2: Call create_presentation
    console.log('\n2️⃣ Testing create_presentation tool...')
    const createResponse = await fetch(`${API_BASE_URL}/api/mcp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 2,
        method: 'tools/call',
        params: {
          name: 'create_presentation',
          arguments: {
            prompt: 'Introduction to Artificial Intelligence',
            slideCount: 5,
            style: 'professional',
            language: 'en',
            contentLength: 'medium'
          }
        }
      })
    })

    if (!createResponse.ok) {
      throw new Error(`HTTP ${createResponse.status}: ${await createResponse.text()}`)
    }

    const createData = await createResponse.json()
    console.log('✅ Create presentation response:', JSON.stringify(createData, null, 2))

    console.log('\n🎉 All tests passed!')

  } catch (error) {
    console.error('❌ Test failed:', error.message)
    if (error.stack) {
      console.error(error.stack)
    }
    process.exit(1)
  }
}

// Get API key from command line argument
const apiKey = process.argv[2]
testMcpServer(apiKey) 