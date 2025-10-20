# 🔍 Analytics Debugging Steps

## Step 1: Test Environment Variables

Open this URL in your browser:

```
http://localhost:3000/api/analytics/test
```

**Expected Result:**

```json
{
  "environment": {
    "supabaseUrl": "✅ SET",
    "supabaseServiceKey": "✅ SET",
    "supabaseAnonKey": "✅ SET",
    "serviceKeyLength": 240, // Should be ~220-250 characters
    "serviceKeyPreview": "eyJhbGciOiJIUzI1NiI..."
  }
}
```

**If you see ❌ MISSING:**

- The environment variable is not loaded
- Check `.env.local` file exists in project root
- Verify variable name is exactly: `SUPABASE_SERVICE_ROLE_KEY`
- No quotes around the value
- **Restart the server again!**

---

## Step 2: Check Browser Console

1. Open a blog post (e.g., `http://localhost:3000/your-blog-slug`)
2. Press **F12** to open Developer Tools
3. Click **Console** tab
4. Look for the error messages

**What to look for:**

### ✅ Success looks like:

```
Tracking blog visit for: [blog-id]
✅ Analytics tracked successfully
```

### ❌ Error looks like:

```
❌ Analytics tracking failed!
Error: [error type]
Details: [specific details]
```

**📋 Copy and share:**

- The full error message
- Any "Details", "Code", or "Hint" shown

---

## Step 3: Check Server Console (Terminal)

Look at the terminal where `pnpm dev` is running.

**What to look for:**

### ✅ Success looks like:

```
Tracking analytics for blog: [blog-id] visitor: [visitor-hash]
Analytics insert result: { data: [...], error: null }
```

### ❌ Error looks like:

```
Missing Supabase credentials
SUPABASE_SERVICE_ROLE_KEY: MISSING
```

OR

```
Analytics tracking error: [error details]
```

**📋 Copy and share:**

- The exact error message from the terminal

---

## Step 4: Verify Database Table Exists

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Table Editor** (left sidebar)
4. Look for `blog_analytics` table

**If table doesn't exist:**

1. Click **SQL Editor** (left sidebar)
2. Create new query
3. Copy the entire contents of `blog_analytics_schema.sql`
4. Paste and click **Run**
5. Go back to **Table Editor** and verify table exists

**If table exists:**

- Click on `blog_analytics` table
- Check if there are any rows
- Note the column names

---

## Step 5: Manual Database Test

Let's test if you can insert data manually:

1. Go to **SQL Editor** in Supabase
2. Run this query:

```sql
-- Test if you can insert manually
INSERT INTO blog_analytics (blog_id, visitor_id, visited_at)
VALUES (
  (SELECT id FROM blogs LIMIT 1),  -- Use first blog
  'test-visitor-123',
  NOW()
);

-- Check if it worked
SELECT * FROM blog_analytics ORDER BY visited_at DESC LIMIT 5;
```

**If this works:**

- The table exists and accepts data
- Issue is with the API route

**If this fails:**

- Copy the error message
- The table might not exist or have different columns

---

## Step 6: Check Your .env.local File

Open `.env.local` in your editor and verify it looks like this:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Common mistakes:**

- ❌ Quotes around values: `SUPABASE_SERVICE_ROLE_KEY="your_key"`
- ❌ Wrong variable name: `SUPABASE_SERVICE_KEY` (missing `_ROLE_`)
- ❌ Using anon key instead of service role key
- ❌ Incomplete key (service role keys are ~220-250 characters)

**Correct format:**

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlvdXJwcm9qZWN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoxOTAwMDAwMDAwfQ.your_very_long_signature_here
```

No quotes, no spaces, just the key.

---

## Step 7: Restart Checklist

Make absolutely sure you restarted correctly:

1. **Stop the server:**

   - Go to terminal running `pnpm dev`
   - Press `Ctrl+C`
   - Wait for it to fully stop

2. **Start the server:**

   ```bash
   pnpm dev
   ```

3. **Verify server started:**

   - Should say "Ready in XXms"
   - No error messages on startup

4. **Clear browser cache:**
   - Press `Ctrl+Shift+R` (hard refresh)
   - Or open in incognito/private window

---

## Step 8: Test with Network Tab

1. Open blog post
2. Press F12 → Network tab
3. Filter by "track"
4. You should see a request to `/api/analytics/track`
5. Click on it
6. Check **Response** tab

**What to look for:**

- Status code (should be 200)
- Response body (shows error details)

---

## 📊 Report Back

Please provide:

1. **Environment Test Result** (Step 1)

   - Screenshot or copy the JSON from `/api/analytics/test`

2. **Browser Console Error** (Step 2)

   - The specific error message

3. **Server Console Error** (Step 3)

   - What the terminal shows

4. **Database Check** (Step 4)

   - Does `blog_analytics` table exist?
   - Screenshot of table structure if possible

5. **.env.local format** (Step 6)
   - Just confirm format is correct (no quotes, right variable name)
   - Don't share the actual keys!

With these details, I can pinpoint exactly what's wrong!
