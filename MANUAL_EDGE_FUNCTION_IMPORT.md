# Manual Edge Function Import Guide

This guide shows you how to manually import the Paddle webhook edge function into Supabase through the dashboard (no CLI required).

## 📋 Prerequisites

- Supabase project created
- Database schema deployed (user_credits, subscriptions, credit_transactions tables)
- Paddle account with products created

## 🚀 Step-by-Step Import

### Step 1: Open Supabase Dashboard

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click on **Edge Functions** in the left sidebar

### Step 2: Create New Function

1. Click the **"Create a new function"** button
2. Enter function name: `paddle-webhook`
3. You'll see a code editor with a template

### Step 3: Copy the Function Code

1. Open the file: `paddle-webhook-edge-function.ts`
2. Select all the code (Ctrl+A / Cmd+A)
3. Copy it (Ctrl+C / Cmd+C)

### Step 4: Paste and Deploy

1. In the Supabase editor, delete the template code
2. Paste the copied code (Ctrl+V / Cmd+V)
3. Click **"Deploy"** button at the top right
4. Wait for deployment to complete (usually 10-30 seconds)

### Step 5: Configure Environment Variables

1. After deployment, click on the **"Settings"** tab
2. Scroll to **"Secrets"** section
3. Add these two secrets:

   **Secret 1:**
   - Name: `SUPABASE_URL`
   - Value: Your Supabase project URL
     - Find it in: Project Settings > API > Project URL
     - Example: `https://abcdefghijklmnop.supabase.co`

   **Secret 2:**
   - Name: `SUPABASE_SERVICE_ROLE_KEY`
   - Value: Your service role key
     - Find it in: Project Settings > API > service_role key (click "Reveal")
     - ⚠️ Keep this secret! Never expose it in client code

4. Click **"Save"** after adding each secret

### Step 6: Get Your Function URL

1. Go back to the **"Details"** tab
2. Copy the **Function URL**
   - It will look like: `https://your-project.supabase.co/functions/v1/paddle-webhook`
3. Save this URL - you'll need it for Paddle configuration

### Step 7: Configure Paddle Webhook

1. Log into [Paddle Dashboard](https://vendors.paddle.com/)
2. Go to **Developer Tools** > **Notifications**
3. Click **"Add Endpoint"**
4. Enter your function URL from Step 6
5. Select these events:
   - ✅ subscription.created
   - ✅ subscription.updated
   - ✅ subscription.canceled
   - ✅ subscription.activated
   - ✅ subscription.past_due
   - ✅ subscription.paused
6. Click **"Save"**

### Step 8: Test the Function

#### Option A: Test with Paddle Sandbox

1. In Paddle, switch to **Sandbox** mode
2. Create a test subscription
3. Go back to Supabase > Edge Functions > paddle-webhook > **Logs**
4. You should see logs showing the webhook was received

#### Option B: Test with curl

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
        "price_id": "pri_test",
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

### Step 9: Verify in Database

Check that the webhook created records:

1. Go to **Table Editor** in Supabase
2. Check these tables:
   - `subscriptions` - Should have new subscription
   - `user_credits` - Should show updated credits
   - `credit_transactions` - Should have transaction log

Or run this SQL in **SQL Editor**:

```sql
-- Check recent subscriptions
SELECT * FROM subscriptions ORDER BY created_at DESC LIMIT 5;

-- Check credit updates
SELECT * FROM user_credits ORDER BY updated_at DESC LIMIT 5;

-- Check transactions
SELECT * FROM credit_transactions ORDER BY created_at DESC LIMIT 10;
```

## ✅ Success Checklist

- [ ] Edge function created and deployed
- [ ] Environment variables (secrets) configured
- [ ] Function URL copied
- [ ] Paddle webhook configured
- [ ] Test webhook sent successfully
- [ ] Logs show webhook received
- [ ] Database tables updated correctly

## 🔍 Monitoring

### View Logs

1. Go to **Edge Functions** > **paddle-webhook**
2. Click on **Logs** tab
3. You'll see all webhook events and any errors

### What to Look For

**Successful webhook:**
```
=== Paddle Webhook Received ===
Event Type: subscription.created
Subscription ID: sub_xxx
User ID: user_xxx
Inserting subscription...
Updating credits to: 100
Logging credit transaction...
✓ Subscription created successfully
=== Webhook Processed Successfully ===
```

**Error example:**
```
=== Webhook Error ===
Error: Missing clerk_user_id in webhook data
```

## 🐛 Troubleshooting

### Function Not Receiving Webhooks

**Check 1: Verify function is deployed**
- Go to Edge Functions
- paddle-webhook should show "Active" status

**Check 2: Test function directly**
- Use the curl command from Step 8
- Check logs for response

**Check 3: Verify Paddle configuration**
- Correct URL
- Events selected
- Endpoint is active (not paused)

### Environment Variables Not Set

**Symptoms:**
- Error: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY"

**Fix:**
1. Go to function Settings > Secrets
2. Verify both secrets are added
3. Redeploy function if needed

### Credits Not Updating

**Check 1: Verify custom_data**
- Webhook must include `clerkUserId` in custom_data
- Check your Paddle checkout code

**Check 2: Check user exists**
```sql
SELECT * FROM profiles WHERE clerk_user_id = 'user_xxx';
SELECT * FROM user_credits WHERE clerk_user_id = 'user_xxx';
```

**Check 3: Review function logs**
- Look for specific error messages
- Check which step failed

### Database Permission Errors

**Symptoms:**
- Error: "permission denied for table"

**Fix:**
- Service role key should bypass RLS
- Verify you're using service_role key (not anon key)
- Check key is correct in secrets

## 🔄 Updating the Function

If you need to update the function code:

1. Go to **Edge Functions** > **paddle-webhook**
2. Click **"Edit"** button
3. Make your changes
4. Click **"Deploy"** again
5. Function updates with zero downtime

## 📊 Expected Behavior

### When User Subscribes

1. User completes Paddle checkout
2. Paddle sends webhook to your function
3. Function receives webhook
4. Creates subscription record
5. Updates user credits (100 for Starter, 500 for Team)
6. Logs transaction
7. Returns success to Paddle

### When Subscription Cancels

1. User cancels subscription (or payment fails)
2. Paddle sends cancellation webhook
3. Function marks subscription as canceled
4. Reverts user to free plan (3 credits)
5. Logs transaction

## 🎯 Testing Checklist

Test each event type:

- [ ] subscription.created - Creates subscription, updates credits
- [ ] subscription.updated - Updates subscription details
- [ ] subscription.canceled - Reverts to free plan
- [ ] subscription.activated - Activates subscription
- [ ] subscription.past_due - Marks as past due
- [ ] subscription.paused - Pauses subscription

## 📱 Integration with Your App

Your app is already configured to work with this edge function:

1. **Pricing page** (`/pricing`) - Paddle checkout includes custom_data
2. **Credits hook** (`useCredits`) - Fetches updated credits
3. **Dashboard sidebar** - Displays current credits
4. **Subscription page** - Shows plan details

No additional code changes needed!

## 🔐 Security Notes

1. **Never expose service_role key** in client code
2. **Keep secrets in Supabase** environment variables only
3. **Monitor function logs** for suspicious activity
4. **Consider adding** webhook signature verification (optional)

## 💡 Pro Tips

1. **Test in sandbox first** before going live
2. **Monitor logs regularly** especially after deployment
3. **Set up alerts** for function errors (Supabase Pro feature)
4. **Keep function code** backed up in your repository
5. **Document any customizations** you make

## 📞 Support

If you encounter issues:

1. Check function logs first
2. Verify all steps completed
3. Test with curl command
4. Check database tables
5. Review Paddle webhook logs

## 🎉 You're Done!

Your edge function is now:
- ✅ Deployed and active
- ✅ Configured with secrets
- ✅ Connected to Paddle
- ✅ Ready to handle webhooks
- ✅ Automatically managing credits

**Next:** Test with a real subscription in Paddle sandbox mode!

---

**Deployment Method:** Manual (Dashboard)
**Estimated Time:** 10-15 minutes
**Difficulty:** Easy
**CLI Required:** No
