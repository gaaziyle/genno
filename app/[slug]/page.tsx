"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase, BlogPost } from "@/lib/supabase";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/nextjs";
import gennoLogo from "@/app/genno-logo.png";
import Footer from "@/components/Footer";

export default function PublicBlogPage() {
  const params = useParams();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [authorInfo, setAuthorInfo] = useState<{
    first_name?: string;
    lastName?: string;
    username?: string;
    imageUrl?: string;
  } | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (params.slug) {
      fetchBlog();
    }
  }, [params.slug]);

  // Track blog visit when blog loads
  useEffect(() => {
    if (blog?.id) {
      trackBlogVisit(blog.id);
    }
  }, [blog?.id]);

  // Update document title when blog loads
  useEffect(() => {
    if (blog) {
      document.title = `${blog.title} - Genno`;
    }
  }, [blog]);

  // Fetch author information when blog loads
  useEffect(() => {
    if (blog?.clerk_user_id) {
      console.log("Blog loaded, fetching author info for:", blog.clerk_user_id);
      fetchAuthorInfo(blog.clerk_user_id);
    } else if (blog) {
      console.log("Blog loaded but no clerk_user_id found");
      // Set fallback author info if no clerk_user_id
      setAuthorInfo({
        first_name: "Anonymous",
        lastName: "Author",
        username: "anonymous",
        imageUrl: undefined,
      });
    }
  }, [blog]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      // Fetch published blog by slug
      // Note: is_publish might be TEXT or BOOLEAN depending on your schema
      const { data, error } = await supabase
        .from("blogs")
        .select("*")
        .eq("slug", params.slug)
        .single();

      // Filter for published blogs (handle both boolean and text types)
      if (data && !error) {
        const isPublished =
          data.is_publish === true ||
          data.is_publish === "true" ||
          data.is_publish === "yes" ||
          data.is_publish === "1";

        if (!isPublished) {
          // Blog exists but not published
          console.log("Blog found but not published");
          setBlog(null);
          setLoading(false);
          return;
        }
      }

      if (error) {
        console.error("Error fetching blog:", error);
        console.error("Error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        console.error("Looking for slug:", params.slug);
        setBlog(null);
      } else {
        console.log("Blog found:", data?.title);
        console.log("Blog clerk_user_id:", data?.clerk_user_id);
        console.log("Blog user_id:", data?.user_id);
        setBlog(data);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      setBlog(null);
    } finally {
      setLoading(false);
    }
  };

  const trackBlogVisit = async (blogId: string) => {
    try {
      console.log("Tracking blog visit for:", blogId);
      const response = await fetch("/api/analytics/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ blogId }),
      });

      console.log("Response status:", response.status);
      console.log(
        "Response content-type:",
        response.headers.get("content-type")
      );

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("❌ API returned non-JSON response!");
        console.error("Status:", response.status);
        console.error("Response preview:", text.substring(0, 500));
        console.error(
          "This usually means there's a server error. Check the terminal where 'pnpm dev' is running."
        );
        return;
      }

      const result = await response.json();
      console.log("Analytics tracking result:", result);

      if (!response.ok) {
        console.error("❌ Analytics tracking failed!");
        console.error("Error:", result.error);
        if (result.details) {
          console.error("Details:", result.details);
        }
        if (result.code) {
          console.error("Code:", result.code);
        }
        if (result.hint) {
          console.error("Hint:", result.hint);
        }
        if (result.missing) {
          console.error("Missing env vars:", result.missing);
        }
      } else {
        console.log("✅ Analytics tracked successfully");
      }
    } catch (error) {
      console.error("Failed to track blog visit:", error);
    }
  };

  const fetchAuthorInfo = async (clerkUserId: string) => {
    try {
      console.log("Fetching author info for clerk_user_id:", clerkUserId);

      // Try to get user info from Supabase profiles table
      // Use maybeSingle() instead of single() to avoid errors when no profile exists
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name, username, profile_image_url, email")
        .eq("clerk_user_id", clerkUserId)
        .maybeSingle();

      console.log("Profile query result:", { profileData, profileError });

      // Handle database errors (like table doesn't exist)
      if (profileError) {
        console.error("Profile query error details:", {
          message: profileError.message,
          code: profileError.code,
          details: profileError.details,
          hint: profileError.hint,
          fullError: profileError,
        });

        if (
          profileError.message?.includes("relation") ||
          profileError.message?.includes("does not exist")
        ) {
          console.log("Profiles table might not exist, using fallback");
        }
      }

      // If we found a profile, use it
      if (profileData && !profileError) {
        console.log("Found author profile:", profileData);
        setAuthorInfo({
          first_name: profileData.first_name || null,
          lastName: profileData.last_name || null,
          username: profileData.username || null,
          imageUrl: profileData.profile_image_url || null,
        });
        return;
      }

      // If no profile found (profileData is null), that's normal - use fallback
      console.log("No profile found for this user, using fallback");

      // Fallback: Create a default author info if no profile found
      setAuthorInfo({
        first_name: "Anonymous",
        lastName: "Author",
        username: "anonymous",
        imageUrl: undefined,
      });
    } catch (error) {
      console.error("Error fetching author info:", error);
      // Fallback author info
      setAuthorInfo({
        first_name: "Anonymous",
        lastName: "Author",
        username: "anonymous",
        imageUrl: undefined,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-white/20 border-t-[#8952e0] rounded-full animate-spin"></div>
          <p className="mt-4 text-[13px] text-white/64">Loading...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-3xl font-bold text-white/92 mb-4">
            Blog not found
          </h1>
          <p className="text-[16px] text-white/64 mb-8">
            The blog you're looking for doesn't exist or hasn't been published
            yet.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white text-[14px] font-semibold transition-colors"
          >
            ← Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="w-full h-16 align-center flex items-center justify-center sticky top-0 z-50 backdrop-blur-xl bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img
              src={gennoLogo.src}
              alt="Genno"
              className="w-12 h-12 rounded-md"
            />
            <span className="text-xl bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent font-semibold">
              Genno
            </span>
          </Link>

          {/* Authentication Buttons */}
          {mounted && (
            <div className="flex items-center gap-4">
              <SignedOut>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 rounded-lg text-white font-medium transition-all text-sm"
                >
                  Sign up
                </Link>
              </SignedOut>

              <SignedIn>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/convert"
                  className="px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 hover:from-orange-500 hover:to-orange-700 rounded-lg text-white font-medium transition-all text-sm flex items-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  New Blog Post
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "bg-[#1d2025]",
                      userButtonPopoverActionButton:
                        "text-white/92 hover:bg-white/4",
                      userButtonPopoverActionButtonText: "text-white/92",
                    },
                  }}
                />
              </SignedIn>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <article>
          {/* Thumbnail */}
          {blog.thumbnail_url && (
            <img
              src={blog.thumbnail_url}
              alt={blog.title}
              className="w-full h-96 object-cover rounded-lg mb-8 shadow-2xl"
            />
          )}

          {/* Title */}
          <h1 className="text-5xl font-bold text-white/95 mb-4 leading-tight">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex flex-col gap-4 text-[14px] text-white/60 mb-8 pb-8 border-b border-gray-400/30">
            {/* Author Info */}
            {authorInfo && (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  {authorInfo.imageUrl ? (
                    <img
                      src={authorInfo.imageUrl}
                      alt={`${authorInfo.first_name} ${authorInfo.lastName}`}
                      className="w-10 h-10 rounded-full object-cover border-2 border-white/10"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-semibold text-sm">
                      {authorInfo.first_name?.charAt(0) || "A"}
                    </div>
                  )}
                  <div>
                    <p className="text-white/90 font-medium">
                      {authorInfo.first_name
                        ? authorInfo.first_name
                        : "Anonymous Author"}
                    </p>
                    <p className="text-white/50 text-xs">Author</p>
                  </div>
                </div>
              </div>
            )}

            {/* Date and Video Link */}
            <div className="flex items-center gap-4">
              <time dateTime={blog.created_at}>
                {new Date(blog.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>

              {blog.youtube_url && (
                <>
                  <span>•</span>
                  <a
                    href={blog.youtube_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 hover:text-white/90 transition-colors"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    Watch Original Video
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Excerpt */}
          {blog.excerpt && (
            <div className="text-xl text-white/75 italic mb-10 leading-relaxed">
              {blog.excerpt}
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-lg prose-invert max-w-none"
            style={{
              color: "rgba(255, 255, 255, 0.88)",
              fontSize: "18px",
              lineHeight: "1.8",
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: blog.content }}
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-gray-400/30">
              <h3 className="text-[14px] text-white/60 font-medium mb-4">
                Tagged with:
              </h3>
              <div className="flex flex-wrap gap-3">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-white/5 hover:bg-white/8 rounded-lg text-[14px] text-white/70 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* Footer CTA */}
        <div className="mt-16 pt-8 border-t border-gray-400/30 text-center">
          <p className="text-white/60 mb-4">
            Enjoyed this blog? Check out more content.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white text-[14px] font-semibold transition-colors"
          >
            View All Blogs
          </Link>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
