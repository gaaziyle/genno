"use client";

import { useState } from "react";
import Link from "next/link";

interface PricingPlan {
  name: string;
  description: string;
  price: {
    monthly: number | string;
    yearly: number | string;
  };
  credits: number | string;
  features: string[];
  limitations?: string[];
  buttonText: string;
  popular: boolean;
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans: PricingPlan[] = [
    {
      name: "Starter",
      description: "Perfect for trying out Genno",
      price: {
        monthly: 0,
        yearly: 0,
      },
      credits: 5,
      features: [
        "5 videos per month",
        "Basic transcription",
        "Markdown export",
        "Community support",
      ],
      buttonText: "Get Started",
      popular: false,
    },
    {
      name: "Pro",
      description: "Best for content creators",
      price: {
        monthly: 29,
        yearly: 278, // 20% discount: 29 * 12 * 0.8 = 278.4 rounded to 278
      },
      credits: 50,
      features: [
        "50 videos per month",
        "Advanced AI transcription",
        "All export formats",
        "Priority support",
        "Custom formatting",
        "API access",
      ],
      buttonText: "Start Free Trial",
      popular: true,
    },
    {
      name: "Enterprise",
      description: "For teams and agencies",
      price: {
        monthly: "Custom",
        yearly: "Custom",
      },
      credits: "Unlimited",
      features: [
        "Unlimited videos",
        "Dedicated AI model",
        "White-label solution",
        "24/7 premium support",
        "Custom integrations",
        "SLA guarantee",
      ],
      buttonText: "Contact Sales",
      popular: false,
    },
  ];

  const faqs = [
    {
      question: "What are blog credits?",
      answer: "Blog credits are used each time you convert a YouTube video into a blog post. Each conversion uses 1 credit regardless of video length.",
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can change your plan at any time. Changes take effect immediately, and we'll prorate any billing differences.",
    },
    {
      question: "What happens if I exceed my credit limit?",
      answer: "You can purchase additional credits or upgrade to a higher plan. We'll notify you when you're approaching your limit.",
    },
    {
      question: "Is there a free trial?",
      answer: "Yes! Starter and Team plans come with a 14-day free trial. No credit card required to start.",
    },
    {
      question: "Can I cancel anytime?",
      answer: "Absolutely. You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.",
    },
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white/92 mb-4">
            Simple, transparent pricing
          </h1>
          <p className="text-xl text-white/64 mb-8 max-w-2xl mx-auto">
            Choose the perfect plan for your content creation needs. Start free and scale as you grow.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-[#1d2025] border border-gray-400/50 rounded-lg p-1">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                billingCycle === "monthly"
                  ? "bg-white/8 text-white/92"
                  : "text-white/64 hover:text-white/92"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors relative ${
                billingCycle === "yearly"
                  ? "bg-white/8 text-white/92"
                  : "text-white/64 hover:text-white/92"
              }`}
            >
              Yearly
              <span className="absolute -top-2 -right-2 bg-[#0ea371] text-white text-xs px-1.5 py-0.5 rounded-full">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "bg-gradient-to-b from-[#ff6b35]/20 to-[#ff6b35]/5 border-2 border-[#ff6b35] transform scale-105"
                  : "bg-[#1a1a1a] border border-gray-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#ff6b35] text-white text-sm font-semibold px-4 py-2 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                
                <div className="mb-6">
                  {plan.price[billingCycle] === 0 ? (
                    <span className="text-5xl font-bold text-white">
                      Free
                    </span>
                  ) : plan.price[billingCycle] === "Custom" ? (
                    <span className="text-5xl font-bold text-white">
                      Custom
                    </span>
                  ) : (
                    <>
                      <span className="text-5xl font-bold text-white">
                        ${plan.price[billingCycle]}
                      </span>
                      <span className="text-gray-400 text-lg">
                        /{billingCycle === "monthly" ? "month" : "year"}
                      </span>
                    </>
                  )}
                  {billingCycle === "yearly" && typeof plan.price.monthly === "number" && typeof plan.price.yearly === "number" && plan.price.monthly > 0 && (
                    <div className="mt-2">
                      <span className="text-sm text-gray-500 line-through">
                        ${plan.price.monthly * 12}/year
                      </span>
                      <span className="ml-2 text-sm text-[#0ea371] font-semibold">
                        Save ${(plan.price.monthly * 12) - plan.price.yearly}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-[#0ea371] flex-shrink-0 mt-0.5"
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
                    <span className="text-gray-300 text-sm">{feature}</span>
                  </li>
                ))}
                {plan.limitations?.map((limitation: string, limitIndex: number) => (
                  <li key={`limit-${limitIndex}`} className="flex items-start gap-3">
                    <svg
                      className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    <span className="text-gray-500 text-sm">{limitation}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`w-full py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-200 ${
                  plan.popular
                    ? "bg-[#ff6b35] hover:bg-[#ff6b35]/90 text-white shadow-lg hover:shadow-xl"
                    : plan.name === "Enterprise"
                    ? "bg-gray-700 hover:bg-gray-600 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white/92 text-center mb-8">
            Compare all features
          </h2>
          <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#171a1d]">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-white/92">
                      Features
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-white/92">
                      Free
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-white/92">
                      Starter
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-white/92">
                      Team
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-400/50">
                  <tr>
                    <td className="px-6 py-4 text-sm text-white/92">Blog credits per month</td>
                    <td className="px-6 py-4 text-center text-sm text-white/64">3</td>
                    <td className="px-6 py-4 text-center text-sm text-white/64">100</td>
                    <td className="px-6 py-4 text-center text-sm text-white/64">500</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-white/92">YouTube to blog conversion</td>
                    <td className="px-6 py-4 text-center">
                      <svg className="w-5 h-5 text-[#0ea371] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <svg className="w-5 h-5 text-[#0ea371] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <svg className="w-5 h-5 text-[#0ea371] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-white/92">Analytics</td>
                    <td className="px-6 py-4 text-center text-sm text-white/64">Basic</td>
                    <td className="px-6 py-4 text-center text-sm text-white/64">Advanced</td>
                    <td className="px-6 py-4 text-center text-sm text-white/64">Advanced + Reporting</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-white/92">Custom templates</td>
                    <td className="px-6 py-4 text-center">
                      <svg className="w-5 h-5 text-white/40 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <svg className="w-5 h-5 text-[#0ea371] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <svg className="w-5 h-5 text-[#0ea371] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-white/92">API access</td>
                    <td className="px-6 py-4 text-center">
                      <svg className="w-5 h-5 text-white/40 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <svg className="w-5 h-5 text-white/40 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <svg className="w-5 h-5 text-[#0ea371] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-white/92">Team collaboration</td>
                    <td className="px-6 py-4 text-center">
                      <svg className="w-5 h-5 text-white/40 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <svg className="w-5 h-5 text-white/40 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <svg className="w-5 h-5 text-[#0ea371] mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white/92 text-center mb-8">
            Frequently asked questions
          </h2>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-6"
              >
                <h3 className="text-lg font-semibold text-white/92 mb-2">
                  {faq.question}
                </h3>
                <p className="text-white/64">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-[#8952e0]/10 to-[#0ea371]/10 border border-[#8952e0]/20 rounded-lg p-12">
          <h2 className="text-3xl font-bold text-white/92 mb-4">
            Ready to get started?
          </h2>
          <p className="text-xl text-white/64 mb-8 max-w-2xl mx-auto">
            Join thousands of content creators who are already using Genno to transform their YouTube videos into engaging blog posts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-3 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white font-semibold transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/demo"
              className="px-8 py-3 bg-white/8 hover:bg-white/12 rounded-md text-white/92 font-semibold transition-colors"
            >
              Watch Demo
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-400/50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-[#8952e0] rounded-md flex items-center justify-center">
                <span className="text-white font-bold text-xs">G</span>
              </div>
              <span className="text-white/92 font-semibold">Genno</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-white/64">
              <Link href="/privacy" className="hover:text-white/92 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white/92 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="hover:text-white/92 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}