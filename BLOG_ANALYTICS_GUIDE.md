# Blog Analytics Implementation Guide

## Overview

This implementation adds dynamic analytics to your dashboard based on blog visitor tracking. The system tracks unique visitors per blog and displays real-time analytics in the dashboard.

## Features Implemented

### 1. Unique Visitor Tracking

- Each visitor is tracked using a unique identifier based on IP address and User Agent
- Visitors can only be counted once per blog (prevents duplicate counting)
- Tracks visits automatically when someone views a published blog

### 2. Dynamic Dashboard Analytics

- **Total Visitors**: Shows all-time unique visitors across all blogs
- **Last 7 Days**: Shows unique visitors in the past week
- **Last 30 Days**: Shows unique visitors in the past month
- **Published Blogs**: Shows count of published blogs
- **Percentage Change**: Shows growth/decline compared to previous period

### 3. Interactive Charts

- Bar chart showing daily unique visitors over the last 30 days
- Chart updates dynamically based on real visitor data
- Shows zero values when no visitors (empty state)

### 4. Blog Performance Table

- Lists blogs sorted by visitor count
- Shows total visitors and last 7 days visitors
- Visual progress bars showing relative performance

### 5. Recent Activity Feed

- Shows recent blog activity with visitor counts
- Displays time since last visit
- Updates in real-time

## Database Schema

The implementation adds a new `blog_analytics` table with the following structure:

```sql
CREATE TABLE blog_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  blog_id UUID NOT NULL REFERENCES blogs(id) ON DELETE CASCADE,
  visitor_id TEXT NOT NULL,
  visited_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## API Endpoints

### 1. Track Visit (`/api/analytics/track`)

- **Method**: POST
- **Body**: `{ "blogId": "uuid" }`
- **Purpose**: Records a unique visit to a blog
- **Access**: Public (anyone can track visits)

### 2. Get Analytics Data (`/api/analytics/data`)

- **Method**: GET
- **Query Parameters**: `?days=30`
- **Purpose**: Fetches analytics data for dashboard
- **Access**: Authenticated users only (their own data)

## Setup Instructions

### 1. Run Database Migration

Execute the SQL schema in `blog_analytics_schema.sql` in your Supabase database:

```bash
# Copy the contents of blog_analytics_schema.sql and run in Supabase SQL editor
```

### 2. Deploy API Routes

The API routes are already created in:

- `app/api/analytics/track/route.ts`
- `app/api/analytics/data/route.ts`

### 3. Update Dashboard

The dashboard has been updated to use real analytics data instead of mock data.

### 4. Blog Tracking

Blog pages automatically track visits when loaded (already implemented).

## How It Works

1. **Visitor Tracking**: When someone visits a blog page (`/[slug]`), the page automatically calls the tracking API
2. **Unique Identification**: Each visitor gets a unique ID based on their IP + User Agent hash
3. **Database Storage**: Visit data is stored in `blog_analytics` table with unique constraints
4. **Dashboard Display**: Dashboard fetches analytics data and displays it in real-time
5. **Privacy**: Only blog owners can see analytics for their own blogs

## Privacy & Security

- **No Personal Data**: Only IP + User Agent hash is stored (not actual IP)
- **Row Level Security**: Users can only see analytics for their own blogs
- **Unique Tracking**: Each visitor counted only once per blog
- **Public Access**: Blog pages remain publicly accessible (no login required)

## Testing

1. **Create a blog** and publish it
2. **Visit the blog** in incognito mode (this counts as a unique visitor)
3. **Check dashboard** - you should see visitor count increase
4. **Visit again** - count should not increase (unique visitor tracking)
5. **Use different browser/IP** - count should increase again

## Troubleshooting

### No Analytics Data Showing

- Ensure the database schema has been applied
- Check that blogs are published (`is_publish = true`)
- Verify API routes are accessible
- Check browser console for errors

### Duplicate Visitors Being Counted

- This shouldn't happen due to unique constraints
- Check that visitor ID generation is working correctly
- Verify database constraints are in place

### Dashboard Not Loading

- Check authentication (user must be logged in)
- Verify API endpoints are responding
- Check browser network tab for failed requests

## Future Enhancements

Potential improvements you could add:

- Geographic visitor tracking
- Referrer tracking
- Time spent on page
- Bounce rate analytics
- Export analytics data
- Email notifications for new visitors
- Visitor heatmaps
