# 🚨 FIX JWT ERROR - Quick Guide

## The Problem
```
❌ Failed to retrieve JWT
❌ 403 Forbidden on transaction-checkout
```

## The Cause
**Your Paddle client tokens are incomplete (truncated)**

Current tokens (35 chars - TOO SHORT):
```
test_2def8b155c8bd5d7a150c9ee34e
live_b5fd9b9341fd4c49dea972fe430
```

Should be (40-50 chars):
```
test_2def8b155c8bd5d7a150c9ee34e1234567890
live_b5fd9b9341fd4c49dea972fe4301234567890
```

## The Fix (3 Steps)

### 1️⃣ Get Complete Tokens

**Sandbox Token:**
- Go to: https://sandbox-vendors.paddle.com/authentication-v2
- Copy "Client-side token" (starts with `test_`)
- Should be 40-50 characters

**Production Token:**
- Go to: https://vendors.paddle.com/authentication-v2  
- Copy "Client-side token" (starts with `live_`)
- Should be 40-50 characters

### 2️⃣ Update .env.local

Replace these lines with COMPLETE tokens:

```env
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX=test_PASTE_COMPLETE_TOKEN_HERE
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_PASTE_COMPLETE_TOKEN_HERE
```

### 3️⃣ Restart Server

```bash
# Press Ctrl+C to stop
pnpm dev
```

## Test It Works

1. Go to: http://localhost:3000/test-paddle
2. Click "Test Paddle Configuration"
3. Should see ✅ Success

## That's It!

Once you have the complete tokens, the JWT error will be gone.

---

**Need help?** Check `PADDLE_SETUP_COMPLETE.md` for detailed instructions.
