-- SQL Schema for Genno Blog Application
-- Execute this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    youtube_url TEXT,
    thumbnail_url TEXT,
    user_id TEXT NOT NULL, -- Clerk user ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    published BOOLEAN DEFAULT false,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[]
);

-- Create an index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_blogs_user_id ON blogs(user_id);

-- Create an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at DESC);

-- Create an index on published for filtering
CREATE INDEX IF NOT EXISTS idx_blogs_published ON blogs(published);

-- Enable Row Level Security
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read all published blogs
CREATE POLICY "Public blogs are viewable by everyone" 
    ON blogs FOR SELECT 
    USING (published = true);

-- Create policy to allow users to view their own blogs (published or not)
CREATE POLICY "Users can view their own blogs" 
    ON blogs FOR SELECT 
    USING (user_id = current_setting('app.current_user_id', true));

-- Create policy to allow users to insert their own blogs
CREATE POLICY "Users can insert their own blogs" 
    ON blogs FOR INSERT 
    WITH CHECK (user_id = current_setting('app.current_user_id', true));

-- Create policy to allow users to update their own blogs
CREATE POLICY "Users can update their own blogs" 
    ON blogs FOR UPDATE 
    USING (user_id = current_setting('app.current_user_id', true));

-- Create policy to allow users to delete their own blogs
CREATE POLICY "Users can delete their own blogs" 
    ON blogs FOR DELETE 
    USING (user_id = current_setting('app.current_user_id', true));

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_blogs_updated_at ON blogs;
CREATE TRIGGER update_blogs_updated_at
    BEFORE UPDATE ON blogs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Optional: Create a view for blog statistics
CREATE OR REPLACE VIEW blog_stats AS
SELECT 
    user_id,
    COUNT(*) as total_blogs,
    COUNT(*) FILTER (WHERE published = true) as published_blogs,
    COUNT(*) FILTER (WHERE published = false) as draft_blogs,
    MAX(created_at) as last_blog_date
FROM blogs
GROUP BY user_id;

COMMENT ON TABLE blogs IS 'Stores blog posts created by users, converted from YouTube videos';
COMMENT ON COLUMN blogs.user_id IS 'Clerk user ID of the blog author';
COMMENT ON COLUMN blogs.youtube_url IS 'Original YouTube video URL that was converted';
COMMENT ON COLUMN blogs.thumbnail_url IS 'URL to the blog post thumbnail image';
COMMENT ON COLUMN blogs.tags IS 'Array of tags associated with the blog post';

