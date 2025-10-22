"use client";

import Link from "next/link";

export default function CareersPage() {
  const openPositions = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      description: "Join our AI team to develop cutting-edge algorithms for content transformation and natural language processing.",
    },
    {
      title: "Frontend Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time",
      description: "Build beautiful, responsive user interfaces that make AI-powered content creation accessible to everyone.",
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote / New York",
      type: "Full-time",
      description: "Design intuitive experiences that help creators transform their content effortlessly.",
    },
    {
      title: "Content Marketing Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Lead our content strategy and help creators discover the power of AI-driven content transformation.",
    },
  ];

  const benefits = [
    "Competitive salary and equity",
    "Comprehensive health, dental, and vision insurance",
    "Flexible work arrangements",
    "Unlimited PTO policy",
    "Professional development budget",
    "Latest tech equipment",
    "Team retreats and events",
    "Wellness stipend",
  ];

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
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white/92 mb-4">
            Join Our Team
          </h1>
          <p className="text-xl text-white/64 max-w-2xl mx-auto">
            Help us revolutionize content creation with AI. We&apos;re looking for passionate individuals who want to make a real impact.
          </p>
        </div>

        {/* Culture Section */}
        <section className="mb-16">
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white/92 mb-6">Why Work at Genno?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#8952e0]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#8952e0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white/92 mb-2">Innovation First</h3>
                <p className="text-white/64">
                  Work on cutting-edge AI technology that&apos;s shaping the future of content creation.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#0ea371]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#0ea371]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white/92 mb-2">Great Team</h3>
                <p className="text-white/64">
                  Collaborate with talented individuals who are passionate about solving real problems.
                </p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-[#e47c23]/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-[#e47c23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white/92 mb-2">Growth Focused</h3>
                <p className="text-white/64">
                  Accelerate your career with opportunities to learn, lead, and make an impact.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Open Positions */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-white/92 mb-8 text-center">Open Positions</h2>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-6 hover:border-[#8952e0]/50 transition-colors">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-white/92 mb-2">{position.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-white/64">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {position.department}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {position.location}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {position.type}
                      </span>
                    </div>
                  </div>
                  <button className="mt-4 md:mt-0 px-6 py-2 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white font-semibold transition-colors">
                    Apply Now
                  </button>
                </div>
                <p className="text-white/80">{position.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits */}
        <section className="mb-16">
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white/92 mb-6 text-center">Benefits & Perks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-[#0ea371] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-white/80">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Process */}
        <section className="mb-16">
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white/92 mb-6 text-center">Our Hiring Process</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-[#8952e0] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">1</span>
                </div>
                <h3 className="text-lg font-medium text-white/92 mb-2">Application</h3>
                <p className="text-white/64 text-sm">Submit your application and we&apos;ll review it within 48 hours.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#8952e0] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">2</span>
                </div>
                <h3 className="text-lg font-medium text-white/92 mb-2">Phone Screen</h3>
                <p className="text-white/64 text-sm">A brief call to discuss your background and interest in the role.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#8952e0] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">3</span>
                </div>
                <h3 className="text-lg font-medium text-white/92 mb-2">Technical Interview</h3>
                <p className="text-white/64 text-sm">Demonstrate your skills through practical exercises and discussions.</p>
              </div>
              <div className="text-center">
                <div className="w-12 h-12 bg-[#8952e0] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold">4</span>
                </div>
                <h3 className="text-lg font-medium text-white/92 mb-2">Team Interview</h3>
                <p className="text-white/64 text-sm">Meet the team and learn more about our culture and values.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="text-center bg-gradient-to-r from-[#8952e0]/10 to-[#0ea371]/10 border border-[#8952e0]/20 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-white/92 mb-4">
            Don&apos;t See the Right Role?
          </h2>
          <p className="text-xl text-white/64 mb-8 max-w-2xl mx-auto">
            We&apos;re always looking for talented individuals. Send us your resume and tell us how you&apos;d like to contribute to Genno&apos;s mission.
          </p>
          <Link
            href="/contact"
            className="px-8 py-3 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white font-semibold transition-colors"
          >
            Get in Touch
          </Link>
        </section>

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