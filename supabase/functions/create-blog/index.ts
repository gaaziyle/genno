// Supabase Edge Function: create-blog
// This receives blog data from n8n and creates a blog entry in Supabase

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get Supabase client with service role (bypasses RLS)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse request body
    const body = await req.json();
    console.log("Received blog data:", {
      title: body.title,
      clerk_user_id: body.clerk_user_id,
      youtube_url: body.youtube_url,
    });

    // Validate required fields
    if (!body.clerk_user_id) {
      throw new Error("clerk_user_id is required");
    }

    if (!body.title) {
      throw new Error("title is required");
    }

    if (!body.content) {
      throw new Error("content is required");
    }

    // Generate slug from title
    const generateSlug = (title: string): string => {
      const baseSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 100);
      
      // Add random suffix to ensure uniqueness
      const randomSuffix = Math.random().toString(36).substring(2, 10);
      return `${baseSlug}-${randomSuffix}`;
    };

    // Prepare blog data
    const blogData = {
      title: body.title,
      content: body.content,
      excerpt: body.excerpt || null,
      youtube_url: body.youtube_url || null,
      thumbnail_url: body.thumbnail_url || null,
      clerk_user_id: body.clerk_user_id,
      slug: body.slug || generateSlug(body.title),
      is_publish: false, // Default to draft
      tags: body.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    console.log("Creating blog with data:", {
      title: blogData.title,
      slug: blogData.slug,
      clerk_user_id: blogData.clerk_user_id,
    });

    // Insert blog into database
    const { data: blog, error: insertError } = await supabase
      .from("blogs")
      .insert([blogData])
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting blog:", insertError);
      throw insertError;
    }

    console.log("Blog created successfully:", {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
    });

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: "Blog created successfully",
        blog: {
          id: blog.id,
          title: blog.title,
          slug: blog.slug,
          clerk_user_id: blog.clerk_user_id,
          is_publish: blog.is_publish,
          created_at: blog.created_at,
        },
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error in create-blog function:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "An unexpected error occurred",
        details: error.toString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});

