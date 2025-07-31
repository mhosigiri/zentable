import { createClient } from '@/lib/supabase/server'
import { addCredits } from '@/lib/credits'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

// This is the Stripe CLI webhook signing secret for local development
// In production, replace this with your actual webhook endpoint secret
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  console.log('🔗 Webhook endpoint hit! URL:', request.url)
  console.log('📋 Headers:', Object.fromEntries(request.headers.entries()))
  
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')
    
    console.log('📝 Body length:', body.length)
    console.log('✋ Signature present:', !!signature)

    if (!signature) {
      console.log('❌ No Stripe signature found')
      return Response.json({ error: 'No signature found' }, { status: 400 })
    }

    if (!process.env.STRIPE_SECRET_KEY) {
      console.log('❌ Stripe secret key not configured')
      return Response.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20' as any
    })

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.log('❌ Webhook signature verification failed:', err)
      return Response.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    console.log('✅ Stripe webhook event received:', event.type)

    // Handle successful payment
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      
      console.log('💳 Processing successful payment:', {
        sessionId: session.id,
        userId: session.client_reference_id,
        planName: session.metadata?.planName,
        priceId: session.metadata?.priceId,
        amountTotal: session.amount_total
      })

      if (session.client_reference_id && session.metadata?.planName && session.metadata?.priceId) {
        const userId = session.client_reference_id
        const planName = session.metadata.planName
        const priceId = session.metadata.priceId

        // Determine credits to add based on plan
        let creditsToAdd = 0
        switch (planName.toLowerCase()) {
          case 'lite':
            creditsToAdd = 1000
            break
          case 'plus':
            creditsToAdd = 2000
            break
          case 'pro':
            creditsToAdd = 10000 // Large number for "unlimited"
            break
          default:
            console.log('❌ Unknown plan name:', planName)
            return Response.json({ error: 'Unknown plan' }, { status: 400 })
        }

        try {
          // Add credits to user account
          const result = await addCredits(userId, creditsToAdd, 'credit_purchase', {
            stripeSessionId: session.id,
            planName: planName,
            priceId: priceId,
            amountPaid: session.amount_total,
            currency: session.currency
          })

          if (result.success) {
            console.log(`✅ Added ${creditsToAdd} credits to user ${userId}. New balance: ${result.newBalance}`)

            // Update subscription status in profile
            const supabase = await createClient()
            await supabase
              .from('profiles')
              .update({ 
                subscription_status: planName.toLowerCase(),
                updated_at: new Date().toISOString()
              })
              .eq('id', userId)

            console.log(`✅ Updated subscription status to ${planName.toLowerCase()} for user ${userId}`)
          } else {
            console.log('❌ Failed to add credits:', result.error)
            return Response.json({ error: 'Failed to add credits' }, { status: 500 })
          }
        } catch (error) {
          console.error('❌ Error processing payment:', error)
          return Response.json({ error: 'Error processing payment' }, { status: 500 })
        }
      } else {
        console.log('❌ Missing required session data:', {
          client_reference_id: session.client_reference_id,
          planName: session.metadata?.planName,
          priceId: session.metadata?.priceId
        })
        return Response.json({ error: 'Missing session data' }, { status: 400 })
      }
    }

    return Response.json({ received: true })

  } catch (error) {
    console.error('❌ Webhook error:', error)
    return Response.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}