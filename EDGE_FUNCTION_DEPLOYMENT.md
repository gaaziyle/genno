# Deploy Create-Blog Edge Function

## Overview

This guide helps you deploy the `create-blog` Edge Function to ensure each blog gets a unique ID when created from your n8n workflow.

## Prerequisites

- Supabase CLI installed
- Supabase project created
- Access to your Supabase dashboard

## Installation Steps

### 1. Install Supabase CLI

**Windows (PowerShell):**

```powershell
# Using Scoop
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# Or using npm
npm install -g supabase
```

### 2. Login to Supabase

```bash
supabase login
```

This will open a browser window to authenticate.

### 3. Link Your Project

```bash
# Get your project ref from Supabase dashboard URL
# https://app.supabase.com/project/YOUR_PROJECT_REF

supabase link --project-ref YOUR_PROJECT_REF
```

### 4. Deploy the Edge Function

```bash
cd c:\Users\muham\Desktop\genno
supabase functions deploy create-blog
```

### 5. Get Your Function URL

After deployment, you'll see:

```
Deployed Function create-blog
URL: https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-blog
```

**Save this URL!** You'll need it for n8n configuration.

## Configure n8n Workflow

### Update Your n8n Workflow

After your AI processes the YouTube video, add a new HTTP Request node:

**Node Configuration:**

1. **Method:** POST
2. **URL:** `https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-blog`
3. **Headers:**
   ```
   Content-Type: application/json
   ```
4. **Body (JSON):**
   ```json
   {
     "clerk_user_id": "{{ $json.clerk_user_id }}",
     "title": "{{ $json.generated_title }}",
     "content": "{{ $json.generated_content }}",
     "excerpt": "{{ $json.generated_excerpt }}",
     "youtube_url": "{{ $json.youtubeUrl }}",
     "thumbnail_url": "{{ $json.thumbnail_url }}",
     "tags": {{ $json.tags }}
   }
   ```

### Complete n8n Flow

```
1. Webhook Trigger (receives YouTube URL + clerk_user_id)
   ↓
2. Extract YouTube Data (title, description, thumbnail)
   ↓
3. Get YouTube Transcript
   ↓
4. AI Processing (generate blog content)
   ↓
5. HTTP Request → Supabase Edge Function (create blog)
   ↓
6. Success Response
```

## Testing

### Test the Edge Function Directly

```bash
# Using curl
curl -X POST https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-blog \
  -H "Content-Type: application/json" \
  -d '{
    "clerk_user_id": "user_test123",
    "title": "My Test Blog Post",
    "content": "<h2>Introduction</h2><p>This is a test blog post...</p>",
    "excerpt": "A brief summary of the blog post",
    "youtube_url": "https://youtube.com/watch?v=test123"
  }'
```

**Expected Response:**

```json
{
  "success": true,
  "message": "Blog created successfully",
  "blog": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "My Test Blog Post",
    "slug": "my-test-blog-post-abc12345",
    "clerk_user_id": "user_test123",
    "is_publish": false,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Verify in Supabase

1. Open Supabase Dashboard
2. Go to Table Editor → `blogs`
3. Check for the newly created blog
4. Verify it has:
   - ✅ Unique `id` (UUID)
   - ✅ Unique `slug`
   - ✅ `is_publish = false`
   - ✅ Correct `clerk_user_id`

## Integration Flow

### Current Setup (Before Edge Function)

```
Frontend → n8n webhook → (processing) → ?
```

### Updated Setup (With Edge Function)

```
Frontend → n8n webhook → AI Processing → create-blog Edge Function → Supabase
     ↓                        ↓                    ↓                      ↓
YouTube URL          Generate Content      Insert Blog            New Blog Entry
clerk_user_id        (title, content)      (unique ID, slug)      Ready to view!
```

## Edge Function Features

### Automatic Unique ID Generation

```typescript
// PostgreSQL generates UUID automatically
id UUID DEFAULT uuid_generate_v4() PRIMARY KEY
```

Each blog gets a unique ID like:

- `550e8400-e29b-41d4-a716-446655440000`
- `7c9e6679-7425-40de-944b-e07fc1f90ae7`
- `9e107d9d-7f7d-4d0d-84f8-8d5e8a5f6e9d`

### Automatic Slug Generation

```typescript
function generateSlug(title: string): string {
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .substring(0, 100);

  const randomSuffix = Math.random().toString(36).substring(2, 10);
  return `${baseSlug}-${randomSuffix}`;
}
```

Examples:

- "Getting Started with React" → `getting-started-with-react-a1b2c3d4`
- "10 Tips for Better Code" → `10-tips-for-better-code-x9y8z7w6`

### Default Values

```typescript
{
  is_publish: false,        // Always starts as draft
  created_at: NOW(),        // Current timestamp
  updated_at: NOW(),        // Current timestamp
  tags: [],                 // Empty array if not provided
}
```

## Monitoring & Debugging

### View Function Logs

```bash
# Live logs
supabase functions logs create-blog --tail

# Recent logs (last 100)
supabase functions logs create-blog
```

### Common Log Messages

**Success:**

```
Received blog data: {title: "...", clerk_user_id: "..."}
Creating blog with data: {title: "...", slug: "..."}
Blog created successfully: {id: "...", title: "..."}
```

**Error:**

```
Error in create-blog function: clerk_user_id is required
Error inserting blog: duplicate key value...
```

## Troubleshooting

### Issue: Function not deploying

**Solution:**

```bash
# Check Supabase CLI version
supabase --version

# Update CLI
npm update -g supabase

# Try deploying again
supabase functions deploy create-blog --debug
```

### Issue: "clerk_user_id is required"

**Cause:** n8n not sending the clerk_user_id  
**Solution:** Check your n8n workflow passes this field

### Issue: "duplicate key value violates unique constraint"

**Cause:** Slug already exists (very rare)  
**Solution:** The function adds random suffix, but if it happens:

- Don't provide slug in request
- Let the function auto-generate it

### Issue: Blog created but not showing in dashboard

**Possible causes:**

1. Wrong `clerk_user_id` - Check if it matches your profile
2. RLS policies blocking - Check with `CHECK_BLOG_STATUS.sql`
3. Frontend filtering issue - Check console logs

**Solution:**

```sql
-- Check if blog was created
SELECT * FROM blogs ORDER BY created_at DESC LIMIT 5;

-- Check clerk_user_id matches
SELECT clerk_user_id FROM profiles WHERE email = 'your-email';
```

## Security Considerations

### Current Setup

- ✅ Uses service role key (bypasses RLS)
- ✅ Server-side only (secure)
- ⚠️ No authentication on function

### Production Hardening

Add API key authentication:

```typescript
// In the Edge Function
const apiKey = req.headers.get("x-api-key");
const expectedKey = Deno.env.get("N8N_API_KEY");

if (apiKey !== expectedKey) {
  throw new Error("Unauthorized");
}
```

Set the secret:

```bash
supabase secrets set N8N_API_KEY=your_secret_key_here
```

Update n8n to include header:

```
x-api-key: your_secret_key_here
```

## Update Process

When you need to update the function:

```bash
# Make changes to supabase/functions/create-blog/index.ts
# Then deploy
supabase functions deploy create-blog

# Check logs to verify
supabase functions logs create-blog --tail
```

## Complete Workflow

### Step-by-Step Process

1. **User Action:**

   - User enters YouTube URL at `/dashboard/convert`
   - Frontend sends: `youtubeUrl`, `clerk_user_id`

2. **n8n Processing:**

   - Receives webhook with URL and user ID
   - Downloads YouTube transcript
   - Sends to AI for processing
   - AI generates: title, content, excerpt, tags

3. **Blog Creation:**

   - n8n sends data to `create-blog` Edge Function
   - Edge Function creates blog with unique ID and slug
   - Returns success response

4. **User Dashboard:**

   - User goes to `/dashboard/blogs`
   - Sees new blog (as draft)
   - Can preview, edit, or publish

5. **Publishing:**
   - User clicks "Publish"
   - `is_publish` set to `true`
   - Blog accessible at `/slug`

## Useful Commands

```bash
# Deploy function
supabase functions deploy create-blog

# View logs
supabase functions logs create-blog

# List all functions
supabase functions list

# Delete function (if needed)
supabase functions delete create-blog
```

## Expected Database State

After successful blog creation:

```sql
blogs table:
┌──────────────────────────────────────┬─────────────────────┬──────────────────┬─────────────┐
│ id (UUID)                            │ title               │ slug             │ is_publish  │
├──────────────────────────────────────┼─────────────────────┼──────────────────┼─────────────┤
│ 550e8400-e29b-41d4-a716-446655440000 │ Getting Started...  │ getting-st-a1b2  │ false       │
│ 7c9e6679-7425-40de-944b-e07fc1f90ae7 │ 10 Tips for Code    │ 10-tips-fo-x9y8  │ false       │
└──────────────────────────────────────┴─────────────────────┴──────────────────┴─────────────┘
```

✅ Each row has a unique `id`  
✅ Each row has a unique `slug`  
✅ Default `is_publish = false`  
✅ Ready to publish!

## Next Steps

1. **Deploy the function** using the commands above
2. **Get the function URL** from the deployment output
3. **Update your n8n workflow** to call this URL
4. **Test** by submitting a YouTube URL
5. **Verify** the blog appears in `/dashboard/blogs`

Your blogs will now have guaranteed unique IDs! 🚀
