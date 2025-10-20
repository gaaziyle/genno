-- Fix is_publish column type
-- Run this in Supabase SQL Editor

-- 1. Check current data type
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'blogs' AND column_name = 'is_publish';

-- 2. Check what values are currently in the column
SELECT DISTINCT is_publish, COUNT(*) 
FROM blogs 
GROUP BY is_publish;

-- 3. Option A: Convert TEXT column to BOOLEAN
-- This will convert 'true'/'yes'/'1' to true, everything else to false
ALTER TABLE blogs 
ALTER COLUMN is_publish TYPE BOOLEAN 
USING (
    CASE 
        WHEN LOWER(is_publish::TEXT) IN ('true', 'yes', '1', 't', 'y') THEN true
        ELSE false
    END
);

-- 4. Set default value
ALTER TABLE blogs 
ALTER COLUMN is_publish SET DEFAULT false;

-- 5. Verify the change
SELECT column_name, data_type, column_default
FROM information_schema.columns 
WHERE table_name = 'blogs' AND column_name = 'is_publish';

-- 6. Check your blogs after conversion
SELECT 
    id,
    title,
    slug,
    is_publish,
    clerk_user_id
FROM blogs
ORDER BY created_at DESC
LIMIT 10;

