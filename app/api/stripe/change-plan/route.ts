import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { getStripeConfig, getCreditAllocation } from '@/lib/stripe-config'
import { DatabaseService } from '@/lib/database'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { newPriceId } = await request.json()

    if (!newPriceId) {
      return Response.json({ error: 'New price ID is required' }, { status: 400 })
    }

    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's current subscription
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_subscription_id, stripe_price_id, credits_balance')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_subscription_id) {
      return Response.json({ error: 'No active subscription found' }, { status: 400 })
    }

    // Initialize Stripe
    const stripeConfig = getStripeConfig()
    if (!stripeConfig.secretKey) {
      return Response.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const stripe = new Stripe(stripeConfig.secretKey, {
      apiVersion: '2024-06-20' as any
    })

    // Get current subscription details
    const subscription = await stripe.subscriptions.retrieve(profile.stripe_subscription_id)
    const currentPriceId = subscription.items.data[0].price.id
    
    // Don't allow changing to the same plan
    if (currentPriceId === newPriceId) {
      return Response.json({ error: 'Already subscribed to this plan' }, { status: 400 })
    }

    // Determine if this is an upgrade or downgrade
    const currentCredits = getCreditAllocation(currentPriceId)
    const newCredits = getCreditAllocation(newPriceId)
    const isUpgrade = newCredits > currentCredits

    console.log(`🔄 Plan change detected:`, {
      userId: user.id,
      currentPriceId,
      newPriceId,
      currentCredits,
      newCredits,
      isUpgrade: isUpgrade ? 'UPGRADE' : 'DOWNGRADE'
    })

    let subscriptionUpdate: Stripe.SubscriptionUpdateParams

    if (isUpgrade) {
      // UPGRADE: Apply immediately with proration
      subscriptionUpdate = {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'create_prorations', // Charge immediately for upgrade
      }
      
      console.log('⬆️ Processing immediate upgrade with proration')
    } else {
      // DOWNGRADE: Apply at period end
      subscriptionUpdate = {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId,
        }],
        proration_behavior: 'none' // No refund for downgrade - change takes effect at period end
      }
      
      console.log('⬇️ Processing downgrade at period end')
    }

    // Update the subscription in Stripe
    const updatedSubscription = await stripe.subscriptions.update(
      profile.stripe_subscription_id,
      subscriptionUpdate
    )

    // Update our database
    const db = new DatabaseService(supabase)
    await db.updateSubscriptionStatus(user.id, {
      stripePriceId: newPriceId,
      subscriptionStatus: updatedSubscription.status
    })

    // For upgrades, immediately allocate the difference in credits
    if (isUpgrade) {
      const creditDifference = newCredits - currentCredits
      
      console.log(`💰 Adding ${creditDifference} credits for immediate upgrade`)
      
      // Add the credit difference immediately
      const { error: creditError } = await supabase
        .from('profiles')
        .update({
          credits_balance: (profile.credits_balance || 0) + creditDifference,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      if (!creditError) {
        // Record the credit transaction
        await supabase
          .from('credit_transactions')
          .insert({
            user_id: user.id,
            action_type: 'plan_upgrade',
            credits_used: -creditDifference, // Negative = credit added
            credits_before: profile.credits_balance || 0,
            credits_after: (profile.credits_balance || 0) + creditDifference,
            metadata: {
              from_plan: currentPriceId,
              to_plan: newPriceId,
              credit_difference: creditDifference
            }
          })
      }
    }

    return Response.json({ 
      success: true,
      isUpgrade,
      message: isUpgrade 
        ? 'Plan upgraded successfully! Credits have been added to your account.'
        : 'Plan change scheduled for end of billing period. New credits will apply then.'
    })

  } catch (error) {
    console.error('Plan change error:', error)
    return Response.json(
      { error: 'Failed to change plan' },
      { status: 500 }
    )
  }
}