# Quick Reference Card

## 🚀 Deploy in 3 Commands

```bash
# 1. Deploy edge function
supabase functions deploy paddle-webhook

# 2. Set secrets
supabase secrets set SUPABASE_URL=https://your-project.supabase.co
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-key

# 3. Configure Paddle webhook
# URL: https://your-project.supabase.co/functions/v1/paddle-webhook
```

## 📊 Plans Overview

| Plan | Price | Credits | Best For |
|------|-------|---------|----------|
| Free | $0 | 3/mo | Testing |
| Starter | $29 | 100/mo | Creators |
| Team | $99 | 500/mo | Teams |

## 🔍 Quick Checks

### Check Credits
```sql
SELECT * FROM user_credits WHERE clerk_user_id = 'user_xxx';
```

### Check Subscriptions
```sql
SELECT * FROM subscriptions WHERE clerk_user_id = 'user_xxx';
```

### View Transactions
```sql
SELECT * FROM credit_transactions 
WHERE clerk_user_id = 'user_xxx' 
ORDER BY created_at DESC;
```

## 🐛 Quick Fixes

### Buttons Disabled?
```bash
# Check browser console for Paddle errors
# Verify .env.local has:
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX=test_xxx
```

### Credits Not Updating?
```bash
# Check edge function logs
supabase functions logs paddle-webhook --limit 20

# Verify webhook in Paddle dashboard
# Check custom_data includes clerkUserId
```

### Edge Function Error?
```bash
# Redeploy
supabase functions deploy paddle-webhook

# Check secrets
supabase secrets list

# Test manually
curl -X POST https://your-project.supabase.co/functions/v1/paddle-webhook \
  -H "Content-Type: application/json" \
  -d '{"event_type":"test","data":{}}'
```

## 📱 User Flow

1. User visits `/pricing`
2. Clicks "Start 14-Day Trial"
3. Paddle checkout opens
4. Completes payment
5. Webhook → Edge Function
6. Credits updated automatically
7. User sees new credits in sidebar

## 🔗 Important URLs

- Pricing: `/pricing`
- Subscription: `/dashboard/subscription`
- Convert: `/dashboard/convert`
- Edge Function: `https://your-project.supabase.co/functions/v1/paddle-webhook`

## 📚 Documentation

- Full Setup: `SUBSCRIPTION_SETUP.md`
- Edge Function: `EDGE_FUNCTION_DEPLOYMENT.md`
- Updates: `UPDATES_SUMMARY.md`
- Quick Start: `QUICK_START.md`

## ⚡ Key Features

✅ Credit display in sidebar
✅ Real-time credit updates
✅ Paddle integration
✅ Edge function webhooks
✅ Plan comparison cards
✅ Transaction logging
✅ Automatic credit management

## 🎯 Testing

```bash
# 1. Test Paddle checkout
Visit: http://localhost:3000/pricing
Click: "Start 14-Day Trial"

# 2. Test edge function
curl -X POST http://localhost:54321/functions/v1/paddle-webhook \
  -H "Content-Type: application/json" \
  -d @test-webhook.json

# 3. Check database
SELECT * FROM user_credits;
SELECT * FROM subscriptions;
SELECT * FROM credit_transactions;
```

## 🔐 Environment Variables

```env
# Paddle
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX=test_xxx
NEXT_PUBLIC_STARTER_PRICEID_SANDBOX=pri_xxx
NEXT_PUBLIC_TEAM_PRICEID_SANDBOX=pri_xxx

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx
SUPABASE_SERVICE_ROLE_KEY=eyJxxx
```

## 💡 Pro Tips

1. **Always test in sandbox first**
2. **Monitor edge function logs**
3. **Keep service role key secret**
4. **Use transaction logs for debugging**
5. **Set up Paddle webhook alerts**

## 🆘 Emergency Commands

```bash
# Manually add credits
SELECT add_credits('user_id', 100, 'Emergency credit');

# Reset credits
SELECT reset_monthly_credits('user_id');

# Check function status
supabase functions list

# View recent logs
supabase functions logs paddle-webhook --limit 50
```

---

**Need Help?** Check the full documentation files or Supabase/Paddle support.
