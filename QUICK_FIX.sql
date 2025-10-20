-- QUICK FIX: Disable RLS on blogs table temporarily
-- Run this in Supabase SQL Editor NOW

-- This will disable RLS and allow your app to read/write blogs
-- WARNING: This is for development only!

ALTER TABLE blogs DISABLE ROW LEVEL SECURITY;

-- After running this, your blogs page should work immediately
-- You can re-enable RLS later with proper policies

-- To re-enable RLS later (don't run this yet):
-- ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

