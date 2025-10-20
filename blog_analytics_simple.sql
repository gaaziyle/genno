-- Simplified Blog Analytics Schema
-- This schema tracks unique visitors and analytics for blog posts

-- Create blog_analytics table to track unique visitors per blog
CREATE TABLE IF NOT EXISTS blog_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL, -- Unique identifier for each visitor (IP + User Agent hash)
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_blog_analytics_blog_id ON blog_analytics(blog_id);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_visitor_id ON blog_analytics(visitor_id);
CREATE INDEX IF NOT EXISTS idx_blog_analytics_visited_at ON blog_analytics(visited_at);

-- Create unique constraint to prevent duplicate visits from same visitor
CREATE UNIQUE INDEX IF NOT EXISTS idx_blog_analytics_unique_visitor 
ON blog_analytics(blog_id, visitor_id);

-- Enable RLS
ALTER TABLE blog_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for blog_analytics
-- Allow anyone to insert analytics data (for tracking visits)
CREATE POLICY "Allow public analytics insert" ON blog_analytics
  FOR INSERT WITH CHECK (true);

-- Allow blog owners to view their own analytics
CREATE POLICY "Allow blog owners to view analytics" ON blog_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM blogs 
      WHERE blogs.id = blog_analytics.blog_id 
      AND blogs.clerk_user_id = auth.jwt() ->> 'sub'
    )
  );

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON blog_analytics TO anon, authenticated;
