# Quick Start: Clerk + Supabase Webhook Integration

This is a condensed guide to get your Clerk webhook integration with Supabase up and running quickly.

## Prerequisites

- ✅ Supabase project created
- ✅ Clerk application set up
- ✅ Supabase CLI installed

## 5-Minute Setup

### 1. Create Profiles Table (2 minutes)

```sql
-- Copy and run in Supabase SQL Editor
-- Use supabase-profiles-schema.sql OR supabase-complete-schema.sql
```

**Quick option**: Copy `supabase-complete-schema.sql` → Supabase SQL Editor → Run

### 2. Deploy Edge Function (2 minutes)

```bash
# Login and link
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Deploy function
supabase functions deploy clerk-webhook
```

Get your function URL (save this):

```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/clerk-webhook
```

### 3. Configure Clerk Webhook (1 minute)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com) → Webhooks
2. Click **Add Endpoint**
3. Paste your function URL
4. Select events: `user.created`, `user.updated`, `user.deleted`
5. Click **Create**
6. **Copy the signing secret**

### 4. Set Secret in Supabase

```bash
supabase secrets set CLERK_WEBHOOK_SECRET=whsec_YOUR_SECRET
```

### 5. Test It

Sign up a new user in your app → Check Supabase profiles table ✅

## What You Get

- ✅ Automatic user profile creation
- ✅ Profile updates synced from Clerk
- ✅ User deletion handling
- ✅ Foreign key relationship between profiles and blogs

## Files Overview

| File                                | Purpose                                |
| ----------------------------------- | -------------------------------------- |
| `supabase-profiles-schema.sql`      | Just the profiles table                |
| `supabase-complete-schema.sql`      | Profiles + Blogs + Views (recommended) |
| `supabase/functions/clerk-webhook/` | Edge function code                     |
| `CLERK_WEBHOOK_SETUP.md`            | Detailed setup guide                   |

## Troubleshooting

**Webhook not firing?**

- Check Clerk webhook logs
- Verify function URL is correct

**Function errors?**

```bash
supabase functions logs clerk-webhook --tail
```

**Profile not created?**

- Check the secret is set correctly
- Verify profiles table exists

## Next Steps

1. Read `CLERK_WEBHOOK_SETUP.md` for detailed configuration
2. Test with different webhook events
3. Monitor your function logs
4. Set up error alerting

---

**Need help?** See the full setup guide in `CLERK_WEBHOOK_SETUP.md`
