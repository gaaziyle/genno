-- Blog Analytics Schema
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

-- Create a view for aggregated analytics data
CREATE OR REPLACE VIEW blog_analytics_summary AS
SELECT 
  b.id as blog_id,
  b.title,
  b.clerk_user_id,
  COUNT(ba.id) as unique_visitors,
  COUNT(ba.id) FILTER (WHERE ba.visited_at >= NOW() - INTERVAL '7 days') as visitors_last_7_days,
  COUNT(ba.id) FILTER (WHERE ba.visited_at >= NOW() - INTERVAL '30 days') as visitors_last_30_days,
  MAX(ba.visited_at) as last_visit
FROM blogs b
LEFT JOIN blog_analytics ba ON b.id = ba.blog_id
WHERE b.is_publish = true OR b.is_publish = 'true'
GROUP BY b.id, b.title, b.clerk_user_id;

-- Enable RLS on the view
ALTER VIEW blog_analytics_summary SET (security_invoker = true);

-- Create a function to get daily analytics for charts
CREATE OR REPLACE FUNCTION get_daily_analytics(user_id_param TEXT, days INTEGER DEFAULT 30)
RETURNS TABLE (
  date DATE,
  unique_visitors INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ba.visited_at::DATE as date,
    COUNT(DISTINCT ba.visitor_id)::INTEGER as unique_visitors
  FROM blog_analytics ba
  JOIN blogs b ON ba.blog_id = b.id
  WHERE b.clerk_user_id = user_id_param
    AND ba.visited_at >= NOW() - (days || ' days')::INTERVAL
  GROUP BY ba.visited_at::DATE
  ORDER BY date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT ON blog_analytics TO anon, authenticated;
GRANT SELECT ON blog_analytics_summary TO authenticated;
GRANT EXECUTE ON FUNCTION get_daily_analytics(TEXT, INTEGER) TO authenticated;
