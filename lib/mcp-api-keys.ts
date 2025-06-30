import { createHash, randomBytes } from 'crypto'

// API key format: slai_[64-character-hex]
export const API_KEY_PREFIX = 'slai_'
export const API_KEY_LENGTH = 64 // Length of the hex part
export const FULL_API_KEY_LENGTH = API_KEY_PREFIX.length + API_KEY_LENGTH

export interface ApiKeyData {
  fullKey: string
  prefix: string
  hash: string
}

/**
 * Generate a new API key with the format: slai_[64-character-hex]
 */
export function generateApiKey(): ApiKeyData {
  // Generate 32 random bytes (which will be 64 hex characters)
  const randomPart = randomBytes(32).toString('hex')
  const fullKey = API_KEY_PREFIX + randomPart
  
  // Extract prefix (first 12 characters for display purposes)
  const prefix = fullKey.substring(0, 12)
  
  // Hash the full key for database storage
  const hash = hashApiKey(fullKey)
  
  console.log('=== MCP API Key Generation ===')
  console.log('Generated API Key:', fullKey.substring(0, 12) + '...')
  console.log('Prefix:', prefix)
  console.log('Hash:', hash)
  
  return {
    fullKey,
    prefix,
    hash
  }
}

/**
 * Hash an API key using SHA-256
 */
export function hashApiKey(apiKey: string): string {
  return createHash('sha256').update(apiKey).digest('hex')
}

/**
 * Validate API key format
 */
export function isValidApiKeyFormat(apiKey: string): boolean {
  if (!apiKey || typeof apiKey !== 'string') {
    return false
  }
  
  // Check length
  if (apiKey.length !== FULL_API_KEY_LENGTH) {
    return false
  }
  
  // Check prefix
  if (!apiKey.startsWith(API_KEY_PREFIX)) {
    return false
  }
  
  // Check if the remaining part is valid hex
  const hexPart = apiKey.substring(API_KEY_PREFIX.length)
  const hexRegex = /^[a-f0-9]+$/i
  
  return hexRegex.test(hexPart) && hexPart.length === API_KEY_LENGTH
}

/**
 * Extract API key from Authorization header
 */
export function extractApiKeyFromHeader(authHeader: string | undefined): string | null {
  if (!authHeader) {
    return null
  }
  
  // Expected format: "Bearer slai_..."
  const parts = authHeader.split(' ')
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return null
  }
  
  const apiKey = parts[1]
  
  // Validate format
  if (!isValidApiKeyFormat(apiKey)) {
    return null
  }
  
  return apiKey
}

/**
 * Mask API key for display (show only prefix)
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 12) {
    return '***'
  }
  
  return apiKey.substring(0, 12) + '...'
}

/**
 * Get display prefix from full API key
 */
export function getApiKeyPrefix(apiKey: string): string {
  if (!apiKey || apiKey.length < 12) {
    return '***'
  }
  
  return apiKey.substring(0, 12)
} 