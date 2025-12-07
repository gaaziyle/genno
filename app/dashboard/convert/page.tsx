"use client";

import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useCredits } from "@/hooks/useCredits";

export default function ConvertPage() {
  const { user } = useUser();
  const { credits, planType, hasCredits, loading: creditsLoading, refetch: refetchCredits, deductCredit } = useCredits();
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      // Check if user has credits
      if (!hasCredits) {
        throw new Error(
          "You don't have enough credits to convert a video. Please upgrade your plan."
        );
      }

      // Validate URL
      if (!url.trim()) {
        throw new Error("Please enter a YouTube URL");
      }

      // Basic YouTube URL validation
      const youtubeRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
      if (!youtubeRegex.test(url)) {
        throw new Error("Please enter a valid YouTube URL");
      }

      // Get user email from Clerk
      const userEmail = user?.primaryEmailAddress?.emailAddress;
      if (!userEmail) {
        throw new Error(
          "Unable to get your email address. Please try logging out and back in."
        );
      }

      // Check if user has credits
      if (!hasCredits) {
        throw new Error(
          "You don't have enough credits. Please upgrade your plan to continue."
        );
      }

      // Get clerk_user_id from profiles table
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("clerk_user_id")
        .eq("email", userEmail)
        .single();

      if (profileError || !profile) {
        throw new Error(
          "Unable to find your profile. Please ensure you're properly registered."
        );
      }

      // Deduct 1 credit before sending the request
      try {
        await deductCredit(1, "YouTube to blog conversion");
      } catch (creditError: any) {
        throw new Error(
          creditError.message || "Failed to deduct credit. Please try again."
        );
      }

      // Send request directly to webhook
      const response = await fetch(
        "https://nn.farabiulder.com/webhook/youtube-to-blog",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            youtubeUrl: url.trim(),
            clerk_user_id: profile.clerk_user_id,
            timestamp: new Date().toISOString(),
            userId: user?.id,
          }),
        }
      );

      if (!response.ok) {
        // If webhook fails, we should ideally restore the credit
        // For now, just show an error
        throw new Error(
          `Failed to send request: ${response.status} ${response.statusText}`
        );
      }

      // Refetch credits to update UI
      await refetchCredits();

      // If we get here, the request was successful
      setSuccess(true);
      setUrl(""); // Clear the form

      // Show success message
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-white/92 mb-2">
                Submit Video for Processing
              </h1>
              <p className="text-[14px] text-white/64">
                Paste a YouTube URL to send for processing
              </p>
            </div>
            {!creditsLoading && (
              <div className="text-right">
                <p className="text-[13px] text-white/64 mb-1">
                  Credits remaining
                </p>
                <p className="text-xl font-semibold text-white/92">
                  {credits}
                </p>
                <p className="text-[11px] text-white/40 mt-1">
                  {planType.charAt(0).toUpperCase() + planType.slice(1)} Plan
                </p>
              </div>
            )}
          </div>

          {/* No Credits Warning */}
          {!creditsLoading && !hasCredits && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-md">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-red-400 flex-shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div>
                    <p className="text-[13px] font-medium text-red-400">
                      No credits remaining
                    </p>
                    <p className="text-[12px] text-white/64">
                      You need credits to convert YouTube videos to blog posts.
                    </p>
                  </div>
                </div>
                <Link
                  href="/pricing"
                  className="px-4 py-2 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white text-[13px] font-semibold transition-colors"
                >
                  Upgrade Plan
                </Link>
              </div>
            </div>
          )}

          {/* Low Credits Warning (1-2 credits left) */}
          {!creditsLoading &&
            hasCredits &&
            credits > 0 &&
            credits <= 2 && (
              <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-5 h-5 text-yellow-400 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <p className="text-[13px] font-medium text-yellow-400">
                        Running low on credits
                      </p>
                      <p className="text-[12px] text-white/64">
                        You have {credits} credit
                        {credits !== 1 ? "s" : ""} remaining.
                      </p>
                    </div>
                  </div>
                  <Link
                    href="/pricing"
                    className="px-4 py-2 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white text-[13px] font-semibold transition-colors"
                  >
                    Get More Credits
                  </Link>
                </div>
              </div>
            )}
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-[#0ea371]/10 border border-[#0ea371]/20 rounded-md">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-[#0ea371] flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-[13px] font-medium text-[#0ea371]">
                  Request sent successfully!
                </p>
                <p className="text-[12px] text-white/64">
                  Your request has been sent to our processing system.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-md">
            <div className="flex items-center gap-3">
              <svg
                className="w-5 h-5 text-red-400 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p className="text-[13px] font-medium text-red-400">Error</p>
                <p className="text-[12px] text-white/64">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Submit Form */}
        <div className="bg-[#1d2025] border border-gray-400/50 rounded-md p-6 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="url"
                className="block text-[13px] font-medium text-white/92 mb-2"
              >
                YouTube URL
              </label>
              <input
                type="url"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full px-4 py-2.5 bg-[#171a1d] border border-gray-400/50 rounded-md text-[13px] text-white/92 placeholder-white/40 focus:outline-none focus:border-[#8952e0] transition-colors"
                required
              />
            </div>

            <div className="bg-[#e47c23]/5 border border-[#e47c23]/20 rounded-md p-4">
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-[#e47c23] flex-shrink-0 mt-0.5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
                <div className="text-[13px] text-white/92">
                  <p className="font-medium mb-2">What happens next?</p>
                  <ul className="space-y-1 text-white/64">
                    <li>• We extract the video transcript</li>
                    <li>• AI analyzes and structures the content</li>
                    <li>• You get a ready-to-publish blog post</li>
                  </ul>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={
                loading ||
                creditsLoading ||
                !hasCredits
              }
              className="w-full px-6 py-2.5 bg-[#e47c23] hover:bg-[#aa5e1b] disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-white text-[13px] font-semibold transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Creating...
                </span>
              ) : creditsLoading ? (
                "Loading..."
              ) : !hasCredits ? (
                "No Credits Available"
              ) : (
                `Create Blog (${credits} credit${
                  credits !== 1 ? "s" : ""
                } left)`
              )}
            </button>
          </form>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-[#8952e0]/10 rounded-md flex items-center justify-center mx-auto mb-3">
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3 className="text-white/92 font-semibold mb-2 text-[14px]">
              Fast Processing
            </h3>
            <p className="text-white/64 text-[13px]">
              Get your blog post in minutes
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-[#0ea371]/10 rounded-md flex items-center justify-center mx-auto mb-3">
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
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <h3 className="text-white/92 font-semibold mb-2 text-[14px]">
              AI-Powered
            </h3>
            <p className="text-white/64 text-[13px]">
              Advanced AI ensures quality
            </p>
          </div>

          <div className="text-center">
            <div className="w-12 h-12 bg-[#9fe3cd]/10 rounded-md flex items-center justify-center mx-auto mb-3">
              <svg
                className="w-6 h-6 text-[#9fe3cd]"
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
            </div>
            <h3 className="text-white/92 font-semibold mb-2 text-[14px]">
              Easy Editing
            </h3>
            <p className="text-white/64 text-[13px]">
              Customize before publishing
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
