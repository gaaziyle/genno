# Genno - YouTube to Blog Converter

Transform YouTube videos into engaging blog posts with AI-powered transcription and formatting.

## Features

- 🎥 **AI-Powered Transcription**: Automatically transcribe YouTube videos with high accuracy
- 📝 **Smart Formatting**: Convert transcripts into well-structured blog posts
- ⚡ **Lightning Fast**: Process videos in minutes, not hours
- 💾 **Multiple Export Options**: Export to Markdown, HTML, or directly to your CMS
- 🎨 **Beautiful UI**: Modern, responsive design built with Next.js and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Package Manager**: pnpm

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm

### Installation

1. Install dependencies:

```bash
pnpm install
```

2. Run the development server:

```bash
pnpm dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
genno/
├── app/
│   ├── layout.tsx       # Root layout
│   ├── page.tsx         # Homepage
│   └── globals.css      # Global styles
├── components/
│   ├── Header.tsx       # Navigation header
│   ├── HeroSection.tsx  # Hero/landing section
│   ├── FeaturesSection.tsx
│   ├── HowItWorksSection.tsx
│   ├── TestimonialsSection.tsx
│   ├── PricingSection.tsx
│   └── Footer.tsx
└── public/              # Static assets
```

## Future Development

This is currently a design prototype. Future development will include:

- Integration with n8n for workflow automation
- YouTube video transcription API
- AI-powered content generation
- User authentication and accounts
- Blog post editor and customization
- Direct publishing to popular platforms

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
