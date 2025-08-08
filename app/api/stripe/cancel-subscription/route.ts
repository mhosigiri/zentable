import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user's subscription info
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_subscription_id')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_subscription_id) {
      return Response.json({ error: 'No active subscription found' }, { status: 400 })
    }

    // Initialize Stripe
    if (!process.env.STRIPE_SECRET_KEY) {
      return Response.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20' as any
    })

    // Cancel the subscription at period end
    const subscription = await stripe.subscriptions.update(
      profile.stripe_subscription_id,
      {
        cancel_at_period_end: true
      }
    )

    console.log('✅ Subscription set to cancel at period end:', {
      subscriptionId: subscription.id,
      cancelAt: new Date(subscription.current_period_end * 1000)
    })

    return Response.json({ 
      success: true,
      cancelAt: subscription.current_period_end
    })

  } catch (error) {
    console.error('Subscription cancellation error:', error)
    return Response.json(
      { error: 'Failed to cancel subscription' },
      { status: 500 }
    )
  }
}