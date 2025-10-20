# Column Name Fix - blogs.user_id vs blogs.clerk_user_id

## The Error

```
column blogs.user_id does not exist
```

## Root Cause

The code was trying to query `blogs.user_id`, but your actual Supabase table uses `blogs.clerk_user_id` instead.

## Fix Applied

### Before (Incorrect)

```typescript
.eq("user_id", profile.clerk_user_id)
```

### After (Correct)

```typescript
.eq("clerk_user_id", profile.clerk_user_id)
```

## What Changed

**File**: `app/dashboard/blogs/page.tsx`

```typescript
// Now fetch blogs using the clerk_user_id
let query = supabase
  .from("blogs")
  .select("*")
  .eq("clerk_user_id", profile.clerk_user_id) // ← Changed from "user_id"
  .order("created_at", { ascending: false });
```

## Your Database Schema

Based on the error, your `blogs` table has:

- ✅ `id` (UUID) - Primary key
- ✅ `clerk_user_id` (TEXT) - References the user
- ✅ Other columns (title, content, etc.)

## Why This Happened

The schema files in your project (`supabase-complete-schema.sql`) show `user_id` as the column name, but your actual Supabase database table uses `clerk_user_id`.

This can happen when:

1. The table was created manually in Supabase UI
2. A different schema was used initially
3. The schema file wasn't executed or was modified

## Testing

After this fix, refresh your app and you should see:

- ✅ No more "column does not exist" errors
- ✅ Blogs loading correctly (or empty state if no blogs exist)
- ✅ Console log: "Fetching blogs for clerk_user_id: user_xxx"
- ✅ Console log: "Fetched blogs: X blogs found"

## Note About Schema Files

The schema files in your project reference `user_id`, but since your actual table uses `clerk_user_id`, you have two options:

### Option 1: Keep Using clerk_user_id (Current Fix) ✅

- No database changes needed
- Code now matches your actual schema
- **This is what we've implemented**

### Option 2: Rename Column to user_id

If you want to match the schema files, run this SQL:

```sql
ALTER TABLE blogs RENAME COLUMN clerk_user_id TO user_id;
```

Then change the code back to:

```typescript
.eq("user_id", profile.clerk_user_id)
```

## Data Flow Summary

```
1. User logs in via Clerk
2. Get user email from Clerk
3. Query profiles table: profiles.email = user_email
4. Get: profile.clerk_user_id
5. Query blogs table: blogs.clerk_user_id = profile.clerk_user_id  ← Fixed!
6. Display blogs
```

## Success Checklist

- [ ] Refresh the app
- [ ] Check console - should see "Fetching blogs for clerk_user_id: ..."
- [ ] No more "column does not exist" errors
- [ ] Blogs page loads (shows blogs or empty state)
- [ ] Can filter by all/published/drafts

Your blogs page should now work correctly! 🎉
