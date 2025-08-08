import { stripeConfig } from '@/lib/stripe-config'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Return the current Stripe configuration based on environment
    return Response.json({
      prices: stripeConfig.prices,
      mode: stripeConfig.mode,
      isLive: stripeConfig.isLive
    })
  } catch (error) {
    console.error('Error getting Stripe config:', error)
    return Response.json(
      { error: 'Failed to get Stripe configuration' },
      { status: 500 }
    )
  }
}