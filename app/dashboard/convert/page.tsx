"use client";

import { useState } from "react";

export default function ConvertPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConvert = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // TODO: Implement actual conversion logic
    setTimeout(() => {
      setLoading(false);
      alert("Conversion feature coming soon!");
    }, 2000);
  };

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white/92 mb-2">
            Convert Video to Blog
          </h1>
          <p className="text-[14px] text-white/64">
            Paste a YouTube URL to get started
          </p>
        </div>

        {/* Conversion Form */}
        <div className="bg-[#1d2025] border border-gray-400/50 rounded-md p-6 mb-8">
          <form onSubmit={handleConvert} className="space-y-6">
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

            <div className="bg-[#8952e0]/5 border border-[#8952e0]/20 rounded-md p-4">
              <div className="flex gap-3">
                <svg
                  className="w-5 h-5 text-[#8952e0] flex-shrink-0 mt-0.5"
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
              disabled={loading}
              className="w-full px-6 py-2.5 bg-[#8952e0] hover:bg-[#7543c9] disabled:opacity-50 disabled:cursor-not-allowed rounded-md text-white text-[13px] font-semibold transition-colors"
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
                  Converting...
                </span>
              ) : (
                "Convert to Blog Post"
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
