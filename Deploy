# Deploy North Pole Pen Pal on Vercel (step-by-step)
This is a focused checklist you can follow in order.
---
## 1) Prepare the code
```bash
npm install
cp .env.example .env
# edit .env with a real AUTH_SECRET even for local testing
```
Confirm it builds:
```bash
npm run build
```
---
## 2) Create a Git repo and push
```bash
git init
git add .
git status   # make sure .env is NOT listed
git commit -m "Deploy North Pole Pen Pal"
git branch -M main
```
Create an empty GitHub repo, then:
```bash
git remote add origin https://github.com/YOUR_USER/YOUR_REPO.git
git push -u origin main
```
---
## 3) Create a cloud database (Neon example)
1. Sign up at https://neon.tech  
2. **New Project** → copy the connection string  
3. It should look like:
   ```
   postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require
   ```
4. From your computer, push the schema:
   ```bash
   DATABASE_URL="postgresql://user:password@ep-xxxx.region.aws.neon.tech/neondb?sslmode=require" npx drizzle-kit push
   ```
---
## 4) Import the project on Vercel
1. Open https://vercel.com/new  
2. **Import** your GitHub repository  
3. Framework: **Next.js** (auto-detected)  
4. Root directory: `.` (default)  
5. Build command: `next build` (default)  
6. Output: default Next.js (do **not** set static export)
---
## 5) Add environment variables in Vercel
In the import screen (or **Project → Settings → Environment Variables**), add:
| Name | Value | Environments |
| --- | --- | --- |
| `DATABASE_URL` | your Neon/Supabase URL | Production, Preview |
| `AUTH_SECRET` | output of `openssl rand -base64 48` | Production, Preview |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR_PROJECT.vercel.app` | Production |
Then click **Deploy**.
---
## 6) First-run verification
1. Open `https://YOUR_PROJECT.vercel.app`  
2. Open `https://YOUR_PROJECT.vercel.app/api/health` → should return `{"ok":true}`  
3. Admin login: `/admin/login`  
   - Email: `admin@northpole.app`  
   - Password: `admin123`  
4. Create a parent → register a kid → send a message  
5. In admin, confirm activity/messages appear  
If health fails, the database URL is wrong or schema wasn’t pushed.
---
## 7) Custom domain (optional)
1. Vercel project → **Settings → Domains**  
2. Add `www.yourdomain.com`  
3. Follow DNS instructions at your registrar  
4. Update `NEXT_PUBLIC_SITE_URL` to `https://www.yourdomain.com`  
5. Redeploy  
---
## 8) Spck Editor / static note
- `index.html` at the repo root is a festive static snapshot for tools like **Spck Editor** or quick HTML previews.  
- The real app is **Next.js**. On Vercel you deploy the Next.js app (not static-only `index.html`).  
- Spck can still open/edit files; run the full stack with Node + Postgres for API features.
---
## 9) Updating after changes
```bash
git add .
git commit -m "Describe your change"
git push
```
Vercel auto-deploys `main`.  
If you changed `src/db/schema.ts`, also run:
```bash
DATABASE_URL="your-prod-url" npx drizzle-kit push
```
---
## 10) Production hardening (do this soon)
- [ ] Change default admin password  
- [ ] Rotate `AUTH_SECRET` if it was ever committed or shared  
- [ ] Add Privacy Policy / Terms for parents  
- [ ] Connect real payments (Stripe) for subscriptions  
- [ ] Add email notifications for parents  
- [ ] Restrict admin route further (IP allowlist or second factor)  
Full roadmap: see **What to do next** in `README.md`.
