# Environment Variables Diagnostic

## Quick Check

Run this in your project directory to check if environment variables are set correctly.

### Step 1: Check if `.env.local` exists

```bash
# Windows PowerShell
Test-Path .env.local

# Should return: True
```

### Step 2: View your `.env.local` file (be careful not to share this!)

```bash
# Windows PowerShell
Get-Content .env.local

# Or just open it in your editor
```

### Step 3: Verify it contains all required variables

Your `.env.local` should have:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://....supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

⚠️ **Most likely issue:** `SUPABASE_SERVICE_ROLE_KEY` is missing!

### Step 4: Get the Service Role Key

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click ⚙️ **Settings** (bottom left)
4. Click **API**
5. Scroll to "Project API keys"
6. Find the row that says **`service_role`** (NOT `anon`)
7. Click the **eye icon** to reveal the key
8. Click **Copy**

### Step 5: Add to `.env.local`

Add this line to your `.env.local` file:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXJwcm9qZWN0IiwiCJyb2xlIjoic2VydmljZV9yb2xlIiwiaWF0IjoxNjAwMDAwMDAwLCJleHAiOjE5MDAwMDAwMDB9.your_signature_here
```

(Replace with your actual key from Supabase)

### Step 6: Restart Development Server

**This is critical!** Changes to `.env.local` only take effect after restart.

```bash
# Stop the server (Ctrl+C in the terminal running pnpm dev)
# Then start it again:
pnpm dev
```

### Step 7: Test Again

1. Open a blog post
2. Check browser console
3. Look for detailed error messages

You should now see one of these:

✅ **Success:** `✅ Analytics tracked successfully`

❌ **Still failing with details:**

- Error details will now show what's wrong
- Check server console (terminal) for more info

## Common Issues

### Issue: "Missing env vars: { serviceKey: true }"

**Cause:** `SUPABASE_SERVICE_ROLE_KEY` is not set

**Solution:**

1. Add the key to `.env.local` (see Step 4-5)
2. Restart dev server (Step 6)

### Issue: "Missing env vars: { url: true }"

**Cause:** `NEXT_PUBLIC_SUPABASE_URL` is not set

**Solution:**

1. Get URL from Supabase Dashboard → Settings → API → Project URL
2. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
   ```
3. Restart dev server

### Issue: "relation 'blog_analytics' does not exist"

**Cause:** Database table hasn't been created

**Solution:**

1. Open Supabase Dashboard → SQL Editor
2. Copy contents of `blog_analytics_schema.sql`
3. Paste and run in SQL Editor
4. Try again

### Issue: Still getting errors after adding key

**Possible causes:**

1. Forgot to restart dev server
2. Wrong key (copied anon key instead of service_role)
3. Extra spaces or quotes around the key
4. Key is incomplete (they're very long!)

**Solution:**

1. Double-check you copied the **service_role** key
2. Make sure there are no quotes around it in `.env.local`
3. Restart dev server
4. Check terminal logs for specific error

## Next Steps

After fixing the environment variables:

1. ✅ Visit a blog post
2. ✅ Check browser console
3. ✅ Check terminal/server console
4. ✅ Verify in Supabase:
   ```sql
   SELECT * FROM blog_analytics ORDER BY visited_at DESC LIMIT 5;
   ```

## Still Need Help?

Check the detailed error in your browser console. It should now show:

- Error type
- Details/message
- Code
- Hint

Share these details for more specific help!
