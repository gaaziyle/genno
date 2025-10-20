-- SQL Schema for User Profiles Table
-- Execute this in your Supabase SQL Editor BEFORE setting up the webhook

-- Enable UUID extension if not already enabled
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_clerk_user_id ON profiles(clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read all profiles (for public features)
CREATE POLICY "Profiles are viewable by everyone" 
    ON profiles FOR SELECT 
    USING (true);

-- Create policy to allow users to update their own profile
CREATE POLICY "Users can update their own profile" 
    ON profiles FOR UPDATE 
    USING (clerk_user_id = current_setting('app.current_user_id', true));

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_profiles_updated_at();

-- Optional: Add foreign key constraint to blogs table
-- Run this AFTER creating the profiles table if you want to enforce referential integrity
-- This will link blogs.user_id to profiles.clerk_user_id
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'blogs') THEN
        -- Add index on blogs.user_id if it doesn't exist
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint 
            WHERE conname = 'fk_blogs_user_profile'
        ) THEN
            -- Note: This assumes blogs.user_id contains clerk_user_id
            -- If you want strict foreign key constraint, uncomment the following:
            -- ALTER TABLE blogs
            -- ADD CONSTRAINT fk_blogs_user_profile
            -- FOREIGN KEY (user_id) REFERENCES profiles(clerk_user_id)
            -- ON DELETE CASCADE;
            
            RAISE NOTICE 'Foreign key constraint can be added manually if needed';
        END IF;
    END IF;
END $$;

-- Create a view to get user stats with profile information
CREATE OR REPLACE VIEW user_blog_stats AS
SELECT 
    p.clerk_user_id,
    p.email,
    p.first_name,
    p.last_name,
    p.username,
    p.profile_image_url,
    COUNT(b.id) as total_blogs,
    COUNT(b.id) FILTER (WHERE b.published = true) as published_blogs,
    COUNT(b.id) FILTER (WHERE b.published = false) as draft_blogs,
    MAX(b.created_at) as last_blog_date
FROM profiles p
LEFT JOIN blogs b ON b.user_id = p.clerk_user_id
GROUP BY p.clerk_user_id, p.email, p.first_name, p.last_name, p.username, p.profile_image_url;

-- Comments for documentation
COMMENT ON TABLE profiles IS 'Stores user profile information synced from Clerk via webhook';
COMMENT ON COLUMN profiles.clerk_user_id IS 'Unique user ID from Clerk authentication service';
COMMENT ON COLUMN profiles.metadata IS 'Additional user metadata from Clerk (stored as JSONB)';
COMMENT ON COLUMN profiles.last_sign_in_at IS 'Timestamp of the user''s last sign-in';

