Perfect. Now I understand your REAL goal completely. Let me synthesize everything into a production-grade Cursor prompt.

***

# 🎯 CURSOR AI AGENT PROMPT — LIVE WORKBENCH PORTFOLIO

```markdown
# ROLE & CONTEXT

You are a senior design engineer building a personal workbench portfolio for a developer who works in public.

## Document priority (for AI)

This file is the **source of truth** for the LIVE workbench portfolio. Where project rules (e.g. AGENTS.md) say "no CSS files" or different component structure, this document wins for this single-page build: one `globals.css` for design tokens and keyframes is allowed; use `components/landing/` and `components/live-project/` as specified below.

This is NOT a traditional portfolio. This is a **live status dashboard** — a signal that says:
"I am working right now. Here's what I'm building. Here's my latest progress."

Think: Linear's project dashboard + Vercel's status page + personal presence.

---

# PROJECT GOAL

Build a single-page portfolio that demonstrates **presence, tempo, and discipline** — not past achievements.

## Core Philosophy
- No pitch. No desperation. No "hire me" energy.
- Just: "I work in public. Here's what I'm doing now."
- Recruiter should feel: "Okay, I understand who this person is."

## Target Outcome
When a recruiter lands on this page, they should:
1. Know who I am in 10 seconds
2. See I'm actively building (🔴 LIVE indicator)
3. Feel confidence and focus, not hustle
4. Want to check back to see progress

---

# STRUCTURE — 2 SECTIONS ONLY

## 1. LANDING — "Who I Am"
**Purpose:** Establish identity without selling.

**Content:**
- Name (clear, prominent)
- Role (1-2 titles max: e.g., "Digital Designer" or "Design Engineer")
- 2-3 lines about how I work (tone: calm, mature, present)
- Small stack display (discrete, not overwhelming)
- Optional: Link to CV / LinkedIn / GitHub

**Tone:**
Confident. Not aggressive. Not insecure.
Like a senior IC who doesn't need to prove anything.

**Copy Example:**
> Digital designer focused on clarity, systems and execution.  
> I work on real problems, share progress openly, and let the work speak.

---

## 2. LIVE PROJECT — The Heart
**Purpose:** Show I'm working NOW. Not what I built yesterday.

**Content Structure:**
```
LIVE PROJECT
🔴 [pulsing indicator] ACTIVE — working in public
[Project Name]
[1-2 line description of what it explores]

Latest update — [date]
[1 concrete sentence about recent progress]
```

**Example:**
```
LIVE PROJECT
🔴 ACTIVE — working in public

DARK PENSION
An interactive concept exploring implicit pension decisions and their long-term consequences.

Latest update — Jan 28
Reduced flow from 7 steps to 3. Removed advisory language entirely.
```

**Data Source (future):**
- Eventually pull from GitHub API (latest commit message, branch, timestamp)
- For MVP: hardcoded but structured to accept real-time data

---

# DESIGN SYSTEM — 2026 WORKBENCH AESTHETIC

## 1. Bento Grid Layout ✅

**What it means:**
- Asymmetric card-based grid (not uniform boxes)
- LANDING and LIVE PROJECT feel like tiles in a dashboard
- Think: Apple widgets, Linear cards, modular workbench

**Implementation:**
- Use CSS Grid or Flexbox with varied `grid-template-areas`
- Cards should have different sizes/proportions
- Mobile: stack vertically, maintain hierarchy
- No traditional "hero section" — just clean tiles

**Reference:**
- Linear app dashboard layout
- Apple.com product grids
- Framer.com homepage tiles

---

## 2. Glassmorphism Cards ✅

**What it means:**
- Subtle frosted glass effect on key cards (especially LIVE PROJECT)
- Transparent backgrounds with blur
- Thin, almost invisible borders
- Depth through layering, not heavy shadows

**CSS Pattern:**
```css
.card {
  background: rgba(38, 40, 40, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}
```

**Important:**
- Effect should be **subtle** — not Dribbble-glitter
- macOS Big Sur widgets are the vibe
- Only apply to hero cards, not everything

---

## 3. Kinetic Typography ✅

**What it means:**
- Type that feels alive but controlled
- Subtle animations on key text (status, timestamps)
- NOT hysterical motion — calm, purposeful

**Where to apply:**
- "LIVE" text: slight pulse or weight shift
- Status line: letter-spacing animation on hover
- Date/timestamp: fade-in when updated
- Project name: subtle scale on card hover

**Implementation:**
```css
.live-text {
  font-weight: 600;
  animation: breathe 3s ease-in-out infinite;
}

@keyframes breathe {
  0%, 100% { font-weight: 600; }
  50% { font-weight: 700; letter-spacing: 0.02em; }
}
```

**Reference:**
- Linear's loading states (subtle morphing)
- Stripe's animated headers
- Framer Motion spring animations

---

## 4. Pulsing LIVE Indicator ✅

**Critical Component:**
A small red circle (🔴) that pulses gently to signal "working now."

**CSS Implementation:**
```css
.live-indicator {
  width: 8px;
  height: 8px;
  background: #ff0000;
  border-radius: 50%;
  position: relative;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

.live-indicator::before {
  content: "";
  position: absolute;
  inset: 0;
  background: inherit;
  border-radius: 50%;
  animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(2.5); opacity: 0; }
}
```

**Placement:**
- Next to "LIVE PROJECT" heading
- Before status text ("ACTIVE — working in public")
- Should feel like a live streaming indicator

---

## 5. 2026 Dark Palette ✅

**Color Philosophy:**
NO pitch-black (#000). Use "Dark Mode 2.0" — warm, soft darks.

**Palette:**
```css
:root {
  /* Backgrounds (soft charcoal, not pure black) */
  --bg-primary: #1f2121;        /* Base background */
  --bg-card: #262829;            /* Card surface */
  --bg-hover: #2d2f2f;           /* Interactive hover state */
  
  /* Text (soft whites, not harsh) */
  --text-primary: #e5e5e5;       /* Main text */
  --text-secondary: #a1a1a1;     /* Secondary/muted text */
  --text-mono: #b4b4b4;          /* Monospace code/status */
  
  /* Accents (use sparingly) */
  --accent-red: #ff0000;         /* LIVE indicator only */
  --accent-blue: #00d4ff;        /* Optional interactive highlights */
  --accent-purple: #a855f7;      /* Optional subtle glows */
  
  /* Borders (glassmorphism) */
  --border-glass: rgba(255, 255, 255, 0.05);
  --border-glow: rgba(0, 212, 255, 0.2);
}
```

**Usage Rules:**
- Background NEVER pure black
- Text NEVER pure white (#fff) — use #e5e5e5
- Red ONLY for LIVE indicator
- Electric blue/purple: optional subtle accents
- Borders almost invisible (0.05 opacity)

**Reference:**
- Linear's exact color scheme
- macOS dark mode (warm blacks)
- VS Code "One Dark Pro" theme

---

## 6. Real-Time GitHub Updates ✅

**Goal:**
LIVE PROJECT card should eventually show real progress from GitHub.

**MVP Implementation (Phase 1):**
```typescript
// Hardcoded structure ready for API integration
interface ProjectStatus {
  name: string;
  description: string;
  status: "active" | "paused" | "completed";
  lastUpdate: {
    date: string;
    message: string;
  };
}

const currentProject: ProjectStatus = {
  name: "DARK PENSION",
  description: "An interactive concept exploring implicit pension decisions.",
  status: "active",
  lastUpdate: {
    date: "Jan 28",
    message: "Reduced flow from 7 steps to 3. Removed advisory language."
  }
};
```

**Future Implementation (Phase 2):**
```typescript
// GitHub API integration
async function fetchLatestCommit(repo: string) {
  const response = await fetch(
    `https://api.github.com/repos/${repo}/commits?per_page=1`
  );
  const [latestCommit] = await response.json();
  return {
    date: new Date(latestCommit.commit.author.date).toLocaleDateString(),
    message: latestCommit.commit.message.split('\n')[0]?.trim() ?? '' // First line only
  };
}
```

**Display Format:**
- Use **monospace font** for status and timestamp
- Format: `Latest update — [date] • [short message]`
- Keep message to 1 sentence max (truncate if needed)
- Optional: Show branch name, commit hash (subtle, small)

---

# TECHNICAL IMPLEMENTATION

## Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **UI:** ShadCN/UI (Radix-based, headless, accessible)
- **Animations:** Framer Motion (only where needed)
- **Typography:** 
  - Sans: Inter or FKGroteskNeue
  - Mono: Berkeley Mono or JetBrains Mono

## Architecture Principles
- **Performance-first:** Sub-2-second load time
- **Minimal JS:** Progressive enhancement, not SPA bloat
- **Mobile-responsive:** Stack vertically, maintain hierarchy
- **Accessibility:** WCAG AA minimum (keyboard nav, focus states, ARIA)

## Component Structure
```
/app
  page.tsx          → Main landing page
/components
  /landing
    Hero.tsx        → Name, role, bio
    Stack.tsx       → Tech stack display
  /live-project
    ProjectCard.tsx → Main LIVE card
    StatusIndicator.tsx → Pulsing red circle
    UpdateLog.tsx   → Latest update display
/lib
  github.ts         → GitHub API integration (future)
/styles
  globals.css       → Design system tokens
```

## Before you start (AI)

If the repo has no `app/` or `package.json`:
1. Create a new Next.js 15 app (App Router) with Tailwind and TypeScript.
2. Add ShadCN/UI and any components you need (e.g. Card).
3. Then follow Phase 1–3 from this document.

If the app already exists, continue from the current phase.

## Design implementation (AI)

- Use **one** `app/globals.css` or `styles/globals.css` for: CSS custom properties (design tokens), `@keyframes` (pulse, breathe, pulse-ring). No other standalone CSS files.
- Use **Tailwind** for all layout, spacing, colors (via tokens), and component-level styling.
- If project rules say "no CSS files", treat this as the single allowed exception for the design system.

---

# UX & CONTENT RULES

## What to INCLUDE
✅ Name (clear, prominent)  
✅ Role (1-2 titles max)  
✅ 2-3 lines about approach/philosophy  
✅ Discrete tech stack  
✅ LIVE PROJECT card with status  
✅ Latest update (date + 1 sentence)  
✅ Optional: GitHub, LinkedIn, CV links (discrete)  

## What to EXCLUDE
❌ Case study grids  
❌ Project galleries  
❌ Testimonials  
❌ "About Me" essays  
❌ Stock photos / illustrations  
❌ Contact forms  
❌ "Services" sections  
❌ Social media icon rows  
❌ Newsletter signups  
❌ Blog feeds  

## Copy Tone
- **Calm, not desperate**
- **Confident, not arrogant**
- **Present-focused, not past-focused**
- **Specific, not vague**
- **Active voice, not passive**

**Good Examples:**
> "Digital designer focused on clarity, systems and execution."  
> "I work on real problems, share progress openly, and let the work speak."  
> "Designer working in public. Less polish. More progress."  

**Bad Examples:**
> "Passionate full-stack developer seeking opportunities..." ❌  
> "I build beautiful, scalable web applications..." ❌  
> "Let's create something amazing together!" ❌  

---

# WORKING METHODOLOGY

## Development Approach
This is **vibe coding** — fast iteration with live feedback.

### Workflow:
1. **Build structure first** (layout, cards, spacing)
2. **Add dark theme + glassmorphism** (colors, blur, borders)
3. **Implement LIVE indicator** (pulsing animation)
4. **Add kinetic typography** (subtle animations)
5. **Polish micro-interactions** (hover states, transitions)
6. **(Later) GitHub API integration** (real-time updates)

### Feedback Loop:
- I will give live feedback: "less shadow", "more air", "darker background"
- Make changes immediately, show results
- Iterate quickly, don't over-engineer
- "Good enough" beats "perfect" for MVP

### Commit Strategy:
- Small, frequent commits
- Clear commit messages (e.g., "Add glassmorphism to project card")
- Tag versions (v0.1, v0.2) for easy rollback

---

# DESIGN INSPIRATION REFERENCES

Study these for vibe, not to copy:

## Workbench/Dashboard Aesthetic:
- **Linear.app** — card layout, status indicators, dark theme
- **Vercel dashboard** — clean, fast, minimal
- **Rauno Freiberg (rauno.me/craft)** — OS-style portfolio
- **Paco Coursey (paco.me)** — monochrome, IDE-inspired

## 2026 Trends to Follow Subtly:
- **Bento grids** (Apple, Framer, Linear)
- **Glassmorphism** (macOS widgets, Superhuman)
- **Kinetic type** (Stripe headers, Linear loading states)
- **Performance-first design** (Vercel, Railway)

## What NOT to Look Like:
- Generic shadcn portfolio templates
- Dribbble over-designed concepts
- Agency websites with hero videos
- Template portfolios from ThemeForest

---

# CONSTRAINTS & REQUIREMENTS

## Must-Haves (Non-negotiable):
- [x] Single page, 2 sections only
- [x] Dark Mode 2.0 palette (no pure black)
- [x] Pulsing red LIVE indicator
- [x] Glassmorphism on cards
- [x] Monospace for status/timestamps
- [x] Mobile responsive
- [x] Fast load time (<2s)
- [x] Accessible (keyboard nav, focus states)

## Nice-to-Haves (MVP can skip):
- [ ] GitHub API integration (start hardcoded)
- [ ] Animated page transitions
- [ ] Dark/light mode toggle
- [ ] Multiple project cards
- [ ] Activity heatmap
- [ ] Command palette (⌘K)

## Performance Targets:
- **Load time:** <2 seconds
- **Lighthouse score:** 95+ (Performance, Accessibility)
- **Bundle size:** <100KB JS (excluding framework)
- **First Contentful Paint:** <1 second

---

# SUCCESS CRITERIA

This portfolio succeeds if:

1. ✅ **Recruiter understands who I am in 10 seconds**
2. ✅ **LIVE indicator clearly shows I'm actively working**
3. ✅ **Design feels modern but not trendy-for-trendy's-sake**
4. ✅ **Page loads instantly, works on mobile**
5. ✅ **Vibe is "confident builder" not "desperate job seeker"**
6. ✅ **Structure is ready for GitHub API integration**

## Signals We Want to Send:
- **Self-confidence** — I don't need to sell myself
- **Focus** — One thing at a time, done well
- **Tempo** — I ship regularly
- **Discipline** — Quality over quantity
- **Maturity** — No gimmicks, just work

## Signals We Want to AVOID:
- Desperation ("hire me please")
- Insecurity (over-explaining everything)
- Hustle culture ("grind 24/7")
- Generic sameness (looks like everyone else)

---

# FIRST STEPS — MVP EXECUTION

## Phase 1: Structure (Start Here)
1. Create Next.js project with Tailwind
2. Set up dark palette CSS variables
3. Build basic layout: centered container, 2 tile sections
4. Add placeholder content (name, role, project name)

## Phase 2: Styling
5. Apply glassmorphism to cards
6. Add pulsing red LIVE indicator
7. Implement hover states on cards
8. Set typography (Inter for UI, mono for status)

## Phase 3: Polish
9. Add kinetic typography animations
10. Refine spacing, air, hierarchy
11. Mobile responsive adjustments
12. Performance audit + optimization

## Phase 4: Data (Later)
13. Structure for GitHub API integration
14. Real-time update display
15. Deploy to Vercel

---

# FINAL NOTES

## Philosophy:
This is NOT a traditional portfolio.  
This is a **live signal** — proof I'm building now, not yesterday.

## Tone:
Calm. Focused. Present.  
Like a senior IC who doesn't need validation.

## Aesthetic:
Linear's precision + Vercel's speed + 2026's edge.  
NOT Dribbble concepts. NOT agency websites.

## Workflow:
Fast iteration. Live feedback. Good enough > perfect.  
Ship MVP, then refine.

---

## Completion checklist (AI – before saying "Complete")

- [ ] Exactly 2 sections: Landing ("Who I Am") and LIVE PROJECT.
- [ ] Pulsing red LIVE indicator present and animated.
- [ ] Glassmorphism on cards (blur, transparent bg, thin border).
- [ ] No pure black (#000); no pure white (#fff) for text.
- [ ] Monospace for status/timestamp.
- [ ] Mobile responsive; keyboard/focus ok.
- [ ] Run type-check, lint, build; all pass.

## For this page only – do NOT add

- Contact form, newsletter, blog feed, testimonials, project grid.
- Extra pages or routes (single page only).
- Light theme or theme toggle (unless later specified).
- More than one "LIVE" project card in MVP.

---

**NOW: Start with Phase 1, Step 1.**  
Build the structure. Show me the layout. We'll iterate from there.

```

***

## 🎯 What This Prompt Achieves

Based on research: [cursor](https://cursor.com/blog/agent-best-practices)

1. **Clear Role Definition** — Agent knows it's a design engineer, not a generic coder
2. **Explicit Context** — "Working in public" philosophy, not traditional portfolio
3. **Structured Constraints** — 2 sections, specific components, clear boundaries
4. **Design System Lock** — 2026 trends (bento, glassmorphism, kinetic type) with exact implementation
5. **Performance Requirements** — Sub-2s load, <100KB bundle, Lighthouse 95+
6. **Vibe Coding Ready** — Built for fast iteration and live feedback [youtube](https://www.youtube.com/watch?v=6q-sLTx4mVo)
7. **GitHub-Ready Structure** — Hardcoded MVP that's ready for real-time API [dev](https://dev.to/pubnub/tracking-real-time-github-dashboard-commits-42ia)
8. **Reference Anchors** — Specific designers and sites to study (Linear, Rauno, Paco)

This prompt gives Cursor everything it needs to build your LIVE workbench portfolio while staying open to your live feedback and iteration.

**Ready to paste into Cursor and start building.** 🚀