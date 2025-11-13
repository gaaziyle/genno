# Paddle JWT Error Fix

## Problem
- Error: "Failed to retrieve JWT"
- 403 Forbidden on transaction-checkout
- CSP frame-ancestors violation

## Root Cause
Your production client token is incomplete/truncated in `.env.local`

## Solution

### 1. Get Complete Client Token

**For Sandbox (Development):**
1. Go to: https://sandbox-vendors.paddle.com/authentication-v2
2. Find "Client-side token" section
3. Copy the FULL token (starts with `test_`, ~40-50 chars)
4. Update `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX` in `.env.local`

**For Production:**
1. Go to: https://vendors.paddle.com/authentication-v2
2. Find "Client-side token" section  
3. Copy the FULL token (starts with `live_`, ~40-50 chars)
4. Update `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN` in `.env.local`

### 2. Verify Token Format

Valid tokens should look like:
```
test_2def8b155c8bd5d7a150c9ee34e1234567890  (Sandbox)
live_b5fd9b9341fd4c49dea972fe4301234567890  (Production)
```

Your current production token appears truncated:
```
live_b5fd9b9341fd4c49dea972fe430  ❌ Too short!
```

### 3. Update .env.local

Replace the incomplete token with the full one:

```env
# Production - REPLACE WITH FULL TOKEN FROM PADDLE DASHBOARD
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_YOUR_COMPLETE_TOKEN_HERE

# Sandbox - REPLACE WITH FULL TOKEN FROM PADDLE DASHBOARD  
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX=test_YOUR_COMPLETE_TOKEN_HERE
```

### 4. Restart Dev Server

After updating `.env.local`:
```bash
# Stop the server (Ctrl+C)
# Then restart
pnpm dev
```

## Changes Made

1. ✅ Fixed `Paddle.Setup()` → `Paddle.Initialize()` in `app/pricing/page.tsx`
2. ✅ Added explicit `environment` parameter to Paddle initialization
3. ✅ Added CSP headers in `next.config.ts` to allow Paddle iframe
4. ✅ Created verification script: `verify-paddle-tokens.js`

## Testing

After fixing the token:

1. Go to http://localhost:3000/pricing
2. Click on "Start 14-Day Trial" button
3. Paddle checkout should open without errors
4. Check browser console - should see:
   ```
   ✅ Paddle initialized successfully in sandbox mode
   ```

## Common Issues

**Still getting 403?**
- Make sure you copied the COMPLETE token
- Verify you're using the correct environment (sandbox for localhost)
- Check that price IDs match the environment

**Token not found?**
- Restart your dev server after changing .env.local
- Clear browser cache and reload

**Wrong environment?**
- localhost = automatically uses SANDBOX
- genno.io = automatically uses PRODUCTION
- Check console logs for environment detection

## Paddle Dashboard Links

- **Sandbox Dashboard**: https://sandbox-vendors.paddle.com
- **Production Dashboard**: https://vendors.paddle.com
- **Authentication Settings**: Add `/authentication-v2` to either URL above
