# 🚀 Senior AI Engineer Portfolio — Vibe Coding Prompt
> Stack: Vite + React + TypeScript + Tailwind CSS + shadcn/ui + Supabase + Three.js
> Design Ref: Dark sci-fi dashboard aesthetic (think Microsoft Fabric AI Playbook UI)

---

## 🎯 PROJECT OVERVIEW

Build a **jaw-dropping personal portfolio** for a Senior AI Software Engineer. The goal is to make every visitor say *"wow"* within the first 3 seconds, then keep them engaged through a dense, polished dark UI that feels like a product — not a template.

### Core Philosophy
- **First impression**: Dramatic Three.js 3D hero scene (particle field / neural network globe)
- **Sustained impression**: Dark sci-fi dashboard UI with neon accents, badge pills, glowing cards
- **Credibility**: Real data from Supabase CMS (projects, blog posts, experience)
- **Personality**: Feels like a living product, not a static resume

---

## 🗂️ FULL TECH STACK

```
Frontend:   Vite + React 19 + TypeScript
Styling:    Tailwind CSS v4 + shadcn/ui (Tailwind v4-compatible)
3D:         Three.js + @react-three/fiber + @react-three/drei
Animation:  Framer Motion
Database:   Supabase (PostgreSQL + Auth + Storage + Realtime)
Icons:      Lucide React
Fonts:      "Space Grotesk" (headings) + "JetBrains Mono" (code/labels)
Deploy:     Vercel
```

### Install commands
```bash
# 1. Scaffold project (React 19 + TypeScript)
npm create vite@latest portfolio -- --template react-ts
cd portfolio
npm install

# 2. Install Tailwind CSS v4 (Vite-first — NO postcss or autoprefixer needed)
npm install tailwindcss @tailwindcss/vite

# 3. Configure vite.config.ts — add the Tailwind plugin
# (see vite.config.ts snippet below)

# 4. Replace src/index.css content with:
# @import "tailwindcss";
# (see Design System section for full CSS with @theme)

# 5. Init shadcn/ui (latest — supports Tailwind v4 natively)
npx shadcn@latest init

# 6. Install remaining dependencies
npm install @supabase/supabase-js
npm install three @react-three/fiber @react-three/drei
npm install framer-motion
npm install lucide-react
npm install react-markdown remark-gfm rehype-highlight
npm install @fontsource/space-grotesk @fontsource/jetbrains-mono
npm install -D @types/three @types/node
```

### `vite.config.ts` — required for Tailwind v4
```ts
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
```

> ⚠️ **Tailwind v4 key changes**: No `tailwind.config.ts`, no `postcss.config.js`, no `content` array.
> Everything is configured directly in your CSS file using `@theme {}`. See Design System below.

---

## 🎨 DESIGN SYSTEM

### `src/index.css` — Full CSS-first config (Tailwind v4)

In Tailwind v4, **there is no `tailwind.config.ts`**. All custom tokens (colors, fonts, shadows) are declared directly in your CSS using the `@theme` directive. Replace the entire contents of `src/index.css` with:

```css
@import "tailwindcss";
@import "@fontsource/space-grotesk/400.css";
@import "@fontsource/space-grotesk/600.css";
@import "@fontsource/space-grotesk/700.css";
@import "@fontsource/jetbrains-mono/400.css";
@import "@fontsource/jetbrains-mono/500.css";

@theme {
  /* ── Colors ─────────────────────────────────────── */
  --color-bg-primary:    #0a0c10;
  --color-bg-secondary:  #0f1117;
  --color-bg-elevated:   #161b22;
  --color-border:        #21262d;
  --color-border-glow:   #30363d;

  --color-accent-cyan:   #00d4ff;
  --color-accent-green:  #00ff88;
  --color-accent-orange: #ff6b35;
  --color-accent-purple: #7c3aed;
  --color-accent-pink:   #ff2d78;

  --color-text-primary:   #e6edf3;
  --color-text-secondary: #8b949e;
  --color-text-muted:     #484f58;

  /* ── Typography ─────────────────────────────────── */
  --font-display: "Space Grotesk", sans-serif;
  --font-mono:    "JetBrains Mono", monospace;

  /* ── Shadows ─────────────────────────────────────── */
  --shadow-glow-cyan:  0 0 20px color-mix(in oklch, #00d4ff 30%, transparent);
  --shadow-glow-green: 0 0 20px color-mix(in oklch, #00ff88 25%, transparent);
  --shadow-glow-card:  0 8px 32px rgb(0 0 0 / 0.6);
}

/* Base resets */
* { box-sizing: border-box; }

html {
  scroll-behavior: smooth;
}

body {
  background-color: var(--color-bg-primary);
  color: var(--color-text-primary);
  font-family: var(--font-display);
  -webkit-font-smoothing: antialiased;
}
```

> ✅ With `@theme`, all tokens are auto-available as Tailwind utilities:
> `bg-bg-primary`, `text-accent-cyan`, `font-display`, `shadow-glow-cyan`, etc.
> No `extend`, no JS config file required.

### `tsconfig.json` + `tsconfig.app.json` — path aliases (required for shadcn)

Vite splits TS config into two files — update **both**:

```json
// tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

```json
// tsconfig.app.json — add inside "compilerOptions"
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

### Component Tokens (reuse everywhere — Tailwind v4 utility classes)
> All token names below map directly from your `@theme` block in `index.css`.

- **Pill Badge**: `rounded-full border text-xs px-3 py-1 font-mono` with color variants
- **Card**: `bg-bg-elevated border border-[--color-border] rounded-xl p-6 hover:border-accent-cyan/40 transition-all`
- **Section Label**: `font-mono text-xs uppercase tracking-widest text-accent-cyan`
- **Glow Line**: 1px rule with `bg-linear-to-r from-transparent via-accent-cyan to-transparent`

---

## 🗄️ SUPABASE SCHEMA

Run these in Supabase SQL Editor:

```sql
-- Projects table
create table projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  tagline text,
  description text,
  industry text,                    -- e.g. "Healthcare", "Finance"
  tags text[],                      -- ["LangChain", "RAG", "FastAPI"]
  impact text,                      -- "Very High" | "High" | "Medium"
  difficulty text,                  -- "Advanced" | "Intermediate"
  build_time text,                  -- "4-6 hrs", "2 weeks"
  demo_url text,
  github_url text,
  thumbnail_url text,
  featured boolean default false,
  is_new boolean default false,
  order_index int default 0,
  created_at timestamptz default now()
);

-- Experience table
create table experience (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  period text not null,             -- "Jan 2022 – Present"
  location text,
  description text,
  highlights text[],                -- bullet points
  tech_stack text[],
  company_logo_url text,
  order_index int default 0
);

-- Blog posts table
create table blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,                     -- markdown content
  tags text[],
  cover_image_url text,
  is_published boolean default false,
  views int default 0,
  read_time_minutes int,
  published_at timestamptz
);

-- Skills table
create table skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,           -- "AI/ML", "Cloud", "Backend", "Frontend", "Data"
  proficiency int,                  -- 1-100
  icon_url text,
  is_featured boolean default false
);

-- Contact submissions
create table contact_submissions (
  id uuid primary key default gen_random_uuid(),
  name text,
  email text,
  message text,
  created_at timestamptz default now()
);

-- Enable RLS
alter table projects enable row level security;
alter table experience enable row level security;
alter table blog_posts enable row level security;
alter table skills enable row level security;
alter table contact_submissions enable row level security;

-- Public read policies
create policy "Public read projects" on projects for select using (true);
create policy "Public read experience" on experience for select using (true);
create policy "Public read published blogs" on blog_posts for select using (is_published = true);
create policy "Public read skills" on skills for select using (true);
create policy "Public insert contact" on contact_submissions for insert with check (true);
```

---

## 📁 PROJECT STRUCTURE

```
src/
├── components/
│   ├── 3d/
│   │   ├── HeroCanvas.tsx          # Three.js scene wrapper
│   │   ├── NeuralGlobe.tsx         # Animated particle globe
│   │   └── FloatingParticles.tsx   # Background particle field
│   ├── layout/
│   │   ├── Navbar.tsx              # Fixed top nav with blur
│   │   └── Footer.tsx
│   ├── sections/
│   │   ├── Hero.tsx                # 3D scene + headline + CTA
│   │   ├── Projects.tsx            # Filterable project cards grid
│   │   ├── Skills.tsx              # Animated skill categories
│   │   ├── Experience.tsx          # Vertical timeline
│   │   ├── Blog.tsx                # Article cards grid
│   │   └── Contact.tsx             # Form + socials
│   └── ui/
│       ├── PillBadge.tsx           # Reusable colored pill
│       ├── GlowCard.tsx            # Hover-glow card wrapper
│       ├── SectionHeader.tsx       # Labeled section title
│       ├── FilterBar.tsx           # Industry/tag filter pills
│       └── LoadingShimmer.tsx      # Skeleton loader
├── hooks/
│   ├── useProjects.ts
│   ├── useExperience.ts
│   ├── useBlog.ts
│   └── useSkills.ts
├── lib/
│   ├── supabase.ts                 # Supabase client init
│   └── utils.ts                   # cn(), formatDate(), etc.
├── types/
│   └── index.ts                   # TypeScript interfaces
└── pages/
    ├── index.tsx                   # Main single-page
    └── blog/[slug].tsx             # Blog post page
```

---

## 🌐 SECTION-BY-SECTION BUILD GUIDE

---

### 1. 🔮 HERO SECTION (`Hero.tsx`)

**Goal**: First 3 seconds = jaw-drop. Neural network globe + dramatic headline.

#### Three.js Neural Globe (`NeuralGlobe.tsx`)
```tsx
// Build a sphere of 200+ nodes connected by glowing lines
// Nodes: small icosphere points, color accent-cyan
// Connections: lines between nearby nodes, opacity based on distance
// Animation: slow Y-axis rotation, subtle pulsing node brightness
// Use @react-three/fiber Canvas + useFrame for animation loop
// Add PointLight in cyan + subtle ambient light

// Key Three.js params:
const GLOBE_RADIUS = 2.5;
const NODE_COUNT = 250;
const CONNECTION_DISTANCE = 0.8;
const ROTATION_SPEED = 0.002;
```

#### Hero Layout
```
┌─────────────────────────────────────────────────────┐
│  [NAVBAR]                                           │
│                                                     │
│         ┌──────────────────┐                       │
│         │   🔮 3D GLOBE    │   SENIOR AI            │
│         │   (Three.js)     │   SOFTWARE ENGINEER    │
│         │                  │                        │
│         │  rotating neural │   Building intelligent │
│         │  network sphere  │   systems that scale   │
│         └──────────────────┘                        │
│                                                     │
│  [ View Projects ↓ ]   [ Download CV ]              │
│                                                     │
│  ── CURRENTLY AVAILABLE FOR ──────────────────────  │
│  🟢 Freelance   🟢 Consulting   🟢 Full-Time        │
└─────────────────────────────────────────────────────┘
```

#### Headline Animation (Framer Motion)
```tsx
// Stagger each word of headline with 0.1s delay
// Slide up + fade in from y: 20 → y: 0
// Globe: scale 0 → 1 with spring easing on mount
// Stats row: count-up animation on numbers
```

---

### 2. 📂 PROJECTS SECTION (`Projects.tsx`)

**Goal**: Replicate the playbook UI from the reference screenshots.

#### Layout: Left sidebar list + Right detail panel
```
┌──────────────────────┬──────────────────────────────┐
│  FILTER BAR          │                              │
│  [All] [AI/ML] [NLP] │  ┌──────────────────────┐   │
│  [Vision] [Backend]  │  │ HEALTHCARE  AI/ML     │   │
├──────────────────────┤  │                       │   │
│  ■ Healthcare        │  │ Patient Risk Predictor│   │
│    Patient Risk AI   │  │ Subtitle here         │   │
│    ADVANCED  4-6wks  │  │                       │   │
│                      │  │ [Advanced] [Very High]│   │
│  ■ Finance           │  │ [Build: 3 months]     │   │
│    Fraud Detection   │  ├───────────────────────┤   │
│    ...               │  │ OVERVIEW  TECH  DEMO  │   │
│                      │  ├───────────────────────┤   │
│  ■ NLP               │  │ Description text...   │   │
│    ...               │  │                       │   │
│                      │  │ ARCHITECTURE FLOW     │   │
│                      │  │ 1 → Step one          │   │
│                      │  │ 2 → Step two          │   │
└──────────────────────┴──────────────────────────┘
```

#### Project Card (sidebar item)
```tsx
// Left colored border based on industry color
// Industry label (uppercase, muted, font-mono)
// Project title (bold, text-primary)
// Badge row: difficulty pill + build time pill
// Active state: bg-elevated, left border accent-cyan glow
// Hover: translateX(4px) transition
```

#### Detail Panel tabs: Overview | Architecture | Tech Stack | Links

---

### 3. ⚡ SKILLS SECTION (`Skills.tsx`)

**Goal**: Dense, impressive — shows the breadth of a Senior AI engineer.

#### Layout: Category cards in responsive grid
```
┌─────────────────────────────────────────────────┐
│  ── SKILLS & EXPERTISE ────────────────────────  │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐             │
│  │  🤖 AI / ML  │  │ ☁️  Cloud    │             │
│  │              │  │              │             │
│  │  PyTorch     │  │  Azure       │             │
│  │  ████████░░  │  │  ████████░░  │             │
│  │  LangChain   │  │  AWS         │             │
│  │  ███████░░░  │  │  GCP         │             │
│  └──────────────┘  └──────────────┘             │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐             │
│  │ 🛠 Backend   │  │ 📊 Data Eng  │             │
│  └──────────────┘  └──────────────┘             │
└─────────────────────────────────────────────────┘
```

#### Skill Bar Animation
```tsx
// On scroll into view: width animates from 0 to proficiency%
// Bar color: gradient from accent-cyan to accent-green
// Stagger delay per skill item: index * 0.05s
// Use Framer Motion + Intersection Observer (useInView)
```

---

### 4. 📅 EXPERIENCE SECTION (`Experience.tsx`)

**Goal**: Vertical timeline — clean, readable, impressive.

#### Layout
```
┌─────────────────────────────────────────────────┐
│  ── EXPERIENCE ─────────────────────────────────  │
│                                                  │
│  2023–Now  │  ● ─────────────────────────────   │
│            │    Senior AI Engineer @ Company     │
│            │    [Azure] [LangChain] [FastAPI]    │
│            │    • Led RAG pipeline for 1M docs   │
│            │    • Reduced inference latency 40%  │
│                                                  │
│  2021–23   │  ○ ─────────────────────────────   │
│            │    ML Engineer @ Company B          │
│            │    ...                              │
└─────────────────────────────────────────────────┘
```

#### Animation
```tsx
// Timeline line draws downward on scroll (SVG stroke-dashoffset trick)
// Each entry fades in from left as it enters viewport
// Company logo thumbnail (from Supabase Storage)
// Tech stack pills below description
```

---

### 5. 📝 BLOG SECTION (`Blog.tsx`)

**Goal**: Editorial feel — cards with subtle image overlays.

#### Card Design
```
┌──────────────────────────────────┐
│  [cover image with gradient fade]│
│  ─────────────────────────────── │
│  [AI/ML]  [RAG]                  │
│  Article Title Here              │
│  Short excerpt text              │
│  ── ─────────────────────────── │
│  Jan 2025  •  8 min read  •  👁 2.1k│
└──────────────────────────────────┘
```

#### Blog Post Page (`/blog/[slug]`)
```tsx
// Render markdown content (use react-markdown + remark-gfm)
// Code blocks: syntax highlighted (use rehype-highlight or shiki)
// Dark reading layout: max-w-2xl centered, generous line-height
// Progress bar at top shows read progress
// Back button → returns to portfolio with smooth scroll to #blog
```

---

### 6. 📬 CONTACT SECTION (`Contact.tsx`)

**Goal**: Clean, futuristic form. Supabase insert on submit.

#### Layout
```
┌─────────────────────────────────────────────────┐
│  Let's build something remarkable together.     │
│                                                  │
│  ┌─────────────────┐  ┌────────────────────┐   │
│  │ Name            │  │ Email              │   │
│  └─────────────────┘  └────────────────────┘   │
│  ┌──────────────────────────────────────────┐   │
│  │ Message                                  │   │
│  │                                          │   │
│  └──────────────────────────────────────────┘   │
│                                                  │
│  [ Send Message → ]                             │
│                                                  │
│  Or reach me at:  GitHub  LinkedIn  X  Email    │
└─────────────────────────────────────────────────┘
```

#### Supabase submit handler
```tsx
const handleSubmit = async (data: ContactForm) => {
  const { error } = await supabase
    .from('contact_submissions')
    .insert([{ name: data.name, email: data.email, message: data.message }]);
  if (!error) toast.success("Message sent! I'll reply within 24 hours.");
};
```

---

## 🔧 SUPABASE CLIENT SETUP

```ts
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

```ts
// src/hooks/useProjects.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export const useProjects = (filter?: string) => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      let query = supabase.from('projects').select('*').order('order_index');
      if (filter && filter !== 'All') query = query.eq('industry', filter);
      const { data } = await query;
      setProjects(data || []);
      setLoading(false);
    };
    fetch();
  }, [filter]);

  return { projects, loading };
};
```

---

## 🎬 ANIMATIONS MASTER PLAN

### Page Load Sequence (stagger everything)
```
0.0s  Navbar fades in from top
0.2s  Hero 3D globe scales in (spring)
0.4s  Hero headline words stagger up
0.6s  Hero subtext fades in
0.8s  CTA buttons slide up
1.0s  Stats row counts up
```

### Scroll Animations (Framer Motion + useInView)
```tsx
// Every section: fade up from y:40 as it enters viewport
// Skills bars: animate width on enter
// Timeline: line draws down, entries stagger left→right
// Project cards: stagger in 0.05s apart
// Blog cards: 3D tilt on hover (rotateX/Y based on mouse position)
```

### 3D Globe Interactions
```tsx
// Mouse move: globe tilts slightly toward cursor (lerp)
// Click on globe: burst particle explosion then reform
// Scroll past hero: globe shrinks and fades gracefully
```

### Micro-interactions
```tsx
// Nav links: underline slides from left on hover
// Buttons: subtle scale(0.97) on press
// Cards: translateY(-4px) + border-glow on hover
// Filter pills: smooth bg-color transition
// Badge pills: glow pulse on hover
```

---

## 🧩 REUSABLE COMPONENTS SPEC

### `PillBadge.tsx`
```tsx
// Props: label, variant: 'cyan'|'green'|'orange'|'purple'|'muted', size: 'sm'|'md'
// Uses: shadcn Badge as base, override with custom colors
// Includes optional glowing dot prefix (for status indicators)
```

### `GlowCard.tsx`
```tsx
// Wrapper div with: bg-elevated, border, rounded-xl
// On hover: border-color transitions to accent-cyan/40
// Box shadow: glow-cyan on hover
// Optional: 3D mouse-tracking tilt (onMouseMove → rotateX/Y)
```

### `SectionHeader.tsx`
```tsx
// Props: label (ALL CAPS pill), title, subtitle
// Layout: pill label → h2 title → muted subtitle
// Decorative: thin glow line before the label
```

### `FilterBar.tsx`
```tsx
// Scrollable horizontal list of filter pills
// Active pill: accent-cyan bg, white text
// Inactive: muted border, secondary text
// On click: animated background slides to new active item
```

---

## 🌟 WOW-FACTOR EXTRAS (implement after core is done)

1. **Custom Cursor**: Replace default cursor with small glowing cyan dot + trailing circle
2. **Noise Texture Overlay**: Very subtle grain texture on bg (CSS `filter: url(#noise)` SVG trick) 
3. **Typing Effect**: Hero role title cycles through: "AI Engineer" → "ML Architect" → "LLM Builder"
4. **Live GitHub Activity**: Supabase Edge Function fetches GitHub contributions, shows streak
5. **Easter Egg**: Konami code triggers a particle explosion across the whole page
6. **Scroll Progress Bar**: Thin accent-cyan line at very top of viewport
7. **Availability Dot**: Pulsing green dot in nav: "Open to opportunities"
8. **Page Transitions**: Framer Motion AnimatePresence for route changes

---

## ⚙️ ENV VARIABLES

```bash
# .env.local
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🚀 BUILD & DEPLOY

```bash
# Development
npm run dev

# Build
npm run build

# Deploy to Vercel
npx vercel --prod
# Set env vars in Vercel dashboard
```

---

## ✅ BUILD ORDER (Recommended)

1. [ ] Setup Vite + TS + Tailwind + shadcn
2. [ ] Configure Supabase, create tables, add RLS policies
3. [ ] Build design system (colors, fonts, CSS vars)
4. [ ] Build reusable components (PillBadge, GlowCard, SectionHeader, FilterBar)
5. [ ] Build Navbar
6. [ ] Build Hero section (layout first, add 3D globe last)
7. [ ] Build Projects section (sidebar + detail panel)
8. [ ] Build Skills section
9. [ ] Build Experience timeline
10. [ ] Build Blog section + post page
11. [ ] Build Contact form (wire to Supabase)
12. [ ] Add Three.js Neural Globe to Hero
13. [ ] Add all Framer Motion animations
14. [ ] Add wow-factor extras
15. [ ] Populate Supabase with real content
16. [ ] Deploy to Vercel

---

*Built with 🤖 for a Senior AI Software Engineer who refuses to ship boring portfolios.*
