import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'

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

    // Check if Stripe secret key is configured
    if (!process.env.STRIPE_SECRET_KEY) {
      // Fallback to demo mode if secret key is not configured
      return Response.json({ 
        success: true, 
        checkoutUrl: '/dashboard/billing?demo=true&plan=' + encodeURIComponent(planName),
        message: 'Demo mode - Stripe integration requires secret API key configuration'
      })
    }

    // Initialize Stripe with secret key
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20' as any
    })

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment', // One-time payment for credits
      success_url: `http://localhost:3000/dashboard/billing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/pricing?canceled=true`,
      client_reference_id: user.id,
      customer_email: user.email,
      metadata: {
        userId: user.id,
        planName: planName,
        priceId: priceId
      }
    })

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