// ============================================================================
// PADDLE WEBHOOK EDGE FUNCTION FOR SUPABASE
// ============================================================================
// 
// MANUAL IMPORT INSTRUCTIONS:
// 1. Go to Supabase Dashboard > Edge Functions
// 2. Click "Create a new function"
// 3. Name it: paddle-webhook
// 4. Copy and paste this entire file
// 5. Click "Deploy"
// 6. Go to function Settings and add these secrets:
//    - SUPABASE_URL: Your Supabase project URL
//    - SUPABASE_SERVICE_ROLE_KEY: Your service role key
// 7. Copy the function URL and add it to Paddle webhook settings
//
// ============================================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS headers for cross-origin requests
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("=== Paddle Webhook Received ===");
    
    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing environment variables");
      return new Response(
        JSON.stringify({ 
          error: "Server configuration error",
          message: "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY" 
        }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 500,
        }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse webhook payload
    const payload = await req.json();
    const { event_type, data } = payload;

    console.log("Event Type:", event_type);
    console.log("Subscription ID:", data?.id);

    // Route to appropriate handler based on event type
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

    console.log("=== Webhook Processed Successfully ===");

    return new Response(
      JSON.stringify({ 
        received: true, 
        event_type: event_type,
        processed_at: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("=== Webhook Error ===");
    console.error("Error:", error.message);
    console.error("Stack:", error.stack);
    
    return new Response(
      JSON.stringify({ 
        error: "Webhook handler failed", 
        message: error.message,
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});

// ============================================================================
// HANDLER FUNCTIONS
// ============================================================================

/**
 * Handle subscription.created event
 * Creates subscription record and updates user credits
 */
async function handleSubscriptionCreated(supabase: any, data: any) {
  console.log("--- Handling subscription.created ---");
  
  const clerkUserId = data.custom_data?.clerkUserId;
  const planType = data.custom_data?.planType || "starter";
  const billingCycle = data.custom_data?.billingCycle || "monthly";

  if (!clerkUserId) {
    console.error("ERROR: No clerk_user_id in custom_data");
    throw new Error("Missing clerk_user_id in webhook data");
  }

  console.log("User ID:", clerkUserId);
  console.log("Plan Type:", planType);
  console.log("Billing Cycle:", billingCycle);

  // Insert subscription record
  const subscriptionData = {
    clerk_user_id: clerkUserId,
    paddle_subscription_id: data.id,
    paddle_customer_id: data.customer_id,
    plan_type: planType,
    status: data.status,
    price_id: data.items?.[0]?.price_id,
    billing_cycle: billingCycle,
    amount: parseFloat(data.items?.[0]?.price?.unit_price?.amount || "0") / 100,
    currency: data.currency_code,
    current_period_start: data.current_billing_period?.starts_at,
    current_period_end: data.current_billing_period?.ends_at,
    trial_start: data.trial_dates?.starts_at,
    trial_end: data.trial_dates?.ends_at,
    metadata: data,
  };

  console.log("Inserting subscription...");
  const { error: subError } = await supabase
    .from("subscriptions")
    .insert(subscriptionData);

  if (subError) {
    console.error("Subscription insert error:", subError);
    throw new Error(`Failed to create subscription: ${subError.message}`);
  }

  // Determine credits based on plan
  const credits = planType === "starter" ? 100 : planType === "team" ? 500 : 3;
  console.log("Updating credits to:", credits);

  // Update user credits
  const { error: creditsError } = await supabase
    .from("user_credits")
    .update({
      plan_type: planType,
      credits: credits,
      last_credit_reset: new Date().toISOString(),
    })
    .eq("clerk_user_id", clerkUserId);

  if (creditsError) {
    console.error("Credits update error:", creditsError);
    throw new Error(`Failed to update credits: ${creditsError.message}`);
  }

  // Log credit transaction
  console.log("Logging credit transaction...");
  const { error: txError } = await supabase
    .from("credit_transactions")
    .insert({
      clerk_user_id: clerkUserId,
      transaction_type: "reset",
      amount: credits,
      balance_after: credits,
      reason: `Subscription created: ${planType} plan`,
    });

  if (txError) {
    console.error("Transaction log error:", txError);
    // Don't throw - transaction log is not critical
  }

  console.log("✓ Subscription created successfully");
}

/**
 * Handle subscription.updated event
 * Updates subscription details
 */
async function handleSubscriptionUpdated(supabase: any, data: any) {
  console.log("--- Handling subscription.updated ---");
  console.log("Subscription ID:", data.id);

  const updateData = {
    status: data.status,
    current_period_start: data.current_billing_period?.starts_at,
    current_period_end: data.current_billing_period?.ends_at,
    amount: parseFloat(data.items?.[0]?.price?.unit_price?.amount || "0") / 100,
    metadata: data,
  };

  const { error } = await supabase
    .from("subscriptions")
    .update(updateData)
    .eq("paddle_subscription_id", data.id);

  if (error) {
    console.error("Update error:", error);
    throw new Error(`Failed to update subscription: ${error.message}`);
  }

  console.log("✓ Subscription updated successfully");
}

/**
 * Handle subscription.canceled event
 * Marks subscription as canceled and reverts to free plan
 */
async function handleSubscriptionCanceled(supabase: any, data: any) {
  console.log("--- Handling subscription.canceled ---");
  console.log("Subscription ID:", data.id);

  const clerkUserId = data.custom_data?.clerkUserId;

  // Update subscription status
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
    console.error("Cancel error:", subError);
    throw new Error(`Failed to cancel subscription: ${subError.message}`);
  }

  // Revert to free plan if we have user ID
  if (clerkUserId) {
    console.log("Reverting user to free plan:", clerkUserId);
    
    const { error: creditsError } = await supabase
      .from("user_credits")
      .update({
        plan_type: "free",
        credits: 3,
        last_credit_reset: new Date().toISOString(),
      })
      .eq("clerk_user_id", clerkUserId);

    if (creditsError) {
      console.error("Credits revert error:", creditsError);
      // Don't throw - subscription is already canceled
    }

    // Log transaction
    await supabase.from("credit_transactions").insert({
      clerk_user_id: clerkUserId,
      transaction_type: "reset",
      amount: 3,
      balance_after: 3,
      reason: "Subscription canceled: reverted to free plan",
    });
  }

  console.log("✓ Subscription canceled successfully");
}

/**
 * Handle subscription.activated event
 * Activates subscription
 */
async function handleSubscriptionActivated(supabase: any, data: any) {
  console.log("--- Handling subscription.activated ---");
  console.log("Subscription ID:", data.id);

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "active",
      metadata: data,
    })
    .eq("paddle_subscription_id", data.id);

  if (error) {
    console.error("Activation error:", error);
    throw new Error(`Failed to activate subscription: ${error.message}`);
  }

  console.log("✓ Subscription activated successfully");
}

/**
 * Handle subscription.past_due event
 * Marks subscription as past due
 */
async function handleSubscriptionPastDue(supabase: any, data: any) {
  console.log("--- Handling subscription.past_due ---");
  console.log("Subscription ID:", data.id);

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "past_due",
      metadata: data,
    })
    .eq("paddle_subscription_id", data.id);

  if (error) {
    console.error("Past due error:", error);
    throw new Error(`Failed to mark subscription past due: ${error.message}`);
  }

  console.log("✓ Subscription marked past due successfully");
}

/**
 * Handle subscription.paused event
 * Pauses subscription
 */
async function handleSubscriptionPaused(supabase: any, data: any) {
  console.log("--- Handling subscription.paused ---");
  console.log("Subscription ID:", data.id);

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "paused",
      metadata: data,
    })
    .eq("paddle_subscription_id", data.id);

  if (error) {
    console.error("Pause error:", error);
    throw new Error(`Failed to pause subscription: ${error.message}`);
  }

  console.log("✓ Subscription paused successfully");
}

// ============================================================================
// END OF EDGE FUNCTION
// ============================================================================
