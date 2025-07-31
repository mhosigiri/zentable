import { createClient } from '@/lib/supabase/server'

export interface CreditCosts {
  presentation_create: 10
  slide_generate: 5
  image_generate: 2
  chat_message: 2
  brainstorming: 3
}

export const CREDIT_COSTS: CreditCosts = {
  presentation_create: 10,
  slide_generate: 5,
  image_generate: 2,
  chat_message: 2,
  brainstorming: 3,
}

export type ActionType = keyof CreditCosts

export interface CreditCheckResult {
  hasCredits: boolean
  currentBalance: number
  required: number
}

export interface CreditDeductionResult {
  success: boolean
  newBalance: number
  transactionId?: string
  error?: string
}

/**
 * Check if a user has enough credits for an action
 */
export async function checkCredits(
  userId: string,
  actionType: ActionType
): Promise<CreditCheckResult> {
  const supabase = await createClient()
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', userId)
    .single()

  if (error || !profile) {
    return {
      hasCredits: false,
      currentBalance: 0,
      required: CREDIT_COSTS[actionType],
    }
  }

  return {
    hasCredits: profile.credits_balance >= CREDIT_COSTS[actionType],
    currentBalance: profile.credits_balance,
    required: CREDIT_COSTS[actionType],
  }
}

/**
 * Deduct credits for an action
 */
export async function deductCredits(
  userId: string,
  actionType: ActionType,
  metadata: Record<string, any> = {}
): Promise<CreditDeductionResult> {
  const supabase = await createClient()
  
  // Call the database function to deduct credits atomically
  const { data, error } = await supabase.rpc('deduct_credits', {
    user_uuid: userId,
    credits_to_deduct: CREDIT_COSTS[actionType],
    action_type_param: actionType,
    metadata_param: metadata,
  })

  if (error) {
    return {
      success: false,
      newBalance: 0,
      error: error.message,
    }
  }

  if (!data) {
    return {
      success: false,
      newBalance: 0,
      error: 'Insufficient credits or user not found',
    }
  }

  // Get updated balance
  const { data: profile } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', userId)
    .single()

  return {
    success: true,
    newBalance: profile?.credits_balance || 0,
  }
}

/**
 * Add credits to a user account
 */
export async function addCredits(
  userId: string,
  amount: number,
  actionType: string = 'credit_grant',
  metadata: Record<string, any> = {}
): Promise<CreditDeductionResult> {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('add_credits', {
    user_uuid: userId,
    credits_to_add: amount,
    action_type_param: actionType,
    metadata_param: metadata,
  })

  if (error) {
    return {
      success: false,
      newBalance: 0,
      error: error.message,
    }
  }

  if (!data) {
    return {
      success: false,
      newBalance: 0,
      error: 'User not found',
    }
  }

  // Get updated balance
  const { data: profile } = await supabase
    .from('profiles')
    .select('credits_balance')
    .eq('id', userId)
    .single()

  return {
    success: true,
    newBalance: profile?.credits_balance || 0,
  }
}

/**
 * Get user's credit balance and usage stats
 */
export async function getCreditStats(userId: string) {
  const supabase = await createClient()
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('credits_balance, credits_total_used, subscription_status')
    .eq('id', userId)
    .single()

  if (error || !profile) {
    return {
      balance: 0,
      totalUsed: 0,
      subscriptionStatus: 'free',
    }
  }

  return {
    balance: profile.credits_balance,
    totalUsed: profile.credits_total_used,
    subscriptionStatus: profile.subscription_status,
  }
}

/**
 * Middleware function to check and deduct credits for API routes
 */
export async function withCreditCheck(
  userId: string,
  actionType: ActionType,
  metadata: Record<string, any> = {}
): Promise<{ success: true; newBalance: number } | { success: false; error: string; currentBalance: number }> {
  // First check if user has enough credits
  const creditCheck = await checkCredits(userId, actionType)
  
  if (!creditCheck.hasCredits) {
    return {
      success: false,
      error: `Insufficient credits. Required: ${creditCheck.required}, Available: ${creditCheck.currentBalance}`,
      currentBalance: creditCheck.currentBalance,
    }
  }

  // Deduct credits
  const deduction = await deductCredits(userId, actionType, metadata)
  
  if (!deduction.success) {
    return {
      success: false,
      error: deduction.error || 'Failed to deduct credits',
      currentBalance: creditCheck.currentBalance,
    }
  }

  return {
    success: true,
    newBalance: deduction.newBalance,
  }
}