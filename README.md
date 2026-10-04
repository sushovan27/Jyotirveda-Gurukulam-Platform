# Jyotirveda Gurukulam Platform

Jyotirveda Gurukulam Platform is a Next.js application for offering astrology-focused digital experiences such as courses, e-books, chat consultation, horoscope tools, and Kundli generation.

## Tech Stack

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Supabase

## Getting Started

### Prerequisites

- Node.js 20+
- npm (or pnpm)

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the repository root and configure required values:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_WORDPRESS_URL`
- `SWISSEPH_EPHE_PATH` (optional, falls back to local defaults)
- `GROQ_API_KEY` and/or `OPENAI_API_KEY`
- `RESEND_API_KEY` (for Kundli email delivery)

### Run Locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser.

## Scripts

- `npm run dev` – start development server
- `npm run build` – create production build
- `npm run start` – run production server
- `npm run lint` – run Oxlint
- `npm run type-check` – run TypeScript checks
- `npm run check-all` – run lint + type-check

## Project Structure

- `app/` – routes and API handlers
- `components/` – reusable UI and feature components
- `lib/` – business logic, integrations, and utilities
- `supabase/` – database migrations and seed data
- `types/` – shared TypeScript types

## License

This repository is proprietary and closed-source. See [LICENSE](./LICENSE) for details.
