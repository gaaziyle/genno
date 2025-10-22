import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      console.log('No userId found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Fetching analytics for userId:', userId);
    console.log('User ID type:', typeof userId);
    console.log('User ID length:', userId?.length);

    // Helper function to generate slug from title
    const generateSlug = (title: string): string => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim()
        .substring(0, 50); // Limit length
    };

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    // Get user's blogs first - let's check both published and unpublished
    const { data: userBlogs, error: blogsError } = await supabase
      .from('blogs')
      .select('id, title, slug, clerk_user_id, is_publish, created_at')
      .eq('clerk_user_id', userId);

    console.log('All user blogs:', userBlogs);

    // Filter for published blogs
    const publishedBlogs = userBlogs?.filter(blog => 
      blog.is_publish === true || 
      blog.is_publish === 'true' || 
      blog.is_publish === 'yes' || 
      blog.is_publish === '1'
    ) || [];

    console.log('Published blogs:', publishedBlogs);

    if (blogsError) {
      console.error('Blogs error:', blogsError);
      return NextResponse.json({ error: 'Failed to fetch blogs', details: blogsError }, { status: 500 });
    }

    // Get analytics for each blog
    const blogIds = publishedBlogs.map(blog => blog.id);
    let summaryData: any[] = [];

    if (blogIds.length > 0) {
      const { data: analyticsData, error: analyticsError } = await supabase
        .from('blog_analytics')
        .select('blog_id, visitor_id, visited_at')
        .in('blog_id', blogIds);

      if (analyticsError) {
        console.error('Analytics error:', analyticsError);
      } else {
        console.log('Raw analytics data:', analyticsData);
        // Process analytics data
        const blogAnalytics = new Map();
        
        analyticsData?.forEach(visit => {
          if (!blogAnalytics.has(visit.blog_id)) {
            blogAnalytics.set(visit.blog_id, {
              unique_visitors: new Set(),
              visitors_last_7_days: new Set(),
              visitors_last_30_days: new Set(),
              last_visit: null
            });
          }
          
          const analytics = blogAnalytics.get(visit.blog_id);
          analytics.unique_visitors.add(visit.visitor_id);
          
          const visitDate = new Date(visit.visited_at);
          const now = new Date();
          const daysDiff = (now.getTime() - visitDate.getTime()) / (1000 * 60 * 60 * 24);
          
          if (daysDiff <= 7) {
            analytics.visitors_last_7_days.add(visit.visitor_id);
          }
          if (daysDiff <= 30) {
            analytics.visitors_last_30_days.add(visit.visitor_id);
          }
          
          if (!analytics.last_visit || visitDate > analytics.last_visit) {
            analytics.last_visit = visitDate;
          }
        });

        // Create summary data
        summaryData = publishedBlogs.map(blog => {
          const analytics = blogAnalytics.get(blog.id) || {
            unique_visitors: new Set(),
            visitors_last_7_days: new Set(),
            visitors_last_30_days: new Set(),
            last_visit: null
          };
          
          // Generate slug if it doesn't exist
          const slug = blog.slug || generateSlug(blog.title);
          
          return {
            blog_id: blog.id,
            title: blog.title,
            slug: slug,
            clerk_user_id: blog.clerk_user_id,
            is_publish: blog.is_publish,
            created_at: blog.created_at,
            unique_visitors: analytics.unique_visitors.size,
            visitors_last_7_days: analytics.visitors_last_7_days.size,
            visitors_last_30_days: analytics.visitors_last_30_days.size,
            last_visit: analytics.last_visit?.toISOString()
          };
        }) || [];
        
        console.log('Processed summary data:', summaryData);
      }
    }

    console.log('Final summary data:', summaryData);

    // If we have no data from direct query, try using the summary view as fallback
    if (summaryData.length === 0) {
      console.log('No data from direct query, trying summary view...');
      const { data: summaryViewData, error: summaryViewError } = await supabase
        .from('blog_analytics_summary')
        .select('*')
        .eq('clerk_user_id', userId);

      if (summaryViewError) {
        console.error('Summary view error:', summaryViewError);
      } else {
        console.log('Summary view data:', summaryViewData);
        summaryData = summaryViewData || [];
      }
    }

    // Try to get daily analytics using direct query instead of function
    const { data: dailyData, error: dailyError } = await supabase
      .from('blog_analytics')
      .select('visited_at, visitor_id')
      .in('blog_id', blogIds)
      .gte('visited_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString());

    if (dailyError) {
      console.error('Daily analytics error:', dailyError);
      // Don't fail completely, just use empty daily data
    }

    // Process daily data
    const dailyMap = new Map();
    if (dailyData) {
      dailyData.forEach(visit => {
        const date = visit.visited_at.split('T')[0];
        if (!dailyMap.has(date)) {
          dailyMap.set(date, new Set());
        }
        dailyMap.get(date).add(visit.visitor_id);
      });
    }

    const processedDailyData = Array.from(dailyMap.entries()).map(([date, visitors]) => ({
      date,
      unique_visitors: visitors.size
    })).sort((a, b) => a.date.localeCompare(b.date));

    // Calculate totals
    const totalVisitors = summaryData?.reduce((sum, blog) => sum + (blog.unique_visitors || 0), 0) || 0;
    const totalVisitorsLast7Days = summaryData?.reduce((sum, blog) => sum + (blog.visitors_last_7_days || 0), 0) || 0;
    const totalVisitorsLast30Days = summaryData?.reduce((sum, blog) => sum + (blog.visitors_last_30_days || 0), 0) || 0;

    // Calculate percentage change (simplified)
    const visitorsChange = totalVisitorsLast30Days > 0 ? 100 : 0;

    console.log('Returning analytics data:', {
      dailyDataLength: processedDailyData.length,
      summaryLength: summaryData?.length || 0,
      totalVisitors
    });

    return NextResponse.json({
      dailyData: processedDailyData,
      summary: {
        totalVisitors,
        totalVisitorsLast7Days,
        totalVisitorsLast30Days,
        visitorsChange,
        blogs: summaryData || []
      }
    });
  } catch (error) {
    console.error('Analytics API error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
