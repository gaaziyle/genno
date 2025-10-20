-- Check Blog Status - Run this in Supabase SQL Editor
-- This helps diagnose why blogs aren't showing up

-- 1. Check if slug column exists
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'blogs' 
AND column_name IN ('slug', 'is_publish', 'clerk_user_id');

-- 2. Check all your blogs and their status
SELECT 
    id,
    title,
    slug,
    is_publish,
    clerk_user_id,
    created_at
FROM blogs
ORDER BY created_at DESC
LIMIT 10;

-- 3. Check how many blogs you have by status
-- Note: is_publish might be TEXT instead of BOOLEAN
SELECT 
    is_publish as status_value,
    COUNT(*) as count
FROM blogs
GROUP BY is_publish;

-- 4. Check if any blogs have NULL slugs
SELECT 
    id,
    title,
    CASE 
        WHEN slug IS NULL THEN '⚠️ NULL'
        WHEN slug = '' THEN '⚠️ EMPTY'
        ELSE slug
    END as slug_status,
    is_publish
FROM blogs
WHERE slug IS NULL OR slug = '';

-- 5. Fix: If you see NULL slugs, run ADD_SLUG_COLUMN.sql
-- Then run this to generate slugs for existing blogs:
-- UPDATE blogs 
-- SET slug = lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g')) || '-' || substring(id::text from 1 for 8)
-- WHERE slug IS NULL;

