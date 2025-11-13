# Price ID Structure Updated

## ✅ What Changed

The pricing page now uses a **single price ID** per plan from your `.env.local` file, instead of separate monthly/yearly price IDs.

### Before (Complex)
```typescript
priceId: {
  monthly: "pri_monthly_xxx",
  yearly: "pri_yearly_xxx"
}
```

### After (Simple)
```typescript
priceId: "pri_xxx"  // Single ID from .env.local
```

## 🎯 How It Works Now

### Environment Detection
The app automatically selects the correct price ID based on hostname:

**Localhost** → Uses sandbox price IDs:
- `NEXT_PUBLIC_STARTER_PRICEID_SANDBOX`
- `NEXT_PUBLIC_TEAM_PRICEID_SANDBOX`

**genno.io** → Uses production price IDs:
- `NEXT_PUBLIC_STARTER_PRICE_ID`
- `NEXT_PUBLIC_TEAM_PRICE_ID`

### Single Price ID Per Plan
Each plan now has ONE price ID that handles both monthly and yearly billing:
- **Free Plan**: No price ID (free)
- **Starter Plan**: Uses `STARTER_PRICE_ID` (or `_SANDBOX`)
- **Team Plan**: Uses `TEAM_PRICE_ID` (or `_SANDBOX`)

## 📝 Your .env.local Structure

```env
# Production (genno.io)
NEXT_PUBLIC_STARTER_PRICE_ID=pri_01k9x3nh0pn67aybh84w68z8xr
NEXT_PUBLIC_TEAM_PRICE_ID=pri_01k9x3qewrphjs2g7b8dk0zg06

# Sandbox (localhost)
NEXT_PUBLIC_STARTER_PRICEID_SANDBOX=pri_01k9x3x7p91mcjbvtrmvcq9sbh
NEXT_PUBLIC_TEAM_PRICEID_SANDBOX=pri_01k9x3xxta3t40d29tgemms5g8
```

## 🔧 How Paddle Handles Monthly/Yearly

Paddle's price IDs can be configured to support multiple billing intervals. When you create a price in Paddle, you can set it to allow both monthly and yearly billing.

### In Paddle Dashboard

When creating a price:
1. Set base price (e.g., $29/month)
2. Enable "Allow customers to choose billing frequency"
3. Set yearly discount (e.g., 20% off)
4. One price ID handles both intervals

### In Your Code

The billing cycle is passed to Paddle in `customData`:
```typescript
customData: {
  clerkUserId: user?.id,
  planType: plan.name.toLowerCase(),
  billingCycle: billingCycle,  // "monthly" or "yearly"
}
```

Paddle uses this to show the correct price in checkout.

## ✅ Benefits

1. **Simpler** - One price ID per plan
2. **Cleaner** - Less configuration needed
3. **Flexible** - Paddle handles billing intervals
4. **Maintainable** - Fewer variables to manage

## 🧪 Testing

### Test on Localhost (Sandbox)

1. Visit `http://localhost:3000/pricing`
2. Toggle between Monthly/Yearly
3. Click "Start 14-Day Trial" on Starter
4. Should open Paddle checkout with sandbox price
5. Price should reflect selected billing cycle

### Verify Price IDs

Check console logs:
```
🏓 Paddle Environment Detection: {
  hostname: "localhost",
  environment: "sandbox",
  isLive: false,
  hasToken: true
}
```

Then check which price ID is being used:
```javascript
// In browser console
console.log('Starter Price ID:', 'pri_01k9x3x7p91mcjbvtrmvcq9sbh');
console.log('Team Price ID:', 'pri_01k9x3xxta3t40d29tgemms5g8');
```

## 🔍 Troubleshooting

### Issue: Price ID not found (403 error)

**Check:**
1. Is the price ID correct in `.env.local`?
2. Does it exist in Paddle Dashboard?
3. Are you in the right environment (sandbox vs production)?

**Solution:**
1. Go to Paddle Dashboard
2. Switch to correct environment (Sandbox/Live)
3. Go to Catalog > Prices
4. Verify the price ID exists
5. Update `.env.local` if needed
6. Restart dev server

### Issue: Wrong price shown in checkout

**Check:**
- Is `billingCycle` state being passed correctly?
- Does the Paddle price support both intervals?

**Solution:**
- In Paddle Dashboard, edit the price
- Enable "Allow customers to choose billing frequency"
- Set up yearly discount

### Issue: Environment not detected correctly

**Check console logs:**
```
🏓 Paddle Environment Detection: {
  hostname: "localhost",  // Should match your actual hostname
  environment: "sandbox",  // Should be "sandbox" or "production"
  isLive: false,
  hasToken: true
}
```

**Solution:**
- Verify hostname is exactly `localhost` or `genno.io`
- Clear browser cache
- Restart dev server

## 📊 Price ID Matrix

| Plan | Localhost (Sandbox) | Production (genno.io) |
|------|---------------------|----------------------|
| Free | (none) | (none) |
| Starter | `NEXT_PUBLIC_STARTER_PRICEID_SANDBOX` | `NEXT_PUBLIC_STARTER_PRICE_ID` |
| Team | `NEXT_PUBLIC_TEAM_PRICEID_SANDBOX` | `NEXT_PUBLIC_TEAM_PRICE_ID` |

## 🎓 Key Points

1. **One price ID per plan** - Simpler structure
2. **Paddle handles intervals** - Monthly/yearly in one price
3. **Auto environment detection** - Based on hostname
4. **Billing cycle in customData** - Passed to Paddle
5. **Same code, both environments** - No manual switching

## 🚀 Next Steps

1. **Restart dev server** if not already done
2. **Test on localhost** with sandbox prices
3. **Verify console logs** show correct environment
4. **Test checkout** with test card
5. **Deploy to production** when ready

---

**Status:** ✅ Updated to single price ID structure
**Complexity:** Reduced
**Maintainability:** Improved
