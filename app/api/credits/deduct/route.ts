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

    // First, check if user has a credits record, if not create one
    const { data: existingCredits, error: checkError } = await supabase
      .from("user_credits")
      .select("credits")
      .eq("clerk_user_id", userId)
      .single();

    // If no record exists (PGRST116 = no rows returned), create one
    if (checkError && checkError.code === "PGRST116") {
      const { error: insertError } = await supabase
        .from("user_credits")
        .insert({
          clerk_user_id: userId,
          credits: 3,
          plan_type: "free",
          total_credits_used: 0,
        });

      if (insertError) {
        console.error("Error creating user credits record:", insertError);
        return NextResponse.json(
          { error: "Failed to initialize user credits" },
          { status: 500 }
        );
      }
    } else if (checkError) {
      console.error("Error checking credits:", checkError);
      return NextResponse.json(
        { error: "Failed to check credits" },
        { status: 500 }
      );
    }

    // Check if user has enough credits before deducting
    const currentCredits = existingCredits?.credits ?? 3;
    if (currentCredits < amount) {
      return NextResponse.json(
        { error: "Insufficient credits", success: false },
        { status: 400 }
      );
    }

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
