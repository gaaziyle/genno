# Design Documentation

## Overview

Genno is a modern web application designed to transform YouTube videos into blog posts using AI. The design is inspired by contemporary SaaS landing pages with a focus on clarity, usability, and visual appeal.

## Design System

### Color Palette

- **Primary**: Purple (`#a855f7`) - Main brand color
- **Secondary**: Blue (`#3b82f6`) - Accent color
- **Background**: Black (`#0a0a0a`) - Main background
- **Text**:
  - Primary: White (`#ededed`)
  - Secondary: Gray-400 (`#9ca3af`)

### Typography

- **Font Family**: Inter (via Google Fonts)
- **Headings**:
  - H1: 6xl-8xl (96px-128px), Bold
  - H2: 5xl-6xl (48px-60px), Bold
  - H3: 2xl (24px), Semibold
- **Body**: Base-xl (16px-20px), Regular

### Components

#### Header

- Sticky navigation with backdrop blur
- Logo with gradient
- Navigation links
- Search bar with keyboard shortcut
- CTA buttons (Login, Sign up)

#### Hero Section

- Large gradient heading
- Subtitle with description
- Tech stack badges (React, Next.js, AI)
- Dual CTA buttons
- YouTube URL input for quick try
- Trusted by section

#### Features Section

- 4-column grid layout
- Icon + Title + Description cards
- Gradient icons with hover effects
- Glass morphism card design

#### How It Works Section

- 3-step process with numbered badges
- Connection lines between steps
- Icon representations
- Code example block

#### Testimonials Section

- 3-column grid of testimonial cards
- 5-star ratings
- User avatars with initials
- Quote-style formatting

#### Pricing Section

- 3-tier pricing structure
- "Most Popular" badge for Pro tier
- Feature lists with checkmarks
- Gradient CTA buttons
- Scale effect on hover for popular tier

#### Footer

- 4-column layout
- Brand section with social links
- Resources, Company, Legal links
- Copyright notice

### Visual Effects

1. **Gradients**

   - Background gradients: Purple to Blue
   - Text gradients: White to Gray, Purple to Blue
   - Button gradients: Purple to Blue

2. **Glass Morphism**

   - Backdrop blur on cards
   - Semi-transparent backgrounds
   - Border highlights

3. **Animations**

   - Hover scale effects
   - Gradient blob animation (pulse)
   - Loading spinner rotation
   - Smooth transitions

4. **Shadows**
   - Glow effects on CTAs
   - Card shadows on hover
   - Layered depth

## Layout Structure

```
┌─────────────────────────────────────┐
│           Status Banner             │
├─────────────────────────────────────┤
│             Header                  │
├─────────────────────────────────────┤
│         Hero Section                │
│   (Gradient Background + CTA)       │
├─────────────────────────────────────┤
│       Features Section              │
│        (4 Feature Cards)            │
├─────────────────────────────────────┤
│     How It Works Section            │
│     (3 Steps + Code Block)          │
├─────────────────────────────────────┤
│    Testimonials Section             │
│      (6 Testimonial Cards)          │
├─────────────────────────────────────┤
│       Pricing Section               │
│       (3 Pricing Tiers)             │
├─────────────────────────────────────┤
│           Footer                    │
│   (Links + Social + Copyright)      │
└─────────────────────────────────────┘
```

## Responsive Design

- **Mobile**: Single column, stacked layout
- **Tablet**: 2-column grids
- **Desktop**: 3-4 column grids

### Breakpoints

- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

## Accessibility

- Semantic HTML structure
- ARIA labels for icons
- Keyboard navigation support
- Focus indicators
- Color contrast ratios meet WCAG AA standards

## Future Enhancements

1. Dark/Light theme toggle
2. Animated illustrations
3. Video demonstrations
4. Interactive pricing calculator
5. Blog section integration
6. User dashboard design
7. Editor interface for blog posts
8. Settings and preferences pages
