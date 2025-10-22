"use client";

import Link from "next/link";

export default function CareersPage() {
  const openPositions = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Remote / San Francisco",
      type: "Full-time",
      description: "Join our AI team to develop cutting-edge natural language processing models for content generation.",
      requirements: [
        "5+ years experience in machine learning",
        "Strong background in NLP and transformer models",
        "Experience with Python, TensorFlow/PyTorch",
        "PhD in Computer Science or related field preferred"
      ]
    },
    {
      title: "Full Stack Developer",
      department: "Engineering",
      location: "Remote / New York",
      type: "Full-time",
      description: "Build and maintain our web application, working on both frontend and backend systems.",
      requirements: [
        "3+ years experience with React and Node.js",
        "Experience with TypeScript and Next.js",
        "Knowledge of database design and optimization",
        "Familiarity with cloud platforms (AWS, GCP)"
      ]
    },
    {
      title: "Product Designer",
      department: "Design",
      location: "Remote / Los Angeles",
      type: "Full-time",
      description: "Design intuitive user experiences for our AI-powered content creation platform.",
      requirements: [
        "4+ years experience in product design",
        "Strong portfolio showcasing UX/UI design",
        "Experience with Figma and design systems",
        "Understanding of user research methodologies"
      ]
    },
    {
      title: "Content Marketing Manager",
      department: "Marketing",
      location: "Remote",
      type: "Full-time",
      description: "Lead our content marketing strategy and help creators discover the power of AI-assisted content creation.",
      requirements: [
        "3+ years experience in content marketing",
        "Strong writing and storytelling skills",
        "Experience with SEO and content analytics",
        "Background in creator economy preferred"
      ]
    }
  ];

  const benefits = [
    {
      icon: "💰",
      title: "Competitive Salary",
      description: "Market-rate compensation with equity options"
    },
    {
      icon: "🏥",
      title: "Health & Wellness",
      description: "Comprehensive health, dental, and vision insurance"
    },
    {
      icon: "🌍",
      title: "Remote First",
      description: "Work from anywhere with flexible hours"
    },
    {
      icon: "📚",
      title: "Learning Budget",
      description: "$2,000 annual budget for courses and conferences"
    },
    {
      icon: "🏖️",
      title: "Unlimited PTO",
      description: "Take the time you need to recharge"
    },
    {
      icon: "💻",
      title: "Equipment",
      description: "Top-tier laptop and home office setup"
    }
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
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white/92 mb-6">
            Join Our Team
          </h1>
          <p className="text-xl text-white/64 max-w-3xl mx-auto leading-relaxed">
            Help us revolutionize content creation with AI. We're looking for passionate individuals who want to make a real impact in the creator economy.
          </p>
        </div>

        {/* Culture Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white/92 mb-4">Our Culture</h2>
            <p className="text-white/80 leading-relaxed mb-6">
              At Genno, we believe in building a diverse, inclusive, and collaborative environment where everyone can do their best work. We're a remote-first company that values results over hours worked.
            </p>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-center gap-2">
                <span className="text-[#0ea371]">✓</span>
                Transparent communication and feedback
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0ea371]">✓</span>
                Continuous learning and growth
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0ea371]">✓</span>
                Work-life balance and flexibility
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#0ea371]">✓</span>
                Innovation and experimentation
              </li>
            </ul>
          </div>

          <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-8">
            <h2 className="text-2xl font-semibold text-white/92 mb-4">Why Genno?</h2>
            <p className="text-white/80 leading-relaxed mb-6">
              Join a fast-growing startup that's making a real difference in how content creators work. You'll have the opportunity to shape the future of AI-powered content creation.
            </p>
            <ul className="space-y-2 text-white/80">
              <li className="flex items-center gap-2">
                <span className="text-[#8952e0]">→</span>
                Work on cutting-edge AI technology
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8952e0]">→</span>
                Direct impact on product and company direction
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8952e0]">→</span>
                Collaborate with world-class talent
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#8952e0]">→</span>
                Competitive equity and growth opportunities
              </li>
            </ul>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white/92 mb-8 text-center">Benefits & Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-6">
                <div className="text-3xl mb-3">{benefit.icon}</div>
                <h3 className="text-lg font-semibold text-white/92 mb-2">{benefit.title}</h3>
                <p className="text-white/64 text-sm">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white/92 mb-8 text-center">Open Positions</h2>
          <div className="space-y-6">
            {openPositions.map((position, index) => (
              <div key={index} className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
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
                  <button className="mt-4 lg:mt-0 px-6 py-2 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white font-semibold transition-colors">
                    Apply Now
                  </button>
                </div>
                
                <p className="text-white/80 mb-4">{position.description}</p>
                
                <div>
                  <h4 className="text-white/92 font-medium mb-2">Requirements:</h4>
                  <ul className="space-y-1">
                    {position.requirements.map((req, reqIndex) => (
                      <li key={reqIndex} className="flex items-start gap-2 text-white/64 text-sm">
                        <span className="text-[#0ea371] mt-1">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No Open Positions Message */}
        <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-8 text-center mb-16">
          <h3 className="text-xl font-semibold text-white/92 mb-4">Don't See a Perfect Fit?</h3>
          <p className="text-white/64 mb-6">
            We're always looking for talented individuals to join our team. Send us your resume and tell us how you'd like to contribute to Genno's mission.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0ea371] hover:bg-[#0c8a5f] rounded-md text-white font-semibold transition-colors"
          >
            Get in Touch
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="text-center">
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