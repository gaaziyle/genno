"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface AnalyticsData {
  dailyData: Array<{
    date: string;
    unique_visitors: number;
  }>;
  summary: {
    totalVisitors: number;
    totalVisitorsLast7Days: number;
    totalVisitorsLast30Days: number;
    visitorsChange: number;
    blogs: Array<{
      blog_id: string;
      title: string;
      unique_visitors: number;
      visitors_last_7_days: number;
      visitors_last_30_days: number;
      last_visit?: string;
    }>;
  };
}

export default function AnalyticsPage() {
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
      const response = await fetch("/api/analytics/data?days=30");
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

  // Generate chart data from analytics
  const generateChartData = () => {
    if (!analyticsData) {
      // Return empty data if no analytics available
      const labels = [];
      const data = [];
      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() - (29 - i));
        labels.push(
          date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" })
        );
        data.push(0);
      }
      return { labels, data };
    }

    const labels = [];
    const data = [];
    const dailyMap = new Map();

    // Create a map of date -> visitors for quick lookup
    analyticsData.dailyData.forEach((day) => {
      dailyMap.set(day.date, day.unique_visitors);
    });

    // Generate 30 days of data
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (29 - i));
      const dateStr = date.toISOString().split("T")[0];
      labels.push(
        date.toLocaleDateString("en-GB", { day: "2-digit", month: "2-digit" })
      );
      data.push(dailyMap.get(dateStr) || 0);
    }

    return { labels, data };
  };

  const { labels, data } = generateChartData();

  // Helper function to format time ago
  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return `${Math.floor(diffInSeconds / 2592000)} months ago`;
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Unique Visitors",
        data,
        backgroundColor: "rgba(137, 82, 224, 0.8)",
        borderColor: "rgba(137, 82, 224, 1)",
        borderWidth: 0,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(29, 32, 37, 0.95)",
        titleColor: "rgba(255, 255, 255, 0.92)",
        bodyColor: "rgba(255, 255, 255, 0.92)",
        borderColor: "rgba(255, 255, 255, 0.08)",
        borderWidth: 1,
        cornerRadius: 6,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            return `${context.parsed.y} unique visitors`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.4)",
          font: {
            size: 11,
          },
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.04)",
          borderColor: "rgba(255, 255, 255, 0.08)",
        },
        ticks: {
          color: "rgba(255, 255, 255, 0.4)",
          font: {
            size: 11,
          },
          callback: function (value: any) {
            return `${value}`;
          },
        },
        border: {
          display: false,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Page Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white/92 mb-1">Analytics</h1>
          <p className="text-sm text-white/64">
            Track your blog performance and visitor insights
          </p>
        </div>

        {/* Stats Cards */}
        <div className="bg-[#1d2025] border border-gray-400/50 rounded-md overflow-hidden mb-8">
          <div className="grid grid-cols-4 divide-x divide-white/4">
            {/* Total Visitors Card */}
            <div className="p-4 border-b-2 border-[#8952e0]">
              <div className="text-[13px] text-white/64 font-medium mb-2">
                Total Visitors
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-2xl text-white/92 font-semibold">
                  {loading ? "..." : analyticsData?.summary.totalVisitors || 0}
                </div>
                {analyticsData?.summary.visitorsChange !== undefined && (
                  <div
                    className={`flex items-center gap-1 px-1 rounded-full ${
                      analyticsData.summary.visitorsChange >= 0
                        ? "bg-[#9fe3cd]/10"
                        : "bg-[#f1b8b4]/10"
                    }`}
                  >
                    <svg
                      className={`w-3 h-3 ${
                        analyticsData.summary.visitorsChange >= 0
                          ? "text-[#9fe3cd]"
                          : "text-[#f1b8b4]"
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={3}
                        d={
                          analyticsData.summary.visitorsChange >= 0
                            ? "M5 15l7-7 7 7"
                            : "M19 9l-7 7-7-7"
                        }
                      />
                    </svg>
                    <span
                      className={`text-[11px] font-bold ${
                        analyticsData.summary.visitorsChange >= 0
                          ? "text-[#9fe3cd]"
                          : "text-[#f1b8b4]"
                      }`}
                    >
                      {Math.abs(analyticsData.summary.visitorsChange)}%
                    </span>
                  </div>
                )}
              </div>
              <div className="text-[13px] text-white/64 opacity-80">
                All time unique visitors
              </div>
            </div>

            {/* Last 7 Days Card */}
            <div className="p-4 border-b border-gray-400/50">
              <div className="text-[13px] text-white/64 font-medium mb-2">
                Last 7 Days
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-2xl text-white/92 font-semibold">
                  {loading
                    ? "..."
                    : analyticsData?.summary.totalVisitorsLast7Days || 0}
                </div>
              </div>
              <div className="text-[13px] text-white/64 opacity-80">
                Unique visitors this week
              </div>
            </div>

            {/* Last 30 Days Card */}
            <div className="p-4 border-b border-gray-400/50">
              <div className="text-[13px] text-white/64 font-medium mb-2">
                Last 30 Days
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-2xl text-white/92 font-semibold">
                  {loading
                    ? "..."
                    : analyticsData?.summary.totalVisitorsLast30Days || 0}
                </div>
              </div>
              <div className="text-[13px] text-white/64 opacity-80">
                Unique visitors this month
              </div>
            </div>

            {/* Published Blogs Card */}
            <div className="p-4 border-b border-gray-400/50">
              <div className="text-[13px] text-white/64 font-medium mb-2">
                Published Blogs
              </div>
              <div className="flex items-center gap-2 mb-1">
                <div className="text-2xl text-white/92 font-semibold">
                  {loading ? "..." : analyticsData?.summary.blogs.length || 0}
                </div>
              </div>
              <div className="text-[13px] text-white/64 opacity-80">
                Total published blogs
              </div>
            </div>
          </div>

          {/* Chart.js Implementation */}
          <div className="p-8">
            <div className="h-[300px]">
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Bottom Section - Tables */}
        <div className="grid grid-cols-2 gap-8">
          {/* Top Blogs Table */}
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-400/50">
              <h3 className="text-[14px] text-white/92 font-medium">
                Top Blogs
              </h3>
            </div>
            <div className="overflow-auto">
              <table className="w-full text-[13px]">
                <thead className="bg-[#171a1d]">
                  <tr className="border-b border-gray-400/50">
                    <th className="px-4 py-3 text-left text-[12px] text-[#abadaf] font-medium">
                      Blog Title
                    </th>
                    <th className="px-4 py-3 text-right text-[12px] text-[#abadaf] font-medium">
                      Visitors
                    </th>
                    <th className="px-4 py-3 text-right text-[12px] text-[#abadaf] font-medium">
                      Last 7 Days
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-[#171a1d]">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-8 text-center text-white/64"
                      >
                        Loading analytics...
                      </td>
                    </tr>
                  ) : analyticsData?.summary.blogs.length === 0 ? (
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-8 text-center text-white/64"
                      >
                        No published blogs yet. Create your first blog to see
                        analytics!
                      </td>
                    </tr>
                  ) : (
                    analyticsData?.summary.blogs
                      .sort((a, b) => b.unique_visitors - a.unique_visitors)
                      .slice(0, 7)
                      .map((blog, i) => {
                        const maxVisitors = Math.max(
                          ...(analyticsData?.summary.blogs.map(
                            (b) => b.unique_visitors
                          ) || [1])
                        );
                        const progress =
                          maxVisitors > 0
                            ? (blog.unique_visitors / maxVisitors) * 100
                            : 0;

                        return (
                          <tr
                            key={blog.blog_id}
                            className="border-b border-gray-400/50 hover:bg-white/2"
                          >
                            <td className="px-4 py-3 text-white/92">
                              <div
                                className="max-w-[200px] truncate"
                                title={blog.title}
                              >
                                {blog.title}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-16 h-1 bg-white/16 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-[#8952e0] rounded-full"
                                    style={{ width: `${progress}%` }}
                                  />
                                </div>
                                <span className="text-white/92 w-12 text-right">
                                  {blog.unique_visitors}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right text-white/92">
                              {blog.visitors_last_7_days}
                            </td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-md overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-400/50">
              <h3 className="text-[14px] text-white/92 font-medium">
                Recent Activity
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {loading ? (
                <div className="text-center text-white/64 py-8">
                  Loading activity...
                </div>
              ) : analyticsData?.summary.blogs.length === 0 ? (
                <div className="text-center text-white/64 py-8">
                  No activity yet. Publish blogs to see visitor activity!
                </div>
              ) : (
                analyticsData?.summary.blogs
                  .filter((blog) => blog.unique_visitors > 0)
                  .sort((a, b) =>
                    (b.last_visit || "").localeCompare(a.last_visit || "")
                  )
                  .slice(0, 7)
                  .map((blog, i) => {
                    const lastVisit = blog.last_visit
                      ? new Date(blog.last_visit)
                      : null;
                    const timeAgo = lastVisit
                      ? getTimeAgo(lastVisit)
                      : "No visits yet";

                    return (
                      <div
                        key={blog.blog_id}
                        className="flex items-center gap-3"
                      >
                        <div className="relative flex items-center justify-center">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-orange-400 to-orange-600" />
                          {i < 6 && (
                            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-px h-3 bg-white/8" />
                          )}
                        </div>
                        <div className="text-[13px]">
                          <span className="text-white/92 font-medium">
                            {blog.title.length > 30
                              ? blog.title.substring(0, 30) + "..."
                              : blog.title}
                          </span>
                          <span className="text-white/64">
                            {" "}
                            had {blog.unique_visitors} visitor
                            {blog.unique_visitors !== 1 ? "s" : ""} · {timeAgo}
                          </span>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
