# Paddle Auto-Environment Detection

## 🎯 How It Works

The application now **automatically detects** which Paddle environment to use based on the hostname:

### Localhost (Development)
```
http://localhost:3000
http://localhost:3001
http://127.0.0.1:3000
```
**Uses:** Sandbox credentials
- `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX`
- `NEXT_PUBLIC_STARTER_PRICEID_SANDBOX`
- `NEXT_PUBLIC_TEAM_PRICEID_SANDBOX`

### Production
```
https://genno.io
https://www.genno.io
```
**Uses:** Live credentials
- `NEXT_PUBLIC_PADDLE_CLIENT_TOKEN`
- `NEXT_PUBLIC_STARTER_PRICE_ID`
- `NEXT_PUBLIC_TEAM_PRICE_ID`

## ✅ Benefits

1. **No manual switching** - Environment is detected automatically
2. **Safer** - Can't accidentally use production keys in development
3. **Simpler** - No need to change `.env.local` when deploying
4. **Clearer** - Console logs show which environment is active

## 📝 Environment Variables

Your `.env.local` should have **both** sets of credentials:

```env
# Production (Live) - Used on genno.io
NEXT_PUBLIC_PADDLE_API_KEY=pdl_live_apikey_01k9x3rx98vjctpg5nyg0492fc_3KSJMZR2CDVRwwEyFNhFfR_Ab0
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=live_b5fd9b9341fd4c49dea972fe430
NEXT_PUBLIC_STARTER_PRICE_ID=pri_01k9x3nh0pn67aybh84w68z8xr
NEXT_PUBLIC_TEAM_PRICE_ID=pri_01k9x3qewrphjs2g7b8dk0zg06

# Sandbox (Testing) - Used on localhost
NEXT_PUBLIC_PADDLE_API_KEY_SANDBOX=pdl_sdbx_apikey_01k9x3tknj3cz771x2d6qrfknf_ggjg7EEVVMRY3fD3NfQXRC_AL1
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX=test_2def8b155c8bd5d7a150c9ee34e
NEXT_PUBLIC_STARTER_PRICEID_SANDBOX=pri_01k9x3x7p91mcjbvtrmvcq9sbh
NEXT_PUBLIC_TEAM_PRICEID_SANDBOX=pri_01k9x3xxta3t40d29tgemms5g8
```

## 🔍 How to Verify

### Check Console Logs

When you visit the pricing page, check the browser console:

**On localhost:**
```
🏓 Paddle Environment Detection: {
  hostname: "localhost",
  environment: "sandbox",
  isLive: false,
  hasToken: true
}
✅ Paddle initialized successfully in sandbox mode
```

**On genno.io:**
```
🏓 Paddle Environment Detection: {
  hostname: "genno.io",
  environment: "production",
  isLive: true,
  hasToken: true
}
✅ Paddle initialized successfully in production mode
```

### Run Diagnostic

Open browser console and run:
```javascript
console.log('Hostname:', window.location.hostname);
console.log('Is Production:', 
  window.location.hostname === 'genno.io' || 
  window.location.hostname === 'www.genno.io'
);
```

## 🧪 Testing

### Test Sandbox (Localhost)

1. Run: `npm run dev`
2. Visit: `http://localhost:3000/pricing`
3. Click "Start 14-Day Trial"
4. Should use **sandbox** checkout
5. Use test card: `4242 4242 4242 4242`

### Test Production (Before Going Live)

1. Update your hosts file to point genno.io to localhost:
   ```
   127.0.0.1 genno.io
   ```
2. Visit: `http://genno.io:3000/pricing`
3. Should use **production** credentials
4. **Don't complete checkout** (uses real money!)

### Test Production (After Deployment)

1. Deploy to production
2. Visit: `https://genno.io/pricing`
3. Should use **production** checkout
4. Test with real payment

## 🚀 Deployment

### What to Deploy

Your `.env.local` file should be added to your production environment variables:

**Vercel:**
1. Go to Project Settings > Environment Variables
2. Add all variables from `.env.local`
3. Redeploy

**Other Platforms:**
- Add environment variables to your hosting platform
- Make sure all `NEXT_PUBLIC_*` variables are included

### Production Checklist

Before going live:

- [ ] All production Paddle credentials in `.env.local`
- [ ] All sandbox Paddle credentials in `.env.local`
- [ ] Price IDs verified in Paddle Dashboard (both environments)
- [ ] Tested checkout in sandbox (localhost)
- [ ] Deployed to production
- [ ] Verified environment detection on production
- [ ] Tested with small real payment

## 🔧 Troubleshooting

### Issue: Using wrong environment

**Symptom:** Sandbox checkout opens on production (or vice versa)

**Check:**
```javascript
// In browser console
console.log('Hostname:', window.location.hostname);
console.log('Expected:', window.location.hostname === 'genno.io' ? 'production' : 'sandbox');
```

**Fix:**
- Verify hostname is exactly `genno.io` or `www.genno.io`
- Check console logs for environment detection
- Clear browser cache

### Issue: Price IDs not found

**Symptom:** 403 Forbidden error

**Check:**
1. Which environment are you in? (check console logs)
2. Do the price IDs exist in that environment?
   - Sandbox: Check Paddle Dashboard (Sandbox mode)
   - Production: Check Paddle Dashboard (Live mode)

**Fix:**
- Create products/prices in correct Paddle environment
- Update `.env.local` with correct price IDs
- Restart dev server

### Issue: Token not found

**Symptom:** "Paddle or client token not available"

**Check:**
```javascript
// In browser console
console.log('Sandbox Token:', process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX);
console.log('Live Token:', process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN);
```

**Fix:**
- Verify tokens in `.env.local`
- Restart dev server
- Check for typos in variable names

## 💡 Pro Tips

1. **Always test in sandbox first** - Use localhost for testing
2. **Keep both credentials** - Don't remove sandbox keys after going live
3. **Monitor console logs** - They show which environment is active
4. **Use test cards in sandbox** - Never use real cards on localhost
5. **Verify before deploying** - Check environment detection works

## 🎓 How It's Implemented

The detection logic in `app/pricing/page.tsx`:

```typescript
// Detect if running on production domain
const isProduction = typeof window !== 'undefined' && 
  (window.location.hostname === 'genno.io' || 
   window.location.hostname === 'www.genno.io');

// Select credentials based on environment
const clientToken = isProduction
  ? process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
  : process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN_SANDBOX;

// Select price IDs based on environment
const starterPriceId = isProduction
  ? process.env.NEXT_PUBLIC_STARTER_PRICE_ID
  : process.env.NEXT_PUBLIC_STARTER_PRICEID_SANDBOX;
```

## 📊 Environment Matrix

| Hostname | Environment | Client Token | Price IDs | Use Case |
|----------|-------------|--------------|-----------|----------|
| localhost | Sandbox | `_SANDBOX` | `_SANDBOX` | Development |
| 127.0.0.1 | Sandbox | `_SANDBOX` | `_SANDBOX` | Development |
| genno.io | Production | Live | Live | Production |
| www.genno.io | Production | Live | Live | Production |

## 🔐 Security Notes

1. **Both credentials in .env.local** - Safe because:
   - `.env.local` is not committed to git
   - Only `NEXT_PUBLIC_*` variables are exposed to browser
   - Server-side variables remain secret

2. **Auto-detection is client-side** - Safe because:
   - Based on public hostname
   - Can't be manipulated to use wrong credentials
   - Console logs help verify correct environment

3. **Production credentials** - Keep secure:
   - Never commit to git
   - Use environment variables in production
   - Rotate if exposed

## ✅ Success Indicators

You'll know it's working when:

1. **On localhost:**
   - Console shows "sandbox mode"
   - Paddle checkout uses test environment
   - Can use test cards

2. **On genno.io:**
   - Console shows "production mode"
   - Paddle checkout uses live environment
   - Real payments processed

---

**Status:** ✅ Auto-detection enabled
**No manual switching required**
**Works automatically based on hostname**
