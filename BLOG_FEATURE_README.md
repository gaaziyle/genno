# Blog Feature Documentation

## Overview

I've created a complete blog management system for Genno that allows users to create, view, edit, and manage blog posts. The system is integrated with Supabase for data persistence and uses Clerk for user authentication.

## What Was Created

### 1. **Database Integration**

- **File**: `lib/supabase.ts`
- Supabase client configuration
- TypeScript interface for BlogPost type
- Connects to your Supabase database

### 2. **Database Schema**

- **File**: `supabase-schema.sql`
- Complete SQL schema to execute in Supabase SQL Editor
- Includes:
  - Blogs table with all necessary columns
  - Indexes for performance optimization
  - Row Level Security (RLS) policies
  - Automatic timestamp updates
  - Blog statistics view

### 3. **Blog Pages**

#### a. Blog List Page

- **Route**: `/dashboard/blogs`
- **File**: `app/dashboard/blogs/page.tsx`
- Features:
  - Display all user's blogs in a table format
  - Statistics cards (total, published, drafts)
  - Filter by status (all, published, drafts)
  - Actions: view, edit, publish/unpublish, delete
  - Empty state with call-to-action

#### b. Create Blog Page

- **Route**: `/dashboard/blogs/new`
- **File**: `app/dashboard/blogs/new/page.tsx`
- Features:
  - Form to create new blog posts
  - Fields: title, excerpt, content, YouTube URL, thumbnail, tags
  - Publish immediately or save as draft
  - Image preview for thumbnails

#### c. View Blog Page

- **Route**: `/dashboard/blogs/[id]`
- **File**: `app/dashboard/blogs/[id]/page.tsx`
- Features:
  - Display full blog post with formatting
  - Show thumbnail, metadata, tags
  - Link to original YouTube video (if provided)
  - Edit button for quick access

#### d. Edit Blog Page

- **Route**: `/dashboard/blogs/edit/[id]`
- **File**: `app/dashboard/blogs/edit/[id]/page.tsx`
- Features:
  - Pre-filled form with existing blog data
  - Update any blog field
  - Permission check (only owner can edit)
  - Auto-save functionality

### 4. **Navigation**

- **Updated**: `app/dashboard/layout.tsx`
- Added "My Blogs" link to sidebar navigation
- Active state highlighting for blog routes

### 5. **Setup Documentation**

- **File**: `SUPABASE_SETUP.md`
- Comprehensive step-by-step guide for:
  - Creating a Supabase project
  - Getting API credentials
  - Setting up environment variables
  - Running the SQL schema
  - Troubleshooting common issues

## Features

### Blog Management

- ✅ Create new blog posts
- ✅ Edit existing blogs
- ✅ Delete blogs with confirmation
- ✅ Publish/unpublish toggle
- ✅ View blog details
- ✅ Filter by status (all, published, drafts)

### Blog Fields

- **Title**: Required text field
- **Content**: Required textarea (supports Markdown)
- **Excerpt**: Optional short description
- **YouTube URL**: Optional link to source video
- **Thumbnail URL**: Optional image for the blog
- **Tags**: Optional array of tags (comma-separated)
- **Published**: Boolean status (draft or published)

### Data Features

- **User Association**: Each blog is linked to the Clerk user ID
- **Timestamps**: Automatic created_at and updated_at tracking
- **Row Level Security**: Users can only edit their own blogs
- **Statistics**: Real-time counts of total, published, and draft blogs

## Setup Instructions

### Step 1: Install Dependencies

Already completed! Supabase client has been installed.

### Step 2: Configure Environment Variables

Create a `.env.local` file in your project root with:

```env
# Clerk Authentication (existing)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Supabase (add these)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Step 3: Set Up Supabase

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your Project URL and anon key from Project Settings > API
3. Go to SQL Editor in your Supabase dashboard
4. Copy and run the entire `supabase-schema.sql` file

### Step 4: Restart Your Dev Server

```bash
pnpm dev
```

### Step 5: Test the Feature

1. Log in to your application
2. Click "My Blogs" in the sidebar
3. Create a new blog post
4. Test all CRUD operations

## Database Schema

### Blogs Table Structure

```sql
CREATE TABLE blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    youtube_url TEXT,
    thumbnail_url TEXT,
    user_id TEXT NOT NULL,  -- Clerk user ID
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published BOOLEAN DEFAULT false,
    tags TEXT[]
);
```

### Security

The schema includes Row Level Security policies:

- Users can view all published blogs
- Users can view all their own blogs (published or draft)
- Users can only create, update, and delete their own blogs

## File Structure

```
app/
├── dashboard/
│   ├── blogs/
│   │   ├── [id]/
│   │   │   └── page.tsx           # View blog
│   │   ├── edit/
│   │   │   └── [id]/
│   │   │       └── page.tsx       # Edit blog
│   │   ├── new/
│   │   │   └── page.tsx           # Create blog
│   │   └── page.tsx               # Blog list
│   └── layout.tsx                 # Updated sidebar
lib/
└── supabase.ts                    # Supabase client
supabase-schema.sql                # Database schema
SUPABASE_SETUP.md                  # Setup guide
```

## Usage Examples

### Creating a Blog Post

1. Navigate to `/dashboard/blogs`
2. Click "New Blog Post"
3. Fill in the required fields (title, content)
4. Optionally add excerpt, YouTube URL, thumbnail, and tags
5. Check "Publish immediately" or save as draft
6. Click "Create Blog Post"

### Editing a Blog Post

1. Navigate to `/dashboard/blogs`
2. Click the edit icon (pencil) on any blog
3. Update the fields you want to change
4. Click "Save Changes"

### Publishing/Unpublishing

1. From the blog list, click the eye icon to toggle publish status
2. Published blogs show a green status badge
3. Draft blogs show a gray status badge

### Deleting a Blog

1. Click the delete icon (trash) on any blog
2. Confirm the deletion in the popup
3. The blog will be permanently removed

## Next Steps & Enhancements

You can extend this feature with:

- **Rich Text Editor**: Replace textarea with a WYSIWYG editor (e.g., TipTap, Quill)
- **Markdown Rendering**: Use `react-markdown` to render markdown in blog view
- **Image Upload**: Integrate Supabase Storage for image uploads
- **YouTube Integration**: Auto-fetch video details from YouTube API
- **Blog Analytics**: Track views, likes, comments
- **Search & Filter**: Add search functionality and tag-based filtering
- **Export**: Export blogs to PDF or Medium
- **Share**: Social media sharing buttons
- **SEO**: Add meta tags and Open Graph data

## Troubleshooting

### "Supabase environment variables are not set"

- Ensure `.env.local` exists with correct variables
- Restart your development server

### "Failed to create blog post"

- Check browser console for specific errors
- Verify Supabase credentials are correct
- Ensure SQL schema was executed successfully

### Blogs not appearing

- Verify Row Level Security policies were created
- Check that user_id matches your Clerk user ID
- Look in Supabase Table Editor to see if data exists

## Support Files

- **SUPABASE_SETUP.md**: Detailed setup guide
- **supabase-schema.sql**: Database schema to execute in Supabase
- **lib/supabase.ts**: Type definitions and client configuration

---

🎉 **Your blog feature is ready to use!** Follow the setup instructions in `SUPABASE_SETUP.md` to get started.
