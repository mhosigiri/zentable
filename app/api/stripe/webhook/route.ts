import { createClient } from '@/lib/supabase/server'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'
import { DatabaseService } from '@/lib/database'

export const dynamic = 'force-dynamic'

// Type guards to handle Stripe API response variations
function getSubscriptionId(sub: string | Stripe.Subscription | null): string | null {
  if (!sub) return null
  return typeof sub === 'string' ? sub : sub.id
}

function getPeriodEnd(subscription: Stripe.Subscription): number {
  return subscription.current_period_end
}

// Use simple webhook secret variable
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  console.log('🔗 Webhook endpoint hit! URL:', request.url)
  
  try {
    const body = await request.text()
    const signature = request.headers.get('stripe-signature')

    if (!signature) {
      return Response.json({ error: 'No signature found' }, { status: 400 })
    }

    if (!process.env.STRIPE_SECRET_KEY) {
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
    
    const supabase = await createClient()
    const db = new DatabaseService(supabase)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        
        // For subscription mode checkouts
        if (session.mode === 'subscription' && session.subscription) {
          const subscriptionId = session.subscription as string
          const customerId = session.customer as string
          const userId = session.client_reference_id!
          
          // Retrieve the subscription to get details
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const priceId = subscription.items.data[0].price.id
          const currentPeriodEnd = getPeriodEnd(subscription)
          
          console.log('💳 Processing new subscription:', {
            userId,
            subscriptionId,
            customerId,
            priceId,
            status: subscription.status
          })

          // Update user profile with subscription info
          const updateSuccess = await db.updateSubscriptionStatus(userId, {
            stripeCustomerId: customerId,
            stripeSubscriptionId: subscriptionId,
            stripePriceId: priceId,
            subscriptionStatus: subscription.status, // Stripe status (active, canceled, etc.)
            currentPeriodEnd: new Date(currentPeriodEnd * 1000).toISOString()
          })

          if (!updateSuccess) {
            console.error('❌ Failed to update subscription status')
            return Response.json({ error: 'Failed to update subscription status' }, { status: 500 })
          }

          // Check if this is an upgrade (plan change) by looking at metadata
          const isUpgrade = session.metadata?.isUpgrade === 'true'

          if (isUpgrade) {
            console.log('🔄 Processing plan change via checkout')
          }

          // Allocate initial credits (for new subscriptions) or full credits (for plan changes)
          const creditSuccess = await db.allocateSubscriptionCredits(userId, priceId, false)

          if (!creditSuccess) {
            console.error('❌ Failed to allocate credits')
          }

          console.log('✅ Subscription activated for user:', userId)
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        // Skip first invoice (already handled in checkout.session.completed)
        if (invoice.billing_reason === 'subscription_create') {
          break
        }

        // Handle subscription renewals - get subscription from line items
        const firstLineItem = invoice.lines?.data?.[0]
        if (firstLineItem?.subscription && invoice.billing_reason === 'subscription_cycle') {
          const subscriptionId = firstLineItem.subscription as string
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          
          // Get user from subscription metadata or customer
          const { data: profile } = await supabase
            .from('profiles')
            .select('id')
            .eq('stripe_subscription_id', subscriptionId)
            .single()

          if (profile) {
            const priceId = subscription.items.data[0].price.id
            
            console.log('🔄 Processing subscription renewal:', {
              userId: profile.id,
              subscriptionId,
              priceId
            })

            // Update subscription period  
            const renewalPeriodEnd = getPeriodEnd(subscription)
            const renewalUpdateData: any = {
              stripePriceId: priceId, // This will set the correct tier based on price
              subscriptionStatus: subscription.status // Update Stripe status
            }
            
            // Only set period end if it's a valid timestamp
            if (renewalPeriodEnd && renewalPeriodEnd > 0) {
              renewalUpdateData.currentPeriodEnd = new Date(renewalPeriodEnd * 1000).toISOString()
            }
            
            await db.updateSubscriptionStatus(profile.id, renewalUpdateData)

            // Allocate renewal credits
            const creditSuccess = await db.allocateSubscriptionCredits(profile.id, priceId, true)

            if (!creditSuccess) {
              console.error('❌ Failed to allocate renewal credits')
            }

            console.log('✅ Subscription renewed for user:', profile.id)
          }
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Get user from subscription
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (profile) {
          const priceId = subscription.items.data[0].price.id
          
          // Check if this is a plan change by comparing with current price
          const { data: currentProfile } = await supabase
            .from('profiles')
            .select('stripe_price_id')
            .eq('id', profile.id)
            .single()
            
          const oldPriceId = currentProfile?.stripe_price_id
          const isPlanChange = oldPriceId && oldPriceId !== priceId
          
          console.log('📝 Subscription updated:', {
            userId: profile.id,
            subscriptionId: subscription.id,
            status: subscription.status,
            cancelAtPeriodEnd: subscription.cancel_at_period_end,
            isPlanChange,
            oldPriceId,
            newPriceId: priceId
          })

          // Update subscription info
          const updatePeriodEnd = getPeriodEnd(subscription)
          const updateData: any = {
            stripePriceId: priceId,
            subscriptionStatus: subscription.status // Update Stripe status
          }
          
          // Only set period end if it's a valid timestamp
          if (updatePeriodEnd && updatePeriodEnd > 0) {
            updateData.currentPeriodEnd = new Date(updatePeriodEnd * 1000).toISOString()
          }
          
          // Handle cancellation date
          if (subscription.cancel_at_period_end && subscription.cancel_at) {
            updateData.cancelAt = new Date(subscription.cancel_at * 1000).toISOString()
            console.log('✅ Subscription set to cancel at period end:', {
              subscriptionId: subscription.id,
              cancelAt: new Date(subscription.cancel_at * 1000)
            })
          } else if (!subscription.cancel_at_period_end) {
            // Subscription was reactivated, clear cancel date
            updateData.cancelAt = null
          }
          
          await db.updateSubscriptionStatus(profile.id, updateData)
          
          // Handle plan changes - allocate credits for upgrades
          if (isPlanChange && oldPriceId) {
            await db.handlePlanChange(profile.id, oldPriceId, priceId)
          }
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        // Get user from subscription
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('stripe_subscription_id', subscription.id)
          .single()

        if (profile) {
          console.log('❌ Subscription canceled:', {
            userId: profile.id,
            subscriptionId: subscription.id
          })

          // Handle subscription cancellation (credits expire)
          const cancelSuccess = await db.handleSubscriptionCancellation(profile.id)

          if (!cancelSuccess) {
            console.error('❌ Failed to handle cancellation')
          }

          console.log('✅ Subscription canceled for user:', profile.id)
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
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