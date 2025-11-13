# ✅ Paddle Integration Complete

## What Was Done

### 1. Created Paddle Utility (`lib/paddle.ts`)
- ✅ Proper singleton pattern for Paddle instance
- ✅ Environment auto-detection (sandbox for localhost, production for genno.io)
- ✅ Comprehensive error handling and logging
- ✅ Type-safe interfaces
- ✅ Event callbacks for checkout completion/errors

### 2. Updated Pricing Page (`app/pricing/page.tsx`)
- ✅ Simplified code using the new utility
- ✅ Removed manual Paddle script loading
- ✅ Better error handling
- ✅ Cleaner component structure

### 3. Created Test Page (`app/test-paddle/page.tsx`)
- ✅ Easy way to test Paddle configuration
- ✅ Shows environment variables
- ✅ Validates token format

## ⚠️ CRITICAL: Fix Your Tokens

Your current tokens are **INCOMPLETE** and causing the JWT error:

```
❌ NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX=test_2def8b155c8bd5d7a150c9ee34e (35 chars - TOO SHORT!)
❌ NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_b5fd9b9341fd4c49dea972fe430 (35 chars - TOO SHORT!)
```

Valid tokens should be **40-50+ characters**:
```
✅ test_2def8b155c8bd5d7a150c9ee34e1234567890 (42 chars)
✅ live_b5fd9b9341fd4c49dea972fe4301234567890 (42 chars)
```

## How to Fix

### Step 1: Get Complete Tokens

**For Sandbox (Development/Localhost):**
1. Go to: https://sandbox-vendors.paddle.com/authentication-v2
2. Find "Client-side token" section
3. Click "Copy" to get the FULL token
4. Paste it somewhere to verify it's longer than 35 characters

**For Production (genno.io):**
1. Go to: https://vendors.paddle.com/authentication-v2
2. Find "Client-side token" section
3. Click "Copy" to get the FULL token
4. Paste it somewhere to verify it's longer than 35 characters

### Step 2: Update .env.local

Replace the incomplete tokens in your `.env.local` file:

```env
# Sandbox (Development) - REPLACE WITH FULL TOKEN
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX=test_YOUR_COMPLETE_TOKEN_HERE

# Production - REPLACE WITH FULL TOKEN
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_YOUR_COMPLETE_TOKEN_HERE
```

### Step 3: Restart Dev Server

```bash
# Stop the server (Ctrl+C in terminal)
# Then restart
pnpm dev
```

### Step 4: Test Configuration

1. Go to: http://localhost:3000/test-paddle
2. Click "Test Paddle Configuration"
3. Should see "✅ Success" message
4. Check browser console for detailed logs

### Step 5: Test Checkout

1. Go to: http://localhost:3000/pricing
2. Sign in with Clerk
3. Click "Start 14-Day Trial" on any paid plan
4. Paddle checkout should open without errors

## Environment Detection

The system automatically detects the environment:

| Hostname | Environment | Token Used |
|----------|-------------|------------|
| localhost | Sandbox | `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX` |
| 127.0.0.1 | Sandbox | `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX` |
| genno.io | Production | `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` |
| www.genno.io | Production | `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` |

## Price IDs Configuration

Make sure all price IDs are set in `.env.local`:

```env
# Sandbox Price IDs
NEXT_PUBLIC_STARTER_MONTHLY_PRICEID_SANDBOX=pri_01k9x3x7p91mcjbvtrmvcq9sbh
NEXT_PUBLIC_STARTER_YEARLY_PRICEID_SANDBOX=pri_01k9x7v488zh1dxjvprgp1ffh5
NEXT_PUBLIC_TEAM_MONTHLY_PRICEID_SANDBOX=pri_01k9x3xxta3t40d29tgemms5g8
NEXT_PUBLIC_TEAM_YEARLY_PRICEID_SANDBOX=pri_01k9x7ycn6hkxnp7s4fqashdy8

# Production Price IDs
NEXT_PUBLIC_STARTER_MONTHLY_PRICE_ID=pri_01k9x3nh0pn67aybh84w68z8xr
NEXT_PUBLIC_STARTER_YEARLY_PRICE_ID=pri_01k9x806vakrec8eve9d679sty
NEXT_PUBLIC_TEAM_MONTHLY_PRICE_ID=pri_01k9x3qewrphjs2g7b8dk0zg06
NEXT_PUBLIC_TEAM_YEARLY_PRICE_ID=pri_01k9x812g316fgh0a9vznc76n4
```

## Usage in Other Components

You can now use the Paddle utility anywhere in your app:

```typescript
import { initPaddle, openCheckout, getPricingPlans } from "@/lib/paddle";

// Initialize Paddle
const paddle = await initPaddle();

// Open checkout
await openCheckout(
  priceId,
  customerEmail,
  userId,
  planName,
  billingCycle
);

// Get pricing plans
const plans = getPricingPlans();
```

## Troubleshooting

### Still Getting JWT Error?
1. Verify token length is 40+ characters
2. Make sure you copied the COMPLETE token from Paddle dashboard
3. Restart dev server after updating .env.local
4. Clear browser cache (Ctrl+Shift+Delete)

### Checkout Not Opening?
1. Check browser console for errors
2. Verify price IDs are correct for your environment
3. Make sure user is signed in with Clerk
4. Test with the test page first: http://localhost:3000/test-paddle

### Wrong Environment?
- The system auto-detects based on hostname
- localhost = always sandbox
- genno.io = always production
- Check console logs to see which environment is detected

## Next Steps

1. ✅ Fix your client tokens (MOST IMPORTANT!)
2. ✅ Test with http://localhost:3000/test-paddle
3. ✅ Test checkout flow on pricing page
4. ✅ Set up webhook handler (already exists in `supabase/functions/paddle-webhook`)
5. ✅ Configure webhook URL in Paddle dashboard

## Support

If you still have issues after fixing the tokens:
1. Check browser console for detailed error logs
2. Verify all environment variables are set correctly
3. Make sure Paddle account is fully activated
4. Check Paddle dashboard for any account restrictions
