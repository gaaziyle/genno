// Supabase Edge Function for Paddle Webhook
// Deploy this to Supabase Edge Functions

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PaddleWebhookData {
  event_type: string;
  data: any;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse webhook payload
    const payload: PaddleWebhookData = await req.json();
    const { event_type, data } = payload;

    console.log("Paddle webhook received:", event_type);

    // Handle different event types
    switch (event_type) {
      case "subscription.created":
        await handleSubscriptionCreated(supabase, data);
        break;

      case "subscription.updated":
        await handleSubscriptionUpdated(supabase, data);
        break;

      case "subscription.canceled":
        await handleSubscriptionCanceled(supabase, data);
        break;

      case "subscription.activated":
        await handleSubscriptionActivated(supabase, data);
        break;

      case "subscription.past_due":
        await handleSubscriptionPastDue(supabase, data);
        break;

      case "subscription.paused":
        await handleSubscriptionPaused(supabase, data);
        break;

      default:
        console.log("Unhandled event type:", event_type);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Webhook error:", error);
    return new Response(
      JSON.stringify({ error: "Webhook handler failed", details: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

async function handleSubscriptionCreated(supabase: any, data: any) {
  const clerkUserId = data.custom_data?.clerkUserId;
  const planType = data.custom_data?.planType || "starter";
  const billingCycle = data.custom_data?.billingCycle || "monthly";

  if (!clerkUserId) {
    console.error("No clerk user ID in subscription data");
    return;
  }

  console.log("Creating subscription for user:", clerkUserId);

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
    throw subError;
  }

  // Update user credits based on plan
  const credits = planType === "starter" ? 100 : planType === "team" ? 500 : 3;

  const { error: creditsError } = await supabase
    .from("user_credits")
    .update({
      plan_type: planType,
      credits: credits,
      last_credit_reset: new Date().toISOString(),
    })
    .eq("clerk_user_id", clerkUserId);

  if (creditsError) {
    console.error("Error updating credits:", creditsError);
    throw creditsError;
  }

  // Log credit transaction
  await supabase.from("credit_transactions").insert({
    clerk_user_id: clerkUserId,
    transaction_type: "reset",
    amount: credits,
    balance_after: credits,
    reason: `Subscription created: ${planType} plan`,
  });

  console.log("Subscription created successfully for user:", clerkUserId);
}

async function handleSubscriptionUpdated(supabase: any, data: any) {
  console.log("Updating subscription:", data.id);

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
    throw error;
  }

  console.log("Subscription updated successfully");
}

async function handleSubscriptionCanceled(supabase: any, data: any) {
  const clerkUserId = data.custom_data?.clerkUserId;

  console.log("Canceling subscription:", data.id);

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
    throw subError;
  }

  // Revert to free plan
  if (clerkUserId) {
    const { error: creditsError } = await supabase
      .from("user_credits")
      .update({
        plan_type: "free",
        credits: 3,
        last_credit_reset: new Date().toISOString(),
      })
      .eq("clerk_user_id", clerkUserId);

    if (creditsError) {
      console.error("Error reverting to free plan:", creditsError);
      throw creditsError;
    }

    // Log credit transaction
    await supabase.from("credit_transactions").insert({
      clerk_user_id: clerkUserId,
      transaction_type: "reset",
      amount: 3,
      balance_after: 3,
      reason: "Subscription canceled: reverted to free plan",
    });
  }

  console.log("Subscription canceled successfully");
}

async function handleSubscriptionActivated(supabase: any, data: any) {
  console.log("Activating subscription:", data.id);

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "active",
      metadata: data,
    })
    .eq("paddle_subscription_id", data.id);

  if (error) {
    console.error("Error activating subscription:", error);
    throw error;
  }

  console.log("Subscription activated successfully");
}

async function handleSubscriptionPastDue(supabase: any, data: any) {
  console.log("Marking subscription past due:", data.id);

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "past_due",
      metadata: data,
    })
    .eq("paddle_subscription_id", data.id);

  if (error) {
    console.error("Error marking subscription past due:", error);
    throw error;
  }

  console.log("Subscription marked past due successfully");
}

async function handleSubscriptionPaused(supabase: any, data: any) {
  console.log("Pausing subscription:", data.id);

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "paused",
      metadata: data,
    })
    .eq("paddle_subscription_id", data.id);

  if (error) {
    console.error("Error pausing subscription:", error);
    throw error;
  }

  console.log("Subscription paused successfully");
}
