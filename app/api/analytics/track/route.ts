import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const { blogId } = await request.json();
    
    if (!blogId) {
      return NextResponse.json({ error: 'Blog ID is required' }, { status: 400 });
    }

    // Create a server-side Supabase client with service role key to bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase credentials');
      console.error('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'SET' : 'MISSING');
      console.error('SUPABASE_SERVICE_ROLE_KEY:', supabaseServiceKey ? 'SET' : 'MISSING');
      return NextResponse.json({ 
        error: 'Server configuration error',
        details: 'Missing environment variables. Check server logs.',
        missing: {
          url: !supabaseUrl,
          serviceKey: !supabaseServiceKey
        }
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Generate a unique visitor ID based on IP and User Agent
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    // Create a hash of IP + User Agent for unique visitor identification
    const visitorId = crypto
      .createHash('sha256')
      .update(`${ip}-${userAgent}`)
      .digest('hex')
      .substring(0, 16);

    console.log('Tracking analytics for blog:', blogId, 'visitor:', visitorId);

    // Insert analytics record (will fail silently if visitor already exists due to unique constraint)
    const { data, error } = await supabase
      .from('blog_analytics')
      .insert({
        blog_id: blogId,
        visitor_id: visitorId,
        visited_at: new Date().toISOString()
      })
      .select();

    console.log('Analytics insert result:', { data, error });

    // Don't return error if it's a duplicate visit (unique constraint violation)
    if (error && !error.message.includes('duplicate key')) {
      console.error('Analytics tracking error:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json({ 
        error: 'Failed to track visit',
        details: error.message,
        code: error.code,
        hint: error.hint
      }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Analytics API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ 
      error: 'Internal server error',
      details: errorMessage
    }, { status: 500 });
  }
}
