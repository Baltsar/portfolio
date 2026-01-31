# Project Context for Cursor AI Agent

## Project Overview

Single-page LIVE workbench portfolio: presence dashboard with Landing ("Who I Am") + LIVE PROJECT card. Dark 2026 aesthetic, glassmorphism, pulsing LIVE indicator. Built for vibe coding and eventual GitHub API integration.

## Document priority (for AI)

When building the LIVE workbench portfolio, **LIVE WORKBENCH PORTFOLIO.md** is the source of truth for layout, design system, sections, content rules, and tech choices for this page. Where it conflicts with AGENTS.md (e.g. one allowed `globals.css`, component folders `landing/` and `live-project/`), follow LIVE WORKBENCH for this project.

## Tech Stack

### Frontend
- Next.js 15 (App Router)
- React 19 Server Components
- TypeScript (strict mode)
- ShadCN/UI components
- Tailwind CSS
- Framer Motion
- Lucide React icons

### Forms & Validation
- React Hook Form
- Zod schemas

### Backend
- Next.js API Routes
- Server Actions
- Prisma ORM (if using database)

### Deployment
- Vercel (auto-deploy on push)

## Commands

```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build
npm run lint         # ESLint
npm run type-check   # TypeScript check
```

## Structure

```
app/
├── (routes)/       # Route groups
├── api/            # API routes
├── layout.tsx      
└── page.tsx        

components/
├── ui/             # ShadCN (don't modify)
├── shared/         # Custom components
├── landing/        # LIVE workbench: Hero, Stack
└── live-project/   # LIVE workbench: ProjectCard, StatusIndicator, UpdateLog

lib/
├── utils.ts        # Helpers
├── db.ts           # Database (if Prisma)
├── auth.ts         # Auth (if using)
└── github.ts       # GitHub API (LIVE workbench, future)

styles/             # Optional; for LIVE workbench
└── globals.css     # Design tokens + keyframes only

types/
└── index.ts        # TypeScript types
```

## Environment Variables

`.env.local`:
```
DATABASE_URL="..."              # If database
NEXTAUTH_SECRET="..."           # If NextAuth
NEXTAUTH_URL="http://localhost:3000"
```

## Code Style

- ShadCN/UI only
- Tailwind CSS only
- Server Components default
- TypeScript strict
- No `any` types
- **One allowed exception:** one `app/globals.css` or `styles/globals.css` for design tokens (CSS variables) and keyframes only (e.g. LIVE workbench). No other standalone CSS files.

## Don'ts

❌ Custom CSS files (except the single globals.css for design system)
❌ Inline styles
❌ Other UI libraries
❌ `any` types
❌ console.log in production
❌ Hardcoded URLs

## Current Focus

Building LIVE workbench portfolio: Phase 1 (structure) → Phase 2 (glassmorphism, LIVE indicator) → Phase 3 (polish, performance). Single page, two sections only.

## Known Issues

None currently.

## Next Steps

- [ ] GitHub API integration for real-time project updates
- [ ] Deploy LIVE workbench to Vercel
- [ ] Optional: dark/light toggle, multiple project cards, command palette
