-- Fix blogs table structure
-- Run this in your Supabase SQL Editor

-- First, let's check what columns exist in your blogs table
-- Run this query first to see the current structure:
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'blogs' 
ORDER BY ordinal_position;

-- If user_id column doesn't exist, add it:
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS user_id TEXT;

-- If you have clerk_user_id column instead, you can:
-- Option 1: Rename it to user_id
-- ALTER TABLE blogs RENAME COLUMN clerk_user_id TO user_id;

-- Option 2: Keep both and copy data
-- UPDATE blogs SET user_id = clerk_user_id WHERE user_id IS NULL;

-- Add index if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_blogs_user_id ON blogs(user_id);

-- If you want to add the foreign key constraint:
ALTER TABLE blogs
DROP CONSTRAINT IF EXISTS fk_blogs_user_profile;

ALTER TABLE blogs
ADD CONSTRAINT fk_blogs_user_profile
FOREIGN KEY (user_id) 
REFERENCES profiles(clerk_user_id)
ON DELETE CASCADE;

