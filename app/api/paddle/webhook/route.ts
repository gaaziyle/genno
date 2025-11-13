import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const eventType = body.event_type;

    console.log("Paddle webhook received:", eventType);

    switch (eventType) {
      case "subscription.created":
        await handleSubscriptionCreated(body.data);
        break;

      case "subscription.updated":
        await handleSubscriptionUpdated(body.data);
        break;

      case "subscription.canceled":
        await handleSubscriptionCanceled(body.data);
        break;

      case "subscription.activated":
        await handleSubscriptionActivated(body.data);
        break;

      case "subscription.past_due":
        await handleSubscriptionPastDue(body.data);
        break;

      case "subscription.paused":
        await handleSubscriptionPaused(body.data);
        break;

      default:
        console.log("Unhandled event type:", eventType);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

async function handleSubscriptionCreated(data: any) {
  const clerkUserId = data.custom_data?.clerkUserId;
  const planType = data.custom_data?.planType || "starter";
  const billingCycle = data.custom_data?.billingCycle || "monthly";

  if (!clerkUserId) {
    console.error("No clerk user ID in subscription data");
    return;
  }

  // Insert subscription record
  const { error: subError } = await supabase.from("subscriptions").insert({
    clerk_user_id: clerkUserId,
    paddle_subscription_id: data.id,
    paddle_customer_id: data.customer_id,
    plan_type: planType,
    status: data.status,
    price_id: data.items[0]?.price_id,
    billing_cycle: billingCycle,
    amount: parseFloat(data.items[0]?.price?.unit_price?.amount || "0") / 100,
    currency: data.currency_code,
    current_period_start: data.current_billing_period?.starts_at,
    current_period_end: data.current_billing_period?.ends_at,
    trial_start: data.trial_dates?.starts_at,
    trial_end: data.trial_dates?.ends_at,
    metadata: data,
  });

  if (subError) {
    console.error("Error creating subscription:", subError);
    return;
  }

  // Update user credits based on plan
  const credits = planType === "starter" ? 100 : planType === "team" ? 500 : 3;

  const { error: creditsError } = await supabase
    .from("user_credits")
    .update({
      plan_type: planType,
      credits: credits,
    })
    .eq("clerk_user_id", clerkUserId);

  if (creditsError) {
    console.error("Error updating credits:", creditsError);
  }

  console.log("Subscription created successfully for user:", clerkUserId);
}

async function handleSubscriptionUpdated(data: any) {
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: data.status,
      current_period_start: data.current_billing_period?.starts_at,
      current_period_end: data.current_billing_period?.ends_at,
      amount: parseFloat(data.items[0]?.price?.unit_price?.amount || "0") / 100,
      metadata: data,
    })
    .eq("paddle_subscription_id", data.id);

  if (error) {
    console.error("Error updating subscription:", error);
  }
}

async function handleSubscriptionCanceled(data: any) {
  const clerkUserId = data.custom_data?.clerkUserId;

  const { error: subError } = await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      canceled_at: new Date().toISOString(),
      cancel_at: data.scheduled_change?.effective_at,
      metadata: data,
    })
    .eq("paddle_subscription_id", data.id);

  if (subError) {
    console.error("Error canceling subscription:", subError);
    return;
  }

  // Revert to free plan
  if (clerkUserId) {
    const { error: creditsError } = await supabase
      .from("user_credits")
      .update({
        plan_type: "free",
        credits: 3,
      })
      .eq("clerk_user_id", clerkUserId);

    if (creditsError) {
      console.error("Error reverting to free plan:", creditsError);
    }
  }
}

async function handleSubscriptionActivated(data: any) {
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "active",
      metadata: data,
    })
    .eq("paddle_subscription_id", data.id);

  if (error) {
    console.error("Error activating subscription:", error);
  }
}

async function handleSubscriptionPastDue(data: any) {
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "past_due",
      metadata: data,
    })
    .eq("paddle_subscription_id", data.id);

  if (error) {
    console.error("Error marking subscription past due:", error);
  }
}

async function handleSubscriptionPaused(data: any) {
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "paused",
      metadata: data,
    })
    .eq("paddle_subscription_id", data.id);

  if (error) {
    console.error("Error pausing subscription:", error);
  }
}
