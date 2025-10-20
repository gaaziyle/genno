# Genno Logo Implementation

## Overview

The app now uses `genno-logo.png` for both the favicon and logo throughout the application.

## Files Updated

### 1. **`app/layout.tsx`** - Root Layout (Favicon)

✅ Updated metadata to use `/genno-logo.png` as favicon

```typescript
export const metadata: Metadata = {
  title: "Genno - YouTube to Blog Converter",
  description: "Transform YouTube videos into engaging blog posts with AI",
  icons: {
    icon: "/genno-logo.png",
    apple: "/genno-logo.png",
  },
};
```

### 2. **`app/dashboard/layout.tsx`** - Dashboard Sidebar

✅ Updated sidebar logo to use image

```tsx
<img src="/genno-logo.png" alt="Genno" className="w-6 h-6 rounded-md" />
```

### 3. **`components/Header.tsx`** - Landing Page Header

✅ Updated header logo to use image

```tsx
<img src="/genno-logo.png" alt="Genno" className="w-8 h-8 rounded-lg" />
```

### 4. **`app/[slug]/page.tsx`** - Public Blog Pages

✅ Updated public blog header logo

```tsx
<img src="/genno-logo.png" alt="Genno" className="w-8 h-8 rounded-md" />
```

## Logo Placement

### Where the Logo Appears

1. **Browser Tab** (Favicon)

   - Shows in browser tab
   - Shows in bookmarks
   - Shows in browser history

2. **Landing Page** (`/`)

   - Top-left corner header
   - 8x8 pixels, rounded

3. **Dashboard** (`/dashboard/*`)

   - Sidebar top-left
   - 6x6 pixels, rounded

4. **Public Blog Pages** (`/[slug]`)
   - Header top-left
   - 8x8 pixels, rounded

## File Location

The logo file should be located at:

```
c:\Users\muham\Desktop\genno\app\genno-logo.png
```

Or in the public folder:

```
c:\Users\muham\Desktop\genno\public\genno-logo.png
```

## Logo Specifications

### Recommended Format

- **Format:** PNG (with transparency)
- **Size:** 512x512 pixels (minimum)
- **Aspect Ratio:** 1:1 (square)
- **File Size:** < 100KB

### For Best Results

- Use transparent background
- High resolution (512x512 or higher)
- Simple, recognizable design
- Works well at small sizes

## Next.js Image Optimization

Currently using standard `<img>` tags. For better performance, you could use Next.js Image component:

```tsx
import Image from "next/image";

<Image
  src="/genno-logo.png"
  alt="Genno"
  width={32}
  height={32}
  className="rounded-md"
/>;
```

## Troubleshooting

### Issue: Logo not showing

**Solutions:**

1. **Check file exists:**

   - Verify `app/genno-logo.png` exists
   - Or move to `public/genno-logo.png`

2. **Check file permissions:**

   - Make sure file is readable

3. **Clear browser cache:**

   - Hard refresh: Ctrl + Shift + R
   - Or clear browser cache

4. **Check file path:**
   - If in `app/` folder, use: `/genno-logo.png`
   - If in `public/` folder, use: `/genno-logo.png`

### Issue: Favicon not updating

**Solution:**

```
1. Clear browser cache
2. Close and reopen browser
3. Check Network tab to see if genno-logo.png is loading
4. Restart Next.js dev server
```

### Issue: Logo appears broken/pixelated

**Solution:**

- Use higher resolution image (512x512 minimum)
- Use PNG format (not JPG)
- Ensure proper transparency

## Customization

### Change Logo Size

**Landing Page Header:**

```tsx
className = "w-8 h-8 rounded-lg"; // Current: 32x32px
className = "w-10 h-10 rounded-lg"; // Larger: 40x40px
```

**Dashboard Sidebar:**

```tsx
className = "w-6 h-6 rounded-md"; // Current: 24x24px
className = "w-8 h-8 rounded-md"; // Larger: 32x32px
```

### Change Rounding

```tsx
rounded - none; // Square corners
rounded - sm; // Slightly rounded
rounded - md; // Medium rounded (current)
rounded - lg; // Large rounded
rounded - full; // Circle
```

## Alternative: Use Favicon Only

If you want different images for favicon vs logo:

```typescript
// In app/layout.tsx
export const metadata: Metadata = {
  icons: {
    icon: "/favicon.ico", // Browser tab
    apple: "/apple-touch-icon.png", // iOS devices
  },
};

// In components, keep using genno-logo.png
<img src="/genno-logo.png" alt="Genno" />;
```

## Summary

✅ **Favicon** - Uses `genno-logo.png`  
✅ **Landing Page** - Uses `genno-logo.png`  
✅ **Dashboard** - Uses `genno-logo.png`  
✅ **Public Blogs** - Uses `genno-logo.png`

All logos now point to `/genno-logo.png`! Just make sure the file exists in your project. 🎨
