import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { amount = 1, reason = "Blog creation", blogId = null } = body;

    // Call the deduct_credit function
    const { data, error } = await supabase.rpc("deduct_credit", {
      p_clerk_user_id: userId,
      p_amount: amount,
      p_reason: reason,
      p_blog_id: blogId,
    });

    if (error) {
      console.error("Error deducting credits:", error);
      return NextResponse.json(
        { error: "Failed to deduct credits" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Insufficient credits", success: false },
        { status: 400 }
      );
    }

    // Get updated credits
    const { data: creditsData } = await supabase
      .from("user_credits")
      .select("credits, plan_type")
      .eq("clerk_user_id", userId)
      .single();

    return NextResponse.json({
      success: true,
      credits: creditsData?.credits || 0,
      planType: creditsData?.plan_type || "free",
    });
  } catch (error) {
    console.error("Error in credits deduction:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
