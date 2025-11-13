# Edge Function Deployment Guide

This guide explains how to deploy the Paddle webhook handler as a Supabase Edge Function.

## Why Use Edge Functions?

Edge Functions provide:
- **Better Performance**: Run closer to your users
- **Automatic Scaling**: Handle any webhook volume
- **Built-in Monitoring**: Logs and metrics in Supabase dashboard
- **Secure**: Direct access to Supabase without exposing service keys

## Prerequisites

- Supabase CLI installed
- Supabase project created
- Database schema deployed (user_credits, subscriptions tables)

## Step-by-Step Deployment

### 1. Install Supabase CLI

```bash
# Using npm
npm install -g supabase

# Using Homebrew (macOS)
brew install supabase/tap/supabase

# Using Scoop (Windows)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase
```

### 2. Login to Supabase

```bash
supabase login
```

This will open your browser to authenticate.

### 3. Link Your Project

```bash
# Get your project ref from Supabase dashboard URL
# Example: https://app.supabase.com/project/abcdefghijklmnop
# Project ref is: abcdefghijklmnop

supabase link --project-ref your-project-ref
```

### 4. Deploy the Edge Function

```bash
cd your-project-directory
supabase functions deploy paddle-webhook
```

You should see output like:
```
Deploying paddle-webhook (project ref: your-project-ref)
Deployed Function paddle-webhook
Function URL: https://your-project.supabase.co/functions/v1/paddle-webhook
```

### 5. Set Environment Variables

The function needs access to your Supabase credentials:

```bash
# Set SUPABASE_URL
supabase secrets set SUPABASE_URL=https://your-project.supabase.co

# Set SUPABASE_SERVICE_ROLE_KEY (find in Project Settings > API)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Or set them in the Supabase Dashboard:
1. Go to **Edge Functions**
2. Click on **paddle-webhook**
3. Go to **Settings** tab
4. Add secrets

### 6. Configure Paddle Webhook

1. Login to [Paddle Dashboard](https://vendors.paddle.com/)
2. Go to **Developer Tools** > **Notifications**
3. Click **Add Endpoint**
4. Enter your function URL:
   ```
   https://your-project.supabase.co/functions/v1/paddle-webhook
   ```
5. Select events to subscribe to:
   - ✅ subscription.created
   - ✅ subscription.updated
   - ✅ subscription.canceled
   - ✅ subscription.activated
   - ✅ subscription.past_due
   - ✅ subscription.paused
6. Save the endpoint

### 7. Test the Webhook

#### Option A: Use Paddle's Test Mode

1. In Paddle dashboard, switch to **Sandbox** mode
2. Create a test subscription
3. Check Edge Function logs in Supabase

#### Option B: Manual Test with curl

```bash
curl -X POST https://your-project.supabase.co/functions/v1/paddle-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "subscription.created",
    "data": {
      "id": "sub_test123",
      "customer_id": "cus_test123",
      "status": "active",
      "custom_data": {
        "clerkUserId": "user_2abc123",
        "planType": "starter",
        "billingCycle": "monthly"
      },
      "items": [{
        "price_id": "pri_01k9x3x7p91mcjbvtrmvcq9sbh",
        "price": {
          "unit_price": {
            "amount": "2900"
          }
        }
      }],
      "currency_code": "USD",
      "current_billing_period": {
        "starts_at": "2024-01-01T00:00:00Z",
        "ends_at": "2024-02-01T00:00:00Z"
      }
    }
  }'
```

### 8. Verify in Database

Check that the webhook created records:

```sql
-- Check subscriptions
SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 5;

-- Check credits were updated
SELECT * FROM user_credits ORDER BY updated_at DESC LIMIT 5;

-- Check transaction log
SELECT * FROM credit_transactions ORDER BY created_at DESC LIMIT 10;
```

## Monitoring

### View Logs in Dashboard

1. Go to Supabase Dashboard
2. Navigate to **Edge Functions**
3. Click on **paddle-webhook**
4. Go to **Logs** tab

### View Logs with CLI

```bash
# Real-time logs
supabase functions logs paddle-webhook --follow

# Last 100 logs
supabase functions logs paddle-webhook --limit 100
```

## Local Development

### 1. Start Supabase Locally

```bash
supabase start
```

### 2. Create .env.local for Edge Function

Create `supabase/functions/.env.local`:
```env
SUPABASE_URL=http://localhost:54321
SUPABASE_SERVICE_ROLE_KEY=your-local-service-role-key
```

### 3. Serve Function Locally

```bash
supabase functions serve paddle-webhook --env-file supabase/functions/.env.local
```

### 4. Test Locally

```bash
curl -X POST http://localhost:54321/functions/v1/paddle-webhook \
  -H "Content-Type: application/json" \
  -d @test-webhook.json
```

## Updating the Function

After making changes to the function code:

```bash
supabase functions deploy paddle-webhook
```

The function will be updated without downtime.

## Troubleshooting

### Function not receiving webhooks

**Check 1: Verify function is deployed**
```bash
supabase functions list
```

**Check 2: Test function directly**
```bash
curl -X POST https://your-project.supabase.co/functions/v1/paddle-webhook \
  -H "Content-Type: application/json" \
  -d '{"event_type":"test","data":{}}'
```

**Check 3: Verify Paddle webhook configuration**
- Correct URL
- Events selected
- Endpoint is active

### Credits not updating

**Check 1: Verify clerk_user_id in custom_data**
```javascript
// In your Paddle checkout
customData: {
  clerkUserId: user?.id,  // Make sure this is set
  planType: 'starter',
  billingCycle: 'monthly'
}
```

**Check 2: Check function logs**
```bash
supabase functions logs paddle-webhook --limit 50
```

**Check 3: Verify user exists in database**
```sql
SELECT * FROM profiles WHERE clerk_user_id = 'user_xxx';
SELECT * FROM user_credits WHERE clerk_user_id = 'user_xxx';
```

### Database permission errors

**Check 1: Verify service role key**
- Go to Project Settings > API
- Copy the service_role key (not anon key)
- Update secrets

**Check 2: Check RLS policies**
```sql
-- Service role should bypass RLS, but verify tables exist
SELECT tablename FROM pg_tables WHERE schemaname = 'public';
```

### Function timeout

Edge Functions have a 150-second timeout. If processing takes longer:
- Optimize database queries
- Use batch operations
- Consider async processing

## Security Best Practices

### 1. Verify Webhook Signatures (Recommended)

Add signature verification to the edge function:

```typescript
// Get Paddle webhook secret from environment
const webhookSecret = Deno.env.get("PADDLE_WEBHOOK_SECRET");

// Verify signature (Paddle provides this in headers)
const signature = req.headers.get("paddle-signature");
// Implement verification logic
```

### 2. Use Environment Variables

Never hardcode:
- API keys
- Service role keys
- Webhook secrets

Always use:
```typescript
const secret = Deno.env.get("SECRET_NAME");
```

### 3. Log Sensitive Data Carefully

Avoid logging:
- Full customer data
- Payment information
- API keys

Do log:
- Event types
- User IDs (hashed if needed)
- Error messages

## Performance Tips

### 1. Use Database Indexes

Ensure indexes exist on frequently queried columns:
```sql
CREATE INDEX IF NOT EXISTS idx_subscriptions_paddle_id 
  ON subscriptions(paddle_subscription_id);
```

### 2. Batch Operations

If processing multiple items, use batch inserts:
```typescript
await supabase.from('table').insert([item1, item2, item3]);
```

### 3. Error Handling

Always wrap operations in try-catch:
```typescript
try {
  await processWebhook(data);
} catch (error) {
  console.error('Error:', error);
  // Return 200 to prevent Paddle retries for invalid data
  // Return 500 for temporary failures
}
```

## Cost Considerations

Edge Functions pricing:
- **Free tier**: 500,000 invocations/month
- **Pro tier**: 2,000,000 invocations/month
- Additional: $2 per 1M invocations

For most applications, webhooks will stay within free tier.

## Next Steps

1. ✅ Deploy edge function
2. ✅ Configure Paddle webhook
3. ✅ Test with sandbox subscription
4. ✅ Monitor logs
5. ✅ Go live with production

## Support

- Supabase Edge Functions docs: https://supabase.com/docs/guides/functions
- Paddle webhook docs: https://developer.paddle.com/webhooks/overview
- Supabase Discord: https://discord.supabase.com

---

**Status**: Ready for deployment
**Estimated setup time**: 15-20 minutes
