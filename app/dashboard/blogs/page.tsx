"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase, BlogPost } from "@/lib/supabase";
import Link from "next/link";
import Image from "next/image";

export default function BlogsPage() {
  const { user } = useUser();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "drafts">("all");

  useEffect(() => {
    if (user) {
      fetchBlogs();
    }
  }, [user, filter]);

  const fetchBlogs = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Use the Clerk user ID directly from the user object
      const clerkUserId = user.id;
      console.log("Fetching blogs for Clerk user ID:", clerkUserId);

      // Fetch blogs using the user_id column (which stores clerk_user_id)
      let query = supabase
        .from("blogs")
        .select("*")
        .eq("user_id", clerkUserId)
        .order("created_at", { ascending: false });

      if (filter === "published") {
        query = query.eq("published", true);
      } else if (filter === "drafts") {
        query = query.eq("published", false);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching blogs:", error);
        console.error("Blogs error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        console.error("Full error object:", JSON.stringify(error, null, 2));
        alert(
          `Error fetching blogs: ${
            error.message || "Unknown error"
          }. Check RLS policies in Supabase.`
        );
        return;
      }

      console.log("Fetched blogs:", data?.length || 0, "blogs found");
      setBlogs(data || []);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id: string) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const { error } = await supabase.from("blogs").delete().eq("id", id);

      if (error) {
        console.error("Error deleting blog:", error);
        alert("Failed to delete blog");
        return;
      }

      // Remove from local state
      setBlogs(blogs.filter((blog) => blog.id !== id));
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete blog");
    }
  };

  const togglePublished = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("blogs")
        .update({ is_publish: !currentStatus })
        .eq("id", id);

      if (error) {
        console.error("Error updating blog:", error);
        alert("Failed to update blog status");
        return;
      }

      // Update local state
      setBlogs(
        blogs.map((blog) =>
          blog.id === id ? { ...blog, is_publish: !currentStatus } : blog
        )
      );
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to update blog status");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const stats = {
    total: blogs.length,
    published: blogs.filter((b) => b.is_publish).length,
    drafts: blogs.filter((b) => !b.is_publish).length,
  };

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-white/92 mb-2">
              My Blogs
            </h1>
            <p className="text-[13px] text-white/64">
              Manage all your blog posts created from YouTube videos
            </p>
          </div>
          <Link
            href="/dashboard/convert"
            className="px-4 py-2 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white text-[13px] font-semibold transition-colors flex items-center gap-2"
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-md p-4">
            <div className="text-[13px] text-white/64 font-medium mb-2">
              Total Blogs
            </div>
            <div className="text-3xl text-white/92 font-semibold">
              {stats.total}
            </div>
          </div>
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-md p-4">
            <div className="text-[13px] text-white/64 font-medium mb-2">
              Published
            </div>
            <div className="text-3xl text-white/92 font-semibold">
              {stats.published}
            </div>
          </div>
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-md p-4">
            <div className="text-[13px] text-white/64 font-medium mb-2">
              Drafts
            </div>
            <div className="text-3xl text-white/92 font-semibold">
              {stats.drafts}
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-md text-[13px] font-medium transition-colors ${
              filter === "all"
                ? "bg-white/8 text-white/92"
                : "text-white/64 hover:bg-white/4"
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilter("published")}
            className={`px-4 py-2 rounded-md text-[13px] font-medium transition-colors ${
              filter === "published"
                ? "bg-white/8 text-white/92"
                : "text-white/64 hover:bg-white/4"
            }`}
          >
            Published ({stats.published})
          </button>
          <button
            onClick={() => setFilter("drafts")}
            className={`px-4 py-2 rounded-md text-[13px] font-medium transition-colors ${
              filter === "drafts"
                ? "bg-white/8 text-white/92"
                : "text-white/64 hover:bg-white/4"
            }`}
          >
            Drafts ({stats.drafts})
          </button>
        </div>

        {/* Blogs List */}
        <div className="bg-[#1d2025] border border-gray-400/50 rounded-md overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <div className="inline-block w-8 h-8 border-4 border-white/20 border-t-[#8952e0] rounded-full animate-spin"></div>
              <p className="mt-4 text-[13px] text-white/64">Loading blogs...</p>
            </div>
          ) : blogs.length === 0 ? (
            <div className="p-12 text-center">
              <svg
                className="w-16 h-16 mx-auto mb-4 text-white/20"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <h3 className="text-lg font-medium text-white/92 mb-2">
                No blogs yet
              </h3>
              <p className="text-[13px] text-white/64 mb-6">
                Start by creating your first blog post from a YouTube video
              </p>
              <Link
                href="/dashboard/convert"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white text-[13px] font-semibold transition-colors"
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
                Create New Blog
              </Link>
            </div>
          ) : (
            <div className="overflow-auto">
              <table className="w-full text-[13px]">
                <thead className="bg-[#171a1d]">
                  <tr className="border-b border-gray-400/50">
                    <th className="px-4 py-3 text-left text-[12px] text-[#abadaf] font-medium">
                      Title
                    </th>
                    <th className="px-4 py-3 text-left text-[12px] text-[#abadaf] font-medium">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-[12px] text-[#abadaf] font-medium">
                      Created
                    </th>
                    <th className="px-4 py-3 text-left text-[12px] text-[#abadaf] font-medium">
                      Tags
                    </th>
                    <th className="px-4 py-3 text-right text-[12px] text-[#abadaf] font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#171a1d]">
                  {blogs.map((blog) => (
                    <tr
                      key={blog.id}
                      className="border-b border-gray-400/50 hover:bg-white/2"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          {blog.thumbnail_url && (
                            <Image
                              src={blog.thumbnail_url}
                              alt={blog.title}
                              width={64}
                              height={40}
                              className="object-cover rounded"
                            />
                          )}
                          <div>
                            <div className="text-white/92 font-medium mb-1">
                              {blog.title}
                            </div>
                            {blog.excerpt && (
                              <div className="text-white/64 text-[12px] line-clamp-1">
                                {blog.excerpt}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-medium ${
                            blog.is_publish
                              ? "bg-[#0ea371]/10 text-[#9fe3cd]"
                              : "bg-white/8 text-white/64"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              blog.is_publish ? "bg-[#0ea371]" : "bg-white/40"
                            }`}
                          />
                          {blog.is_publish ? "Published" : "Draft"}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-white/64">
                        {formatDate(blog.created_at)}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-wrap gap-1">
                          {blog.tags && blog.tags.length > 0 ? (
                            blog.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-0.5 bg-white/8 rounded text-[11px] text-white/64"
                              >
                                {tag}
                              </span>
                            ))
                          ) : (
                            <span className="text-white/40 text-[11px]">
                              No tags
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/blogs/${blog.slug || blog.id}`}
                            className="p-1.5 hover:bg-white/8 rounded transition-colors"
                            title="View"
                          >
                            <svg
                              className="w-4 h-4 text-white/64"
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
                          </Link>
                          <Link
                            href={`/dashboard/blogs/edit/${blog.id}`}
                            className="p-1.5 hover:bg-white/8 rounded transition-colors"
                            title="Edit"
                          >
                            <svg
                              className="w-4 h-4 text-white/64"
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
                          </Link>
                          <button
                            onClick={() =>
                              togglePublished(blog.id, blog.is_publish || false)
                            }
                            className="p-1.5 hover:bg-white/8 rounded transition-colors"
                            title={blog.is_publish ? "Unpublish" : "Publish"}
                          >
                            <svg
                              className="w-4 h-4 text-white/64"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={
                                  blog.published
                                    ? "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                                    : "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                }
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteBlog(blog.id)}
                            className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
                            title="Delete"
                          >
                            <svg
                              className="w-4 h-4 text-red-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
