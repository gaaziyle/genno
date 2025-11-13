# Fixing Paddle 403 Forbidden Error

## 🔴 The Error You're Seeing

```
POST https://checkout-service.paddle.com/transaction-checkout 403 (Forbidden)
```

This means Paddle is rejecting your checkout request.

## 🎯 Common Causes

### 1. Environment Mismatch ⚠️ MOST COMMON

**Problem:** Using sandbox environment with live credentials (or vice versa)

**Check your .env.local:**
```env
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox  ← This says sandbox
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_xxx  ← But this is LIVE token!
```

**Fix:** Match environment with credentials

**Option A: Use Sandbox (Recommended for testing)**
```env
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX=test_2def8b155c8bd5d7a150c9ee34e
NEXT_PUBLIC_STARTER_PRICEID_SANDBOX=pri_01k9x3x7p91mcjbvtrmvcq9sbh
NEXT_PUBLIC_TEAM_PRICEID_SANDBOX=pri_01k9x3xxta3t40d29tgemms5g8
```

**Option B: Use Production (Only when ready to go live)**
```env
NEXT_PUBLIC_PADDLE_ENVIRONMENT=production
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_b5fd9b9341fd4c49dea972fe430
NEXT_PUBLIC_STARTER_PRICE_ID=pri_01k9x3nh0pn67aybh84w68z8xr
NEXT_PUBLIC_TEAM_PRICE_ID=pri_01k9x3qewrphjs2g7b8dk0zg06
```

### 2. Invalid Price IDs

**Problem:** Price IDs don't exist in Paddle or are from wrong environment

**Check in Paddle Dashboard:**
1. Go to Paddle Dashboard
2. Navigate to Catalog > Prices
3. Verify your price IDs exist
4. Make sure they're in the correct environment (Sandbox vs Live)

### 3. Domain Not Allowed

**Problem:** Your domain isn't whitelisted in Paddle

**Fix:**
1. Go to Paddle Dashboard
2. Navigate to Developer Tools > Checkout Settings
3. Add your domain to allowed domains:
   - `http://localhost:3000` (for development)
   - `https://yourdomain.com` (for production)

### 4. Paddle Not Initialized

**Problem:** Paddle script didn't load or initialize properly

**Check browser console for:**
```javascript
console.log(window.Paddle); // Should not be undefined
```

## 🔧 Step-by-Step Fix

### Step 1: Verify Environment

Open your `.env.local` and check:

```env
# Make sure these match!
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox  ← Should be "sandbox" for testing

# If sandbox, use these:
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX=test_xxx
NEXT_PUBLIC_STARTER_PRICEID_SANDBOX=pri_xxx
NEXT_PUBLIC_TEAM_PRICEID_SANDBOX=pri_xxx

# If production, use these:
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_xxx
NEXT_PUBLIC_STARTER_PRICE_ID=pri_xxx
NEXT_PUBLIC_TEAM_PRICE_ID=pri_xxx
```

### Step 2: Restart Dev Server

After changing `.env.local`:
```bash
# Stop your dev server (Ctrl+C)
# Start it again
npm run dev
```

### Step 3: Clear Browser Cache

1. Open DevTools (F12)
2. Right-click refresh button
3. Select "Empty Cache and Hard Reload"

### Step 4: Test Paddle Initialization

Open browser console and run:
```javascript
console.log('Paddle loaded:', !!window.Paddle);
console.log('Environment:', process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT);
```

### Step 5: Verify Price IDs in Paddle

1. Log into Paddle Dashboard
2. Switch to **Sandbox** mode (top right)
3. Go to **Catalog** > **Prices**
4. Find your price IDs and verify they match your `.env.local`

## 🎯 Quick Fix (Most Common Solution)

**Your current setup shows you're in sandbox mode, so update your pricing page to use sandbox credentials:**

<function_calls>
<invoke name="readFile">
<parameter name="explanation">Reading pricing page to check Paddle initialization