# Fix: "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

## What This Error Means

The API route `/api/analytics/track` is returning an HTML error page instead of JSON. This happens when:

1. The API route has a compilation/build error
2. Missing dependencies
3. Next.js build cache is corrupted

## 🔧 Solution Steps

### Step 1: Check Terminal for Build Errors

Look at your terminal where `pnpm dev` is running.

**Look for errors like:**

- `Module not found: Can't resolve 'crypto'`
- `Module not found: Can't resolve '@supabase/supabase-js'`
- TypeScript compilation errors
- Any red error messages

**If you see errors:**

- Copy the error message and we'll fix it
- The HTML response is caused by that error

### Step 2: Test If API Routes Work at All

Open these URLs in your browser:

1. **Simple ping test:**

   ```
   http://localhost:3000/api/analytics/ping
   ```

   Should return: `{"message":"pong","timestamp":"..."}`

2. **Environment test:**
   ```
   http://localhost:3000/api/analytics/test
   ```
   Should return environment variable status

**If these return HTML:**

- There's a general Next.js issue
- Proceed to Step 3

**If these work but `/api/analytics/track` doesn't:**

- There's a specific issue with the track route
- Proceed to Step 4

### Step 3: Clear Next.js Cache and Rebuild

Stop the server and run:

```bash
# Stop server (Ctrl+C)

# Remove Next.js cache and build files
rm -rf .next
# On Windows PowerShell:
Remove-Item -Recurse -Force .next

# Reinstall dependencies
pnpm install

# Start fresh
pnpm dev
```

### Step 4: Verify Dependencies Are Installed

Check if `@supabase/supabase-js` is installed:

```bash
pnpm list @supabase/supabase-js
```

**If it says "not found" or shows an error:**

```bash
pnpm add @supabase/supabase-js
```

### Step 5: Check for TypeScript Errors

Run type checking:

```bash
pnpm tsc --noEmit
```

**If there are errors:**

- Fix the TypeScript errors shown
- Restart the server

### Step 6: Temporary Simplified Route

Let's create a minimal version of the route to isolate the issue.

Replace the contents of `app/api/analytics/track/route.ts` temporarily with this:

```typescript
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Received:", body);

    return NextResponse.json({
      success: true,
      message: "Basic route working",
      received: body,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        error: "Failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
```

**Test this:**

1. Save the file
2. Visit a blog post
3. Check browser console

**If this works:**

- The issue is with the Supabase client or crypto module
- We'll add functionality back piece by piece

**If this still returns HTML:**

- There's a deeper Next.js routing issue

### Step 7: Check Next.js Version Compatibility

Check your Next.js version:

```bash
pnpm list next
```

The route syntax we're using requires Next.js 13+.

**If you're on Next.js 12 or below:**

- Upgrade to latest: `pnpm add next@latest`

### Step 8: Verify File Location

Make sure the file is at the correct path:

```
app/
  api/
    analytics/
      track/
        route.ts  ← Must be named exactly "route.ts"
```

**Wrong names that won't work:**

- `Route.ts` (capital R)
- `index.ts`
- `track.ts`

### Step 9: Check Middleware Issues

If you have a `middleware.ts` file, it might be interfering.

Temporarily disable it by renaming:

```bash
# Windows PowerShell
Rename-Item middleware.ts middleware.ts.backup
```

Restart server and test.

**If this fixes it:**

- The middleware is blocking the API route
- We need to update the middleware matcher

## 📊 Quick Diagnostic Commands

Run these and share the output:

```bash
# 1. Check Next.js version
pnpm list next

# 2. Check if @supabase/supabase-js is installed
pnpm list @supabase/supabase-js

# 3. Check for TypeScript errors
pnpm tsc --noEmit

# 4. Check if route file exists
# Windows PowerShell:
Test-Path app/api/analytics/track/route.ts
```

## 🎯 Most Likely Solutions

Based on the error, try these in order:

### 1️⃣ **Clear Cache** (Most Common)

```bash
rm -rf .next
pnpm dev
```

### 2️⃣ **Check Terminal for Actual Error**

When you visit the blog, look at terminal immediately.
The real error will be there.

### 3️⃣ **Test Simplified Route** (Step 6 above)

This tells us if it's a routing issue or code issue.

## 🔍 What to Report Back

Please provide:

1. **Terminal output** when you visit a blog page

   - Any errors shown
   - Especially red text

2. **Result of ping test**

   - What `http://localhost:3000/api/analytics/ping` returns

3. **Browser console with new error logging**

   - What it says now (should be more detailed)

4. **Output of:**
   ```bash
   pnpm list next
   pnpm list @supabase/supabase-js
   ```

This will help me pinpoint exactly what's wrong!
