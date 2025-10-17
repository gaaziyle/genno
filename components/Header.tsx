"use client";

import Link from "next/link";
import { useState } from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      {/* Status Banner */}
      <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-b border-purple-500/20">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-gray-300">
              Genno v1.0 beta is now available!
            </span>
            <span className="text-gray-400">
              Transform your videos into blogs with AI
            </span>
            <Link
              href="#"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Learn more →
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/60 border-b border-white/10">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2 text-xl font-bold"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">G</span>
              </div>
              <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Genno
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="#features"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Features
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-300 hover:text-white transition-colors"
              >
                How it Works
              </Link>
              <Link
                href="#pricing"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Pricing
              </Link>
              <Link
                href="#testimonials"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Testimonials
              </Link>
            </div>

            {/* Search & Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-gray-400 hover:text-white hover:border-white/20 transition-colors"
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
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <span className="text-sm">Search...</span>
                <kbd className="px-2 py-0.5 bg-white/10 rounded text-xs">/</kbd>
              </button>

              <SignedOut>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 rounded-lg text-white font-medium transition-all"
                >
                  Sign up
                </Link>
              </SignedOut>

              <SignedIn>
                <Link
                  href="/dashboard"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Dashboard
                </Link>
                <UserButton
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10",
                    },
                  }}
                />
              </SignedIn>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
