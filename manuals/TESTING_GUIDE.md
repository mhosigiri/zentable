# Credit System Testing Guide

This guide will help you test the newly implemented credit system in cursor-for-slides.

## ✅ Prerequisites

1. **Database Migration Applied**: The credit system database tables should be created
2. **Authenticated User**: You need to be logged in to test the system
3. **Initial Credits**: Users start with 500 free credits

## 🧪 Manual Testing Checklist

### 1. Database & Credits Setup
- [ ] Check if you have initial 500 credits (visible in sidebar)
- [ ] Navigate to `/dashboard/billing` to see credit balance
- [ ] Verify credit balance shows in sidebar footer

### 2. API Credit Deduction Testing

#### Generate Outline (10 credits)
- [ ] Create a new presentation
- [ ] Enter a prompt and generate outline
- [ ] Check that credits decreased by 10
- [ ] Response should include `creditsRemaining` field

#### Generate Slide (5 credits)  
- [ ] Generate an individual slide
- [ ] Check that credits decreased by 5
- [ ] Response should include `creditsRemaining` field

#### Generate Image (20 credits)
- [ ] Generate an AI image for a slide
- [ ] Check that credits decreased by 20
- [ ] Response should include `creditsRemaining` field

#### Chat Features (2 credits each)
- [ ] Use copilot chat feature
- [ ] Use assistant chat feature  
- [ ] Each message should deduct 2 credits

#### Brainstorming (3 credits)
- [ ] Use brainstorming feature
- [ ] Each interaction should deduct 3 credits

### 3. Insufficient Credits Testing
- [ ] Reduce your credits to below required amount (you can do this via database)
- [ ] Try to use any AI feature
- [ ] Should get 402 Payment Required response
- [ ] Error should show current balance and required credits

### 4. UI Testing

#### Pricing Page (`/pricing`)
- [ ] Navigate to `/pricing`
- [ ] Should show 4 plans: Free, Lite ($5), Plus ($10), Pro ($20)
- [ ] Should show current credit balance at top
- [ ] Should show credit costs for each action
- [ ] Click "Get Lite/Plus/Pro" should redirect to billing page

#### Billing Page (`/dashboard/billing`)
- [ ] Navigate to `/dashboard/billing`
- [ ] Should show current credit balance
- [ ] Should show total credits used
- [ ] Should show current plan status
- [ ] Should show recent transactions list
- [ ] Should show usage progress bar

#### Sidebar Integration
- [ ] Credit balance should be visible in sidebar footer
- [ ] Should show available credits with yellow background
- [ ] Clicking "Billing" in user dropdown should go to billing page

### 5. Transaction Logging
- [ ] After each AI action, check `/dashboard/billing`
- [ ] Should show new transaction in "Recent Activity"
- [ ] Transaction should show correct action type and credit cost
- [ ] Should show before/after credit balance

## 🔧 Database Testing (Advanced)

If you have database access, you can verify:

```sql
-- Check user's credit balance
SELECT credits_balance, credits_total_used, subscription_status 
FROM profiles WHERE id = 'your-user-id';

-- Check recent transactions
SELECT * FROM credit_transactions 
WHERE user_id = 'your-user-id' 
ORDER BY created_at DESC LIMIT 10;

-- Manually adjust credits for testing
UPDATE profiles 
SET credits_balance = 10 
WHERE id = 'your-user-id';
```

## 🚨 Error Scenarios to Test

1. **Zero Credits**: Set balance to 0, try any AI feature
2. **Insufficient Credits**: Set balance to 3, try image generation (needs 20)
3. **Database Errors**: Test with invalid user IDs
4. **Concurrent Usage**: Multiple browser tabs using credits simultaneously

## 📊 Expected Behavior

### Successful Operations
- Credits deducted before AI processing
- Response includes `creditsRemaining`
- Transaction logged in database
- UI updates to show new balance

### Insufficient Credits
- HTTP 402 Payment Required status
- Error message with current balance
- No AI processing occurs
- No credits deducted

### Error Handling
- Database errors return 500 status
- Invalid requests return 400 status  
- Unauthorized users return 401 status

## 🎯 Testing Commands

### Quick Credit Check (Browser Console)
```javascript
// Check current user's credits
fetch('/api/user/credits').then(r => r.json()).then(console.log)

// Test outline generation
fetch('/api/generate-outline', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({
    prompt: 'Test presentation',
    cardCount: 3,
    style: 'professional',
    language: 'en' 
  })
}).then(r => r.json()).then(console.log)
```

### Database Functions Test
```sql
-- Test deduct credits function
SELECT deduct_credits(
  'your-user-id'::uuid, 
  5, 
  'slide_generate', 
  '{"test": true}'::jsonb
);

-- Test add credits function  
SELECT add_credits(
  'your-user-id'::uuid,
  100,
  'credit_grant',
  '{"reason": "testing"}'::jsonb
);
```

## ✅ Success Criteria

The implementation is working correctly if:

1. ✅ All API routes deduct credits before processing
2. ✅ Insufficient credits return 402 status  
3. ✅ Credit balance updates in real-time
4. ✅ Transactions are logged correctly
5. ✅ UI shows accurate credit information
6. ✅ Database functions work atomically
7. ✅ Error handling is graceful

## 🐛 Common Issues

1. **Credits Not Deducting**: Check if user is authenticated
2. **UI Not Updating**: Check if getCreditStats is being called
3. **Database Errors**: Verify migration was applied correctly
4. **API Errors**: Check server logs for detailed error messages

## 📝 Report Issues

If you find any issues during testing:

1. Note the exact steps to reproduce
2. Include error messages and status codes
3. Check browser console and server logs
4. Verify database state before and after issue
5. Test with different user accounts if possible

The credit system should now be fully functional and ready for production use!