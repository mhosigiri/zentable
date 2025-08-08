/**
 * Stripe Configuration - Environment-aware price selection
 * Automatically switches between test and live prices based on NODE_ENV and STRIPE_MODE
 */

export interface StripePriceConfig {
  lite: string
  plus: string 
  pro: string
}

export interface StripeConfig {
  prices: StripePriceConfig
  isLive: boolean
  mode: 'test' | 'live'
  secretKey: string | null
  publishableKey: string | null
  webhookSecret: string | null
}

// Test prices (for development) - Updated to use prices that exist in your test account
const TEST_PRICES: StripePriceConfig = {
  lite: 'price_1RtWl99MDLdB3mTb8iBxZYaY',  // $5/month - 1,000 credits
  plus: 'price_1RtWlA9MDLdB3mTbqz1qLDT5',  // $10/month - 2,500 credits
  pro: 'price_1RtWlA9MDLdB3mTbUMunPLQH'    // $20/month - 7,500 credits
}

// Live prices (for production) - These need to be created in live account
const LIVE_PRICES: StripePriceConfig = {
  lite: 'price_1RtZh870FDEx9RGInEa3QFX5',    // $5/month - 1,000 credits - TO BE CREATED
  plus: 'price_1RtZhB70FDEx9RGINJGwTgVg',   // $10/month - 2,500 credits - TO BE CREATED
  pro: 'price_1RtZhE70FDEx9RGIptYXsUw7'      // $20/month - 7,500 credits - TO BE CREATED
}

/**
 * Determine if we should use live or test mode
 * Priority: STRIPE_MODE env var > NODE_ENV
 * Client-safe version that works in both server and client contexts
 */
function getStripeMode(): 'test' | 'live' {
  // For client-side, check if we have access to process.env
  if (typeof process === 'undefined' || !process.env) {
    // Default to test mode on client-side for safety
    return 'test'
  }
  
  const explicitMode = process.env.STRIPE_MODE as 'test' | 'live'
  if (explicitMode && ['test', 'live'].includes(explicitMode)) {
    return explicitMode
  }
  
  // Fallback to NODE_ENV
  return process.env.NODE_ENV === 'production' ? 'live' : 'test'
}

/**
 * Get the current Stripe configuration based on environment
 */
export function getStripeConfig(): StripeConfig {
  const mode = getStripeMode()
  const isLive = mode === 'live'
  
  // Use simple environment variable names - user manages different keys for different environments
  const secretKey = process.env.STRIPE_SECRET_KEY
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  
  return {
    prices: isLive ? LIVE_PRICES : TEST_PRICES,
    isLive,
    mode,
    secretKey: secretKey || null,
    publishableKey: publishableKey || null,
    webhookSecret: webhookSecret || null
  }
}

/**
 * Get all price IDs (both test and live) for database mapping
 */
export function getAllPriceIds(): Record<string, 'lite' | 'plus' | 'pro'> {
  return {
    // Test prices
    [TEST_PRICES.lite]: 'lite',
    [TEST_PRICES.plus]: 'plus', 
    [TEST_PRICES.pro]: 'pro',
    // Live prices  
    [LIVE_PRICES.lite]: 'lite',
    [LIVE_PRICES.plus]: 'plus',
    [LIVE_PRICES.pro]: 'pro'
  }
}

/**
 * Get credit allocation for a price ID
 */
export function getCreditAllocation(priceId: string): number {
  const allPriceIds = getAllPriceIds()
  const tier = allPriceIds[priceId]
  
  const allocations = {
    lite: 1000,
    plus: 2500, 
    pro: 7500
  }
  
  return allocations[tier] || 0
}

// Export current config for easy access
export const stripeConfig = getStripeConfig()