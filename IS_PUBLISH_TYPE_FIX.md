# Fix is_publish Column Type Issue

## The Problem

You're getting this error:

```
ERROR: operator does not exist: text = boolean
```

This means your `is_publish` column is **TEXT** instead of **BOOLEAN**.

## Why This Happened

You manually created the `is_publish` column in Supabase, and it defaulted to TEXT type instead of BOOLEAN.

## Solution Options

### Option 1: Convert Column to BOOLEAN (Recommended)

Run `FIX_IS_PUBLISH_TYPE.sql` in Supabase SQL Editor.

This will:

1. ✅ Convert the column from TEXT to BOOLEAN
2. ✅ Handle existing 'true'/'yes'/'1' values correctly
3. ✅ Set false as default for new rows
4. ✅ Make the app work properly

**Steps:**

1. Open Supabase SQL Editor
2. Paste contents of `FIX_IS_PUBLISH_TYPE.sql`
3. Click "Run"
4. Check the output - should show successful conversion

### Option 2: Keep as TEXT (Already Fixed in Code)

I've already updated the app code to handle both TEXT and BOOLEAN types, so if you want to keep it as TEXT, the app will now work!

The code now checks for:

- `true` (boolean)
- `"true"` (text)
- `"yes"` (text)
- `"1"` (text)

## How to Check Current Type

Run this SQL:

```sql
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'blogs' AND column_name = 'is_publish';
```

**Results:**

- `data_type: boolean` ✅ Good - everything will work
- `data_type: text` ⚠️ Works now, but BOOLEAN is better

## Current Values Check

Run this SQL:

```sql
SELECT is_publish, COUNT(*)
FROM blogs
GROUP BY is_publish;
```

**If you see:**

- `true` / `false` - Column is boolean ✅
- `'true'` / `'false'` - Column is text ⚠️

## Recommended Actions

### 1. Convert to BOOLEAN (Best)

```sql
-- Run FIX_IS_PUBLISH_TYPE.sql
-- Or just run this:

ALTER TABLE blogs
ALTER COLUMN is_publish TYPE BOOLEAN
USING (
    CASE
        WHEN LOWER(is_publish::TEXT) IN ('true', 'yes', '1', 't', 'y') THEN true
        ELSE false
    END
);

ALTER TABLE blogs
ALTER COLUMN is_publish SET DEFAULT false;
```

### 2. Verify It Worked

```sql
-- Check column type
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'blogs' AND column_name = 'is_publish';

-- Should show:
-- column_name: is_publish
-- data_type: boolean
-- column_default: false
```

### 3. Test Your Blogs

```sql
-- Check all your blogs
SELECT
    title,
    slug,
    is_publish,
    clerk_user_id
FROM blogs;

-- Publish a test blog
UPDATE blogs
SET is_publish = true
WHERE title = 'Your Blog Title';

-- Check published blogs
SELECT title, slug FROM blogs WHERE is_publish = true;
```

## App Code Updates (Already Done)

I've updated the following files to handle both TEXT and BOOLEAN:

✅ `app/[slug]/page.tsx` - Public blog view
✅ `CHECK_BLOG_STATUS.sql` - Diagnostic queries

The app will now work regardless of whether you convert to BOOLEAN or keep as TEXT!

## Publishing a Blog

After fixing the column type:

### From Dashboard:

1. Go to `/dashboard/blogs`
2. Click a blog
3. Click "Publish" button
4. Visit `/slug` to see it live

### From SQL:

```sql
-- Publish a specific blog
UPDATE blogs
SET is_publish = true
WHERE slug = 'your-blog-slug';

-- Or by title
UPDATE blogs
SET is_publish = true
WHERE title LIKE '%Your Blog Title%';
```

## Testing Checklist

- [ ] Run `FIX_IS_PUBLISH_TYPE.sql`
- [ ] Verify column is now BOOLEAN
- [ ] Check existing blog values
- [ ] Publish a blog from dashboard
- [ ] Visit `/slug` - should see published blog
- [ ] Try unpublishing - `/slug` should return 404
- [ ] Check console - should be error-free

## Summary

**Before:**

- ❌ `is_publish` is TEXT
- ❌ Comparisons fail with boolean values
- ❌ App errors on `/slug`

**After (Option 1 - BOOLEAN):**

- ✅ `is_publish` is BOOLEAN
- ✅ Native true/false values
- ✅ Faster queries
- ✅ Type-safe

**After (Option 2 - TEXT):**

- ✅ `is_publish` stays TEXT
- ✅ App handles both types
- ✅ Works but less optimal

**Recommendation: Convert to BOOLEAN for best results! 🚀**
