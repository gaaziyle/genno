import { useState, useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";

interface CreditInfo {
  credits: number;
  planType: string;
  totalCreditsUsed: number;
  hasCredits: boolean;
}

export function useCredits() {
  const { user } = useUser();
  const [creditInfo, setCreditInfo] = useState<CreditInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/credits/check");
      if (!response.ok) {
        throw new Error("Failed to fetch credits");
      }

      const data = await response.json();
      setCreditInfo(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching credits:", err);
      setError("Failed to load credits");
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const deductCredit = useCallback(
    async (amount: number = 1, reason: string = "Blog creation", blogId?: string) => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      try {
        const response = await fetch("/api/credits/deduct", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount, reason, blogId }),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to deduct credits");
        }

        // Update local state
        setCreditInfo({
          credits: data.credits,
          planType: data.planType,
          totalCreditsUsed: (creditInfo?.totalCreditsUsed || 0) + amount,
          hasCredits: data.credits > 0,
        });

        return { success: true, credits: data.credits };
      } catch (err: any) {
        console.error("Error deducting credits:", err);
        throw err;
      }
    },
    [user?.id, creditInfo]
  );

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return {
    credits: creditInfo?.credits || 0,
    planType: creditInfo?.planType || "free",
    totalCreditsUsed: creditInfo?.totalCreditsUsed || 0,
    hasCredits: creditInfo?.hasCredits || false,
    loading,
    error,
    refetch: fetchCredits,
    deductCredit,
  };
}
