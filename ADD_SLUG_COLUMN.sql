-- Add slug column to blogs table
-- Run this in your Supabase SQL Editor

-- Add slug column if it doesn't exist
ALTER TABLE blogs 
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs(slug);

-- Function to generate slug from title
CREATE OR REPLACE FUNCTION generate_slug(title TEXT) 
RETURNS TEXT AS $$
DECLARE
    slug TEXT;
BEGIN
    -- Convert to lowercase and replace spaces/special chars with hyphens
    slug := lower(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'));
    -- Remove leading/trailing hyphens
    slug := trim(both '-' from slug);
    -- Limit length to 100 characters
    slug := substring(slug from 1 for 100);
    RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Update existing blogs to have slugs (if any exist)
-- This will generate slugs from existing titles
UPDATE blogs 
SET slug = generate_slug(title) || '-' || substring(id::text from 1 for 8)
WHERE slug IS NULL;

-- Optional: Add trigger to auto-generate slug on insert if not provided
CREATE OR REPLACE FUNCTION set_blog_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        NEW.slug := generate_slug(NEW.title) || '-' || substring(NEW.id::text from 1 for 8);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_blog_slug ON blogs;
CREATE TRIGGER trigger_set_blog_slug
    BEFORE INSERT OR UPDATE OF title ON blogs
    FOR EACH ROW
    EXECUTE FUNCTION set_blog_slug();

