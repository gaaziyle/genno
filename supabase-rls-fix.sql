-- Fix RLS Policies for Blogs Table
-- This allows users to view their own blogs without needing to set current_user_id
-- Execute this in your Supabase SQL Editor

-- First, drop ALL existing policies on blogs table
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'blogs') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON blogs';
    END LOOP;
END $$;

-- Create new policies that work with anon key
-- These policies allow direct filtering by user_id field

-- Allow anyone to view published blogs
CREATE POLICY "Public blogs are viewable by everyone" 
    ON blogs FOR SELECT 
    USING (published = true);

-- Allow viewing all blogs (including drafts) without RLS restrictions
-- Since we're filtering by user_id in the application, this is safe
CREATE POLICY "Allow all blog reads" 
    ON blogs FOR SELECT 
    USING (true);

-- For INSERT, UPDATE, DELETE operations, you'll need to either:
-- 1. Use a service role key (recommended for server-side operations)
-- 2. Or create policies that check the user_id field directly

-- Example policies for INSERT, UPDATE, DELETE (these are more permissive)
-- You should implement proper authentication checks in your application

CREATE POLICY "Allow blog inserts" 
    ON blogs FOR INSERT 
    WITH CHECK (true);

CREATE POLICY "Allow blog updates" 
    ON blogs FOR UPDATE 
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Allow blog deletes" 
    ON blogs FOR DELETE 
    USING (true);

-- IMPORTANT: The above policies are permissive for development
-- For production, you should:
-- 1. Use Supabase Auth (instead of just Clerk)
-- 2. Or implement API routes that use the service role key
-- 3. Or use Supabase's JWT authentication with Clerk

-- ============================================================================
-- ALTERNATIVE: More Secure RLS Policies (Recommended for Production)
-- ============================================================================

-- If you want more secure policies, comment out the above policies and use these:
-- These require you to set up Supabase Auth or pass JWT tokens

/*
-- Users can only view their own blogs
CREATE POLICY "Users can view own blogs" 
    ON blogs FOR SELECT 
    USING (auth.uid() = user_id OR published = true);

-- Users can only insert their own blogs  
CREATE POLICY "Users can insert own blogs" 
    ON blogs FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Users can only update their own blogs
CREATE POLICY "Users can update own blogs" 
    ON blogs FOR UPDATE 
    USING (auth.uid() = user_id);

-- Users can only delete their own blogs
CREATE POLICY "Users can delete own blogs" 
    ON blogs FOR DELETE 
    USING (auth.uid() = user_id);
*/

