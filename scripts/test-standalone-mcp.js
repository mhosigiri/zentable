#!/usr/bin/env node

/**
 * Test script for the standalone SlidesAI MCP server
 * Tests the MCP server that can be used with npx
 */

import { spawn } from 'child_process'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const API_KEY = process.argv[2]

if (!API_KEY) {
  console.log('❌ Usage: npm run test:standalone-mcp <api-key>')
  console.log('   Example: npm run test:standalone-mcp slai_499826a...')
  process.exit(1)
}

console.log('🧪 Testing Standalone MCP Server...')
console.log('🔑 API Key:', API_KEY.substring(0, 10) + '...')
console.log('')

async function testStandaloneMCP() {
  return new Promise((resolve, reject) => {
    const serverPath = path.join(__dirname, '..', 'bin', 'slides-ai-mcp.js')
    
    // Set environment variables
    const env = {
      ...process.env,
      SLIDES_AI_API_KEY: API_KEY,
      SLIDES_AI_SERVER_URL: 'http://localhost:3000'
    }
    
    // Start the MCP server
    const serverProcess = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: env
    })

    let serverReady = false
    let testComplete = false

    // Handle server stderr (status messages)
    serverProcess.stderr.on('data', (data) => {
      const message = data.toString().trim()
      if (message.includes('SlidesAI MCP Server running on stdio')) {
        console.log('✅ Server started successfully')
        serverReady = true
        runTests()
      } else if (message) {
        console.log('📡 Server:', message)
      }
    })

    // Handle server stdout (MCP responses)
    let responseBuffer = ''
    serverProcess.stdout.on('data', (data) => {
      responseBuffer += data.toString()
      
      // Try to parse complete JSON responses
      const lines = responseBuffer.split('\n')
      responseBuffer = lines.pop() || '' // Keep incomplete line
      
      for (const line of lines) {
        if (line.trim()) {
          try {
            const response = JSON.parse(line)
            console.log('📨 Response:', JSON.stringify(response, null, 2))
            
            if (response.id === 'test-list-tools') {
              console.log('✅ Tools listed successfully')
              testCreatePresentation()
            } else if (response.id === 'test-create-presentation') {
              console.log('✅ Presentation creation test completed')
              testComplete = true
              serverProcess.kill()
              resolve()
            }
          } catch (e) {
            // Ignore parse errors for incomplete JSON
          }
        }
      }
    })

    serverProcess.on('error', (error) => {
      console.error('❌ Server error:', error.message)
      reject(error)
    })

    serverProcess.on('exit', (code) => {
      if (!testComplete) {
        if (code === 0) {
          console.log('✅ Tests completed successfully')
          resolve()
        } else {
          console.error(`❌ Server exited with code ${code}`)
          reject(new Error(`Server exited with code ${code}`))
        }
      }
    })

    function runTests() {
      if (!serverReady) return
      
      console.log('')
      console.log('1️⃣ Testing tool listing...')
      
      // Test 1: List available tools
      const listToolsRequest = {
        jsonrpc: '2.0',
        id: 'test-list-tools',
        method: 'tools/list',
        params: {}
      }
      
      serverProcess.stdin.write(JSON.stringify(listToolsRequest) + '\n')
    }

    function testCreatePresentation() {
      console.log('')
      console.log('2️⃣ Testing presentation creation...')
      
      // Test 2: Create a presentation
      const createPresentationRequest = {
        jsonrpc: '2.0',
        id: 'test-create-presentation',
        method: 'tools/call',
        params: {
          name: 'create_presentation',
          arguments: {
            prompt: 'Introduction to Artificial Intelligence',
            slideCount: 5,
            style: 'professional',
            contentLength: 'medium'
          }
        }
      }
      
      serverProcess.stdin.write(JSON.stringify(createPresentationRequest) + '\n')
    }

    // Start tests after a short delay
    setTimeout(() => {
      if (!serverReady) {
        console.log('⏳ Waiting for server to start...')
      }
    }, 2000)

    // Timeout after 30 seconds
    setTimeout(() => {
      if (!testComplete) {
        console.error('❌ Test timeout after 30 seconds')
        serverProcess.kill()
        reject(new Error('Test timeout'))
      }
    }, 30000)
  })
}

// Run the test
testStandaloneMCP()
  .then(() => {
    console.log('')
    console.log('🎉 All tests passed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('')
    console.error('💥 Test failed:', error.message)
    process.exit(1)
  }) 