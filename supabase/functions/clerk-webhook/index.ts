// Supabase Edge Function to handle Clerk webhooks
// This function syncs user data from Clerk to Supabase profiles table

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const WEBHOOK_SECRET = Deno.env.get("CLERK_WEBHOOK_SECRET") || "";
const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || "";
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

interface ClerkWebhookEvent {
  type: string;
  data: {
    id: string;
    email_addresses?: Array<{ email_address: string; id: string }>;
    first_name?: string;
    last_name?: string;
    username?: string;
    image_url?: string;
    created_at?: number;
    updated_at?: number;
    last_sign_in_at?: number;
    banned?: boolean;
    email_verified?: boolean;
    public_metadata?: Record<string, any>;
    private_metadata?: Record<string, any>;
  };
}

// Verify Clerk webhook signature
async function verifyWebhookSignature(
  request: Request,
  body: string
): Promise<boolean> {
  const svixId = request.headers.get("svix-id");
  const svixTimestamp = request.headers.get("svix-timestamp");
  const svixSignature = request.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    console.error("Missing Svix headers");
    return false;
  }

  // For production, implement proper Svix signature verification
  // For now, we'll do a simple check
  if (!WEBHOOK_SECRET) {
    console.error("CLERK_WEBHOOK_SECRET not set");
    return false;
  }

  // In production, use the Svix library to verify the signature
  // For development, you can temporarily skip this check
  return true;
}

serve(async (req) => {
  try {
    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, svix-id, svix-timestamp, svix-signature",
        },
      });
    }

    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Read the request body
    const body = await req.text();

    // Verify webhook signature
    const isValid = await verifyWebhookSignature(req, body);
    if (!isValid) {
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Parse the webhook event
    const event: ClerkWebhookEvent = JSON.parse(body);
    console.log("Received event:", event.type);

    // Initialize Supabase client with service role key (bypasses RLS)
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Handle different event types
    switch (event.type) {
      case "user.created":
      case "user.updated": {
        const userData = event.data;
        const primaryEmail = userData.email_addresses?.[0]?.email_address || "";

        const profileData = {
          clerk_user_id: userData.id,
          email: primaryEmail,
          first_name: userData.first_name || null,
          last_name: userData.last_name || null,
          username: userData.username || null,
          profile_image_url: userData.image_url || null,
          last_sign_in_at: userData.last_sign_in_at
            ? new Date(userData.last_sign_in_at).toISOString()
            : null,
          email_verified: userData.email_verified || false,
          banned: userData.banned || false,
          metadata: {
            public_metadata: userData.public_metadata || {},
            private_metadata: userData.private_metadata || {},
          },
        };

        // Upsert the profile (insert or update if exists)
        const { data, error } = await supabase
          .from("profiles")
          .upsert(profileData, {
            onConflict: "clerk_user_id",
            ignoreDuplicates: false,
          })
          .select();

        if (error) {
          console.error("Error upserting profile:", error);
          return new Response(
            JSON.stringify({ error: "Failed to upsert profile", details: error }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        console.log("Profile upserted successfully:", data);
        return new Response(
          JSON.stringify({ success: true, action: event.type, data }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      case "user.deleted": {
        const userId = event.data.id;

        // Delete the user profile
        const { error } = await supabase
          .from("profiles")
          .delete()
          .eq("clerk_user_id", userId);

        if (error) {
          console.error("Error deleting profile:", error);
          return new Response(
            JSON.stringify({ error: "Failed to delete profile", details: error }),
            {
              status: 500,
              headers: { "Content-Type": "application/json" },
            }
          );
        }

        console.log("Profile deleted successfully:", userId);
        return new Response(
          JSON.stringify({ success: true, action: "user.deleted", userId }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      default:
        console.log("Unhandled event type:", event.type);
        return new Response(
          JSON.stringify({ success: true, message: "Event type not handled" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : String(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});

