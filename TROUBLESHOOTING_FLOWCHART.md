# Troubleshooting Flowchart

Use this flowchart to diagnose and fix common issues.

## 🔍 Issue: Function Not Receiving Webhooks

```
Is the function deployed?
│
├─ NO → Go to Edge Functions → Deploy the function
│
└─ YES → Is the function URL correct in Paddle?
    │
    ├─ NO → Update Paddle webhook URL
    │
    └─ YES → Are the events selected in Paddle?
        │
        ├─ NO → Select subscription.* events
        │
        └─ YES → Test with curl command
            │
            ├─ FAILS → Check function logs for errors
            │
            └─ WORKS → Check Paddle webhook logs
```

## 🔍 Issue: Credits Not Updating

```
Did the webhook reach the function?
│
├─ NO → See "Function Not Receiving Webhooks" above
│
└─ YES → Check function logs for errors
    │
    ├─ ERROR: "Missing clerk_user_id"
    │   └─ FIX: Add clerkUserId to Paddle custom_data
    │
    ├─ ERROR: "Failed to update credits"
    │   └─ Check if user exists in user_credits table
    │       │
    │       ├─ NO → Run: INSERT INTO user_credits (clerk_user_id, credits, plan_type)
    │       │        VALUES ('user_id', 3, 'free');
    │       │
    │       └─ YES → Check service role key is correct
    │
    └─ NO ERROR → Check database directly
        └─ SELECT * FROM user_credits WHERE clerk_user_id = 'user_id';
```

## 🔍 Issue: Environment Variables Error

```
Error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"
│
└─ Go to Edge Functions → paddle-webhook → Settings → Secrets
    │
    ├─ Missing SUPABASE_URL?
    │   └─ Add: Settings > API > Project URL
    │
    └─ Missing SUPABASE_SERVICE_ROLE_KEY?
        └─ Add: Settings > API > service_role key
```

## 🔍 Issue: Database Permission Error

```
Error: "permission denied for table"
│
└─ Are you using service_role key?
    │
    ├─ NO → Update secret with service_role key (not anon key)
    │
    └─ YES → Check if tables exist
        └─ Run: SELECT tablename FROM pg_tables 
                WHERE schemaname = 'public';
            │
            ├─ Tables missing → Run schema SQL
            │
            └─ Tables exist → Check RLS policies
                └─ Service role should bypass RLS automatically
```

## 🔍 Issue: Pricing Page Buttons Disabled

```
Are buttons disabled?
│
└─ YES → Open browser console (F12)
    │
    └─ Check for errors
        │
        ├─ "Paddle is not defined"
        │   └─ Check .env.local has Paddle credentials
        │       └─ NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX
        │
        ├─ "Failed to load Paddle script"
        │   └─ Check internet connection
        │   └─ Check browser console for blocked scripts
        │
        └─ "Invalid token"
            └─ Verify Paddle credentials are correct
            └─ Check environment (sandbox vs production)
```

## 🔍 Issue: Credits Not Showing in Sidebar

```
Is sidebar showing "Loading..."?
│
├─ YES (stuck) → Check browser console for errors
│   │
│   └─ Check /api/credits/check endpoint
│       └─ curl http://localhost:3000/api/credits/check
│
└─ NO (shows 0) → Check database
    └─ SELECT * FROM user_credits WHERE clerk_user_id = 'user_id';
        │
        ├─ No record → User not initialized
        │   └─ FIX: INSERT INTO user_credits (clerk_user_id, credits, plan_type)
        │          VALUES ('user_id', 3, 'free');
        │
        └─ Record exists → Check if credits column is 0
            └─ Update manually or wait for subscription
```

## 🔍 Issue: Subscription Not Created

```
Check function logs
│
├─ "Subscription insert error"
│   └─ Check subscriptions table exists
│       └─ Run schema SQL if missing
│
├─ "Duplicate key value"
│   └─ Subscription already exists
│       └─ Check: SELECT * FROM subscriptions 
│                 WHERE paddle_subscription_id = 'sub_id';
│
└─ No error but no record
    └─ Check if webhook reached function
        └─ Look for "=== Paddle Webhook Received ===" in logs
```

## 🔍 Issue: Test Webhook Fails

```
Using curl to test?
│
└─ Check response
    │
    ├─ 404 Not Found
    │   └─ Function URL incorrect
    │       └─ Verify: https://project.supabase.co/functions/v1/paddle-webhook
    │
    ├─ 500 Internal Server Error
    │   └─ Check function logs for error details
    │
    ├─ 401 Unauthorized
    │   └─ Function requires authentication (shouldn't happen)
    │       └─ Check function code has CORS headers
    │
    └─ 200 OK but error in response
        └─ Check response body for error message
```

## 📊 Diagnostic Commands

### Check Function Status
```bash
# In Supabase Dashboard
Edge Functions > paddle-webhook > Details
Status should be: "Active"
```

### Check Secrets
```bash
# In Supabase Dashboard
Edge Functions > paddle-webhook > Settings > Secrets
Should see:
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
```

### Test Function
```bash
curl -X POST https://your-project.supabase.co/functions/v1/paddle-webhook \
  -H "Content-Type: application/json" \
  -d '{"event_type":"test","data":{}}'
```

### Check Database
```sql
-- Check if user exists
SELECT * FROM profiles WHERE clerk_user_id = 'user_xxx';

-- Check credits
SELECT * FROM user_credits WHERE clerk_user_id = 'user_xxx';

-- Check subscriptions
SELECT * FROM subscriptions WHERE clerk_user_id = 'user_xxx';

-- Check recent transactions
SELECT * FROM credit_transactions 
WHERE clerk_user_id = 'user_xxx' 
ORDER BY created_at DESC 
LIMIT 10;
```

### Check Logs
```bash
# In Supabase Dashboard
Edge Functions > paddle-webhook > Logs

Look for:
- "=== Paddle Webhook Received ===" (webhook arrived)
- "✓" symbols (success)
- "Error:" messages (problems)
```

## 🎯 Quick Fixes

### Reset User Credits
```sql
UPDATE user_credits 
SET credits = 100, plan_type = 'starter'
WHERE clerk_user_id = 'user_xxx';
```

### Initialize New User
```sql
INSERT INTO user_credits (clerk_user_id, credits, plan_type)
VALUES ('user_xxx', 3, 'free')
ON CONFLICT (clerk_user_id) DO NOTHING;
```

### Delete Test Subscription
```sql
DELETE FROM subscriptions 
WHERE paddle_subscription_id = 'sub_test123';
```

### Clear Test Data
```sql
-- Be careful with this!
DELETE FROM credit_transactions WHERE clerk_user_id = 'user_test';
DELETE FROM subscriptions WHERE clerk_user_id = 'user_test';
UPDATE user_credits SET credits = 3, plan_type = 'free' 
WHERE clerk_user_id = 'user_test';
```

## 🔄 Common Workflows

### Workflow: First Time Setup
```
1. Deploy function
2. Add secrets
3. Test with curl
4. Configure Paddle
5. Test with Paddle sandbox
6. Verify in database
7. Go live
```

### Workflow: Debugging Webhook
```
1. Check function logs
2. Verify webhook reached function
3. Check for error messages
4. Test specific handler
5. Verify database changes
6. Fix issue
7. Redeploy if needed
```

### Workflow: Testing New Plan
```
1. Add price ID to .env.local
2. Update pricing page
3. Test checkout
4. Check webhook logs
5. Verify credits updated
6. Check subscription record
```

## 📞 When to Ask for Help

Ask for help if:
- ✅ You've followed all troubleshooting steps
- ✅ You've checked function logs
- ✅ You've verified database tables exist
- ✅ You've tested with curl
- ✅ Issue persists after 30+ minutes

Provide:
- Function logs (last 20 lines)
- Error messages
- Steps you've tried
- Database query results

## 🎓 Prevention Tips

Prevent issues by:
1. **Always test in sandbox first**
2. **Check logs after each change**
3. **Verify database after webhooks**
4. **Keep secrets up to date**
5. **Monitor function regularly**
6. **Document any customizations**

---

**Remember:** Most issues are simple fixes!
- 80% = Configuration (secrets, URLs)
- 15% = Database (missing tables, wrong data)
- 5% = Code (actual bugs)

Start with the simple stuff first! 🎯
