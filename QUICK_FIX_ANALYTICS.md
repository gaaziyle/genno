# 🚀 Quick Fix: Analytics Not Tracking

## Problem

Analytics not recording visits from different users or anonymous visitors.

## Solution in 3 Steps

### Step 1: Get Your Service Role Key

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. **Project Settings** → **API**
4. Find "**service_role**" key (⚠️ Not the anon key!)
5. Click **Copy**

### Step 2: Add to Environment Variables

Create or edit `.env.local` in your project root:

```env
# Add this line (replace with your actual key)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

### Step 3: Restart Server

```bash
# Stop server (Ctrl+C)
pnpm dev
```

## ✅ Test It

1. Open a blog post: `http://localhost:3000/your-blog-slug`
2. Open browser console (F12)
3. You should see:
   ```
   Tracking blog visit for: [id]
   Analytics tracking result: { success: true, ... }
   ```

## 🔍 Verify in Database

In Supabase SQL Editor:

```sql
SELECT * FROM blog_analytics ORDER BY visited_at DESC LIMIT 5;
```

You should see new entries! 🎉

## 🚨 For Production (Vercel)

1. Vercel Dashboard → Your Project
2. **Settings** → **Environment Variables**
3. Add `SUPABASE_SERVICE_ROLE_KEY`
4. Paste your service role key
5. Select all environments
6. **Save** and **Redeploy**

---

**Still not working?** See `ANALYTICS_TRACKING_FIX.md` for detailed troubleshooting.
