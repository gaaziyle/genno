"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { supabase, BlogPost } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default function BlogViewPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useUser();
  const [blog, setBlog] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && params.slug) {
      fetchBlog();
    }
  }, [user, params.slug]);

  const fetchBlog = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Check if params.slug is a UUID (for backward compatibility with old links)
      const isUUID =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          params.slug as string
        );

      // Fetch blog by slug or id, ensuring it belongs to the current user
      let query = supabase
        .from("blogs")
        .select("*")
        .eq("clerk_user_id", user.id);

      if (isUUID) {
        // If it's a UUID, try matching by ID or slug
        query = query.or(`slug.eq.${params.slug},id.eq.${params.slug}`);
      } else {
        // Otherwise, only match by slug
        query = query.eq("slug", params.slug as string);
      }

      const { data, error } = await query.single();

      if (error) {
        console.error("Error fetching blog:", error);
        setLoading(false);
        return;
      }

      setBlog(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const togglePublish = async () => {
    if (!blog) return;

    try {
      const { error } = await supabase
        .from("blogs")
        .update({ is_publish: !blog.is_publish })
        .eq("id", blog.id);

      if (error) {
        console.error("Error updating blog:", error);
        alert("Failed to update blog status");
        return;
      }

      setBlog({ ...blog, is_publish: !blog.is_publish });
      alert(
        blog.is_publish ? "Blog unpublished" : "Blog published successfully!"
      );
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update blog status");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-white/20 border-t-[#8952e0] rounded-full animate-spin"></div>
          <p className="mt-4 text-[13px] text-white/64">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-white/92 mb-2">
            Blog not found
          </h1>
          <p className="text-[14px] text-white/64 mb-6">
            The blog you&apos;re looking for doesn&apos;t exist or you
            don&apos;t have access to it.
          </p>
          <Link
            href="/dashboard/blogs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white text-[13px] font-semibold transition-colors"
          >
            ← Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Actions */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard/blogs"
            className="flex items-center gap-2 text-[13px] text-white/64 hover:text-white/92 transition-colors"
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
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blogs
          </Link>

          <div className="flex items-center gap-2">
            {blog.is_publish && blog.slug && (
              <Link
                href={`/${blog.slug}`}
                target="_blank"
                className="px-4 py-2 bg-white/8 hover:bg-white/12 rounded-md text-white text-[13px] font-semibold transition-colors flex items-center gap-2"
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
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                View Public
              </Link>
            )}
            <Link
              href={`/dashboard/blogs/edit/${blog.id}`}
              className="px-4 py-2 bg-white/8 hover:bg-white/12 rounded-md text-white text-[13px] font-semibold transition-colors flex items-center gap-2"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
              Edit
            </Link>
            <button
              onClick={togglePublish}
              className={`px-4 py-2 rounded-md text-white text-[13px] font-semibold transition-colors flex items-center gap-2 ${
                blog.is_publish
                  ? "bg-white/8 hover:bg-white/12"
                  : "bg-[#8952e0] hover:bg-[#7543c9]"
              }`}
            >
              {blog.is_publish ? (
                <>
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
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                    />
                  </svg>
                  Unpublish
                </>
              ) : (
                <>
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
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  Publish
                </>
              )}
            </button>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-6">
          <span
            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-medium ${
              blog.is_publish
                ? "bg-[#0ea371]/10 text-[#9fe3cd]"
                : "bg-white/8 text-white/64"
            }`}
          >
            <span
              className={`w-2 h-2 rounded-full ${
                blog.is_publish ? "bg-[#0ea371]" : "bg-white/40"
              }`}
            />
            {blog.is_publish ? "Published" : "Draft"}
          </span>
        </div>

        {/* Blog Content */}
        <article className="bg-[#1d2025] border border-gray-400/50 rounded-md p-8">
          {/* Thumbnail */}
          {blog.thumbnail_url && (
            <Image
              src={blog.thumbnail_url}
              alt={blog.title}
              width={800}
              height={256}
              className="w-full h-64 object-cover rounded-md mb-6"
            />
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold text-white/92 mb-4">
            {blog.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-[13px] text-white/64 mb-6 pb-6 border-b border-gray-400/50">
            <span>
              Created:{" "}
              {new Date(blog.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            {blog.youtube_url && (
              <a
                href={blog.youtube_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-white/92 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Watch Original Video
              </a>
            )}
          </div>

          {/* Excerpt */}
          {blog.excerpt && (
            <div className="text-lg text-white/80 italic mb-6 pb-6 border-b border-gray-400/50">
              {blog.excerpt}
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-invert max-w-none"
            style={{
              color: "rgba(255, 255, 255, 0.85)",
              fontSize: "16px",
              lineHeight: "1.7",
            }}
          >
            <div
              dangerouslySetInnerHTML={{ __html: blog.content }}
              style={{ whiteSpace: "pre-wrap" }}
            />
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-400/50">
              <div className="flex flex-wrap gap-2">
                {blog.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-white/8 rounded-md text-[12px] text-white/64"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        {/* URL Info */}
        {blog.slug && (
          <div className="mt-6 p-4 bg-white/4 border border-white/8 rounded-md">
            <div className="text-[12px] text-white/64 mb-1">
              {blog.is_publish ? "Public URL:" : "Will be published at:"}
            </div>
            <div className="text-[14px] text-white/92 font-mono">
              {typeof window !== "undefined" &&
                `${window.location.origin}/${blog.slug}`}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
