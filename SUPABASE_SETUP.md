# Supabase Setup Guide for Genno

This guide will help you set up Supabase for the blog functionality in Genno.

## Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com) and create an account (if you haven't already)
2. Click "New Project"
3. Fill in the project details:
   - **Name**: Genno (or your preferred name)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the region closest to your users
4. Click "Create new project" and wait for it to be provisioned

## Step 2: Get Your API Credentials

1. Once your project is ready, go to **Project Settings** (gear icon in the sidebar)
2. Click on **API** in the left menu
3. You'll need two values:
   - **Project URL**: This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key**: This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Step 3: Set Up Environment Variables

1. In your project root, create a file named `.env.local` (if it doesn't exist)
2. Add the following variables:

```env
# Clerk Authentication (you should already have these)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

3. Replace the placeholder values with your actual credentials from Step 2

## Step 4: Create the Database Schema

1. In your Supabase Dashboard, go to **SQL Editor** (database icon in the sidebar)
2. Click **New Query**
3. Copy the entire contents of the `supabase-schema.sql` file from your project root
4. Paste it into the SQL Editor
5. Click **Run** to execute the SQL

This will:

- Create the `blogs` table with all necessary columns
- Set up indexes for better performance
- Enable Row Level Security (RLS)
- Create policies for data access control
- Add triggers for automatic timestamp updates

## Step 5: Verify the Setup

1. Go to **Table Editor** in your Supabase Dashboard
2. You should see a table named `blogs` with the following columns:
   - `id` (uuid, primary key)
   - `title` (text)
   - `content` (text)
   - `excerpt` (text)
   - `youtube_url` (text)
   - `thumbnail_url` (text)
   - `user_id` (text)
   - `created_at` (timestamp)
   - `updated_at` (timestamp)
   - `published` (boolean)
   - `tags` (text array)

## Step 6: Test the Integration

1. Restart your development server:

   ```bash
   pnpm dev
   ```

2. Log in to your application
3. Navigate to **My Blogs** in the sidebar
4. Try creating a new blog post
5. The blog should be saved to your Supabase database

## Understanding Row Level Security (RLS)

The database schema includes RLS policies that ensure:

- Users can only view, edit, and delete their own blogs
- Published blogs can be viewed by everyone
- Users cannot access other users' draft blogs

## Database Schema Details

### Blogs Table

| Column        | Type      | Description                            |
| ------------- | --------- | -------------------------------------- |
| id            | UUID      | Unique identifier for the blog post    |
| title         | TEXT      | Blog post title                        |
| content       | TEXT      | Full blog content (supports Markdown)  |
| excerpt       | TEXT      | Short description/summary              |
| youtube_url   | TEXT      | Original YouTube video URL             |
| thumbnail_url | TEXT      | URL to the blog thumbnail image        |
| user_id       | TEXT      | Clerk user ID of the author            |
| created_at    | TIMESTAMP | When the blog was created              |
| updated_at    | TIMESTAMP | Last update timestamp (auto-updated)   |
| published     | BOOLEAN   | Whether the blog is published or draft |
| tags          | TEXT[]    | Array of tags associated with the blog |

### Indexes

- `idx_blogs_user_id`: Fast filtering by user
- `idx_blogs_created_at`: Efficient sorting by date
- `idx_blogs_published`: Quick filtering of published/draft posts

## Troubleshooting

### Error: "Supabase environment variables are not set"

- Make sure your `.env.local` file exists and contains the correct variables
- Restart your development server after adding environment variables

### Error: "Failed to create blog post"

- Check the browser console for detailed error messages
- Verify that the SQL schema was executed successfully
- Ensure your Supabase project is active and not paused

### Blogs not appearing

- Check if Row Level Security is enabled
- Verify that the user_id matches your Clerk user ID
- Try checking the Supabase Table Editor to see if data is being inserted

## Next Steps

Once you have Supabase set up, you can:

- Create blog posts from YouTube videos
- Manage your blog posts (edit, delete, publish/unpublish)
- Filter blogs by status (all, published, drafts)
- Add tags and thumbnails to your blogs

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
