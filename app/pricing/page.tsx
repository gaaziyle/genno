"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useUser } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { initPaddle, getPricingPlans, openCheckout, type PricingPlan } from "@/lib/paddle";

export default function PricingPage() {
  const { user, isSignedIn } = useUser();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [paddleLoaded, setPaddleLoaded] = useState(false);
  const [plans, setPlans] = useState<PricingPlan[]>([]);

  // Initialize Paddle on mount
  useEffect(() => {
    const init = async () => {
      const paddle = await initPaddle();
      setPaddleLoaded(!!paddle);
      
      // Get pricing plans with correct environment
      const pricingPlans = getPricingPlans();
      setPlans(pricingPlans);
    };

    init();
  }, []);

  const handleSubscribe = async (plan: PricingPlan) => {
    console.log('🎯 Subscribe clicked for:', plan.name);

    if (plan.name === "Free") {
      window.location.href = isSignedIn ? "/dashboard" : "/sign-up";
      return;
    }

    if (!isSignedIn) {
      window.location.href = `/sign-up?redirect=/pricing&plan=${plan.name.toLowerCase()}`;
      return;
    }

    if (!paddleLoaded) {
      alert("Payment system is loading. Please try again in a moment.");
      return;
    }

    const priceId = plan.priceIds[billingCycle];
    
    if (!priceId) {
      console.error('❌ Price ID not found for', plan.name, billingCycle);
      alert(`Price ID not configured for ${plan.name} (${billingCycle}). Please contact support.`);
      return;
    }

    try {
      await openCheckout(
        priceId,
        user?.primaryEmailAddress?.emailAddress || "",
        user?.id || "",
        plan.name,
        billingCycle
      );
    } catch (error: any) {
      console.error('❌ Error opening checkout:', error);
      alert(error.message || 'Failed to open checkout. Please try again or contact support.');
    }
  };

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
      <Header />

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
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.popular
                  ? "bg-gradient-to-b from-[#8952e0]/20 to-[#8952e0]/5 border-2 border-[#8952e0] transform scale-105"
                  : "bg-[#1a1a1a] border border-gray-700"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-[#8952e0] text-white text-sm font-semibold px-4 py-2 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {plan.name}
                </h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>
                
                <div className="mb-4">
                  {plan.price[billingCycle] === 0 ? (
                    <span className="text-5xl font-bold text-white">
                      Free
                    </span>
                  ) : (
                    <>
                      <span className="text-5xl font-bold text-white">
                        ${plan.price[billingCycle]}
                      </span>
                      <span className="text-gray-400 text-lg">
                        /{billingCycle === "monthly" ? "mo" : "yr"}
                      </span>
                    </>
                  )}
                </div>
                
                <div className="text-[#8952e0] font-semibold text-lg">
                  {plan.credits} credits/month
                </div>
                
                {billingCycle === "yearly" && plan.price.monthly > 0 && (
                  <div className="mt-2">
                    <span className="text-sm text-gray-500 line-through">
  ${ (plan.price.monthly * 12).toFixed(2) }/year
</span>

                    <span className="ml-2 text-sm text-[#0ea371] font-semibold">
  Save ${((plan.price.monthly * 12) - plan.price.yearly).toFixed(2)}
</span>

                  </div>
                )}
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
              </ul>

              <button
                onClick={() => handleSubscribe(plan)}
                disabled={!paddleLoaded && plan.name !== "Free"}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                  plan.popular
                    ? "bg-[#8952e0] hover:bg-[#7543c9] text-white shadow-lg hover:shadow-xl"
                    : plan.name === "Free"
                    ? "bg-white/8 hover:bg-white/12 text-white"
                    : "bg-gray-700 hover:bg-gray-600 text-white"
                }`}
              >
                {!paddleLoaded && plan.name !== "Free" ? "Loading..." : plan.buttonText}
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
                    <td className="px-6 py-4 text-sm text-white/92">Monthly Price</td>
                    <td className="px-6 py-4 text-center text-sm text-white/64">$0</td>
                    <td className="px-6 py-4 text-center text-sm text-white/64">$29</td>
                    <td className="px-6 py-4 text-center text-sm text-white/64">$99</td>
                  </tr>
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
              href="/sign-up"
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

      <Footer />
    </div>
  );
}