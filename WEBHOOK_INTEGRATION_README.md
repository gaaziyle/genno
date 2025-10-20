# Clerk + Supabase Webhook Integration - Complete Setup

## 📋 Overview

This integration automatically syncs user data from Clerk to your Supabase database using webhooks and edge functions. When a user signs up, updates their profile, or is deleted in Clerk, those changes are immediately reflected in your Supabase `profiles` table.

## 🎯 What Was Created

### 1. **Database Schema**

- **`profiles` table**: Stores user information synced from Clerk
- **Foreign key relationship**: Links `blogs.user_id` to `profiles.clerk_user_id`
- **Views**: `user_blog_stats`, `recent_blogs_with_authors` for analytics
- **RLS Policies**: Secure data access rules
- **Triggers**: Automatic timestamp updates

### 2. **Supabase Edge Function**

- **Location**: `supabase/functions/clerk-webhook/`
- **Purpose**: Receives webhooks from Clerk and updates the database
- **Handles**: `user.created`, `user.updated`, `user.deleted` events
- **Security**: Webhook signature verification

### 3. **Documentation Files**

| File                                | Purpose                                           |
| ----------------------------------- | ------------------------------------------------- |
| `supabase-profiles-schema.sql`      | Profiles table only                               |
| `supabase-complete-schema.sql`      | Complete schema (profiles + blogs) ⭐ Recommended |
| `CLERK_WEBHOOK_SETUP.md`            | Detailed step-by-step setup guide                 |
| `QUICKSTART_WEBHOOK.md`             | Quick 5-minute setup                              |
| `ENVIRONMENT_SETUP.md`              | Environment variables guide                       |
| `supabase/functions/clerk-webhook/` | Edge function code                                |

## 🚀 Quick Start

### Step 1: Run the SQL Schema

**Option A: Complete Setup (Recommended)**

```sql
-- Copy and run: supabase-complete-schema.sql
-- Creates profiles table, blogs table, views, and relationships
```

**Option B: Profiles Only**

```sql
-- Copy and run: supabase-profiles-schema.sql
-- Then run: supabase-schema.sql (for blogs)
```

### Step 2: Deploy Edge Function

```bash
# Install Supabase CLI if needed
npm install -g supabase

# Login and link to your project
supabase login
supabase link --project-ref YOUR_PROJECT_REF

# Deploy the webhook function
supabase functions deploy clerk-webhook
```

Your function URL will be:

```
https://YOUR_PROJECT_REF.supabase.co/functions/v1/clerk-webhook
```

### Step 3: Configure Clerk Webhook

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Webhooks** → **Add Endpoint**
3. Enter your Supabase function URL
4. Subscribe to events:
   - ✅ `user.created`
   - ✅ `user.updated`
   - ✅ `user.deleted`
5. Copy the **Signing Secret**

### Step 4: Set Webhook Secret

```bash
supabase secrets set CLERK_WEBHOOK_SECRET=whsec_YOUR_SECRET
```

### Step 5: Test

1. Sign up a new user in your app
2. Check Supabase → Table Editor → `profiles`
3. Verify the profile was created ✅

## 📊 Database Schema

### Profiles Table

```sql
profiles (
  id UUID PRIMARY KEY,
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  username TEXT,
  profile_image_url TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  last_sign_in_at TIMESTAMP,
  email_verified BOOLEAN,
  banned BOOLEAN,
  metadata JSONB
)
```

### Relationship with Blogs

```sql
blogs.user_id → profiles.clerk_user_id (FOREIGN KEY)
```

When a profile is deleted, all associated blogs are deleted (CASCADE).

## 🔄 How It Works

### User Registration Flow

```
1. User signs up with Clerk
   ↓
2. Clerk creates user account
   ↓
3. Clerk sends webhook: user.created
   ↓
4. Supabase Edge Function receives webhook
   ↓
5. Function inserts profile into database
   ↓
6. Profile is now available in your app
```

### Profile Update Flow

```
1. User updates profile in Clerk
   ↓
2. Clerk sends webhook: user.updated
   ↓
3. Edge Function updates profile in database
```

### User Deletion Flow

```
1. User is deleted in Clerk
   ↓
2. Clerk sends webhook: user.deleted
   ↓
3. Edge Function deletes profile
   ↓
4. All user's blogs are deleted (CASCADE)
```

## 🔐 Security Features

- ✅ **Webhook signature verification** prevents unauthorized requests
- ✅ **Row Level Security (RLS)** controls data access
- ✅ **Service role key** used in edge function (bypasses RLS)
- ✅ **Secrets management** via Supabase CLI
- ✅ **HTTPS** for all webhook communication

## 📁 File Structure

```
genno/
├── supabase/
│   └── functions/
│       └── clerk-webhook/
│           ├── index.ts          # Edge function code
│           └── README.md         # Function docs
├── supabase-profiles-schema.sql  # Profiles table only
├── supabase-complete-schema.sql  # Complete schema ⭐
├── supabase-schema.sql          # Original blogs schema
├── CLERK_WEBHOOK_SETUP.md       # Detailed guide
├── QUICKSTART_WEBHOOK.md        # Quick start
└── ENVIRONMENT_SETUP.md         # Environment variables
```

## 🧪 Testing

### Test User Creation

```bash
# Monitor logs
supabase functions logs clerk-webhook --tail

# In another terminal, create a test user
# Check logs for webhook events
```

### Test in Clerk Dashboard

1. Go to Webhooks → Your endpoint
2. Click **Testing** tab
3. Send example `user.created` event
4. Check response is `200 OK`

### Verify Database

```sql
-- Check profiles table
SELECT * FROM profiles ORDER BY created_at DESC LIMIT 5;

-- Check user stats
SELECT * FROM user_blog_stats;

-- Check blogs with authors
SELECT * FROM recent_blogs_with_authors WHERE published = true LIMIT 10;
```

## 🛠️ Useful Commands

### Edge Functions

```bash
# Deploy function
supabase functions deploy clerk-webhook

# View logs (real-time)
supabase functions logs clerk-webhook --tail

# View logs (last 100 lines)
supabase functions logs clerk-webhook --limit 100

# Delete function
supabase functions delete clerk-webhook
```

### Secrets Management

```bash
# Set secret
supabase secrets set CLERK_WEBHOOK_SECRET=value

# List secrets (names only)
supabase secrets list

# Remove secret
supabase secrets unset CLERK_WEBHOOK_SECRET
```

### Database Queries

```bash
# Connect to database
supabase db remote

# Run SQL file
supabase db execute -f supabase-complete-schema.sql
```

## 🐛 Troubleshooting

### Webhook Not Firing

**Symptoms:** No profiles being created

**Solutions:**

1. Check webhook is enabled in Clerk Dashboard
2. Verify endpoint URL is correct
3. Check Clerk webhook delivery logs
4. Ensure events are selected (`user.created`, etc.)

### Function Errors

**Symptoms:** 500 errors in webhook logs

**Solutions:**

```bash
# Check function logs
supabase functions logs clerk-webhook --tail

# Common issues:
# - Missing CLERK_WEBHOOK_SECRET
# - Profiles table doesn't exist
# - Service role key not set
```

### Signature Verification Failed

**Symptoms:** 401 Unauthorized

**Solutions:**

1. Verify `CLERK_WEBHOOK_SECRET` matches Clerk dashboard
2. No extra spaces/quotes in the secret
3. Secret is set in Supabase (not .env.local)

### Profile Not Created

**Check:**

1. Edge Function logs for errors
2. Profiles table exists in database
3. RLS policies allow insertion
4. Service role key has permissions

## 📈 Analytics & Monitoring

### View User Statistics

```sql
-- Top users by blog count
SELECT
  username,
  email,
  total_blogs,
  published_blogs
FROM user_blog_stats
ORDER BY total_blogs DESC
LIMIT 10;
```

### Monitor Webhook Activity

```bash
# Real-time monitoring
supabase functions logs clerk-webhook --tail

# Filter by time
supabase functions logs clerk-webhook --since 1h

# Show only errors
supabase functions logs clerk-webhook | grep -i error
```

### Clerk Webhook Dashboard

View delivery status in Clerk:

- Dashboard → Webhooks → Your endpoint → Attempts
- Shows success/failure rates
- Retry attempts
- Response times

## 🔄 Updating the Edge Function

When you modify the edge function:

```bash
# 1. Edit the file
# supabase/functions/clerk-webhook/index.ts

# 2. Deploy changes
supabase functions deploy clerk-webhook

# 3. Monitor for errors
supabase functions logs clerk-webhook --tail

# 4. Test with a webhook
# Clerk Dashboard → Webhooks → Testing → Send Example
```

## 📚 Additional Resources

### Documentation

- [Clerk Webhooks](https://clerk.com/docs/integrations/webhooks)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

### Guides

- `CLERK_WEBHOOK_SETUP.md` - Detailed setup instructions
- `QUICKSTART_WEBHOOK.md` - Quick 5-minute setup
- `ENVIRONMENT_SETUP.md` - Environment variables
- `SUPABASE_SETUP.md` - Supabase database setup

## ✅ Success Checklist

After completing the setup, verify:

- [ ] Profiles table exists in Supabase
- [ ] Edge function is deployed
- [ ] Webhook endpoint created in Clerk
- [ ] Webhook secret set in Supabase
- [ ] Test user creation works
- [ ] Profile appears in database
- [ ] No errors in function logs
- [ ] RLS policies are working
- [ ] Foreign key relationship set up
- [ ] Views are accessible

## 🎉 What's Next?

Now that webhooks are set up:

1. **Use Profile Data**: Access user info in your app
2. **Build Features**: User profiles, author pages, etc.
3. **Add Analytics**: Track user engagement
4. **Extend Schema**: Add custom profile fields
5. **Monitor**: Set up alerts for webhook failures

---

**Need Help?**

- Check `CLERK_WEBHOOK_SETUP.md` for detailed troubleshooting
- Review function logs: `supabase functions logs clerk-webhook`
- Test webhooks in Clerk Dashboard → Webhooks → Testing
