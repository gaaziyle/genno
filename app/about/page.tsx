"use client";

import Link from "next/link";

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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white/92 mb-4">
            About Genno
          </h1>
          <p className="text-xl text-white/64 max-w-2xl mx-auto">
            We&apos;re revolutionizing content creation by transforming YouTube videos into engaging blog posts with the power of AI.
          </p>
        </div>

        <div className="space-y-16">
          {/* Mission Section */}
          <section className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white/92 mb-6">Our Mission</h2>
            <p className="text-white/80 leading-relaxed text-lg">
              At Genno, we believe that great content shouldn&apos;t be limited to a single format. Our mission is to democratize content creation by making it easy for creators, marketers, and businesses to repurpose their video content into high-quality written articles that reach new audiences and improve SEO performance.
            </p>
          </section>

          {/* Story Section */}
          <section className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white/92 mb-6">Our Story</h2>
            <div className="space-y-4 text-white/80 leading-relaxed">
              <p>
                Genno was born from a simple observation: content creators were spending countless hours manually transcribing and reformatting their video content into blog posts. We saw an opportunity to leverage cutting-edge AI technology to automate this process while maintaining the quality and authenticity that audiences expect.
              </p>
              <p>
                Founded in 2024, our team combines expertise in artificial intelligence, natural language processing, and content strategy to deliver a solution that doesn&apos;t just transcribe—it transforms. We understand that each piece of content has its own voice and purpose, and our AI is designed to preserve that while optimizing for written consumption.
              </p>
            </div>
          </section>

          {/* Values Section */}
          <section className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white/92 mb-6">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-white/92">Innovation</h3>
                <p className="text-white/80">
                  We&apos;re constantly pushing the boundaries of what&apos;s possible with AI-powered content transformation.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-white/92">Quality</h3>
                <p className="text-white/80">
                  Every piece of content generated through our platform maintains the highest standards of readability and engagement.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-white/92">Accessibility</h3>
                <p className="text-white/80">
                  We believe powerful content creation tools should be accessible to creators of all sizes and technical backgrounds.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-lg font-medium text-white/92">Privacy</h3>
                <p className="text-white/80">
                  Your content is yours. We&apos;re committed to protecting your data and respecting your intellectual property.
                </p>
              </div>
            </div>
          </section>

          {/* Team Section */}
          <section className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white/92 mb-6">Our Team</h2>
            <p className="text-white/80 leading-relaxed mb-8">
              We&apos;re a diverse team of engineers, designers, and content strategists united by our passion for making content creation more efficient and accessible. Our backgrounds span AI research, software engineering, digital marketing, and content creation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#8952e0] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">AI</span>
                </div>
                <h3 className="text-lg font-medium text-white/92 mb-2">AI Research Team</h3>
                <p className="text-white/64 text-sm">
                  Developing cutting-edge algorithms for content understanding and generation.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-[#0ea371] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">ENG</span>
                </div>
                <h3 className="text-lg font-medium text-white/92 mb-2">Engineering Team</h3>
                <p className="text-white/64 text-sm">
                  Building scalable, reliable infrastructure to power your content transformation.
                </p>
              </div>
              <div className="text-center">
                <div className="w-20 h-20 bg-[#e47c23] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">UX</span>
                </div>
                <h3 className="text-lg font-medium text-white/92 mb-2">Design Team</h3>
                <p className="text-white/64 text-sm">
                  Creating intuitive experiences that make powerful AI accessible to everyone.
                </p>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="text-center bg-gradient-to-r from-[#8952e0]/10 to-[#0ea371]/10 border border-[#8952e0]/20 rounded-lg p-12">
            <h2 className="text-3xl font-bold text-white/92 mb-4">
              Ready to Transform Your Content?
            </h2>
            <p className="text-xl text-white/64 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already using Genno to expand their reach and maximize their content&apos;s impact.
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
          </section>
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