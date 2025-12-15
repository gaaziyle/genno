import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user credits
    const { data, error } = await supabase
      .from("user_credits")
      .select("*")
      .eq("clerk_user_id", userId)
      .single();

    // Handle case where user doesn't have a credits record yet (PGRST116 = no rows returned)
    if (error) {
      // If no record found, return default free plan values
      if (error.code === "PGRST116") {
        return NextResponse.json({
          credits: 3,
          planType: "free",
          totalCreditsUsed: 0,
          hasCredits: true,
        });
      }

      console.error("Error fetching credits:", error);
      return NextResponse.json(
        { error: "Failed to fetch credits" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      credits: data?.credits || 0,
      planType: data?.plan_type || "free",
      totalCreditsUsed: data?.total_credits_used || 0,
      hasCredits: (data?.credits || 0) > 0,
    });
  } catch (error) {
    console.error("Error in credits check:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
