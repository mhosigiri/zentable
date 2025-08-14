import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { getStripeConfig } from '@/lib/stripe-config'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const { priceId, planName } = await request.json()

    if (!priceId) {
      return Response.json({ error: 'Price ID is required' }, { status: 400 })
    }

    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile to check for existing customer and subscription
    const { data: profile } = await supabase
      .from('profiles')
      .select('stripe_customer_id, stripe_subscription_id, stripe_price_id, subscription_status')
      .eq('id', user.id)
      .single()

    // Check if user already has this exact plan
    if (profile?.stripe_price_id === priceId && profile?.subscription_status === 'active') {
      return Response.json({ 
        error: 'You are already subscribed to this plan' 
      }, { status: 400 })
    }

    // Get environment-aware Stripe configuration
    const stripeConfig = getStripeConfig()
    
    // Check if Stripe secret key is configured
    if (!stripeConfig.secretKey) {
      return Response.json({ 
        error: 'Stripe secret key not configured' 
      }, { status: 500 })
    }

    // Initialize Stripe with secret key
    const stripe = new Stripe(stripeConfig.secretKey, {
      apiVersion: '2024-06-20' as any
    })

    const hasActiveSubscription = profile?.stripe_subscription_id && profile.subscription_status === 'active'

    // Create checkout session configuration
    const sessionConfig: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/pricing?canceled=true`,
      client_reference_id: user.id,
      allow_promotion_codes: true, // Enable coupon/promo codes in checkout
      metadata: {
        userId: user.id,
        planName: planName,
        priceId: priceId,
        isUpgrade: hasActiveSubscription ? 'true' : 'false'
      },
      subscription_data: {
        metadata: {
          userId: user.id,
          planName: planName,
          previousSubscription: profile?.stripe_subscription_id || ''
        }
      }
    }

    // If user has existing subscription, we need to cancel it first
    if (hasActiveSubscription && profile.stripe_subscription_id) {
      try {
        // Cancel the existing subscription immediately
        await stripe.subscriptions.cancel(profile.stripe_subscription_id)
        console.log(`📛 Canceled existing subscription: ${profile.stripe_subscription_id}`)
      } catch (error) {
        console.error('Failed to cancel existing subscription:', error)
        // Continue anyway - Stripe checkout will handle it
      }
    }

    // If user has existing Stripe customer, try to use it but fallback to email if invalid
    if (profile?.stripe_customer_id) {
      try {
        // Verify the customer exists in current Stripe account
        await stripe.customers.retrieve(profile.stripe_customer_id)
        sessionConfig.customer = profile.stripe_customer_id
      } catch (error) {
        // Customer doesn't exist in this account, use email instead
        console.log('Customer not found in current Stripe account, using email instead')
        sessionConfig.customer_email = user.email
      }
    } else {
      sessionConfig.customer_email = user.email
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create(sessionConfig)

    return Response.json({ 
      success: true, 
      checkoutUrl: session.url 
    })

  } catch (error) {
    console.error('Stripe checkout error:', error)
    return Response.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}