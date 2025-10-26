"use client";

import { useUser } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

interface SubscriptionData {
  plan: string;
  status: string;
  credits_remaining: number;
  credits_total: number;
  billing_cycle: string;
  next_billing_date: string;
  amount: number;
}

interface UserProfile {
  credits: number;
}

export default function SubscriptionPage() {
  const { user } = useUser();
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchSubscriptionData();
    }
  }, [user?.id]);

  const fetchSubscriptionData = async () => {
    if (!user?.id) return;

    try {
      // Fetch user profile with credits from Supabase
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("credits")
        .eq("clerk_user_id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching user profile:", profileError);
      } else {
        setUserProfile(profileData);
      }

      // Mock subscription data - replace with actual subscription service integration
      const mockSubscriptionData: SubscriptionData = {
        plan: "Free",
        status: "active",
        credits_remaining: profileData?.credits || 0,
        credits_total: 3, // This should come from your subscription plan configuration
        billing_cycle: "monthly",
        next_billing_date: "2024-11-26",
        amount: 0,
      };
      
      setSubscription(mockSubscriptionData);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

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
        <p className="text-white/64">Manage your subscription and billing settings</p>
      </div>

      {/* Current Plan */}
      <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white/92">Current Plan</h2>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            subscription?.status === 'active' 
              ? 'bg-green-500/20 text-green-400' 
              : 'bg-red-500/20 text-red-400'
          }`}>
            {subscription?.status === 'active' ? 'Active' : 'Inactive'}
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-white/64 text-sm mb-1">Plan</p>
            <p className="text-white/92 font-semibold text-lg">{subscription?.plan}</p>
          </div>
          
          <div>
            <p className="text-white/64 text-sm mb-1">Billing</p>
            <p className="text-white/92 font-semibold">
              ${subscription?.amount}/month
            </p>
          </div>
          
          {subscription?.plan !== 'Free' && (
            <div>
              <p className="text-white/64 text-sm mb-1">Next billing</p>
              <p className="text-white/92 font-semibold">
                {new Date(subscription?.next_billing_date || '').toLocaleDateString()}
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
              {userProfile?.credits || 0} / {subscription?.credits_total}
            </span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-[#8952e0] h-2 rounded-full transition-all duration-300"
              style={{ 
                width: `${((userProfile?.credits || 0) / (subscription?.credits_total || 1)) * 100}%` 
              }}
            ></div>
          </div>
        </div>
        
        <p className="text-white/64 text-sm">
          Credits reset on your next billing date
        </p>
      </div>

      {/* Actions */}
      <div className="bg-[#1d2025] border border-gray-400/50 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-white/92 mb-4">Manage Subscription</h2>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {subscription?.plan === 'Free' ? (
            <button
              onClick={handleUpgrade}
              className="px-6 py-3 bg-[#8952e0] hover:bg-[#7543c9] rounded-md text-white font-semibold transition-colors"
            >
              Upgrade Plan
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
            <a href="/contact" className="text-[#8952e0] hover:text-[#7543c9] transition-colors">
              Contact Support
            </a>
            <a href="/refund" className="text-[#8952e0] hover:text-[#7543c9] transition-colors">
              Refund Policy
            </a>
            <a href="/terms" className="text-[#8952e0] hover:text-[#7543c9] transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}