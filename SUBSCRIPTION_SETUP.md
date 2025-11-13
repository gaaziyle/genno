# Subscription and Credit System Setup Guide

This guide explains how to set up the subscription and credit system for Genno using Paddle and Supabase.

## Overview

The system includes:
- **3 Subscription Plans**: Free, Starter, and Team
- **Credit System**: Users get monthly credits based on their plan
- **Paddle Integration**: Payment processing and subscription management
- **Supabase Database**: Credit tracking and subscription data storage

## Plans

| Plan | Price (Monthly) | Price (Yearly) | Credits/Month |
|------|----------------|----------------|---------------|
| Free | $0 | $0 | 3 |
| Starter | $29 | $290 | 100 |
| Team | $99 | $990 | 500 |

## Database Setup

### 1. Run the SQL Schema

Execute the SQL file in your Supabase SQL Editor:

```bash
supabase-credits-subscriptions-schema.sql
```

This creates:
- `user_credits` table - Tracks user credit balances
- `subscriptions` table - Stores Paddle subscription data
- `credit_transactions` table - Audit trail for credit usage
- Helper functions for credit management
- Row Level Security policies

### 2. Verify Tables

After running the schema, verify the tables were created:

```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('user_credits', 'subscriptions', 'credit_transactions');
```

## Paddle Setup

### 1. Environment Variables

Your `.env.local` file should contain:

```env
# Paddle Live Environment
NEXT_PUBLIC_PADDLE_API_KEY=pdl_live_apikey_...
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_...
NEXT_PUBLIC_STARTER_PRICE_ID=pri_...
NEXT_PUBLIC_TEAM_PRICE_ID=pri_...

# Paddle Sandbox Environment
NEXT_PUBLIC_PADDLE_API_KEY_SANDBOX=pdl_sdbx_apikey_...
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX=test_...
NEXT_PUBLIC_STARTER_PRICEID_SANDBOX=pri_...
NEXT_PUBLIC_TEAM_PRICEID_SANDBOX=pri_...

# Environment: 'sandbox' or 'production'
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
```

### 2. Configure Paddle Webhook

You have two options for webhook handling:

#### Option A: Supabase Edge Function (Recommended)

1. Deploy the edge function (see `EDGE_FUNCTION_DEPLOYMENT.md`)
2. Use the edge function URL:
   ```
   https://your-project.supabase.co/functions/v1/paddle-webhook
   ```

#### Option B: Next.js API Route

1. Use your Next.js API route:
   ```
   https://yourdomain.com/api/paddle/webhook
   ```

In your Paddle dashboard:

1. Go to **Developer Tools** > **Notifications**
2. Add a new webhook endpoint (use URL from option A or B)
3. Subscribe to these events:
   - `subscription.created`
   - `subscription.updated`
   - `subscription.canceled`
   - `subscription.activated`
   - `subscription.past_due`
   - `subscription.paused`

### 3. Create Products and Prices in Paddle

1. Create two products in Paddle:
   - **Starter Plan**
   - **Team Plan**

2. For each product, create prices:
   - Monthly price
   - Yearly price (with discount)

3. Copy the Price IDs and add them to your `.env.local`

## API Routes

The system includes these API routes:

### Credit Management
- `GET /api/credits/check` - Check user's current credits
- `POST /api/credits/deduct` - Deduct credits (used when creating blogs)

### Paddle Webhooks
- `POST /api/paddle/webhook` - Handles Paddle subscription events

## Usage in Code

### Check Credits

```typescript
import { useCredits } from "@/hooks/useCredits";

function MyComponent() {
  const { credits, planType, hasCredits, deductCredit } = useCredits();
  
  // Check if user has credits
  if (!hasCredits) {
    // Show upgrade prompt
  }
}
```

### Deduct Credits

```typescript
// When creating a blog post
try {
  await deductCredit(1, "Blog creation", blogId);
  // Continue with blog creation
} catch (error) {
  // Handle insufficient credits
}
```

## Credit System Functions

The database includes helper functions:

### Deduct Credits
```sql
SELECT deduct_credit(
  'user_clerk_id',  -- Clerk user ID
  1,                -- Amount to deduct
  'Blog creation',  -- Reason
  'blog_uuid'       -- Optional blog ID
);
```

### Add Credits
```sql
SELECT add_credits(
  'user_clerk_id',  -- Clerk user ID
  10,               -- Amount to add
  'Bonus credits'   -- Reason
);
```

### Reset Monthly Credits
```sql
SELECT reset_monthly_credits('user_clerk_id');
```

## Testing

### Test in Sandbox Mode

1. Set `NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox`
2. Use sandbox credentials
3. Test subscription flow:
   - Go to `/pricing`
   - Click "Start 14-Day Trial" on Starter or Team
   - Complete checkout with test card
   - Verify credits are updated in database

### Test Credit Deduction

1. Go to `/dashboard/convert`
2. Enter a YouTube URL
3. Submit the form
4. Check that credits are deducted in database:
   ```sql
   SELECT * FROM user_credits WHERE clerk_user_id = 'your_user_id';
   SELECT * FROM credit_transactions WHERE clerk_user_id = 'your_user_id';
   ```

## Monitoring

### Check User Credits
```sql
SELECT 
  uc.clerk_user_id,
  p.email,
  uc.credits,
  uc.plan_type,
  uc.total_credits_used,
  uc.last_credit_reset
FROM user_credits uc
JOIN profiles p ON uc.clerk_user_id = p.clerk_user_id;
```

### Check Active Subscriptions
```sql
SELECT 
  s.clerk_user_id,
  p.email,
  s.plan_type,
  s.status,
  s.amount,
  s.current_period_end
FROM subscriptions s
JOIN profiles p ON s.clerk_user_id = p.clerk_user_id
WHERE s.status = 'active';
```

### Credit Usage Analytics
```sql
SELECT * FROM credit_usage_stats;
```

## Troubleshooting

### Credits Not Updating After Subscription

1. Check webhook logs in Paddle dashboard
2. Verify webhook endpoint is accessible
3. Check Supabase logs for errors
4. Manually update credits:
   ```sql
   UPDATE user_credits 
   SET credits = 100, plan_type = 'starter'
   WHERE clerk_user_id = 'user_id';
   ```

### User Can't Create Blog (No Credits)

1. Check current credits:
   ```sql
   SELECT * FROM user_credits WHERE clerk_user_id = 'user_id';
   ```
2. Check if credits were deducted:
   ```sql
   SELECT * FROM credit_transactions 
   WHERE clerk_user_id = 'user_id' 
   ORDER BY created_at DESC;
   ```
3. Manually add credits if needed:
   ```sql
   SELECT add_credits('user_id', 10, 'Manual credit addition');
   ```

## Monthly Credit Reset

Credits should reset monthly based on the subscription billing cycle. To manually reset credits:

```sql
SELECT reset_monthly_credits('user_clerk_id');
```

For automated monthly resets, set up a cron job or use Supabase Edge Functions with pg_cron.

## Security Notes

1. **RLS Policies**: All tables have Row Level Security enabled
2. **Service Role Key**: Only use `SUPABASE_SERVICE_ROLE_KEY` in API routes (server-side)
3. **Webhook Verification**: Consider adding Paddle webhook signature verification
4. **Credit Validation**: Always check credits server-side before processing

## Support

For issues or questions:
- Check Paddle documentation: https://developer.paddle.com/
- Check Supabase documentation: https://supabase.com/docs
- Review API route logs in your deployment platform
