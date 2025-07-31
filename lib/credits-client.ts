/**
 * Client-side credit utilities
 * These functions work in browser environments and make API calls
 */

export interface CreditStats {
  balance: number
  totalUsed: number
  subscriptionStatus: string
}

/**
 * Get user's credit balance and usage stats (client-side)
 */
export async function getCreditStatsClient(): Promise<CreditStats> {
  try {
    const response = await fetch('/api/user/credits')
    if (!response.ok) {
      throw new Error('Failed to fetch credit stats')
    }
    return await response.json()
  } catch (error) {
    console.error('Error fetching credit stats:', error)
    return {
      balance: 0,
      totalUsed: 0,
      subscriptionStatus: 'free'
    }
  }
}

/**
 * Add credits to user account (client-side)
 */
export async function addCreditsClient(credits: number, reason: string = 'Manual credit grant'): Promise<{
  success: boolean
  creditsAdded?: number
  newBalance?: number
  error?: string
}> {
  try {
    const response = await fetch('/api/user/credits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ credits, reason })
    })

    const data = await response.json()
    
    if (!response.ok) {
      return { success: false, error: data.error || 'Failed to add credits' }
    }

    return {
      success: true,
      creditsAdded: data.creditsAdded,
      newBalance: data.newBalance
    }
  } catch (error) {
    console.error('Error adding credits:', error)
    return { success: false, error: 'Network error' }
  }
}