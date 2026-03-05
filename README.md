# 🚀 Senior AI Engineer — Portfolio

A **jaw-dropping personal portfolio** built with a dark sci-fi dashboard aesthetic. Features 3D visuals, glowing cards, smooth animations, and a Supabase-powered backend for dynamic content and contact form with email notifications.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase&logoColor=white)

---

## ✨ Features

- **3D Hero Scene** — Particle field + neural network globe via Three.js / React Three Fiber
- **Dark Sci-Fi UI** — Neon accent glow cards, pill badges, custom cursor, smooth scroll
- **Supabase CMS** — Projects, experience, skills, and blog posts pulled from PostgreSQL
- **Contact Form** — Saves to DB + sends email via Resend (Supabase Edge Function)
- **Spam Protection** — Cloudflare Turnstile CAPTCHA, honeypot, time-based check, server-side rate limiting & validation
- **Blog** — Markdown rendering with syntax highlighting, view count tracking
- **Konami Code Easter Egg** — Try `↑↑↓↓←→←→BA` 🎉
- **Fully Responsive** — Mobile-first design with smooth Framer Motion animations

---

## 🛠️ Tech Stack

| Layer     | Technology                                        |
| --------- | ------------------------------------------------- |
| Framework | React 19 + TypeScript                             |
| Build     | Vite 7                                            |
| Styling   | Tailwind CSS v4 + shadcn/ui                       |
| 3D        | Three.js + @react-three/fiber + @react-three/drei |
| Animation | Framer Motion                                     |
| Backend   | Supabase (PostgreSQL + Edge Functions)            |
| Email     | Resend API                                        |
| CAPTCHA   | Cloudflare Turnstile                              |
| Icons     | Lucide React                                      |
| Fonts     | Space Grotesk + JetBrains Mono                    |
| Deploy    | Vercel                                            |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── 3d/                 # Three.js scenes (Hero, Globe, Particles)
│   ├── layout/             # Navbar, Footer
│   ├── sections/           # Hero, Projects, Experience, Skills, Blog, Contact
│   └── ui/                 # GlowCard, PillBadge, Turnstile, CustomCursor, etc.
├── hooks/                  # Data-fetching hooks (useProjects, useBlog, etc.)
├── lib/                    # Supabase client, utilities
├── pages/                  # Home, BlogPost
└── types/                  # TypeScript interfaces
supabase/
├── functions/              # Edge Functions (send-contact-email)
├── migration.sql           # Database schema
└── seed.sql                # Sample data
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- (Optional) [Resend](https://resend.com) account for email notifications
- (Optional) [Cloudflare Turnstile](https://dash.cloudflare.com/?to=/:account/turnstile) site for CAPTCHA

### 1. Clone & install

```bash
git clone <your-repo-url>
cd portfolio
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optional — Cloudflare Turnstile (CAPTCHA on contact form)
VITE_TURNSTILE_SITE_KEY=0x4AAAAAAA...
```

### 3. Set up Supabase

Run the migration and seed scripts in your Supabase SQL Editor:

```sql
-- 1. Create tables & RLS policies
-- (paste contents of supabase/migration.sql)

-- 2. Seed sample data
-- (paste contents of supabase/seed.sql)
```

### 4. Deploy the Edge Function (optional — for email notifications)

```bash
# Set secrets
supabase secrets set RESEND_API_KEY=re_your_key
supabase secrets set CONTACT_RECIPIENT_EMAIL=you@example.com
supabase secrets set TURNSTILE_SECRET_KEY=0x4AAAAAAA...

# Deploy
supabase functions deploy send-contact-email --no-verify-jwt
```

### 5. Run locally

```bash
npm run dev
```

---

## 📦 Scripts

| Command           | Description                      |
| ----------------- | -------------------------------- |
| `npm run dev`     | Start dev server with HMR        |
| `npm run build`   | Type-check + production build    |
| `npm run preview` | Preview production build locally |
| `npm run lint`    | Run ESLint                       |

---

## 🔒 Contact Form Security

The public contact form is protected by multiple layers:

| Layer                | Location        | Purpose                                            |
| -------------------- | --------------- | -------------------------------------------------- |
| Honeypot field       | Client          | Hidden input that bots auto-fill; silently rejects |
| Time-based check     | Client          | Rejects submissions under 2 seconds                |
| Cloudflare Turnstile | Client + Server | Invisible CAPTCHA verified server-side             |
| Rate limiting        | Edge Function   | Max 3 requests/IP/minute                           |
| Input validation     | Edge Function   | Email format, length limits, required fields       |

---

## 📄 License

This project is for personal use. Feel free to use it as inspiration for your own portfolio.
