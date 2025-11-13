# Quick Start Guide

## 🚀 Get Your Subscription System Running in 5 Steps

### Step 1: Set Up Database (5 minutes)

1. Open your Supabase project
2. Go to **SQL Editor**
3. Copy and paste the contents of `supabase-credits-subscriptions-schema.sql`
4. Click **Run**
5. Verify tables were created:
   ```sql
   SELECT table_name FROM information_schema.tables 
   WHERE table_schema = 'public' 
   AND table_name IN ('user_credits', 'subscriptions', 'credit_transactions');
   ```

### Step 2: Configure Paddle (10 minutes)

#### A. Create Products
1. Log into [Paddle Dashboard](https://vendors.paddle.com/)
2. Go to **Catalog** > **Products**
3. Create two products:
   - **Starter Plan** ($29/month, $290/year)
   - **Team Plan** ($99/month, $990/year)
4. Copy the Price IDs

#### B. Set Up Webhook
1. Go to **Developer Tools** > **Notifications**
2. Add webhook URL: `https://yourdomain.com/api/paddle/webhook`
3. Subscribe to events:
   - subscription.created
   - subscription.updated
   - subscription.canceled
   - subscription.activated

#### C. Update Environment Variables
Add to your `.env.local`:
```env
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX=test_xxxxx
NEXT_PUBLIC_STARTER_PRICEID_SANDBOX=pri_xxxxx
NEXT_PUBLIC_TEAM_PRICEID_SANDBOX=pri_xxxxx
```

### Step 3: Test in Sandbox (5 minutes)

1. Start your dev server: `npm run dev`
2. Go to `http://localhost:3000/pricing`
3. Click "Start 14-Day Trial" on Starter plan
4. Use Paddle test card: `4242 4242 4242 4242`
5. Complete checkout

### Step 4: Verify Everything Works (2 minutes)

Check in Supabase:
```sql
-- Check if credits were added
SELECT * FROM user_credits WHERE clerk_user_id = 'your_user_id';

-- Check if subscription was created
SELECT * FROM subscriptions WHERE clerk_user_id = 'your_user_id';
```

### Step 5: Test Credit Deduction (2 minutes)

1. Go to `/dashboard/convert`
2. Enter a YouTube URL
3. Submit
4. Check credits were deducted:
   ```sql
   SELECT * FROM credit_transactions 
   WHERE clerk_user_id = 'your_user_id' 
   ORDER BY created_at DESC;
   ```

## ✅ You're Done!

Your subscription system is now live in sandbox mode.

## 🎯 Going to Production

When ready to go live:

1. Get production credentials from Paddle
2. Update `.env.local`:
   ```env
   NEXT_PUBLIC_PADDLE_ENVIRONMENT=production
   NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_xxxxx
   NEXT_PUBLIC_STARTER_PRICE_ID=pri_xxxxx
   NEXT_PUBLIC_TEAM_PRICE_ID=pri_xxxxx
   ```
3. Update webhook URL in Paddle to production domain
4. Test with real payment

## 🆘 Troubleshooting

### Credits not updating after subscription?
- Check Paddle webhook logs
- Verify webhook URL is accessible
- Check Supabase logs

### Can't create blog (no credits)?
```sql
-- Manually add credits for testing
SELECT add_credits('your_user_id', 10, 'Test credits');
```

### Paddle checkout not opening?
- Check browser console for errors
- Verify Paddle script is loaded
- Check environment variables are set

## 📚 More Information

- Full setup guide: `SUBSCRIPTION_SETUP.md`
- Implementation details: `IMPLEMENTATION_SUMMARY.md`
- Paddle docs: https://developer.paddle.com/
- Supabase docs: https://supabase.com/docs

## 🎉 What You Built

- ✅ 3-tier subscription system (Free, Starter, Team)
- ✅ Credit-based usage tracking
- ✅ Paddle payment integration
- ✅ Automatic credit management
- ✅ Transaction audit trail
- ✅ Upgrade/downgrade flows
- ✅ Low credit warnings

**Total setup time: ~25 minutes**
