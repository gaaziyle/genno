# Genno - Sections Guide

Visual reference for all sections on the homepage.

## 📋 Page Sections Overview

### 1️⃣ Status Banner

**Location**: Top of page (above header)  
**Purpose**: Announce updates or special messages  
**Content**:

- "Genno v1.0 beta is now available!"
- CTA link: "Learn more →"

**Design**:

- Purple/blue gradient background
- Centered text
- Dismissible (can be implemented)

---

### 2️⃣ Header

**Location**: Sticky at top  
**Purpose**: Main navigation  
**Elements**:

- Logo (G icon + "Genno" text)
- Navigation links:
  - Features
  - How it Works
  - Pricing
  - Testimonials
- Search bar with "/" shortcut
- Login button
- Sign up button (gradient)

**Design**:

- Backdrop blur effect
- Sticky positioning
- Glass morphism

---

### 3️⃣ Hero Section

**Location**: First main section  
**Purpose**: Primary CTA and value proposition  
**Elements**:

- Main heading: "Transform YouTube videos into engaging blogs"
- Subtitle explaining Genno
- Tech badges: React, Next.js, AI Powered
- Two CTAs:
  - "Get started for free" (gradient)
  - "View live demo →" (outline)
- YouTube URL input field
- Quick try section
- "Trusted by" logos

**Design**:

- Large gradient backgrounds
- Animated gradient blob
- Prominent CTAs
- Input with convert button

**Metrics**:

- Height: ~900px
- Max-width: 1280px

---

### 4️⃣ Features Section

**Location**: After hero  
**Purpose**: Showcase key features  
**Elements**:

- Section badge: "Features"
- Heading: "Everything you need to repurpose video content"
- 4 feature cards:
  1. AI-Powered Transcription
  2. Smart Formatting
  3. Lightning Fast
  4. Export Options

**Design**:

- 4-column grid (responsive)
- Glass morphism cards
- Gradient icons
- Hover effects

**Card Structure**:

- Icon (gradient background)
- Title
- Description

---

### 5️⃣ How It Works Section

**Location**: After features  
**Purpose**: Explain the process  
**Elements**:

- Heading: "How it works"
- 3 steps:
  1. Paste YouTube URL
  2. AI Processing
  3. Get Your Blog
- Code example block

**Design**:

- 3-column grid
- Numbered badges (01, 02, 03)
- Connection lines between steps
- Code syntax highlighting

**Step Structure**:

- Number badge (gradient circle)
- Icon
- Title
- Description

---

### 6️⃣ Testimonials Section

**Location**: After how it works  
**Purpose**: Social proof  
**Elements**:

- Heading: "Loved by creators worldwide"
- 6 testimonial cards:
  - Sarah Johnson (Content Creator)
  - Michael Chen (Marketing Director)
  - Emma Rodriguez (Blogger & Podcaster)
  - David Kim (Startup Founder)
  - Lisa Anderson (Educational Content Creator)
  - James Wilson (Digital Marketer)

**Design**:

- 3-column grid (responsive)
- Glass morphism cards
- 5-star ratings
- User avatars (initials)

**Card Structure**:

- Rating stars (5)
- Quote/testimonial text
- User avatar
- User name
- User role

---

### 7️⃣ Pricing Section

**Location**: After testimonials  
**Purpose**: Present pricing options  
**Elements**:

- Section badge: "Pricing"
- Heading: "Simple, transparent pricing"
- 3 pricing tiers:
  1. **Starter** (Free)
     - 5 videos/month
     - Basic features
  2. **Pro** ($29/month) ⭐ Most Popular
     - 50 videos/month
     - Advanced features
     - API access
  3. **Enterprise** (Custom)
     - Unlimited videos
     - Dedicated support
     - White-label

**Design**:

- 3-column grid
- Pro tier scaled up (scale-105)
- "Most Popular" badge
- Different button styles per tier

**Card Structure**:

- Tier name
- Price
- Description
- Feature list (with checkmarks)
- CTA button

---

### 8️⃣ Footer

**Location**: Bottom of page  
**Purpose**: Links and information  
**Elements**:

- Brand section:
  - Logo
  - Tagline
  - Social media icons
- Resources column:
  - Documentation
  - API Reference
  - Guides
  - Blog
- Company column:
  - About
  - Careers
  - Contact
  - Partners
- Legal column:
  - Privacy
  - Terms
  - Security
  - Cookies
- Copyright notice

**Design**:

- 4-column grid (responsive)
- Dark background
- Border top
- Social icons in grid

---

## 🎨 Design Patterns Used

### Glass Morphism

- Used in: Header, Feature cards, Testimonial cards
- Effect: `backdrop-blur-sm` + `bg-white/5`

### Gradients

- Used in: Headings, Buttons, Backgrounds, Icons
- Colors: Purple (#a855f7) to Blue (#3b82f6)

### Hover Effects

- Scale transform
- Border color changes
- Background opacity changes
- Shadow glows

### Responsive Grid

- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

---

## 📐 Spacing System

- **Section Padding**: `py-32` (128px vertical)
- **Container Padding**: `px-4` (16px horizontal)
- **Max Width**: 1280px (max-w-7xl)
- **Gap**:
  - Cards: `gap-8` (32px)
  - Elements: `gap-4` (16px)

---

## 🎯 Call-to-Actions (CTAs)

### Primary CTAs

- "Get started for free" (Hero)
- "Start Free Trial" (Pricing Pro)
- Gradient background
- Shadow glow

### Secondary CTAs

- "View live demo" (Hero)
- "Contact Sales" (Pricing)
- Outline style
- Hover fill

### Tertiary CTAs

- "Learn more" (Banner)
- "Check our FAQ" (Pricing)
- Text links
- Color change on hover

---

## 📱 Responsive Breakpoints

```
Mobile (< 768px)
├── 1 column layouts
├── Stacked navigation
└── Full-width cards

Tablet (768px - 1024px)
├── 2 column layouts
├── Horizontal navigation
└── Medium cards

Desktop (> 1024px)
├── 3-4 column layouts
├── Full navigation
└── Optimal spacing
```

---

## 🔄 Interactive Elements

1. **Header Search**: Click to open search modal (placeholder)
2. **YouTube Input**: Enter URL and click Convert
3. **Navigation Links**: Smooth scroll to sections
4. **Hover Cards**: Scale and border effects
5. **CTA Buttons**: Transform scale on hover

---

## ✨ Animation Details

- **Gradient Blob**: Pulse animation (Hero background)
- **Loading Spinner**: Rotate animation
- **Hover Transforms**: Scale 1.05 on buttons
- **Transitions**: All transitions ~300ms
- **Backdrop Blur**: Smooth blur effect on scroll

---

This guide provides a complete overview of every section built in the Genno landing page! 🚀
