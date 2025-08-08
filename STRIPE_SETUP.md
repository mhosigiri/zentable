# Stripe Environment Setup Guide

This document explains how to configure Stripe for both development and production environments.

## Environment Variables

### Required Variables

Add these to your `.env.local` (development) and production environment:

```bash
# Environment Configuration
NODE_ENV=development          # "development" or "production"
STRIPE_MODE=test             # "test" or "live" (optional override)

# Simple Keys - Use test or live keys based on your environment
STRIPE_SECRET_KEY=sk_test_...      # Use sk_test_... for dev, sk_live_... for prod
STRIPE_PUBLISHABLE_KEY=pk_test_... # Use pk_test_... for dev, pk_live_... for prod  
STRIPE_WEBHOOK_SECRET=whsec_...    # Use test webhook secret for dev, live for prod
```

## How Mode Selection Works

The system automatically selects test or live mode using this priority:

1. **`STRIPE_MODE`** environment variable (`test` or `live`)
2. **`NODE_ENV`** environment variable (`production` = live, anything else = test)

### Examples:

| NODE_ENV | STRIPE_MODE | Result | Use Case |
|----------|-------------|---------|----------|
| development | (not set) | **test** | Local development |
| production | (not set) | **live** | Production deployment |
| development | test | **test** | Explicit test mode |
| production | test | **test** | Production but with test Stripe |
| development | live | **live** | Local dev with live Stripe |

## Current Configuration

### Test Products & Prices
- **Lite**: `price_1RtWl99MDLdB3mTb8iBxZYaY` - $5/month - 1,000 credits
- **Plus**: `price_1RtWlA9MDLdB3mTbqz1qLDT5` - $10/month - 2,500 credits  
- **Pro**: `price_1RtWlA9MDLdB3mTbUMunPLQH` - $20/month - 7,500 credits

### Live Products & Prices  
- **Lite**: `price_1RtZ5J9MDLdB3mTbaaEODvHQ` - $5/month - 1,000 credits
- **Plus**: `price_1RtZ5O9MDLdB3mTbSjJm8R8u` - $10/month - 2,500 credits
- **Pro**: `price_1RtZ5S9MDLdB3mTbMMhwtTBO` - $20/month - 7,500 credits

## Local Development Setup

1. **Install Stripe CLI:**
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Login to your Stripe account
   stripe login
   ```

2. **Forward Webhooks Locally:**
   ```bash
   # For test mode
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   
   # Copy the webhook secret (whsec_...) to STRIPE_WEBHOOK_SECRET_TEST
   ```

3. **Test the Setup:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/pricing
   # Subscribe to a plan with test card: 4242 4242 4242 4242
   ```

## Production Deployment

1. **Set Environment Variables:**
   ```bash
   NODE_ENV=production
   STRIPE_SECRET_KEY=sk_live_...
   STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_...  # From live webhook
   ```

2. **Configure Live Webhook:**
   - Go to [Stripe Dashboard > Webhooks](https://dashboard.stripe.com/webhooks)
   - Add endpoint: `https://zentableai.com/api/stripe/webhook`
   - Select events: 
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated` 
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
   - Copy webhook secret to environment variables

## Testing Different Modes

### Test Mode (Local Development)
```bash
# .env.local
NODE_ENV=development
STRIPE_MODE=test
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Live Mode (Production)
```bash
# Production environment
NODE_ENV=production  
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### Test Mode in Production (for debugging)
```bash
# Production environment with test Stripe
NODE_ENV=production
STRIPE_MODE=test
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## How It Works in Code

The system uses `/lib/stripe-config.ts` to automatically select the correct:
- ✅ Price IDs for subscriptions
- ✅ Credit allocations  
- ✅ Tier mappings
- ✅ Webhook processing

All components automatically use the right configuration without code changes!

## Troubleshooting

### "Invalid price ID" errors
- Check that your `NODE_ENV` and `STRIPE_MODE` match your intended environment
- Verify the correct keys are active in your environment

### Webhook failures
- Ensure webhook secret matches the environment (test vs live)
- Check that webhook URL is accessible from Stripe's servers

### Credit allocation issues  
- Verify price IDs exist in both test and live modes
- Check `/lib/stripe-config.ts` has correct mappings

## Migration Checklist

- [ ] Test environment working with test keys
- [ ] Live environment configured with live keys  
- [ ] Live webhook endpoint created and configured
- [ ] Database migration applied to production
- [ ] Test subscription flow in both environments
- [ ] Monitor webhook logs for errors