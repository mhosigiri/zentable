# Pricing & Credits Implementation Plan - COMPLETED ✅

## Overview
~~This document outlines the implementation plan for a credit-based pricing system adapted from the Tersa app, focusing on per-action credit costs rather than token counting.~~

**IMPLEMENTATION STATUS: COMPLETED** 🎉

This document has been updated to reflect the **COMPLETED** implementation of a credit-based pricing system for cursor-for-slides. The system is now fully functional with Stripe integration, database tracking, and UI components.

## ✅ IMPLEMENTED FEATURES

### **Core System**
- ✅ **Credit-Based System**: Simple per-action credit costs (presentations, slides, images, chat, brainstorming)
- ✅ **Stripe Integration**: Real Stripe checkout sessions and webhook processing
- ✅ **4 Pricing Tiers**: Free (500 credits), Lite ($5/1000), Plus ($10/2000), Pro ($20/unlimited)
- ✅ **Database Tracking**: Complete credit transaction logging with RLS policies
- ✅ **API Integration**: All 6 API routes now check/deduct credits before processing

### **Database Schema**
- ✅ **profiles table**: Enhanced with credits_balance, credits_total_used, subscription_status
- ✅ **credit_transactions table**: Tracks all credit usage with metadata
- ✅ **user_subscriptions table**: Manages subscription data  
- ✅ **usage_events table**: Detailed usage analytics
- ✅ **Database Functions**: deduct_credits(), add_credits() with atomic operations
- ✅ **RLS Policies**: Complete security implementation

### **Credit Costs (IMPLEMENTED)**
```typescript
export const CREDIT_COSTS = {
  presentation_create: 10,    // Create presentation outline
  slide_generate: 5,          // Generate individual slide  
  image_generate: 2,          // Generate AI image (reduced from 20)
  chat_message: 2,            // Assistant chat messages
  brainstorming: 3,           // Brainstorming sessions
}
```

### **API Routes with Credit Tracking**
- ✅ `/api/generate-outline` - Presentation creation (10 credits)
- ✅ `/api/generate-slide` - Slide generation (5 credits)  
- ✅ `/api/generate-image` - Image generation (2 credits)
- ✅ `/api/assistant-chat` - Chat messages (2 credits)
- ✅ `/api/brainstorming/chat` - Brainstorming (3 credits)
- ❌ `/api/copilot-chat` - Removed (superseded by assistant-chat)

### **Stripe Integration**
- ✅ **4 Stripe Products Created**: Free, Lite ($5), Plus ($10), Pro ($20)
- ✅ **Real Checkout Sessions**: Functional Stripe payment processing
- ✅ **Webhook Handler**: Processes payments and adds credits automatically
- ✅ **Credit Addition**: Automatic credit allocation (1000/2000/10000 based on plan)
- ✅ **Subscription Status**: Updates user subscription tier in database

### **User Interface**
- ✅ **Pricing Page**: Complete 4-tier pricing page with credit costs display
- ✅ **Billing Dashboard**: Shows credit balance, usage history, transactions
- ✅ **Credit Balance Display**: Real-time credit balance in sidebar
- ✅ **Success/Error Handling**: Payment success alerts and insufficient credit warnings
- ✅ **Responsive Design**: Mobile-friendly pricing and billing pages

### **Technical Implementation**
- ✅ **Server/Client Separation**: Proper separation of server-side and client-side credit utilities
- ✅ **Middleware Configuration**: Webhook endpoint excluded from auth middleware
- ✅ **Error Handling**: 402 Payment Required responses for insufficient credits
- ✅ **Security**: All database operations use RLS policies
- ✅ **Performance**: Atomic credit operations prevent race conditions

---

## 🏗️ IMPLEMENTATION DETAILS

### **Implemented Files Structure**
```
/lib/credits.ts                    - Server-side credit management
/lib/credits-client.ts             - Client-side credit utilities  
/app/api/stripe/create-checkout/   - Stripe checkout session creation
/app/api/stripe/webhook/           - Payment processing webhook
/app/pricing/page.tsx              - Pricing page with 4 tiers
/app/dashboard/billing/page.tsx    - Billing dashboard
/app/dashboard/layout.tsx          - Dashboard layout with sidebar
/components/dashboard/app-sidebar.tsx - Credit balance display
middleware.ts                      - Webhook endpoint exclusion
```

### **Database Migration Applied**
```sql
-- Migration: add_credit_system
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS
  credits_balance integer DEFAULT 500 NOT NULL,
  credits_total_used integer DEFAULT 0 NOT NULL,
  subscription_status text DEFAULT 'free';

CREATE TABLE credit_transactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  action_type text NOT NULL,
  credits_used integer NOT NULL,
  credits_before integer NOT NULL,
  credits_after integer NOT NULL,
  metadata jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT NOW()
);

-- RLS policies and functions implemented
```

---

## 📋 ORIGINAL PLAN (REFERENCE)

### Core Credit Tracking Functions

```typescript
// lib/stripe.ts - Adapted from Tersa
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

const creditValue = 0.01; // 1 credit = $0.01

export const trackCreditUsage = async ({
  action,
  cost,
}: {
  action: string;
  cost: number;
}) => {
  // Development bypass
  if (
    process.env.NODE_ENV === 'development' ||
    !process.env.STRIPE_CREDITS_METER_NAME ||
    !process.env.STRIPE_CREDITS_METER_ID
  ) {
    console.log(`[DEV MODE] Would track credit usage: ${action} - ${cost} cost (${Math.ceil(cost / creditValue)} credits)`);
    return;
  }

  const user = await getAuthUser();
  const credits = Math.ceil(cost / creditValue);

  if (!user.stripe_customer_id) {
    throw new Error('User customerId not found');
  }

  // Skip for test customers
  if (user.stripe_customer_id?.startsWith('cus_dev_')) {
    console.log(`[DEV MODE] Skipping Stripe call for test customer: ${action} - ${cost} cost (${credits} credits)`);
    return;
  }

  await stripe.billing.meterEvents.create({
    event_name: process.env.STRIPE_CREDITS_METER_NAME!,
    payload: {
      action,
      value: credits.toString(),
      stripe_customer_id: user.stripe_customer_id,
    },
  });
};
```

### Credit Costs by Action

```typescript
// lib/credit-costs.ts
export const CREDIT_COSTS = {
  // Presentation actions
  presentation_create: 10,        // Create new presentation with AI outline
  slide_generation: 5,            // AI-generated slide content only (not manual slides)
  image_generation: 20,           // Generate AI image
  
  // Assistant UI actions
  chat_message: 2,                // Each chat message in assistant
  
  // Brainstorming actions
  brainstorming_message: 3,       // Each AI message in brainstorming
  
  // Note: Starting brainstorming session is FREE
  // Note: Manual slide creation is FREE
  // Note: Export actions (PDF, PPTX) are FREE for all users
} as const;
```

### Updated Database Schema

```sql
-- Update profiles table to match Tersa structure
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS 
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  stripe_product_id TEXT,
  subscription_status TEXT,
  free_credits_used BOOLEAN DEFAULT false; -- Track if user used their one-time free credits

-- No need for separate credit tables - Stripe handles it all
```

## 2. Auth Functions (Tersa-Style)

```typescript
// lib/auth.ts - Adapted from Tersa
import { getCredits } from '@/app/actions/credits/get';
import { createClient } from '@/lib/supabase/server';

export const currentUser = async () => {
  const client = await createClient();
  const { data: { user } } = await client.auth.getUser();
  return user;
};

export const currentUserProfile = async () => {
  const user = await currentUser();
  if (!user) throw new Error('User not found');

  const { data: profile } = await createClient()
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return profile;
};

export const getSubscribedUser = async () => {
  const user = await currentUser();
  if (!user) {
    throw new Error('Create an account to use AI features.');
  }

  const profile = await currentUserProfile();
  if (!profile) {
    throw new Error('User profile not found');
  }

  // Development bypass
  if (
    process.env.NODE_ENV === 'development' ||
    profile.stripe_customer_id?.startsWith('cus_dev_') ||
    profile.stripe_subscription_id?.startsWith('sub_dev_') ||
    profile.stripe_product_id?.startsWith('prod_dev_')
  ) {
    console.log('[DEV MODE] Bypassing subscription check for development');
    return user;
  }

  if (!profile.stripe_subscription_id) {
    throw new Error('Subscribe to use AI features.');
  }

  const credits = await getCredits();
  if ('error' in credits) {
    throw new Error(credits.error);
  }

  // Check credits for non-Pro plans
  if (
    profile.stripe_product_id !== process.env.STRIPE_PRO_PRODUCT_ID &&
    credits.credits <= 0
  ) {
    const upgradeMessage = !profile.stripe_subscription_id 
      ? 'Your free credits are exhausted! Subscribe to Lite for more credits.'
      : 'You have no credits remaining! Please upgrade for more credits.';
    
    throw new Error(upgradeMessage);
  }

  return user;
};
```

## 3. Credit Retrieval (Stripe Integration)

```typescript
// app/actions/credits/get.ts
'use server';

import { currentUserProfile } from '@/lib/auth';
import { stripe } from '@/lib/stripe';

const PLAN_CREDITS = {
  FREE: 500,        // One-time credits (no renewal)
  LITE: 1000,       // Monthly renewal
  PLUS: 2000,       // Monthly renewal  
  PRO: Infinity,    // Unlimited
};

export const getCredits = async (): Promise<
  { credits: number } | { error: string }
> => {
  try {
    const profile = await currentUserProfile();
    if (!profile) throw new Error('User profile not found');

    // Development bypass
    if (
      profile.stripe_customer_id?.startsWith('cus_dev_') ||
      !process.env.STRIPE_USAGE_PRODUCT_ID
    ) {
      return { credits: PLAN_CREDITS.LITE };
    }

    // Free tier - one-time credits only (check if already used)
    if (!profile.stripe_subscription_id) {
      // TODO: Track if user has already used their free credits
      return { credits: profile.free_credits_used ? 0 : PLAN_CREDITS.FREE };
    }

    // Pro tier - unlimited
    if (profile.stripe_product_id === process.env.STRIPE_PRO_PRODUCT_ID) {
      return { credits: PLAN_CREDITS.PRO };
    }

    // Get usage from Stripe for paid plans
    const upcomingInvoice = await stripe.invoices.createPreview({
      subscription: profile.stripe_subscription_id,
    });

    const usageLineItem = upcomingInvoice.lines.data.find(
      (line) =>
        line.pricing?.price_details?.product === process.env.STRIPE_USAGE_PRODUCT_ID
    );

    const usage = usageLineItem?.quantity ?? 0;
    
    // Determine credit limit based on plan
    let limit = PLAN_CREDITS.LITE; // Default to Lite
    if (profile.stripe_product_id === process.env.STRIPE_PLUS_PRODUCT_ID) {
      limit = PLAN_CREDITS.PLUS;
    }

    return { credits: limit - usage };
  } catch (error) {
    return { error: error.message };
  }
};
```

## 4. Integration with Existing Features

### Generate Presentation API

```typescript
// app/api/generate-outline/route.ts
import { getSubscribedUser } from '@/lib/auth';
import { trackCreditUsage } from '@/lib/stripe';
import { CREDIT_COSTS } from '@/lib/credit-costs';

export async function POST(request: Request) {
  try {
    // Check subscription and credits
    await getSubscribedUser();
    
    const { title, description } = await request.json();
    
    // Generate outline...
    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      // ... generation logic
    });
    
    // Track credit usage after successful generation
    await trackCreditUsage({
      action: 'presentation_create',
      cost: CREDIT_COSTS.presentation_create,
    });
    
    return result.toDataStreamResponse();
  } catch (error) {
    if (error.message.includes('credits')) {
      return new Response(
        JSON.stringify({ 
          error: error.message,
          upgradeUrl: '/pricing'
        }), 
        { status: 402 }
      );
    }
    throw error;
  }
}
```

### Complete API Routes Requiring Credit Tracking

Based on your existing API routes, here are ALL the endpoints that need credit tracking:

```typescript
// 1. app/api/generate-outline/route.ts - CREATE PRESENTATION
export async function POST(request: Request) {
  try {
    await getSubscribedUser(); // Check credits before generation
    
    const { title, description } = await request.json();
    
    const result = await generateObject({
      model: groq(modelName),
      schema: OutlineSchema,
      prompt: `Create a presentation outline for: ${title}...`
    });
    
    // Track after successful generation
    await trackCreditUsage({
      action: 'presentation_create',
      cost: CREDIT_COSTS.presentation_create,
    });
    
    return Response.json(result.object);
  } catch (error) {
    if (error.message.includes('credits')) {
      return Response.json({ error: error.message }, { status: 402 });
    }
    throw error;
  }
}

// 2. app/api/generate-slide/route.ts - AI SLIDE GENERATION
export async function POST(request: Request) {
  try {
    await getSubscribedUser();
    
    const { templateType, content, theme } = await request.json();
    
    // Generate slide content with AI
    const result = await generateObject({
      model: groq(modelName),
      schema: getSchemaForTemplate(templateType),
      prompt: `Generate slide content...`
    });
    
    await trackCreditUsage({
      action: 'slide_generation',
      cost: CREDIT_COSTS.slide_generation,
    });
    
    return Response.json(result.object);
  } catch (error) {
    // Handle credit errors
  }
}

// 3. app/api/generate-image/route.ts - AI IMAGE GENERATION
export async function POST(request: Request) {
  try {
    await getSubscribedUser();
    
    const { prompt, templateType, theme } = await request.json();
    
    const { image } = await generateImage({
      model: replicate('black-forest-labs/flux-1.1-pro'),
      prompt: enhancedPrompt,
    });
    
    await trackCreditUsage({
      action: 'image_generation',
      cost: CREDIT_COSTS.image_generation,
    });
    
    return Response.json({ imageUrl: image.url });
  } catch (error) {
    // Handle credit errors
  }
}

// 4. app/api/assistant-chat/route.ts - ASSISTANT UI CHAT
export async function POST(request: Request) {
  try {
    await getSubscribedUser();
    
    const { messages, presentationId } = await request.json();
    
    const result = await streamText({
      model: azureOpenAI('gpt-4o'),
      messages,
      tools: slideTools,
    });
    
    // Track after message completion
    await trackCreditUsage({
      action: 'chat_message',
      cost: CREDIT_COSTS.chat_message,
    });
    
    return result.toDataStreamResponse();
  } catch (error) {
    // Handle credit errors
  }
}

// 5. app/api/brainstorming/chat/route.ts - BRAINSTORMING CHAT
export async function POST(request: Request) {
  try {
    await getSubscribedUser();
    
    const { messages, context, threadId } = await request.json();
    
    const result = await streamText({
      model: groq('llama-3.3-70b-versatile'),
      messages,
      tools: brainstormingTools,
    });
    
    // Track each AI response in brainstorming
    await trackCreditUsage({
      action: 'brainstorming_message',
      cost: CREDIT_COSTS.brainstorming_message,
    });
    
    return result.toDataStreamResponse();
  } catch (error) {
    // Handle credit errors
  }
}

// 6. REMOVED: app/api/copilot-chat/route.ts - Superseded by assistant-chat
export async function POST(request: Request) {
  try {
    await getSubscribedUser();
    
    const { messages, slideId } = await request.json();
    
    const result = await streamText({
      model: azureOpenAI('gpt-4o'),
      messages,
      tools: slideTools,
    });
    
    // Track copilot interactions as chat messages
    await trackCreditUsage({
      action: 'chat_message',
      cost: CREDIT_COSTS.chat_message,
    });
    
    return result.toDataStreamResponse();
  } catch (error) {
    // Handle credit errors
  }
}
```

### Routes That DON'T Need Tracking:
- `app/api/approve-slide-update/route.ts` - Manual slide updates (FREE)
- `app/api/threads/route.ts` - Thread management (FREE)
- `app/api/api-keys/route.ts` - API key management (FREE)
- `app/api/mcp/route.ts` - MCP integration (FREE)
- `app/api/ai-text-completion/route.ts` - Only if this is for manual text editing

## 5. Credits Counter Component (Tersa-Style)

```typescript
// components/credits-counter.tsx
'use client';

import { getCredits } from '@/app/actions/credits/get';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Infinity } from 'lucide-react';
import Link from 'next/link';

export function CreditsCounter() {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCredits() {
      const result = await getCredits();
      if ('credits' in result) {
        setCredits(result.credits);
      }
      setLoading(false);
    }
    fetchCredits();
  }, []);

  if (loading) {
    return <div className="animate-pulse h-9 w-20 bg-muted rounded" />;
  }

  if (credits === null) {
    return null;
  }

  if (credits === Infinity) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <Infinity className="h-4 w-4" />
        <span>Unlimited</span>
      </div>
    );
  }

  const isLow = credits < 100;

  return (
    <div className="flex items-center gap-2">
      <span className={`text-sm ${isLow ? 'text-orange-600 font-medium' : ''}`}>
        {credits.toLocaleString()} credits
      </span>
      {isLow && (
        <Button variant="ghost" size="sm" asChild>
          <Link href="/pricing">Upgrade</Link>
        </Button>
      )}
    </div>
  );
}
```

## 6. Prerequisites & Setup Requirements

### Pre-Implementation Checklist

#### 1. Stripe Account Setup
- [ ] Create Stripe account (if not exists)
- [ ] Complete account verification
- [ ] Enable test mode for development
- [ ] Note down API keys (publishable and secret)

#### 2. Stripe Products Creation
Create these products in your Stripe dashboard:

**Product 1: Lite Plan**
- Name: "Lite Plan"
- Description: "1,000 credits per month"
- Type: Recurring
- Price: $5.00 USD/month
- Billing period: Monthly
- Copy the Product ID → `STRIPE_LITE_PRODUCT_ID`

**Product 2: Plus Plan**
- Name: "Plus Plan" 
- Description: "2,000 credits per month"
- Type: Recurring
- Price: $10.00 USD/month
- Billing period: Monthly
- Copy the Product ID → `STRIPE_PLUS_PRODUCT_ID`

**Product 3: Pro Plan**
- Name: "Pro Plan"
- Description: "Unlimited credits"
- Type: Recurring
- Price: $20.00 USD/month
- Billing period: Monthly
- Copy the Product ID → `STRIPE_PRO_PRODUCT_ID`

**Product 4: Credit Usage (Metered)**
- Name: "Credit Usage"
- Description: "Usage-based credit tracking"
- Type: Recurring (metered usage)
- Unit: "credit"
- Pricing: $0.00 (this is just for tracking)
- Copy the Product ID → `STRIPE_USAGE_PRODUCT_ID`

#### 3. Stripe Billing Meter Setup
- [ ] Go to Stripe Dashboard → Billing → Meters
- [ ] Create new meter:
  - Event name: `credits_usage`
  - Display name: "Credits Usage"
  - Aggregation: Sum
  - Value settings: Event value
- [ ] Copy Meter ID → `STRIPE_CREDITS_METER_ID`

#### 4. Stripe Webhook Setup
- [ ] Go to Stripe Dashboard → Developers → Webhooks
- [ ] Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
- [ ] Select events to listen for:
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated` 
  - `customer.subscription.deleted`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
- [ ] Copy webhook signing secret → `STRIPE_WEBHOOK_SECRET`

#### 5. Environment Variables Setup
Add these to your `.env.local` file:

```env
# Stripe Core
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Products & Pricing (get from step 2)
STRIPE_LITE_PRODUCT_ID=prod_...
STRIPE_PLUS_PRODUCT_ID=prod_...
STRIPE_PRO_PRODUCT_ID=prod_...
STRIPE_USAGE_PRODUCT_ID=prod_...

# Billing Meter (get from step 3)
STRIPE_CREDITS_METER_NAME=credits_usage
STRIPE_CREDITS_METER_ID=mtr_...
```

#### 6. Database Prerequisites
- [ ] Ensure Supabase project is set up
- [ ] Verify you have database migration access
- [ ] Check that `profiles` table exists
- [ ] Confirm RLS policies are in place

#### 7. Development Setup
For testing without real Stripe charges:
- [ ] Use Stripe test keys (start with `sk_test_` and `pk_test_`)
- [ ] Install Stripe CLI for webhook testing: `stripe login`
- [ ] Set up test customer IDs with `cus_dev_` prefix in your database

#### 8. Dependencies Check
Verify these packages are installed:
```bash
npm list stripe @stripe/stripe-js
```

If missing, install:
```bash
npm install stripe @stripe/stripe-js
```

#### 9. Test Data Setup (Optional)
Create test profiles in your database:
```sql
-- Insert test user with Lite plan
INSERT INTO profiles (id, stripe_customer_id, stripe_subscription_id, stripe_product_id, free_credits_used)
VALUES ('test-user-lite', 'cus_dev_lite123', 'sub_dev_lite123', 'prod_dev_lite', false);

-- Insert test user with exhausted free credits
INSERT INTO profiles (id, stripe_customer_id, stripe_subscription_id, stripe_product_id, free_credits_used)
VALUES ('test-user-free', NULL, NULL, NULL, true);
```

#### 10. Domain/URL Configuration
- [ ] Confirm your domain for webhook endpoints
- [ ] Set up SSL certificate (required for Stripe webhooks)
- [ ] Configure success/cancel URLs for checkout

### Ready to Code Checklist
Before starting implementation, ensure you have:
- [ ] All Stripe Product IDs copied
- [ ] All environment variables set
- [ ] Webhook endpoint configured
- [ ] Database migration planned
- [ ] Test data prepared
- [ ] Dependencies installed

Once all prerequisites are complete, we can begin with the database migration and code implementation!

## 7. Updated Credit Usage Examples

### Revised Credit Costs Summary:
```typescript
{
  presentation_create: 10,     // AI outline generation
  slide_generation: 5,         // AI slide content (not manual)
  image_generation: 20,        // AI image generation
  chat_message: 2,            // Assistant UI messages
  brainstorming_message: 3,   // AI responses in brainstorming
  
  // FREE actions:
  // - Starting brainstorming session
  // - Manual slide creation
  // - PDF/PPTX exports
}
```

### What Each Plan Can Do:
**Free Tier (500 one-time credits):**
- Create 50 AI presentations
- OR 25 presentations + 50 AI images
- OR 100 slides + 100 chat messages
- Manual slides, exports: unlimited

**Lite Tier (1,000 credits/month):**
- Create 100 AI presentations monthly
- OR 50 presentations + 50 AI images
- OR mix of presentations, slides, chat, brainstorming
- Resets monthly

**Plus Tier (2,000 credits/month):**
- Create 200 AI presentations monthly
- OR 100 presentations + 100 AI images
- Suitable for heavy users

**Pro Tier (Unlimited):**
- No limits on any AI features

## 7. Key Differences from Token-Based System

| Aspect | Token-Based | Action-Based (Tersa) |
|--------|-------------|---------------------|
| Tracking | Count AI tokens | Fixed cost per action |
| Complexity | Complex token counting | Simple action tracking |
| User Understanding | Hard to predict costs | Easy to understand |
| Implementation | Custom tracking | Stripe handles most |
| Billing | Need custom logic | Stripe meter events |

## 8. Implementation Steps

1. **Database Migration**
   ```sql
   ALTER TABLE profiles ADD COLUMN 
     stripe_customer_id TEXT,
     stripe_subscription_id TEXT,
     stripe_product_id TEXT,
     subscription_status TEXT,
     free_credits_used BOOLEAN DEFAULT false;
   ```

2. **Update Auth Flow**
   - Copy auth functions from Tersa
   - Add getSubscribedUser checks to all AI endpoints

3. **Add Credit Tracking**
   - Import trackCreditUsage to each API route
   - Call after successful AI operations

4. **Create UI Components**
   - Add CreditsCounter to dashboard
   - Create pricing page
   - Add upgrade prompts

5. **Test Development Mode**
   - Use cus_dev_ prefixes
   - Verify bypass works
   - Test credit depletion

## 9. Advantages of This Approach

1. **Simplicity**: No token counting complexity
2. **Stripe Integration**: Let Stripe handle billing
3. **Flexibility**: Easy to adjust costs per action
4. **User-Friendly**: Users understand "10 credits per presentation"
5. **Development Mode**: Easy testing without Stripe calls

This Tersa-style implementation is much simpler than token counting and gives you full control over credit costs while leveraging Stripe's robust billing infrastructure.