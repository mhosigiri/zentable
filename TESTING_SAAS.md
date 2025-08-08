# SaaS Subscription Testing Guide

## Setup Required

### 1. Database Migration
```bash
# Apply the new subscription schema
npx supabase db push
```

### 2. Stripe Webhook Testing
```bash
# Install Stripe CLI if not already done
# https://stripe.com/docs/stripe-cli

# Login to your Stripe account
stripe login

# Forward webhooks to your local server
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

### 3. Environment Variables
Ensure you have these in your `.env.local`:
```env
STRIPE_SECRET_KEY=sk_test_... # Your test secret key
STRIPE_PUBLISHABLE_KEY=pk_test_... # Your test publishable key
STRIPE_WEBHOOK_SECRET=whsec_... # From stripe listen command above
```

## Test Scenarios

### ✅ **Scenario 1: New User Free Plan**

1. **Sign up new user**
   - Go to `/auth/signup`
   - Create account
   - Should automatically get 500 credits

2. **Use some free credits**
   - Create presentation (10 credits) 
   - Generate image (2 credits)
   - Check billing page - should show credits used

3. **Expected Result**: 488 credits remaining, free_credits_used = 12

### ✅ **Scenario 2: Subscription Flow** 

1. **Subscribe to Lite Plan**
   - Go to `/pricing`
   - Click "Subscribe to Lite" 
   - Use test card: `4242 4242 4242 4242`
   - Complete checkout

2. **Verify Subscription**
   - Check `/dashboard/billing`
   - Should show "Lite" plan active
   - Credits should be: 488 (remaining free) + 1000 (Lite) = 1488 total

3. **Test Monthly Renewal** (Stripe CLI)
   ```bash
   # Trigger renewal webhook
   stripe trigger invoice.payment_succeeded
   ```
   - Should add another 1000 credits (2488 total)

### ✅ **Scenario 3: Subscription Cancellation**

1. **Cancel Subscription**
   - Go to billing page
   - Click "Cancel Subscription" 
   - Confirm cancellation

2. **Verify Cancellation**
   - Subscription should show "Cancels at [end date]"
   - Credits remain until period ends

3. **Test Period End** (Simulate)
   ```bash
   # Trigger subscription deletion
   stripe trigger customer.subscription.deleted
   ```
   - Credits should reset to remaining free credits
   - If started with 500, used 12, then subscribed: should return to 488

### ✅ **Scenario 4: Plan Changes**

1. **Upgrade from Lite to Plus**
   - On billing page, click "Change Plan"
   - Subscribe to Plus plan
   - Should keep all accumulated credits + add Plus allocation

2. **Downgrade from Plus to Lite**
   - Change plan back to Lite
   - Credits should be preserved

### ✅ **Scenario 5: Free Plan Limits**

1. **Use all free credits**
   - Create 50 presentations (500 credits total)
   - Try to create another - should get insufficient credits error

2. **Subscribe after exhausting free credits**
   - Subscribe to any paid plan
   - Should get plan credits immediately

## Test Card Numbers

Use these Stripe test cards:

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Success |
| `4000 0025 0000 3155` | Requires authentication |
| `4000 0000 0000 9995` | Declined |
| `4000 0000 0000 0002` | Declined (generic) |

**All cards**: Use any future expiry date and any 3-digit CVC.

## Expected Database State

After testing, check your database:

```sql
-- Check user profile
SELECT 
  credits_balance,
  credits_total_used, 
  free_credits_used,
  subscription_status,
  stripe_subscription_id,
  current_period_end
FROM profiles 
WHERE id = 'your-user-id';

-- Check credit transactions
SELECT 
  action_type,
  credits_used,
  credits_before,
  credits_after,
  created_at
FROM credit_transactions 
WHERE user_id = 'your-user-id'
ORDER BY created_at DESC;
```

## Monitoring & Debugging

### Stripe Dashboard
- Go to https://dashboard.stripe.com/test/logs
- Monitor webhook events and their responses
- Check subscription status and billing history

### Local Logs
- Watch your server console for webhook processing logs
- Look for `✅` success and `❌` error messages
- Credit allocation and subscription status updates

### Common Issues

1. **Webhooks not triggering**: Check Stripe CLI is running and forwarding
2. **Database errors**: Ensure migration was applied successfully
3. **Credit calculation wrong**: Check the database functions are working
4. **UI not updating**: Verify credit stats are being fetched correctly

## Success Criteria

- ✅ New users get 500 free credits automatically
- ✅ Free credits are tracked when used
- ✅ Subscriptions add credits on top of existing balance
- ✅ Monthly renewals add more credits (accumulation)
- ✅ Cancellation preserves remaining original free credits
- ✅ Plan changes work without losing credits
- ✅ Webhook processing handles all subscription lifecycle events
- ✅ UI reflects current subscription status and credit balance

Ready to test! 🚀