# Clerk Webhook Setup Guide

This guide will help you set up a webhook from Clerk to Supabase to automatically sync user profile data.

## Overview

When users sign up or update their profile in Clerk, a webhook will automatically create or update their profile in your Supabase `profiles` table. This ensures your database always has the latest user information.

## Prerequisites

- Supabase project created and configured
- Clerk account and application set up
- Supabase CLI installed (for deploying edge functions)

## Step 1: Create the Profiles Table in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Click **New Query**
4. Copy the entire contents of `supabase-profiles-schema.sql`
5. Paste and click **Run**

This creates:

- `profiles` table with all necessary columns
- Indexes for performance
- Row Level Security policies
- Automatic timestamp updates
- A view for user blog statistics

## Step 2: Install Supabase CLI

If you haven't installed the Supabase CLI yet:

```bash
# Using npm
npm install -g supabase

# Using pnpm
pnpm add -g supabase

# Using Homebrew (macOS)
brew install supabase/tap/supabase
```

Verify installation:

```bash
supabase --version
```

## Step 3: Initialize Supabase in Your Project

If you haven't already initialized Supabase in your project:

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref
```

To get your project ref:

1. Go to your Supabase Dashboard
2. Click on **Project Settings**
3. Find **Reference ID** under General settings

## Step 4: Deploy the Edge Function

The edge function code is already created in `supabase/functions/clerk-webhook/`.

Deploy it to Supabase:

```bash
# Deploy the function
supabase functions deploy clerk-webhook

# Set the required secret (get this from Clerk dashboard)
supabase secrets set CLERK_WEBHOOK_SECRET=your_clerk_webhook_signing_secret
```

After deployment, you'll get a function URL like:

```
https://your-project-ref.supabase.co/functions/v1/clerk-webhook
```

**Save this URL** - you'll need it for Clerk webhook configuration.

## Step 5: Get Clerk Webhook Secret

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Select your application
3. Navigate to **Webhooks** in the sidebar
4. Click **Add Endpoint**
5. You'll see a **Signing Secret** - copy this

## Step 6: Configure the Webhook in Clerk

1. In Clerk Dashboard, go to **Webhooks**
2. Click **Add Endpoint**
3. Enter your Supabase function URL:
   ```
   https://your-project-ref.supabase.co/functions/v1/clerk-webhook
   ```
4. Select the following events to subscribe to:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
5. Click **Create**
6. Copy the **Signing Secret** from the webhook details

## Step 7: Set Environment Variables in Supabase

Set the Clerk webhook secret in Supabase:

```bash
supabase secrets set CLERK_WEBHOOK_SECRET=whsec_your_secret_here
```

Alternatively, set it in the Supabase Dashboard:

1. Go to **Project Settings** → **Edge Functions**
2. Add a new secret:
   - Name: `CLERK_WEBHOOK_SECRET`
   - Value: Your Clerk signing secret

## Step 8: Test the Webhook

### Option 1: Test with Clerk Dashboard

1. In Clerk Dashboard, go to **Webhooks**
2. Click on your webhook endpoint
3. Go to the **Testing** tab
4. Click **Send Example** for `user.created`
5. Check the response - should be `200 OK`

### Option 2: Test by Creating a User

1. Go to your application and sign up with a new account
2. Check your Supabase Dashboard → **Table Editor** → **profiles**
3. You should see the new user profile created

### Option 3: Check Logs

View function logs to debug:

```bash
# Tail the logs
supabase functions logs clerk-webhook --tail

# Or view in Supabase Dashboard
# Go to Edge Functions → clerk-webhook → Logs
```

## Step 9: Verify the Integration

After setting up the webhook:

1. **Create a new user** in your app
2. **Check Supabase** → Table Editor → profiles table
3. You should see:
   - `clerk_user_id` matching the Clerk user ID
   - Email, name, and other profile data
   - `created_at` timestamp

## How It Works

### User Creation Flow

```
User signs up → Clerk → Webhook → Supabase Edge Function → profiles table
```

1. User signs up via Clerk
2. Clerk sends `user.created` webhook event
3. Supabase Edge Function receives the event
4. Function inserts user data into `profiles` table
5. User can now create blogs linked to their profile

### User Update Flow

```
User updates profile → Clerk → Webhook → Supabase Edge Function → profiles table
```

1. User updates their profile in Clerk
2. Clerk sends `user.updated` webhook event
3. Edge Function updates the profile in Supabase

### User Deletion Flow

```
User deleted → Clerk → Webhook → Supabase Edge Function → Delete from profiles
```

1. User is deleted in Clerk
2. Clerk sends `user.deleted` webhook event
3. Edge Function deletes the profile from Supabase
4. Associated blogs can be deleted or kept (depending on your CASCADE settings)

## Troubleshooting

### Webhook Not Firing

- Check webhook is enabled in Clerk Dashboard
- Verify the endpoint URL is correct
- Check that events (`user.created`, etc.) are selected
- Review Clerk webhook logs for delivery failures

### Function Errors

View logs:

```bash
supabase functions logs clerk-webhook
```

Common issues:

- **Missing secret**: Set `CLERK_WEBHOOK_SECRET`
- **Database error**: Verify profiles table exists
- **Permission error**: Check Supabase service role key is set

### Signature Verification Failed

- Ensure `CLERK_WEBHOOK_SECRET` matches the signing secret in Clerk
- Check for any whitespace or formatting issues in the secret

### Profile Not Created

1. Check Supabase logs for errors
2. Verify profiles table exists
3. Check RLS policies allow insertion
4. Verify service role key has proper permissions

## Advanced Configuration

### Retry Failed Webhooks

Clerk automatically retries failed webhooks. Configure retry settings in Clerk Dashboard:

- Go to Webhooks → Your endpoint → Settings
- Adjust retry attempts and intervals

### Custom Metadata

Store custom metadata in the profiles table:

```typescript
// In the edge function, you can extend profileData:
metadata: {
  public_metadata: userData.public_metadata || {},
  private_metadata: userData.private_metadata || {},
  custom_field: "custom_value",
}
```

### Rate Limiting

Supabase Edge Functions have built-in rate limiting. For high-traffic apps, consider:

- Batching updates
- Using a queue system
- Caching profile data

## Security Best Practices

1. **Always verify webhook signatures** in production
2. **Use HTTPS** for webhook endpoints (Supabase uses HTTPS by default)
3. **Store secrets securely** using Supabase Secrets
4. **Limit webhook events** to only what you need
5. **Monitor webhook logs** regularly

## Updating the Edge Function

When you make changes to the edge function:

```bash
# Deploy the updated function
supabase functions deploy clerk-webhook

# Check the logs
supabase functions logs clerk-webhook --tail
```

## Files Created

- `supabase-profiles-schema.sql` - Database schema for profiles table
- `supabase/functions/clerk-webhook/index.ts` - Edge function code
- `supabase/functions/clerk-webhook/README.md` - Function documentation

## Next Steps

After setting up the webhook:

1. ✅ Test user creation and profile sync
2. ✅ Update your app to use profile data
3. ✅ Consider adding profile editing features
4. ✅ Set up monitoring and alerts
5. ✅ Document the flow for your team

## Additional Resources

- [Clerk Webhooks Documentation](https://clerk.com/docs/integrations/webhooks)
- [Supabase Edge Functions Guide](https://supabase.com/docs/guides/functions)
- [Svix Webhook Verification](https://docs.svix.com/receiving/verifying-payloads/how)

## Support

If you encounter issues:

1. Check Clerk webhook delivery logs
2. Check Supabase Edge Function logs
3. Review this guide's troubleshooting section
4. Check Clerk and Supabase community forums
