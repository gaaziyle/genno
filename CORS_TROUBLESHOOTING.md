# CORS Error Resolution Guide

## Problem

You encountered this error:

```
Access to fetch at 'https://iamgaazicom.app.n8n.cloud/webhook-test/youtube-to-blog' from origin 'http://localhost:3000' has been blocked by CORS policy: Response to preflight request doesn't pass access control check: No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

## What is CORS?

CORS (Cross-Origin Resource Sharing) is a security feature that prevents web pages from making requests to different domains. When your frontend (localhost:3000) tries to call an external API (iamgaazicom.app.n8n.cloud), the browser blocks it unless the external API explicitly allows it.

## Solution: Server-Side Proxy

Instead of calling the webhook directly from the frontend, we now use a Next.js API route as a proxy:

### Before (Direct Call - CORS Error)

```
Frontend → External Webhook ❌
```

### After (Via API Route - No CORS)

```
Frontend → Next.js API Route → External Webhook ✅
```

## Implementation

### 1. Frontend Changes

**File**: `app/dashboard/convert/page.tsx`

**Before:**

```javascript
const response = await fetch(
  "https://iamgaazicom.app.n8n.cloud/webhook-test/youtube-to-blog",
  {
    // ... webhook call
  }
);
```

**After:**

```javascript
const response = await fetch("/api/convert-video", {
  // ... API route call
});
```

### 2. API Route

**File**: `app/api/convert-video/route.ts`

This API route:

- ✅ Receives the request from your frontend
- ✅ Validates the data
- ✅ Makes the webhook call from the server (no CORS issues)
- ✅ Returns the response to your frontend

## Why This Works

1. **Same Origin**: Frontend calls `/api/convert-video` (same domain)
2. **Server-to-Server**: API route calls external webhook (no CORS restrictions)
3. **Security**: Server-side validation and authentication
4. **Error Handling**: Better error messages and logging

## Alternative Solutions

### Option 1: Configure Webhook CORS (If you control the webhook)

If you have access to the webhook endpoint, you can configure it to allow CORS:

```javascript
// In your webhook endpoint
res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
res.setHeader("Access-Control-Allow-Methods", "POST");
res.setHeader("Access-Control-Allow-Headers", "Content-Type");
```

### Option 2: Use a CORS Proxy (Not Recommended for Production)

You could use a CORS proxy service, but this is not secure for production:

```javascript
const response = await fetch(
  `https://cors-anywhere.herokuapp.com/https://iamgaazicom.app.n8n.cloud/webhook-test/youtube-to-blog`
);
```

### Option 3: Browser Extension (Development Only)

Install a CORS browser extension for development, but never use in production.

## Testing the Fix

1. **Start your development server:**

   ```bash
   pnpm dev
   ```

2. **Navigate to the convert page:**

   ```
   http://localhost:3000/dashboard/convert
   ```

3. **Enter a YouTube URL and submit:**
   - Should see success message
   - No CORS errors in browser console
   - Check Network tab - you'll see the API call to `/api/convert-video`

## Debugging

### Check API Route Logs

```bash
# In your terminal where you're running the dev server
# Look for console.log messages from the API route
```

### Browser Network Tab

1. Open DevTools (F12)
2. Go to Network tab
3. Submit the form
4. Look for the `/api/convert-video` request
5. Check the response

### Common Issues

**"Failed to send request: 401 Unauthorized"**

- Check Clerk authentication is working
- Verify user is logged in

**"Failed to send request: 400 Bad Request"**

- Check URL validation
- Verify email is provided

**"Failed to send request: 500 Internal Server Error"**

- Check server logs for webhook errors
- Verify webhook endpoint is accessible

## Production Considerations

### Environment Variables

For production, consider moving the webhook URL to environment variables:

```env
# .env.local
CONVERSION_WEBHOOK_URL=https://iamgaazicom.app.n8n.cloud/webhook-test/youtube-to-blog
```

Then in your API route:

```javascript
const webhookUrl =
  process.env.CONVERSION_WEBHOOK_URL ||
  "https://iamgaazicom.app.n8n.cloud/webhook-test/youtube-to-blog";
```

### Error Logging

Add proper logging for production:

```javascript
// In API route
console.log(`Webhook call: ${webhookUrl}`, {
  youtubeUrl,
  userEmail,
  userId,
  timestamp: new Date().toISOString(),
});
```

### Rate Limiting

Consider adding rate limiting to prevent abuse:

```javascript
// Example with simple in-memory rate limiting
const rateLimit = new Map();

export async function POST(request: NextRequest) {
  const { userId } = await auth();

  // Simple rate limiting: 5 requests per minute per user
  const now = Date.now();
  const userRequests = rateLimit.get(userId) || [];
  const recentRequests = userRequests.filter((time) => now - time < 60000);

  if (recentRequests.length >= 5) {
    return NextResponse.json(
      {
        error:
          "Rate limit exceeded. Please wait before making another request.",
      },
      { status: 429 }
    );
  }

  recentRequests.push(now);
  rateLimit.set(userId, recentRequests);

  // ... rest of the code
}
```

## Summary

The CORS error has been resolved by:

1. ✅ Creating a Next.js API route as a proxy
2. ✅ Updating the frontend to call the API route instead of the webhook directly
3. ✅ Adding proper error handling and validation
4. ✅ Maintaining the same user experience

Your conversion feature should now work without CORS errors! 🎉
