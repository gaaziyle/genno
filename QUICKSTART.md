# Quick Start Guide

Welcome to Genno! This guide will help you get started with the project.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js 18 or higher
- pnpm (recommended) or npm

## Installation

1. **Install Dependencies**

   ```bash
   pnpm install
   ```

2. **Start Development Server**

   ```bash
   pnpm dev
   ```

3. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Overview

Genno is a YouTube-to-Blog converter application that uses AI to transcribe and format video content into blog posts.

### Current Status: Design Phase ✅

This is a **design prototype** showcasing the user interface and user experience. The backend integration with n8n, YouTube API, and AI transcription services will be implemented in future phases.

## Available Pages

- **Homepage** (`/`) - Main landing page with all sections
- **404 Page** - Custom not-found page

## Project Structure

```
genno/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── loading.tsx        # Loading state
│   ├── not-found.tsx      # 404 page
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── Header.tsx
│   ├── HeroSection.tsx
│   ├── FeaturesSection.tsx
│   ├── HowItWorksSection.tsx
│   ├── TestimonialsSection.tsx
│   ├── PricingSection.tsx
│   └── Footer.tsx
└── public/                # Static assets
```

## Key Features (Design)

### 🎨 Modern UI/UX

- Glass morphism design
- Gradient backgrounds and text
- Smooth animations and transitions
- Responsive layout (mobile, tablet, desktop)

### 📱 Components

- **Header**: Sticky navigation with search
- **Hero Section**: Main CTA with YouTube URL input
- **Features**: 4 key features with icons
- **How It Works**: 3-step process explanation
- **Testimonials**: User reviews
- **Pricing**: 3-tier pricing structure
- **Footer**: Links and resources

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linter
pnpm lint
```

## Customization

### Colors

Edit `tailwind.config.ts` to change the color scheme. The current design uses:

- Primary: Purple (#a855f7)
- Secondary: Blue (#3b82f6)
- Background: Black (#0a0a0a)

### Content

Update the content in each component file:

- Hero text: `components/HeroSection.tsx`
- Features: `components/FeaturesSection.tsx`
- Testimonials: `components/TestimonialsSection.tsx`
- Pricing: `components/PricingSection.tsx`

## Next Steps

### Phase 1: Backend Integration (Future)

- [ ] Set up n8n workflow
- [ ] Integrate YouTube API
- [ ] Implement AI transcription (OpenAI Whisper)
- [ ] Create blog post formatter

### Phase 2: User Features (Future)

- [ ] User authentication (Clerk/Supabase)
- [ ] User dashboard
- [ ] Blog post editor
- [ ] Export functionality
- [ ] Usage tracking

### Phase 3: Publishing (Future)

- [ ] Direct publishing to platforms
- [ ] CMS integrations
- [ ] Webhook support
- [ ] API endpoints

## Need Help?

- Check out the [README.md](README.md) for more details
- Review the [DESIGN.md](DESIGN.md) for design system documentation
- Open an issue on GitHub (future)

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Heroicons (inline SVGs)
- **Font**: Inter (Google Fonts)

---

**Happy coding! 🚀**
