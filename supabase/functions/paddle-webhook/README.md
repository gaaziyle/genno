# Paddle Webhook Edge Function

This Supabase Edge Function handles Paddle webhook events for subscription management.

## Deployment

### 1. Install Supabase CLI

```bash
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

### 3. Link Your Project

```bash
supabase link --project-ref your-project-ref
```

### 4. Deploy the Function

```bash
supabase functions deploy paddle-webhook
```

### 5. Set Environment Variables

In your Supabase dashboard, go to **Edge Functions** > **paddle-webhook** > **Settings** and add:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your service role key (from project settings)

Or use CLI:

```bash
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### 6. Get the Function URL

After deployment, you'll get a URL like:
```
https://your-project.supabase.co/functions/v1/paddle-webhook
```

### 7. Configure Paddle Webhook

1. Go to Paddle Dashboard > Developer Tools > Notifications
2. Add webhook endpoint: `https://your-project.supabase.co/functions/v1/paddle-webhook`
3. Subscribe to events:
   - subscription.created
   - subscription.updated
   - subscription.canceled
   - subscription.activated
   - subscription.past_due
   - subscription.paused

## Testing Locally

### 1. Start Supabase locally

```bash
supabase start
```

### 2. Serve the function

```bash
supabase functions serve paddle-webhook --env-file .env.local
```

### 3. Test with curl

```bash
curl -X POST http://localhost:54321/functions/v1/paddle-webhook \
  -H "Content-Type: application/json" \
  -d '{
    "event_type": "subscription.created",
    "data": {
      "id": "sub_test123",
      "customer_id": "cus_test123",
      "status": "active",
      "custom_data": {
        "clerkUserId": "user_test123",
        "planType": "starter",
        "billingCycle": "monthly"
      },
      "items": [{
        "price_id": "pri_test123",
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

## Monitoring

View function logs in Supabase Dashboard:
- Go to **Edge Functions** > **paddle-webhook** > **Logs**

Or use CLI:
```bash
supabase functions logs paddle-webhook
```

## Events Handled

- **subscription.created**: Creates subscription record and updates user credits
- **subscription.updated**: Updates subscription details
- **subscription.canceled**: Marks subscription as canceled and reverts to free plan
- **subscription.activated**: Activates subscription
- **subscription.past_due**: Marks subscription as past due
- **subscription.paused**: Pauses subscription

## Troubleshooting

### Function not receiving webhooks
- Check function URL is correct in Paddle
- Verify function is deployed: `supabase functions list`
- Check function logs for errors

### Credits not updating
- Verify `clerk_user_id` is passed in custom_data
- Check user_credits table exists
- Review function logs for errors

### Database errors
- Ensure service role key has proper permissions
- Verify tables exist (run schema SQL)
- Check RLS policies allow service role access
