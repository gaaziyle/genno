"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface SubscriptionData {
  plan: string;
  status: string;
  credits_remaining: number;
  credits_total: number;
  billing_cycle: string;
  next_billing_date: string;
  amount: number;
  paddle_subscription_id?: string;
}

interface UserCredits {
  credits: number;
  plan_type: string;
  total_credits_used: number;
  last_credit_reset: string;
}

export default function SubscriptionPage() {
  const { user } = useUser();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(
    null
  );
  const [userCredits, setUserCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptionData = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Fetch user credits
      const { data: creditsData, error: creditsError } = await supabase
        .from("user_credits")
        .select("*")
        .eq("clerk_user_id", user.id)
        .single();

      if (creditsError) {
        // If user doesn't have credits record, initialize with free plan defaults
        if (creditsError.code === 'PGRST116') {
          console.log("No credits record found, using free plan defaults");
          setUserCredits({
            credits: 3,
            plan_type: 'free',
            total_credits_used: 0,
            last_credit_reset: new Date().toISOString()
          });
        } else {
          console.error("Error fetching user credits:", creditsError);
        }
      } else {
        setUserCredits(creditsData);
      }

      // Fetch subscription data
      const { data: subData, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("clerk_user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const planType = creditsData?.plan_type || "free";
      const creditsTotal =
        planType === "free" ? 3 : planType === "starter" ? 100 : 500;

      const subscriptionData: SubscriptionData = {
        plan: planType.charAt(0).toUpperCase() + planType.slice(1),
        status: subData?.status || "active",
        credits_remaining: creditsData?.credits || 0,
        credits_total: creditsTotal,
        billing_cycle: subData?.billing_cycle || "monthly",
        next_billing_date:
          subData?.current_period_end || new Date().toISOString(),
        amount: subData?.amount || 0,
        paddle_subscription_id: subData?.paddle_subscription_id,
      };

      setSubscription(subscriptionData);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    if (user?.id) {
      fetchSubscriptionData();
    }
  }, [user?.id, fetchSubscriptionData]);

  const handleUpgrade = () => {
    // Redirect to pricing page or open upgrade modal
    window.location.href = "/pricing";
  };

  const handleManageBilling = () => {
    // Redirect to billing portal (Stripe, etc.)
    console.log("Manage billing clicked");
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-32 bg-gray-700 rounded mb-4"></div>
          <div className="h-24 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white/92 mb-2">Subscription</h1>
        <p className="text-white/64">
          Manage your subscription and billing settings
        </p>
      </div>

      {/* Current Plan */}
      <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white/92">Current Plan</h2>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              subscription?.status === "active"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {subscription?.status === "active" ? "Active" : "Inactive"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-white/64 text-sm mb-1">Plan</p>
            <p className="text-white/92 font-semibold text-lg">
              {subscription?.plan}
            </p>
          </div>

          <div>
            <p className="text-white/64 text-sm mb-1">Billing</p>
            <p className="text-white/92 font-semibold">
              ${subscription?.amount}/month
            </p>
          </div>

          {subscription?.plan !== "Free" && (
            <div>
              <p className="text-white/64 text-sm mb-1">Next billing</p>
              <p className="text-white/92 font-semibold">
                {new Date(
                  subscription?.next_billing_date || ""
                ).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Usage */}
      <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-white/92 mb-4">Usage</h2>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-white/80">Credits remaining</span>
            <span className="text-white/92 font-semibold">
              {userCredits?.credits || 0} / {subscription?.credits_total}
            </span>
          </div>

          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-[#8952e0] h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((userCredits?.credits || 0) /
                    (subscription?.credits_total || 1)) *
                  100
                }%`,
              }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-400/50">
          <div>
            <p className="text-white/64 text-sm mb-1">Total Used</p>
            <p className="text-white/92 font-semibold">
              {userCredits?.total_credits_used || 0}
            </p>
          </div>
          <div>
            <p className="text-white/64 text-sm mb-1">Last Reset</p>
            <p className="text-white/92 font-semibold">
              {userCredits?.last_credit_reset
                ? new Date(userCredits.last_credit_reset).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        <p className="text-white/64 text-sm mt-4">
          Credits reset monthly on your billing date
        </p>
      </div>

      {/* Available Plans */}
      {subscription?.plan === "Free" && (
        <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold text-white/92 mb-4">
            Upgrade Your Plan
          </h2>
          <p className="text-white/64 text-sm mb-6">
            Get more credits and unlock advanced features
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Starter Plan */}
            <div className="border border-[#8952e0]/30 rounded-lg p-5 hover:border-[#8952e0]/50 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white/92">Starter</h3>
                <span className="px-2 py-1 bg-[#8952e0]/20 text-[#8952e0] text-xs font-semibold rounded">
                  POPULAR
                </span>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white/92">$29</span>
                <span className="text-white/64 text-sm">/month</span>
              </div>
              <div className="mb-4">
                <div className="text-[#8952e0] font-semibold mb-2">
                  100 credits/month
                </div>
                <ul className="space-y-2 text-sm text-white/64">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#0ea371]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Advanced AI transcription
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#0ea371]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#0ea371]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Analytics dashboard
                  </li>
                </ul>
              </div>
              <button
                onClick={handleUpgrade}
                className="w-full px-4 py-2 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white font-semibold transition-colors"
              >
                Upgrade to Starter
              </button>
            </div>

            {/* Team Plan */}
            <div className="border border-gray-400/50 rounded-lg p-5 hover:border-gray-400/70 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-white/92">Team</h3>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-white/92">$99</span>
                <span className="text-white/64 text-sm">/month</span>
              </div>
              <div className="mb-4">
                <div className="text-[#8952e0] font-semibold mb-2">
                  500 credits/month
                </div>
                <ul className="space-y-2 text-sm text-white/64">
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#0ea371]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Team collaboration
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#0ea371]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    API access
                  </li>
                  <li className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-[#0ea371]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    White-label options
                  </li>
                </ul>
              </div>
              <button
                onClick={handleUpgrade}
                className="w-full px-4 py-2 bg-white/8 hover:bg-white/12 rounded-md text-white/92 font-semibold transition-colors"
              >
                Upgrade to Team
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white/92 mb-4">
          Manage Subscription
        </h2>

        <div className="flex flex-col sm:flex-row gap-4">
          {subscription?.plan === "Free" ? (
            <button
              onClick={handleUpgrade}
              className="px-6 py-3 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white font-semibold transition-colors"
            >
              View All Plans
            </button>
          ) : (
            <>
              <button
                onClick={handleManageBilling}
                className="px-6 py-3 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white font-semibold transition-colors"
              >
                Manage Billing
              </button>
              <button
                onClick={handleUpgrade}
                className="px-6 py-3 border border-gray-400/50 hover:bg-white/4 rounded-md text-white/92 font-semibold transition-colors"
              >
                Change Plan
              </button>
            </>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-400/50">
          <p className="text-white/64 text-sm mb-2">Need help?</p>
          <div className="flex flex-col sm:flex-row gap-4 text-sm">
            <Link
              href="/contact"
              className="text-[#8952e0] hover:text-[#7543c9] transition-colors"
            >
              Contact Support
            </Link>
            <Link
              href="/refund"
              className="text-[#8952e0] hover:text-[#7543c9] transition-colors"
            >
              Refund Policy
            </Link>
            <Link
              href="/terms"
              className="text-[#8952e0] hover:text-[#7543c9] transition-colors"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
