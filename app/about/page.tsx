"use client";

import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <header className="border-b border-gray-400/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#8952e0] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <span className="text-white/92 font-semibold text-lg">Genno</span>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-white/64 hover:text-white/92 transition-colors text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white text-sm font-semibold transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white/92 mb-6">
            About Genno
          </h1>
          <p className="text-xl text-white/64 max-w-3xl mx-auto leading-relaxed">
            We're on a mission to revolutionize content creation by making it easier than ever to transform video content into engaging, SEO-optimized blog posts using the power of artificial intelligence.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-8">
            <div className="w-12 h-12 bg-[#8952e0]/20 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#8952e0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">Our Mission</h2>
            <p className="text-white/80 leading-relaxed">
              To democratize content creation by providing creators, marketers, and businesses with AI-powered tools that transform their existing video content into multiple formats, helping them reach wider audiences and maximize their content's impact.
            </p>
          </div>

          <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-8">
            <div className="w-12 h-12 bg-[#0ea371]/20 rounded-lg flex items-center justify-center mb-6">
              <svg className="w-6 h-6 text-[#0ea371]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-white/92 mb-4">Our Vision</h2>
            <p className="text-white/80 leading-relaxed">
              A world where content creators can effortlessly repurpose their video content across multiple platforms, breaking down barriers between different content formats and maximizing the reach and impact of every piece of content they create.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-white/92 mb-6 text-center">Our Story</h2>
          <div className="max-w-4xl mx-auto space-y-6 text-white/80 leading-relaxed">
            <p>
              Genno was born from a simple observation: content creators were spending countless hours manually converting their video content into blog posts, often struggling with transcription accuracy, formatting, and SEO optimization.
            </p>
            <p>
              Our founders, experienced in both content creation and AI technology, recognized that artificial intelligence could solve this problem elegantly. They envisioned a tool that wouldn't just transcribe videos, but would intelligently transform them into well-structured, engaging blog posts that maintain the creator's voice and style.
            </p>
            <p>
              Today, Genno serves thousands of content creators, from individual YouTubers to large marketing teams, helping them maximize their content's reach and impact across multiple platforms. We're constantly innovating to make content repurposing faster, smarter, and more effective.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white/92 mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#8952e0]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#8952e0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white/92 mb-2">Innovation</h3>
              <p className="text-white/64">
                We continuously push the boundaries of AI technology to create better, more intuitive content creation tools.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#0ea371]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#0ea371]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white/92 mb-2">User-Centric</h3>
              <p className="text-white/64">
                Every feature we build is designed with our users' needs and feedback at the center of our decision-making process.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#e47c23]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-[#e47c23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white/92 mb-2">Quality</h3>
              <p className="text-white/64">
                We maintain the highest standards in our AI models, ensuring accurate, high-quality content generation every time.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white/92 mb-8 text-center">Meet the Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#8952e0] to-[#7543c9] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">JD</span>
              </div>
              <h3 className="text-lg font-semibold text-white/92 mb-1">John Doe</h3>
              <p className="text-[#8952e0] text-sm mb-3">CEO & Co-Founder</p>
              <p className="text-white/64 text-sm">
                Former AI researcher with 10+ years in machine learning and natural language processing.
              </p>
            </div>

            <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#0ea371] to-[#0c8a5f] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">JS</span>
              </div>
              <h3 className="text-lg font-semibold text-white/92 mb-1">Jane Smith</h3>
              <p className="text-[#0ea371] text-sm mb-3">CTO & Co-Founder</p>
              <p className="text-white/64 text-sm">
                Full-stack engineer and AI specialist focused on building scalable, user-friendly applications.
              </p>
            </div>

            <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-6 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-[#e47c23] to-[#d66d1f] rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold text-xl">MB</span>
              </div>
              <h3 className="text-lg font-semibold text-white/92 mb-1">Mike Brown</h3>
              <p className="text-[#e47c23] text-sm mb-3">Head of Product</p>
              <p className="text-white/64 text-sm">
                Product strategist with deep experience in content creation tools and user experience design.
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-[#8952e0]/10 to-[#0ea371]/10 border border-[#8952e0]/20 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-white/92 mb-4">
            Join Our Journey
          </h2>
          <p className="text-xl text-white/64 mb-8 max-w-2xl mx-auto">
            Ready to transform your content creation process? Join thousands of creators who are already using Genno to maximize their content's impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white font-semibold transition-colors"
            >
              Get Started Free
            </Link>
            <Link
              href="/contact"
              className="px-8 py-3 bg-white/8 hover:bg-white/12 rounded-md text-white/92 font-semibold transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white font-semibold transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}