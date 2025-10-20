# Clerk Webhook Edge Function

This Supabase Edge Function handles webhooks from Clerk to sync user data to the profiles table.

## Events Handled

- `user.created` - Creates a new profile when a user signs up
- `user.updated` - Updates the profile when user data changes
- `user.deleted` - Removes the profile when a user is deleted

## Environment Variables Required

Set these in your Supabase project:

- `CLERK_WEBHOOK_SECRET` - Your Clerk webhook signing secret
- `SUPABASE_URL` - Your Supabase project URL (automatically available)
- `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key (automatically available)

## Deployment

See the main CLERK_WEBHOOK_SETUP.md file for deployment instructions.
