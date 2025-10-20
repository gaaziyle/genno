# Environment Variables Setup Guide

Complete guide for all environment variables needed for the Genno application.

## Required Environment Variables

### 1. Clerk Authentication

Get these from [Clerk Dashboard](https://dashboard.clerk.com) → Your App → API Keys:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```

**Where to find:**

- Dashboard → API Keys → Quick Copy

### 2. Supabase Database

Get these from [Supabase Dashboard](https://supabase.com/dashboard) → Project Settings → API:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

**Where to find:**

- Project Settings → API → Project URL
- Project Settings → API → Project API keys → `anon` `public`

### 3. Supabase Service Role (For Edge Functions & API Routes)

⚠️ **Keep this secret - never expose in client-side code!**

```env
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx
```

**Where to find:**

- Project Settings → API → Project API keys → `service_role`

**Note:** This key is required for:

- Analytics tracking API routes (bypasses RLS for anonymous tracking)
- Supabase Edge Functions (automatically available when deployed)
- Local development of edge functions

### 4. Clerk Webhook Secret

Get this from Clerk Dashboard → Webhooks → Your Endpoint:

```env
CLERK_WEBHOOK_SECRET=whsec_xxxxx
```

**Where to find:**

- After creating webhook endpoint in Clerk
- Shows as "Signing Secret"

## Complete `.env.local` File

Create a `.env.local` file in your project root:

```env
# ============================================================================
# Clerk Authentication
# ============================================================================
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# ============================================================================
# Supabase Database
# ============================================================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx

# ============================================================================
# Supabase Service Role (Required for API routes and edge functions)
# ============================================================================
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx

# ============================================================================
# Clerk Webhook (Set in Supabase Secrets, not here)
# ============================================================================
# This should be set using: supabase secrets set CLERK_WEBHOOK_SECRET=whsec_xxxxx
# Do NOT add to .env.local as edge functions don't have access to it
```

## Supabase Secrets (For Edge Functions)

Edge functions don't have access to `.env.local`. Set secrets using CLI:

```bash
# Set Clerk webhook secret
supabase secrets set CLERK_WEBHOOK_SECRET=whsec_your_secret_here

# List all secrets (won't show values)
supabase secrets list

# Unset a secret if needed
supabase secrets unset CLERK_WEBHOOK_SECRET
```

**Or via Supabase Dashboard:**

1. Project Settings → Edge Functions
2. Manage secrets
3. Add `CLERK_WEBHOOK_SECRET`

## Environment Variable Prefixes

### `NEXT_PUBLIC_*`

- ✅ Exposed to the browser
- ✅ Can be used in client components
- ⚠️ Never put sensitive data here

**Examples:**

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### No Prefix (Server-only)

- 🔒 Only available on the server
- 🔒 Never exposed to browser
- ✅ Safe for sensitive data

**Examples:**

- `CLERK_SECRET_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Verification Checklist

After setting up your environment variables:

### Local Development

```bash
# Restart your dev server
pnpm dev

# Check for warnings in the console
# You should NOT see: "Supabase environment variables are not set"
```

### Edge Functions

```bash
# Verify secrets are set
supabase secrets list

# Should show:
# CLERK_WEBHOOK_SECRET
```

### Test Authentication

1. Sign up a new user
2. Check browser console - no authentication errors
3. User should be redirected to dashboard

### Test Database Connection

1. Navigate to `/dashboard/blogs`
2. Should load without errors
3. Create a test blog post

### Test Webhook

1. Sign up a new user
2. Check Supabase → Table Editor → profiles
3. New profile should appear

## Security Best Practices

### ✅ DO

- Keep `.env.local` in `.gitignore`
- Use different keys for development and production
- Rotate secrets periodically
- Set up environment variables in your deployment platform (Vercel, etc.)
- Use secret management tools for production

### ❌ DON'T

- Commit `.env.local` to Git
- Share secrets in public channels
- Use production keys in development
- Expose service role keys to the client
- Hardcode secrets in your code

## Deployment Environments

### Vercel

1. Go to Project Settings → Environment Variables
2. Add each variable
3. Select environments (Production, Preview, Development)

### Netlify

1. Site Settings → Build & Deploy → Environment
2. Add each variable

### Other Platforms

Consult your platform's documentation for setting environment variables.

## Common Issues

### "CLERK_PUBLISHABLE_KEY is not defined"

- Ensure variable starts with `NEXT_PUBLIC_`
- Restart dev server after adding variables

### "Supabase environment variables are not set"

- Check `.env.local` exists in project root
- Verify variable names match exactly
- Restart dev server

### "Webhook signature verification failed"

- Check `CLERK_WEBHOOK_SECRET` is set correctly in Supabase
- Verify secret matches what's in Clerk dashboard
- No extra spaces or quotes in the secret

### "Invalid Supabase credentials"

- Verify URL and anon key are correct
- Check for typos
- Ensure project is not paused

## Template Files

### `.env.local.example`

Keep this in your repository as a template:

```env
# Copy this file to .env.local and fill in your values

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

### `.gitignore`

Ensure these are ignored:

```gitignore
# Environment variables
.env
.env.local
.env.*.local

# Supabase
.supabase
```

## Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Clerk Environment Variables](https://clerk.com/docs/deployments/set-environment-variables)
- [Supabase Secrets Management](https://supabase.com/docs/guides/functions/secrets)

---

**Quick Reference:**

- Development: `.env.local` file
- Edge Functions: `supabase secrets set`
- Production: Platform environment variables UI
