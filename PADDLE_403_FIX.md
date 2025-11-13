# Fix Paddle 403 Forbidden Error

## 🔴 The Error

```
POST https://checkout-service.paddle.com/transaction-checkout 403 (Forbidden)
```

## 🎯 Root Cause

Your `.env.local` is set to `sandbox` mode, but the pricing page might be using the wrong price IDs or credentials.

## ✅ Quick Fix (5 minutes)

### Step 1: Update Your .env.local

Since you're in sandbox mode, make sure you're using sandbox credentials:

```env
# Paddle Environment
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox

# Use ONLY sandbox credentials when in sandbox mode
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX=test_2def8b155c8bd5d7a150c9ee34e
NEXT_PUBLIC_STARTER_PRICEID_SANDBOX=pri_01k9x3x7p91mcjbvtrmvcq9sbh
NEXT_PUBLIC_TEAM_PRICEID_SANDBOX=pri_01k9x3xxta3t40d29tgemms5g8
```

### Step 2: Verify Price IDs in Paddle

1. Go to [Paddle Dashboard](https://vendors.paddle.com/)
2. **Switch to Sandbox mode** (toggle in top right)
3. Go to **Catalog** > **Prices**
4. Verify these price IDs exist:
   - `pri_01k9x3x7p91mcjbvtrmvcq9sbh` (Starter)
   - `pri_01k9x3xxta3t40d29tgemms5g8` (Team)

### Step 3: Check Paddle Checkout Settings

1. In Paddle Dashboard (Sandbox mode)
2. Go to **Developer Tools** > **Checkout Settings**
3. Under **Allowed Domains**, add:
   ```
   http://localhost:3000
   http://localhost:3001
   ```

### Step 4: Restart Your Dev Server

```bash
# Stop the server (Ctrl+C)
# Start again
npm run dev
```

### Step 5: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

### Step 6: Test Again

1. Go to `http://localhost:3000/pricing`
2. Click "Start 14-Day Trial" on Starter plan
3. Paddle checkout should open

## 🔍 Debugging Steps

### Check 1: Verify Paddle Loaded

Open browser console (F12) and run:

```javascript
console.log('Paddle:', window.Paddle);
console.log('Environment:', 'sandbox');
```

You should see the Paddle object, not `undefined`.

### Check 2: Verify Environment Variables

In browser console:

```javascript
// These should show your values
console.log('Client Token:', process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX);
console.log('Starter Price:', process.env.NEXT_PUBLIC_STARTER_PRICEID_SANDBOX);
console.log('Team Price:', process.env.NEXT_PUBLIC_TEAM_PRICEID_SANDBOX);
```

### Check 3: Test Paddle Initialization

In browser console:

```javascript
if (window.Paddle) {
  console.log('✅ Paddle is loaded');
  console.log('Paddle Environment:', window.Paddle.Environment);
} else {
  console.log('❌ Paddle not loaded');
}
```

## 🐛 Common Issues

### Issue 1: Price IDs Don't Exist

**Symptom:** 403 Forbidden

**Solution:**
1. Go to Paddle Dashboard (Sandbox)
2. Create products and prices
3. Copy the correct price IDs
4. Update `.env.local`

### Issue 2: Wrong Environment

**Symptom:** 403 Forbidden

**Solution:**
Make sure environment matches credentials:

```env
# If using sandbox:
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
# Use: NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX
# Use: NEXT_PUBLIC_STARTER_PRICEID_SANDBOX

# If using production:
NEXT_PUBLIC_PADDLE_ENVIRONMENT=production
# Use: NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
# Use: NEXT_PUBLIC_STARTER_PRICE_ID
```

### Issue 3: Domain Not Allowed

**Symptom:** 403 Forbidden or CSP errors

**Solution:**
1. Paddle Dashboard > Developer Tools > Checkout Settings
2. Add `http://localhost:3000` to allowed domains
3. Save changes

### Issue 4: Invalid Client Token

**Symptom:** 403 Forbidden immediately

**Solution:**
1. Verify token in Paddle Dashboard
2. Make sure it's the sandbox token (starts with `test_`)
3. Copy it exactly (no extra spaces)

## 📝 Checklist

Before testing again:

- [ ] `.env.local` has `NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox`
- [ ] Using sandbox client token (`test_xxx`)
- [ ] Using sandbox price IDs (`pri_xxx`)
- [ ] Price IDs exist in Paddle Dashboard (Sandbox mode)
- [ ] `localhost:3000` added to allowed domains in Paddle
- [ ] Dev server restarted
- [ ] Browser cache cleared
- [ ] Paddle script loads (check console)

## 🎯 Expected Behavior

When working correctly:

1. Click "Start 14-Day Trial"
2. Paddle overlay appears
3. Checkout form loads
4. You can enter test card: `4242 4242 4242 4242`
5. Checkout completes
6. Webhook fires
7. Credits update

## 🧪 Test with Paddle Test Cards

Once checkout opens, use these test cards:

**Successful Payment:**
```
Card: 4242 4242 4242 4242
Expiry: Any future date
CVC: Any 3 digits
```

**Declined Payment:**
```
Card: 4000 0000 0000 0002
```

## 🔄 Still Not Working?

### Option 1: Check Paddle Status

Visit: https://status.paddle.com/
Make sure Paddle services are operational.

### Option 2: Check Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Click "Start 14-Day Trial"
4. Look for failed requests
5. Check the response for error details

### Option 3: Enable Verbose Logging

Add this to your pricing page temporarily:

```typescript
// In handleSubscribe function
console.log('Opening Paddle checkout with:', {
  priceId: plan.priceId[billingCycle],
  environment: process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT,
  customData: {
    clerkUserId: user?.id,
    planType: plan.name.toLowerCase(),
    billingCycle: billingCycle,
  }
});
```

### Option 4: Contact Paddle Support

If still having issues:
1. Go to Paddle Dashboard
2. Click "Help" or "Support"
3. Provide:
   - Error message
   - Price ID you're trying to use
   - Environment (sandbox/production)
   - Screenshot of error

## 💡 Pro Tips

1. **Always test in sandbox first** - Never test with production credentials
2. **Check Paddle Dashboard** - Verify products and prices exist
3. **Monitor browser console** - Errors show up there first
4. **Use test cards** - Don't use real cards in sandbox
5. **Check webhook logs** - After successful checkout

## 📞 Need More Help?

Check these files:
- `TROUBLESHOOTING_FLOWCHART.md` - More diagnostic steps
- `QUICK_REFERENCE.md` - Quick commands
- `MANUAL_EDGE_FUNCTION_IMPORT.md` - Webhook setup

---

**Most Common Fix:** Restart dev server after changing `.env.local` ✅
