"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";

interface AnalyticsData {
  summary: {
    totalVisitors: number;
    totalVisitorsLast7Days: number;
    blogs: Array<{
      blog_id: string;
      title: string;
      slug: string;
      unique_visitors: number;
      created_at: string;
      is_publish: boolean;
    }>;
  };
}

export default function DashboardPage() {
  const { user } = useUser();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchAnalyticsData();
    }
  }, [user?.id]);

  const fetchAnalyticsData = async () => {
    try {
      const response = await fetch("/api/analytics/data?days=7");
      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data);
      } else {
        console.error("Failed to fetch analytics data");
      }
    } catch (error) {
      console.error("Error fetching analytics data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get recent blogs (last 5)
  const recentBlogs =
    analyticsData?.summary.blogs
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5) || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 7 * 86400)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white/92 mb-2">
            Welcome back, {user?.firstName || "there"}!
          </h1>
          <p className="text-[15px] text-white/64">
            Here&apos;s what&apos;s happening with your blogs today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Blogs */}
          <div className="bg-gradient-to-br from-[#8952e0]/10 to-[#8952e0]/5 border border-[#8952e0]/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#8952e0]/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#8952e0]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-white/92 mb-1">
              {loading ? "..." : analyticsData?.summary.blogs.length || 0}
            </div>
            <div className="text-[14px] text-white/64">Total Blogs</div>
          </div>

          {/* Total Visitors */}
          <div className="bg-gradient-to-br from-[#0ea371]/10 to-[#0ea371]/5 border border-[#0ea371]/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#0ea371]/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#0ea371]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-white/92 mb-1">
              {loading ? "..." : analyticsData?.summary.totalVisitors || 0}
            </div>
            <div className="text-[14px] text-white/64">Total Visitors</div>
          </div>

          {/* Last 7 Days */}
          <div className="bg-gradient-to-br from-[#e47c23]/10 to-[#e47c23]/5 border border-[#e47c23]/20 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-[#e47c23]/20 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-[#e47c23]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
            <div className="text-3xl font-bold text-white/92 mb-1">
              {loading
                ? "..."
                : analyticsData?.summary.totalVisitorsLast7Days || 0}
            </div>
            <div className="text-[14px] text-white/64">Visitors This Week</div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-400/50">
                <h2 className="text-[16px] font-semibold text-white/92">
                  Quick Actions
                </h2>
              </div>
              <div className="p-6 grid grid-cols-2 gap-4">
                <Link
                  href="/dashboard/blogs/new"
                  className="group p-6 bg-[#171a1d] border border-gray-400/50 rounded-lg hover:border-[#8952e0]/50 hover:bg-[#8952e0]/5 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-[#8952e0]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#8952e0]/20 transition-colors">
                    <svg
                      className="w-6 h-6 text-[#8952e0]"
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
                  </div>
                  <h3 className="text-[15px] font-semibold text-white/92 mb-1">
                    Create New Blog
                  </h3>
                  <p className="text-[13px] text-white/64">
                    Start writing a new blog post
                  </p>
                </Link>

                <Link
                  href="/dashboard/analytics"
                  className="group p-6 bg-[#171a1d] border border-gray-400/50 rounded-lg hover:border-[#0ea371]/50 hover:bg-[#0ea371]/5 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-[#0ea371]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#0ea371]/20 transition-colors">
                    <svg
                      className="w-6 h-6 text-[#0ea371]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-[15px] font-semibold text-white/92 mb-1">
                    View Analytics
                  </h3>
                  <p className="text-[13px] text-white/64">
                    Check your blog performance
                  </p>
                </Link>

                <Link
                  href="/dashboard/convert"
                  className="group p-6 bg-[#171a1d] border border-gray-400/50 rounded-lg hover:border-[#e47c23]/50 hover:bg-[#e47c23]/5 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-[#e47c23]/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-[#e47c23]/20 transition-colors">
                    <svg
                      className="w-6 h-6 text-[#e47c23]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-[15px] font-semibold text-white/92 mb-1">
                    Convert Video
                  </h3>
                  <p className="text-[13px] text-white/64">
                    Turn videos into blog posts
                  </p>
                </Link>

                <Link
                  href="/dashboard/blogs"
                  className="group p-6 bg-[#171a1d] border border-gray-400/50 rounded-lg hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-200"
                >
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500/20 transition-colors">
                    <svg
                      className="w-6 h-6 text-blue-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 10h16M4 14h16M4 18h16"
                      />
                    </svg>
                  </div>
                  <h3 className="text-[15px] font-semibold text-white/92 mb-1">
                    Manage Blogs
                  </h3>
                  <p className="text-[13px] text-white/64">
                    View and edit all your blogs
                  </p>
                </Link>
              </div>
            </div>

            {/* Recent Blogs */}
            <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-400/50 flex items-center justify-between">
                <h2 className="text-[16px] font-semibold text-white/92">
                  Recent Blogs
                </h2>
                <Link
                  href="/dashboard/blogs"
                  className="text-[13px] text-[#8952e0] hover:text-[#8952e0]/80 transition-colors"
                >
                  View all →
                </Link>
              </div>
              <div className="divide-y divide-gray-400/50">
                {loading ? (
                  <div className="p-8 text-center text-white/64">
                    Loading blogs...
                  </div>
                ) : recentBlogs.length === 0 ? (
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-[#8952e0]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-[#8952e0]"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-[15px] font-medium text-white/92 mb-1">
                      No blogs yet
                    </h3>
                    <p className="text-[13px] text-white/64 mb-4">
                      Create your first blog to get started
                    </p>
                    <Link
                      href="/dashboard/blogs/new"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#8952e0] hover:bg-[#8952e0]/90 rounded-md text-white text-[13px] font-medium transition-colors"
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
                      Create Blog
                    </Link>
                  </div>
                ) : (
                  recentBlogs.map((blog) => (
                    <div
                      key={blog.blog_id}
                      className="p-4 hover:bg-white/2 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/dashboard/blogs/${blog.slug}`}
                            className="text-[15px] font-medium text-white/92 hover:text-[#8952e0] transition-colors line-clamp-1"
                          >
                            {blog.title}
                          </Link>
                          <div className="flex items-center gap-3 mt-2">
                            <span className="text-[13px] text-white/64">
                              {formatDate(blog.created_at)}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                                blog.is_publish
                                  ? "bg-[#0ea371]/10 text-[#0ea371]"
                                  : "bg-yellow-500/10 text-yellow-500"
                              }`}
                            >
                              {blog.is_publish ? "Published" : "Draft"}
                            </span>
                            <span className="text-[13px] text-white/64">
                              {blog.unique_visitors} views
                            </span>
                          </div>
                        </div>
                        <Link
                          href={`/dashboard/blogs/edit/${blog.blog_id}`}
                          className="p-2 hover:bg-white/8 rounded-md transition-colors"
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
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Getting Started */}
            <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg overflow-hidden mb-8">
              <div className="px-6 py-4 border-b border-gray-400/50">
                <h2 className="text-[16px] font-semibold text-white/92">
                  Getting Started
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-[#0ea371] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-medium text-white/92 mb-1">
                      Create your first blog
                    </h3>
                    <p className="text-[13px] text-white/64">
                      Start writing your first blog post
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white/8 border border-gray-400/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] text-white/64 font-bold">
                      2
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-medium text-white/92 mb-1">
                      Publish your blog
                    </h3>
                    <p className="text-[13px] text-white/64">
                      Make your blog live for visitors
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-white/8 border border-gray-400/50 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-[11px] text-white/64 font-bold">
                      3
                    </span>
                  </div>
                  <div>
                    <h3 className="text-[14px] font-medium text-white/92 mb-1">
                      Share and track
                    </h3>
                    <p className="text-[13px] text-white/64">
                      Share your blog and track analytics
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-[#8952e0]/10 to-[#8952e0]/5 border border-[#8952e0]/20 rounded-lg p-6">
              <div className="w-12 h-12 bg-[#8952e0]/20 rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-6 h-6 text-[#8952e0]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-[15px] font-semibold text-white/92 mb-2">
                Pro Tip
              </h3>
              <p className="text-[13px] text-white/64 mb-4">
                Use the Convert Video feature to quickly turn your YouTube
                videos into blog posts with AI assistance!
              </p>
              <Link
                href="/dashboard/convert"
                className="inline-flex items-center gap-2 text-[13px] text-[#8952e0] hover:text-[#8952e0]/80 transition-colors font-medium"
              >
                Try it now
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
