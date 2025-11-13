# Fix Paddle 403 Error - Quick Guide

## 🚨 You're Getting This Error:

```
POST https://checkout-service.paddle.com/transaction-checkout 403 (Forbidden)
```

## ✅ Quick Fix (2 Minutes)

### Step 1: Check Your Environment

Your `.env.local` says:
```env
NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox
```

This means you're in **SANDBOX MODE** for testing.

### Step 2: Verify You Have Sandbox Credentials

Check your `.env.local` has these:
```env
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX=test_2def8b155c8bd5d7a150c9ee34e
NEXT_PUBLIC_STARTER_PRICEID_SANDBOX=pri_01k9x3x7p91mcjbvtrmvcq9sbh
NEXT_PUBLIC_TEAM_PRICEID_SANDBOX=pri_01k9x3xxta3t40d29tgemms5g8
```

✅ You have these! Good.

### Step 3: Verify Price IDs in Paddle

**This is the most common issue!**

1. Go to https://vendors.paddle.com/
2. **Switch to SANDBOX mode** (toggle in top right corner)
3. Go to **Catalog** > **Prices**
4. Check if these price IDs exist:
   - `pri_01k9x3x7p91mcjbvtrmvcq9sbh`
   - `pri_01k9x3xxta3t40d29tgemms5g8`

**If they DON'T exist:**
- You need to create products and prices in Paddle Sandbox
- Or get the correct price IDs from your Paddle account

### Step 4: Add Localhost to Allowed Domains

1. In Paddle Dashboard (Sandbox mode)
2. Go to **Developer Tools** > **Checkout Settings**
3. Under **Allowed Domains**, add:
   ```
   http://localhost:3000
   ```
4. Click **Save**

### Step 5: Restart Everything

```bash
# Stop your dev server (Ctrl+C)
npm run dev

# In browser:
# - Clear cache (Ctrl+Shift+Delete)
# - Hard reload (Ctrl+Shift+R)
```

### Step 6: Test Again

1. Go to http://localhost:3000/pricing
2. Click "Start 14-Day Trial"
3. Should work now! 🎉

## 🔍 Still Not Working?

### Run Diagnostic Script

1. Open http://localhost:3000/pricing
2. Open browser console (F12)
3. Copy and paste the contents of `paddle-diagnostic.js`
4. Press Enter
5. Follow the suggestions

### Check Paddle Dashboard

**Most common issue:** Price IDs don't exist in Paddle

1. Log into Paddle
2. **Make sure you're in SANDBOX mode** (top right)
3. Go to Catalog > Products
4. Create products if they don't exist
5. Go to Catalog > Prices
6. Create prices and copy the IDs
7. Update your `.env.local` with the correct IDs

## 📝 Checklist

- [ ] In Paddle Dashboard, switched to SANDBOX mode
- [ ] Price IDs exist in Paddle Sandbox
- [ ] `localhost:3000` added to allowed domains
- [ ] `.env.local` has `NEXT_PUBLIC_PADDLE_ENVIRONMENT=sandbox`
- [ ] `.env.local` has sandbox credentials
- [ ] Dev server restarted
- [ ] Browser cache cleared

## 🎯 Expected Result

When working:
1. Click "Start 14-Day Trial"
2. Paddle overlay appears
3. Checkout form loads
4. You can enter test card: `4242 4242 4242 4242`

## 💡 Pro Tip

**The #1 reason for 403 errors:**
Price IDs in your `.env.local` don't exist in Paddle Dashboard.

**Solution:**
Go to Paddle Dashboard (Sandbox) and verify the price IDs actually exist!

## 📞 Need More Help?

See these files:
- `PADDLE_403_FIX.md` - Detailed troubleshooting
- `paddle-diagnostic.js` - Run diagnostic in console
- `TROUBLESHOOTING_FLOWCHART.md` - More solutions

---

**TL;DR:** 
1. Make sure you're in Paddle Sandbox mode
2. Verify price IDs exist in Paddle
3. Add localhost to allowed domains
4. Restart dev server
5. Try again
