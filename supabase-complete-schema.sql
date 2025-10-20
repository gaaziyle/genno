-- Complete Supabase Schema for Genno Application
-- Execute this in your Supabase SQL Editor
-- This includes both profiles and blogs tables

-- ============================================================================
-- PART 1: PROFILES TABLE (User data synced from Clerk)
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table to store Clerk user information
CREATE TABLE IF NOT EXISTS profiles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    clerk_user_id TEXT UNIQUE NOT NULL, -- Clerk's unique user ID
    email TEXT NOT NULL,
    first_name TEXT,
    last_name TEXT,
    username TEXT,
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    last_sign_in_at TIMESTAMP WITH TIME ZONE,
    -- Additional metadata
    email_verified BOOLEAN DEFAULT false,
    banned BOOLEAN DEFAULT false,
    metadata JSONB DEFAULT '{}'::JSONB
);

-- Create indexes for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_user_id ON profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Enable Row Level Security for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
    ON profiles FOR SELECT 
    USING (true);

CREATE POLICY "Users can update their own profile" 
    ON profiles FOR UPDATE 
    USING (clerk_user_id = current_setting('app.current_user_id', true));

-- Function to automatically update profiles.updated_at
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for profiles updated_at
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profiles_updated_at();

-- ============================================================================
-- PART 2: BLOGS TABLE (Blog posts created by users)
-- ============================================================================

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    youtube_url TEXT,
    thumbnail_url TEXT,
    user_id TEXT NOT NULL, -- References profiles.clerk_user_id
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    published BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- Create indexes for blogs
CREATE INDEX IF NOT EXISTS idx_blogs_user_id ON blogs(user_id);
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);

-- Add foreign key constraint to link blogs to profiles
-- This ensures referential integrity between blogs and user profiles
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint 
        WHERE conname = 'fk_blogs_user_profile'
    ) THEN
        ALTER TABLE blogs
        ADD CONSTRAINT fk_blogs_user_profile
        FOREIGN KEY (user_id) 
        REFERENCES profiles(clerk_user_id)
        ON DELETE CASCADE; -- Delete blogs when user profile is deleted
    END IF;
END $$;

-- Enable Row Level Security for blogs
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Create policies for blogs
CREATE POLICY "Public blogs are viewable by everyone" 
    ON blogs FOR SELECT 
    USING (published = true);

CREATE POLICY "Users can view their own blogs" 
    ON blogs FOR SELECT 
    USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert their own blogs" 
    ON blogs FOR INSERT 
    WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update their own blogs" 
    ON blogs FOR UPDATE 
    USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete their own blogs" 
    ON blogs FOR DELETE 
    USING (user_id = current_setting('app.current_user_id', true));

-- Function to automatically update blogs.updated_at
CREATE OR REPLACE FUNCTION update_blogs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for blogs updated_at
DROP TRIGGER IF EXISTS update_blogs_updated_at ON blogs;
CREATE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON blogs
    FOR EACH ROW
    EXECUTE FUNCTION update_blogs_updated_at();

-- ============================================================================
-- PART 3: VIEWS FOR ANALYTICS AND STATS
-- ============================================================================

-- View for individual blog statistics
CREATE OR REPLACE VIEW blog_stats AS
SELECT 
    user_id,
    COUNT(*) as total_blogs,
    COUNT(*) FILTER (WHERE published = true) as published_blogs,
    COUNT(*) FILTER (WHERE published = false) as draft_blogs,
    MAX(created_at) as last_blog_date
FROM blogs
GROUP BY user_id;

-- View for user stats with profile information
CREATE OR REPLACE VIEW user_blog_stats AS
SELECT 
    p.id as profile_id,
    p.clerk_user_id,
    p.email,
    p.first_name,
    p.last_name,
    p.username,
    p.profile_image_url,
    COALESCE(COUNT(b.id), 0) as total_blogs,
    COALESCE(COUNT(b.id) FILTER (WHERE b.published = true), 0) as published_blogs,
    COALESCE(COUNT(b.id) FILTER (WHERE b.published = false), 0) as draft_blogs,
    MAX(b.created_at) as last_blog_date,
    p.created_at as user_joined_date,
    p.last_sign_in_at
FROM profiles p
LEFT JOIN blogs b ON b.user_id = p.clerk_user_id
GROUP BY 
    p.id, p.clerk_user_id, p.email, p.first_name, 
    p.last_name, p.username, p.profile_image_url,
    p.created_at, p.last_sign_in_at;

-- View for recent blogs with author information
CREATE OR REPLACE VIEW recent_blogs_with_authors AS
SELECT 
    b.id,
    b.title,
    b.excerpt,
    b.content,
    b.youtube_url,
    b.thumbnail_url,
    b.published,
    b.tags,
    b.created_at,
    b.updated_at,
    p.clerk_user_id,
    p.email,
    p.first_name,
    p.last_name,
    p.username,
    p.profile_image_url,
    (p.first_name || ' ' || p.last_name) as author_full_name
FROM blogs b
INNER JOIN profiles p ON b.user_id = p.clerk_user_id
ORDER BY b.created_at DESC;

-- ============================================================================
-- PART 4: COMMENTS AND DOCUMENTATION
-- ============================================================================

-- Table comments
COMMENT ON TABLE profiles IS 'Stores user profile information synced from Clerk via webhook';
COMMENT ON TABLE blogs IS 'Stores blog posts created by users, converted from YouTube videos';

-- Column comments for profiles
COMMENT ON COLUMN profiles.clerk_user_id IS 'Unique user ID from Clerk authentication service';
COMMENT ON COLUMN profiles.metadata IS 'Additional user metadata from Clerk (stored as JSONB)';
COMMENT ON COLUMN profiles.last_sign_in_at IS 'Timestamp of the user''s last sign-in';

-- Column comments for blogs
COMMENT ON COLUMN blogs.user_id IS 'Clerk user ID of the blog author (references profiles.clerk_user_id)';
COMMENT ON COLUMN blogs.youtube_url IS 'Original YouTube video URL that was converted';
COMMENT ON COLUMN blogs.thumbnail_url IS 'URL to the blog post thumbnail image';
COMMENT ON COLUMN blogs.tags IS 'Array of tags associated with the blog post';

-- View comments
COMMENT ON VIEW user_blog_stats IS 'Combined view of user profiles with their blog statistics';
COMMENT ON VIEW recent_blogs_with_authors IS 'Recent blogs with full author profile information';

-- ============================================================================
-- PART 5: SAMPLE QUERIES (Commented out - for reference)
-- ============================================================================

-- Get all blogs by a specific user
-- SELECT * FROM blogs WHERE user_id = 'user_xxxxx' ORDER BY created_at DESC;

-- Get user stats
-- SELECT * FROM user_blog_stats WHERE clerk_user_id = 'user_xxxxx';

-- Get recent published blogs with author info
-- SELECT * FROM recent_blogs_with_authors WHERE published = true LIMIT 10;

-- Search blogs by tag
-- SELECT * FROM blogs WHERE 'technology' = ANY(tags);

-- Get top authors by blog count
-- SELECT clerk_user_id, email, username, total_blogs, published_blogs
-- FROM user_blog_stats 
-- ORDER BY total_blogs DESC 
-- LIMIT 10;

-- ============================================================================
-- SETUP COMPLETE
-- ============================================================================

-- Run this query to verify all tables were created successfully:
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
    AND table_name IN ('profiles', 'blogs')
ORDER BY table_name;

-- Run this to verify all views were created:
SELECT 
    table_name as view_name
FROM information_schema.views 
WHERE table_schema = 'public' 
    AND table_name LIKE '%blog%' OR table_name LIKE '%profile%'
ORDER BY table_name;

