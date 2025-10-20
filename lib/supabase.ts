import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables are not set. Please configure them in your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our blog posts
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  youtube_url?: string;
  thumbnail_url?: string;
  user_id?: string;
  clerk_user_id?: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  is_publish?: boolean;
  slug?: string;
  tags?: string[];
}

