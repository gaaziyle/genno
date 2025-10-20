import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  return NextResponse.json({
    environment: {
      supabaseUrl: supabaseUrl ? '✅ SET' : '❌ MISSING',
      supabaseServiceKey: supabaseServiceKey ? '✅ SET' : '❌ MISSING',
      supabaseAnonKey: supabaseAnonKey ? '✅ SET' : '❌ MISSING',
      serviceKeyLength: supabaseServiceKey?.length || 0,
      serviceKeyPreview: supabaseServiceKey 
        ? supabaseServiceKey.substring(0, 20) + '...' 
        : 'NOT SET'
    },
    nodeEnv: process.env.NODE_ENV,
    message: 'This is a diagnostic endpoint. Check if environment variables are loaded.'
  });
}

