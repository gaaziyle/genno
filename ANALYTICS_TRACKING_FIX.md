# Analytics Tracking Fix Guide

## Problem Description

When visiting a blog page (`/[slug]`) from a different user's account (or as an anonymous visitor), the analytics weren't being tracked. No records were added to the `blog_analytics` table, and consequently, the `blog_analytics_summary` view wasn't being updated.

## Root Cause

The analytics tracking API route (`/api/analytics/track/route.ts`) was using the **client-side Supabase client** with the `NEXT_PUBLIC_SUPABASE_ANON_KEY`. This key has limitations when used in server-side code due to Row Level Security (RLS) policies.

Even though the RLS policy on `blog_analytics` table allows public inserts:

```sql
CREATE POLICY "Allow public analytics insert" ON blog_analytics
  FOR INSERT WITH CHECK (true);
```

The anon key from the client-side context doesn't always have the proper authentication context to execute the insert on the server side.

## Solution Implemented

### 1. Updated Analytics API Route

Changed `/app/api/analytics/track/route.ts` to use the **Supabase Service Role Key**, which bypasses RLS and ensures reliable tracking:

**Key Changes:**

- ✅ Creates a server-side Supabase client with service role key
- ✅ Bypasses RLS for analytics tracking
- ✅ Added detailed logging for debugging
- ✅ Returns inserted data for verification

**Code Changes:**

```typescript
// Before: Using client-side anon key
import { supabase } from "@/lib/supabase";

// After: Creating server-side client with service role key
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);
```

### 2. Enhanced Client-Side Logging

Updated `/app/[slug]/page.tsx` to add better logging in the `trackBlogVisit` function:

- ✅ Logs blog ID being tracked
- ✅ Logs API response
- ✅ Shows error details if tracking fails

This helps you verify that tracking is working correctly in the browser console.

### 3. Updated Environment Documentation

Updated `ENVIRONMENT_SETUP.md` to clarify that `SUPABASE_SERVICE_ROLE_KEY` is required for:

- Analytics tracking API routes
- Edge functions
- Local development

## Required Environment Variables

### Add to `.env.local`

You **must** add the Supabase Service Role Key to your `.env.local` file:

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

### Where to Find the Service Role Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Project Settings** → **API**
4. Under "Project API keys", find the **`service_role`** key
5. Click "Copy" and add it to `.env.local`

⚠️ **Security Warning:** The service role key bypasses all RLS policies. Never expose it in client-side code or commit it to Git.

## Deployment (Vercel/Netlify)

Don't forget to add the environment variable to your deployment platform:

### Vercel

1. Project Settings → Environment Variables
2. Add: `SUPABASE_SERVICE_ROLE_KEY`
3. Value: Your service role key
4. Select all environments (Production, Preview, Development)

### Netlify

1. Site Settings → Build & Deploy → Environment
2. Add: `SUPABASE_SERVICE_ROLE_KEY`
3. Value: Your service role key

## Testing the Fix

### 1. Restart Development Server

After adding the environment variable:

```bash
# Stop the server (Ctrl+C)
# Restart
pnpm dev
```

### 2. Test Analytics Tracking

1. **Open a blog post** in your browser (e.g., `http://localhost:3000/your-blog-slug`)

2. **Check browser console** for these logs:

   ```
   Tracking blog visit for: [blog-id]
   Analytics tracking result: { success: true, data: [...] }
   ```

3. **Check server console** (terminal running `pnpm dev`) for:
   ```
   Tracking analytics for blog: [blog-id] visitor: [visitor-hash]
   Analytics insert result: { data: [...], error: null }
   ```

### 3. Verify Database Records

Check Supabase to confirm records are being created:

**SQL Query:**

```sql
-- Check recent analytics entries
SELECT * FROM blog_analytics
ORDER BY visited_at DESC
LIMIT 10;

-- Check summary view
SELECT * FROM blog_analytics_summary;
```

### 4. Test Different Scenarios

✅ **Test as anonymous user:**

- Open blog in incognito/private window
- Should track the visit

✅ **Test as different user:**

- Sign in with a different account
- Visit someone else's blog
- Should track the visit

✅ **Test duplicate visits:**

- Visit the same blog twice from same browser
- Second visit should be silently ignored (unique constraint)
- No error should appear

## Troubleshooting

### Issue: "Missing Supabase credentials" error

**Cause:** Service role key not set

**Solution:**

1. Check `.env.local` exists in project root
2. Verify `SUPABASE_SERVICE_ROLE_KEY` is present
3. Restart dev server

### Issue: No logs appearing in browser console

**Cause:** Blog ID might not be loading

**Solution:**

1. Check blog exists and is published
2. Verify `blog.id` is available
3. Check for errors in console

### Issue: "Failed to track visit" error

**Cause:** Database connection or table doesn't exist

**Solution:**

1. Run the analytics schema: `blog_analytics_schema.sql`
2. Verify table exists in Supabase
3. Check RLS policies are enabled

### Issue: Analytics working locally but not in production

**Cause:** Environment variable not set in deployment

**Solution:**

1. Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel/Netlify
2. Redeploy the application
3. Check deployment logs for errors

## How It Works Now

### Flow Diagram

```
1. User visits blog page (/[slug])
   ↓
2. Page loads blog data
   ↓
3. useEffect triggers trackBlogVisit(blogId)
   ↓
4. POST request to /api/analytics/track
   ↓
5. API creates visitor_id (hash of IP + User Agent)
   ↓
6. API inserts record using SERVICE ROLE KEY
   ↓
7. Database: blog_analytics table updated
   ↓
8. Database: blog_analytics_summary view auto-updates
   ↓
9. Success response returned
```

### Visitor Identification

Each visitor is identified by a hash of:

- IP address (from `x-forwarded-for` header)
- User Agent (browser info)

This creates a unique `visitor_id` that:

- ✅ Tracks unique visitors
- ✅ Prevents duplicate counting (same visitor = same ID)
- ✅ Works for anonymous users
- ✅ Respects privacy (no personal data stored)

### Duplicate Visit Handling

The database has a unique constraint:

```sql
CREATE UNIQUE INDEX idx_blog_analytics_unique_visitor
ON blog_analytics(blog_id, visitor_id);
```

If the same visitor visits the same blog twice:

- First visit: Record created ✅
- Second visit: Duplicate key error (silently ignored) ✅

## Database Schema Reference

### blog_analytics Table

```sql
CREATE TABLE blog_analytics (
  id UUID PRIMARY KEY,
  blog_id UUID REFERENCES blogs(id),
  visitor_id TEXT NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE
);
```

### blog_analytics_summary View

```sql
CREATE VIEW blog_analytics_summary AS
SELECT
  b.id as blog_id,
  b.title,
  b.clerk_user_id,
  COUNT(ba.id) as unique_visitors,
  COUNT(ba.id) FILTER (WHERE ba.visited_at >= NOW() - INTERVAL '7 days') as visitors_last_7_days,
  COUNT(ba.id) FILTER (WHERE ba.visited_at >= NOW() - INTERVAL '30 days') as visitors_last_30_days,
  MAX(ba.visited_at) as last_visit
FROM blogs b
LEFT JOIN blog_analytics ba ON b.id = ba.blog_id
WHERE b.is_publish = true
GROUP BY b.id, b.title, b.clerk_user_id;
```

## Security Considerations

### ✅ Safe Usage

The service role key is used in:

- Server-side API routes only
- Not exposed to client
- Used for anonymous analytics tracking

### 🔒 Security Measures

1. **Environment Variable:** Key stored in `.env.local` (gitignored)
2. **Server-Only:** Used in API routes, never in client components
3. **Limited Scope:** Only used for analytics tracking
4. **No User Data:** Only tracks visitor hash (IP + UA)

### ⚠️ Best Practices

- ✅ Keep `.env.local` in `.gitignore`
- ✅ Use different keys for dev/production
- ✅ Rotate keys periodically
- ❌ Never commit keys to Git
- ❌ Never expose in client-side code

## Summary

**Problem:** Analytics not tracking visits from different users

**Root Cause:** API route using client-side anon key without proper auth context

**Solution:** Use service role key in server-side API route

**Result:** Analytics now track all visitors (anonymous and authenticated)

## Next Steps

After implementing this fix:

1. ✅ Add `SUPABASE_SERVICE_ROLE_KEY` to `.env.local`
2. ✅ Restart development server
3. ✅ Test analytics tracking
4. ✅ Verify database records
5. ✅ Add key to production deployment
6. ✅ Monitor analytics in dashboard

---

**Questions or Issues?**

If analytics still aren't tracking:

1. Check server console for detailed error logs
2. Check browser console for API response
3. Verify database schema is set up correctly
4. Ensure service role key is valid
