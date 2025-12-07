"use client";

import { useUser, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import gennoLogo from "@/app/genno-logo.png";
import { useCredits } from "@/hooks/useCredits";

interface UserProfile {
  first_name?: string;
  last_name?: string;
  username?: string;
  profile_image_url?: string;
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { credits, planType, loading: creditsLoading } = useCredits();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile();
    }
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchUserProfile = async () => {
    if (!user?.id) {
      console.warn("fetchUserProfile called without user.id");
      return;
    }

    try {
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        console.error("Supabase is not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("first_name, last_name, username, profile_image_url")
        .eq("clerk_user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching user profile:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          fullError: error,
        });
        
        // Provide more context based on error type
        if (error.code === 'PGRST116') {
          console.warn(`No profile found for clerk_user_id: ${user.id}. This might be a new user.`);
        } else if (error.message?.includes('JWT')) {
          console.error("Authentication error: Invalid or expired JWT token");
        }
        return;
      }

      if (data) {
        setUserProfile(data);
      } else {
        console.warn(`No profile data returned for user: ${user.id}`);
      }
    } catch (error) {
      console.error("Unexpected error fetching user profile:", {
        error,
        errorType: typeof error,
        errorConstructor: error?.constructor?.name,
        errorMessage: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex">
      {/* Sidebar Navigation */}
      <aside className="fixed left-0 top-0 h-screen w-[280px] min-w-[220px] max-w-[320px] bg-[#171a1d] border-r border-gray-400/50 p-3 flex flex-col z-10">
        {/* Logo & User */}
        <div className="h-8 mb-4 flex items-center justify-between px-3">
          <div className="flex items-center gap-2">
            <Image
              src={gennoLogo}
              alt="Genno"
              width={24}
              height={24}
              className="rounded-md"
            />
            <span className="text-white/92 font-semibold">Genno</span>
          </div>
          {mounted && user && (
            <div className="w-6 h-6 bg-gray-600 rounded-full overflow-hidden">
              {(userProfile?.profile_image_url || user?.imageUrl) ? (
                <Image
                  src={userProfile?.profile_image_url || user?.imageUrl || ""}
                  alt={userProfile?.first_name || user?.firstName || "User"}
                  width={24}
                  height={24}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#e47c23] to-[#d66d1f]" />
              )}
            </div>
          )}
        </div>

        {/* Search */}
        <div className="mb-4 px-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search"
              className="w-full h-8 bg-[#171a1d] border border-gray-400/50 rounded-md px-8 text-[13px] text-white/64 placeholder:text-white/64 focus:outline-none focus:border-gray-400/80"
            />
            <div className="absolute left-2 top-1/2 -translate-y-1/2">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/16 px-1.5 py-0.5 rounded text-[11px] text-white/92 font-bold">
              /
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 overflow-auto">
          <div className="space-y-0.5 mb-5">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-2 py-2 rounded-md text-white/92 text-[13px] transition-colors ${
                pathname === "/dashboard"
                  ? "bg-white/4 hover:bg-white/6"
                  : "hover:bg-white/4"
              }`}
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
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Dashboard
            </Link>
            <Link
              href="/dashboard/analytics"
              className={`flex items-center gap-2 px-2 py-2 rounded-md text-white/92 text-[13px] transition-colors ${
                pathname === "/dashboard/analytics"
                  ? "bg-white/4 hover:bg-white/6"
                  : "hover:bg-white/4"
              }`}
            >
              <svg
                className="w-4 h-4 opacity-80"
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
              Analytics
            </Link>
            <Link
              href="/dashboard/convert"
              className={`flex items-center gap-2 px-2 py-2 rounded-md text-white/92 text-[13px] transition-colors ${
                pathname === "/dashboard/convert"
                  ? "bg-white/4 hover:bg-white/6"
                  : "hover:bg-white/4"
              }`}
            >
              <svg
                className="w-4 h-4 opacity-80"
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
              Convert Video
              {pathname !== "/dashboard/convert" && (
                <span className="ml-auto bg-[#e47c23] px-1.5 py-0.5 rounded text-[10px] text-white font-bold">
                  NEW
                </span>
              )}
            </Link>
            <Link
              href="/dashboard/blogs"
              className={`flex items-center gap-2 px-2 py-2 rounded-md text-white/92 text-[13px] transition-colors ${
                pathname?.startsWith("/dashboard/blogs")
                  ? "bg-white/4 hover:bg-white/6"
                  : "hover:bg-white/4"
              }`}
            >
              <svg
                className="w-4 h-4 opacity-80"
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
              My Blogs
            </Link>
            <Link
              href="/dashboard/subscription"
              className={`flex items-center gap-2 px-2 py-2 rounded-md text-white/92 text-[13px] transition-colors ${
                pathname === "/dashboard/subscription"
                  ? "bg-white/4 hover:bg-white/6"
                  : "hover:bg-white/4"
              }`}
            >
              <svg
                className="w-4 h-4 opacity-80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Subscription
            </Link>
          </div>

          {/* Tags Section */}
          <div className="mb-4">
            <div className="px-3 py-1 text-[13px] text-white/64 font-medium mb-1">
              Tags
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2 px-2 py-2 rounded-md text-white/92 text-[13px] hover:bg-white/4 transition-colors cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-[#e47c23]" />
                <span>Videos</span>
                <span className="ml-auto text-[11px] text-white/60">0</span>
              </div>
              <div className="flex items-center gap-2 px-2 py-2 rounded-md text-white/92 text-[13px] hover:bg-white/4 transition-colors cursor-pointer">
                <div className="w-2 h-2 rounded-full bg-[#0ea371]" />
                <span>Blogs</span>
                <span className="ml-auto text-[11px] text-white/60">0</span>
              </div>
            </div>
          </div>

          <div className="flex-1" />

          {/* Credits Display */}
          <div className="mb-3 px-2">
            <Link
              href="/dashboard/subscription"
              className="block p-3 bg-gradient-to-br from-[#8952e0]/20 to-[#8952e0]/5 border border-[#8952e0]/30 rounded-lg hover:border-[#8952e0]/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] text-white/64 font-medium uppercase tracking-wide">
                  Credits
                </span>
                <svg
                  className="w-4 h-4 text-[#8952e0]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              {creditsLoading ? (
                <div className="h-6 bg-white/10 rounded animate-pulse" />
              ) : (
                <>
                  <div className="text-2xl font-bold text-white/92 mb-1">
                    {credits}
                  </div>
                  <div className="text-[11px] text-white/64">
                    {planType.charAt(0).toUpperCase() + planType.slice(1)} Plan
                  </div>
                </>
              )}
            </Link>
          </div>

          {/* Bottom Links */}
          <div className="space-y-0.5 pt-2 border-t border-gray-400/50">
            <button className="flex items-center gap-2 w-full px-2 py-2 rounded-md text-white/64 text-[13px] hover:bg-white/4 transition-colors">
              <svg
                className="w-4 h-4 opacity-80"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              Help & support
            </button>
          </div>
        </nav>

        {/* User Profile - Bottom of Sidebar */}
        <div className="px-3 pb-3">
          <div className="pt-3 border-t border-gray-400/50">
            <div className="flex items-center gap-3 px-2 py-2 rounded-md hover:bg-white/4 transition-colors">
              {mounted ? (
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-8 h-8",
                      userButtonPopoverCard: "bg-[#1d2025]",
                      userButtonPopoverActionButton:
                        "text-white/92 hover:bg-white/4",
                      userButtonPopoverActionButtonText: "text-white/92",
                      userButtonPopoverFooter: "hidden",
                    },
                  }}
                  afterSignOutUrl="/"
                />
              ) : (
                <div className="w-8 h-8 bg-gray-600 rounded-full animate-pulse" />
              )}
              {mounted && user && (
                <div className="flex-1 overflow-hidden">
                  <div className="text-[13px] text-white/92 font-medium truncate">
                    {userProfile?.first_name && userProfile?.last_name
                      ? `${userProfile.first_name} ${userProfile.last_name}`
                      : userProfile?.username || user.firstName && user.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user.username || "User"}
                  </div>
                  <div className="text-[11px] text-white/64 truncate">
                    {user.primaryEmailAddress?.emailAddress || ""}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden ml-[280px]">
        {/* Header */}
        <header className="border-b border-gray-400/50">
          <div className="h-14 px-4 flex items-center justify-end gap-2">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/8 rounded-md transition-colors"
            >
              <svg
                className="w-4 h-4 text-white/92"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-white/8 rounded-md transition-colors"
            >
              <svg
                className="w-4 h-4 text-white/92"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
            </a>
            <Link
              href="/pricing"
              className="ml-2 px-3 py-1.5 bg-[#e47c23] hover:bg-[#d66d1f] rounded-md text-white text-[13px] font-semibold transition-colors"
            >
              Upgrade
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">{children}</div>
      </main>
    </div>
  );
}
