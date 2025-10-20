# Blogs Page RLS Error Troubleshooting

## The Problem

You're seeing "Error fetching blogs: {}" because of Row Level Security (RLS) policies on the `blogs` table.

## Root Cause

The `blogs` table has RLS enabled with policies that check:

```sql
USING (user_id = current_setting('app.current_user_id', true))
```

However, when using the Supabase anon key from the client-side, this setting is not automatically configured, causing the query to fail.

## Quick Fix (Development)

Execute this SQL in your Supabase SQL Editor to temporarily allow reads:

```sql
-- Drop restrictive policy
DROP POLICY IF EXISTS "Users can view their own blogs" ON blogs;

-- Create permissive policy for development
CREATE POLICY "Allow all blog reads"
    ON blogs FOR SELECT
    USING (true);
```

## Better Solution (Recommended)

### Option 1: Update RLS Policies (Easiest)

Run the SQL file `supabase-rls-fix.sql` that I created. This updates the policies to work with the anon key while still filtering by `user_id` in your application code.

```bash
# In Supabase SQL Editor, paste the contents of supabase-rls-fix.sql
```

### Option 2: Use Supabase Service Role (Server-Side)

Create API routes that use the service role key:

1. **Add to `.env.local`:**

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

2. **Create server-side Supabase client (`lib/supabase-server.ts`):**

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabaseServer = createClient(supabaseUrl, supabaseServiceKey);
```

3. **Create API route (`app/api/blogs/route.ts`):**

```typescript
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get clerk_user_id from profiles
  const { data: profile } = await supabaseServer
    .from("profiles")
    .select("clerk_user_id")
    .eq("clerk_user_id", userId)
    .single();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  // Fetch blogs using service role (bypasses RLS)
  const { data: blogs, error } = await supabaseServer
    .from("blogs")
    .select("*")
    .eq("user_id", profile.clerk_user_id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ blogs });
}
```

4. **Update frontend to use API:**

```typescript
const fetchBlogs = async () => {
  const response = await fetch("/api/blogs");
  const { blogs } = await response.json();
  setBlogs(blogs || []);
};
```

### Option 3: Integrate Supabase Auth with Clerk (Advanced)

Use Supabase's JWT authentication with Clerk tokens. This is more complex but provides the best security.

## What Changed in the Code

### Before (Using Clerk User ID - Won't Work)

```typescript
.eq("user_id", user.id) // Clerk's user ID
```

### After (Using Profile's clerk_user_id - Correct)

```typescript
// Get clerk_user_id from profiles table
const { data: profile } = await supabase
  .from("profiles")
  .select("clerk_user_id")
  .eq("email", userEmail)
  .single();

// Use it to fetch blogs
.eq("user_id", profile.clerk_user_id)
```

## Understanding the Schema

```sql
-- profiles table
id              UUID              -- Internal UUID
clerk_user_id   TEXT              -- Clerk's user ID (e.g., "user_abc123")
email           TEXT              -- User's email

-- blogs table
id              UUID              -- Blog post UUID
user_id         TEXT              -- References profiles.clerk_user_id (NOT profiles.id!)
```

The key point: `blogs.user_id` stores the **clerk_user_id** (TEXT), not the profiles UUID.

## Debugging Steps

1. **Check if profile exists:**

```sql
SELECT * FROM profiles WHERE email = 'your-email@example.com';
```

2. **Check if blogs exist for that user:**

```sql
SELECT * FROM blogs WHERE user_id = 'user_xxx'; -- Use your clerk_user_id
```

3. **Check RLS policies:**

```sql
SELECT * FROM pg_policies WHERE tablename = 'blogs';
```

4. **Test without RLS (as admin):**

```sql
-- In SQL Editor (this bypasses RLS)
SELECT * FROM blogs;
```

## Current Status

With the updated code:

- ✅ Fetches `clerk_user_id` from profiles table
- ✅ Uses that to filter blogs
- ✅ Added detailed error logging
- ⚠️ RLS policies may need to be updated (see `supabase-rls-fix.sql`)

## Next Steps

1. **Run the SQL fix:**

   - Open Supabase SQL Editor
   - Paste contents of `supabase-rls-fix.sql`
   - Execute

2. **Check the console logs:**

   - Look for detailed error messages
   - Verify the profile is found
   - Check if blogs query is attempted

3. **Verify in Supabase:**
   - Check Table Editor for your blogs
   - Verify the `user_id` matches your `clerk_user_id`

## Security Considerations

For production:

- ✅ Use API routes with service role key
- ✅ Validate user permissions server-side
- ✅ Never expose service role key to client
- ✅ Implement proper RLS policies
- ⚠️ The permissive policies in `supabase-rls-fix.sql` are for development only

## Additional Resources

- [Supabase RLS Documentation](https://supabase.com/docs/guides/auth/row-level-security)
- [Clerk + Supabase Integration](https://clerk.com/docs/integrations/databases/supabase)
- [Next.js API Routes](https://nextjs.org/docs/app/building-your-application/routing/route-handlers)
