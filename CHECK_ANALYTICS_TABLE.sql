-- Run this in Supabase SQL Editor to check if analytics table exists and is set up correctly

-- 1. Check if blog_analytics table exists
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'blog_analytics';

-- 2. Check table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'blog_analytics'
ORDER BY ordinal_position;

-- 3. Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'blog_analytics';

-- 4. Check RLS policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'blog_analytics';

-- 5. Check if there are any existing records
SELECT COUNT(*) as total_analytics_records FROM blog_analytics;

-- 6. Check recent analytics entries (if any)
SELECT * FROM blog_analytics ORDER BY visited_at DESC LIMIT 5;

-- 7. Check if blog_analytics_summary view exists
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'blog_analytics_summary';

-- 8. Test if you can insert (this will actually insert - comment out if you don't want this)
-- INSERT INTO blog_analytics (blog_id, visitor_id, visited_at)
-- VALUES (
--   (SELECT id FROM blogs WHERE is_publish = true LIMIT 1),
--   'manual-test-' || extract(epoch from now())::text,
--   NOW()
-- )
-- RETURNING *;

