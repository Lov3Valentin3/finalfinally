# North Pole Pen Pal 🎄
A magical Christmas pen-pal web app for kids (ages 3–12). Children message friendly elves at the North Pole; parents get full visibility and controls; admins manage elves, quotes, wall designs, music, support mail, and live activity.
**Stack:** Next.js (App Router) · PostgreSQL · Drizzle ORM · Tailwind CSS · JWT cookies
---
## Table of contents
1. [Features](#features)
2. [Quick start (local)](#quick-start-local)
3. [Environment variables](#environment-variables)
4. [Deploy to Vercel](#deploy-to-vercel)
5. [Database setup on Vercel](#database-setup-on-vercel)
6. [Default logins](#default-logins)
7. [Project structure](#project-structure)
8. [What to do next](#what-to-do-next)
9. [Troubleshooting](#troubleshooting)
---
## Features
- Magical dark Christmas UI (black, deep red, bright green, gold) + snowfall
- Parent register/login, multi-child management, letter history, alerts
- Kid register/login, choose from 20 elves, IM chat with in-character replies
- Custom chat bubbles + wall designs (admin can add more walls)
- Countdown to Christmas + daily inspirational quotes
- Subscription plans (free / monthly / yearly)
- Support tickets parents can send; admins can reply
- Admin dashboard: elves, quotes, walls, music, activity analytics
- SEO metadata, Open Graph, Twitter cards, Schema.org, PWA manifest
- `index.html` included for static/Spck-style previews
---
## Quick start (local)
### Requirements
- Node.js 20+
- PostgreSQL 14+ running locally (or a cloud DB URL)
- npm
### Steps
```bash
# 1) Install packages
npm install
# 2) Create your env file
cp .env.example .env
# 3) Edit .env — set DATABASE_URL and AUTH_SECRET
#    Example local DB:
#    DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
#    AUTH_SECRET=$(openssl rand -base64 48)
# 4) Push the database schema
npx drizzle-kit push
# 5) Run the dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).
Seed data (20 elves, quotes, walls, music, default admin) is created automatically on first request.
### Useful commands
| Command | What it does |
| --- | --- |
| `npm run dev` | Local development server |
| `npm run build` | Production build |
| `npm run start` | Run production server |
| `npm run typecheck` | TypeScript check |
| `npx drizzle-kit push` | Apply schema to the database |
---
## Environment variables
Copy `.env.example` → `.env` (local) or add the same keys in **Vercel → Project → Settings → Environment Variables**.
| Variable | Required | Description |
| --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `AUTH_SECRET` | Yes (prod) | Secret used to sign session JWTs |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical site URL for SEO/sharing |
See `.env.example` for full comments and optional future keys (Stripe, email, OpenAI).
> **Never commit `.env`.** It is listed in `.gitignore`.
---
## Deploy to Vercel
### Option A — Deploy from the Vercel dashboard (easiest)
1. Push this project to **GitHub**, **GitLab**, or **Bitbucket**.
   ```bash
   git init
   git add .
   git commit -m "Initial North Pole Pen Pal app"
   git branch -M main
   git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
   git push -u origin main
   ```
2. Go to [https://vercel.com/new](https://vercel.com/new) and sign in.
3. Click **Import** on your repository.
4. Framework preset should detect **Next.js** automatically.
5. Before deploying, open **Environment Variables** and add:
   - `DATABASE_URL` → your cloud Postgres URL (see next section)
   - `AUTH_SECRET` → long random string (`openssl rand -base64 48`)
   - `NEXT_PUBLIC_SITE_URL` → `https://your-project.vercel.app` (update after first deploy if needed)
6. Click **Deploy**.
7. After the first deploy succeeds, **apply the database schema** (see below).
8. Visit your live URL and test Parent Register → Kid Register → chat → Admin.
### Option B — Deploy with Vercel CLI
```bash
# Install CLI once
npm i -g vercel
# Login
vercel login
# From the project root — preview deploy
vercel
# Set env vars (or use the dashboard)
vercel env add DATABASE_URL
vercel env add AUTH_SECRET
vercel env add NEXT_PUBLIC_SITE_URL
# Production deploy
vercel --prod
```
### After deploy checklist
- [ ] Env vars set for **Production** (and Preview if you want)
- [ ] Schema pushed to the production database
- [ ] `NEXT_PUBLIC_SITE_URL` matches your real domain
- [ ] Change the default admin password (see [What to do next](#what-to-do-next))
- [ ] Create a parent account and a test kid
- [ ] Optional: add a custom domain in Vercel → Project → Settings → Domains
---
## Database setup on Vercel
Vercel does not include Postgres by itself. Pick one free/cheap provider:
### Recommended: Neon
1. Create a project at [https://neon.tech](https://neon.tech)
2. Copy the connection string (use **pooled** + `?sslmode=require` if offered)
3. Paste into Vercel as `DATABASE_URL`
4. From your laptop (with that URL in `.env` or exported):
   ```bash
   export DATABASE_URL="postgresql://...neon.tech/neondb?sslmode=require"
   npx drizzle-kit push
   ```
### Alternative: Supabase
1. Create a project at [https://supabase.com](https://supabase.com)
2. **Project Settings → Database → Connection string (URI)**
3. Use it as `DATABASE_URL` (add `?sslmode=require` if needed)
4. Run `npx drizzle-kit push`
### Alternative: Vercel Postgres / Storage
1. In your Vercel project: **Storage → Create Database → Postgres**
2. Connect it to the project (Vercel can inject `DATABASE_URL` / `POSTGRES_URL`)
3. If Vercel gives `POSTGRES_URL`, either rename/map it to `DATABASE_URL` or set:
   ```
   DATABASE_URL=${POSTGRES_URL}
   ```
   in env settings (or paste the same value into `DATABASE_URL`)
4. Run `npx drizzle-kit push` against that URL
### Schema push note
This app uses Drizzle. On a fresh cloud database you must run:
```bash
npx drizzle-kit push
```
once with `DATABASE_URL` pointing at production. Seed data (elves, quotes, walls, admin) loads automatically the first time the app handles a request.
---
## Default logins
| Role | How to get in |
| --- | --- |
| **Admin** | `admin@northpole.app` / `admin123` (seeded automatically) |
| **Parent** | Register at `/parent/register` |
| **Kid** | Parent registers first, then `/kid/register` (needs parent session or parent email) |
**Important:** Change the admin password before sharing a public production URL.
---
## Project structure
```
├── index.html                 # Static/Spck/Vercel-friendly landing snapshot
├── .env.example               # Env template (safe to commit)
├── .gitignore
├── drizzle.config.json
├── public/                    # Icons, OG image, PWA manifest
├── src/
│   ├── app/                   # Next.js App Router pages + API routes
│   │   ├── page.tsx           # Magical homepage
│   │   ├── kid/               # Kid login, register, dashboard
│   │   ├── parent/            # Parent login, register, dashboard
│   │   ├── admin/             # Admin login + control room
│   │   ├── support/           # Public support form
│   │   └── api/               # Auth, messages, elves, walls, admin, etc.
│   ├── components/            # Snowfall, countdown, music player, lights
│   ├── db/                    # Drizzle client + schema
│   └── lib/                   # Auth, elf AI replies, seed data, helpers
└── README.md
```
---
## What to do next
Prioritized roadmap after your first Vercel deploy:
### Security & production readiness
1. **Change admin credentials** — do not leave `admin123` on a public site.
2. Set a strong unique **`AUTH_SECRET`** in Vercel.
3. Turn on Vercel **Deployment Protection** for preview URLs if needed.
4. Add rate limiting on auth + message APIs (e.g. Upstash Redis).
### Product polish
5. Replace demo music URLs with your own licensed/festive tracks in **Admin → Music**.
6. Add more wall designs and seasonal quotes from the admin dashboard.
7. Customize elf bios / add new elves for your brand.
8. Generate real PNG/JPG marketing images and update Open Graph tags.
### Payments
9. Connect **Stripe** (or Lemon Squeezy) for real Monthly / Yearly checkout.
10. Webhook → update `parents.subscriptionPlan` + `subscriptionStatus`.
### AI upgrades
11. Optional: plug in **OpenAI / Anthropic** for richer elf memory while keeping the safety filters and kid-safe tone.
12. Store longer-term “memory notes” per child (birthdays, wishes, inside jokes are already modeled).
### Notifications
13. Email parents on new elf letters (**Resend** or **Postmark**).
14. Web push / mobile push if you wrap the app with Capacitor or PWA push.
### Mobile apps (iOS & Android)
15. The UI is mobile-first already. For store apps:
    - **PWA** install (manifest is included), or
    - Wrap with **Capacitor** (`npx cap add ios` / `android`) pointing at your Vercel URL or a bundled WebView build.
### Growth
16. Add a blog/landing sections targeting keywords: *Elf Pen Pal*, *Santa Letters*, *North Pole Letters*.
17. Custom domain + Google Search Console.
18. Analytics (Vercel Analytics or Plausible) — respect kids’ privacy (prefer parent-level analytics only).
### Content & safety
19. Publish a parent-facing Privacy Policy + Terms (COPPA/GDPR-aware).
20. Add parent PIN for kid login on shared devices.
21. Moderated word filter on outbound kid messages (extra safety layer).
---
## Troubleshooting
| Problem | Fix |
| --- | --- |
| `DATABASE_URL is required` | Set the env var locally or in Vercel; redeploy |
| Build works, app errors on load | Schema not pushed — run `npx drizzle-kit push` on prod DB |
| Admin login fails on fresh DB | Hit the homepage once (triggers seed), then try again |
| Cookies / login don’t stick on Vercel | Ensure you’re on HTTPS; `AUTH_SECRET` is set; don’t block cookies |
| Kid register says parent required | Log in as parent first, or pass the parent email on the kid form |
| Free plan message limit | Upgrade plan in Parent dashboard (monthly/yearly) |
| Styles missing | Confirm Tailwind/`globals.css` import in `layout.tsx`; rebuild |
---
## License / notes
Built as a family-friendly Christmas experience demo. Replace demo credentials, music URLs, and legal pages before production traffic.
**Live local routes**
- `/` — homepage  
- `/parent/register` · `/parent/login` · `/parent`  
- `/kid/register` · `/kid/login` · `/kid`  
- `/admin/login` · `/admin`  
- `/support`  
- `/api/health` — health check  
Merry building — and welcome to the workshop. ✨🧝🎁
