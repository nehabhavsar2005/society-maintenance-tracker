# Deployment Guide

This project deploys as three independent pieces: **database** (Neon), **backend** (Render or Railway), and **frontend** (Vercel).

## 1. Database — Neon PostgreSQL

1. Create a free project at [neon.tech](https://neon.tech).
2. Copy the pooled connection string — it looks like:
   `postgresql://user:password@ep-xxxx.region.aws.neon.tech/society_tracker?sslmode=require`
3. Save it — you'll use it as `DATABASE_URL` for the backend.

## 2. Backend — Render (or Railway)

### Render

1. Push this repository to GitHub.
2. In Render, create a **New Web Service**, connect the repo, and set:
   - **Root Directory**: `apps/backend`
   - **Build Command**: `npm install && npm run prisma:generate && npm run build`
   - **Start Command**: `npm run prisma:deploy && npm run start`
3. Add environment variables (see `apps/backend/.env.example`): `DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `CLIENT_URL`, `CLOUDINARY_*`, `SMTP_*`, `EMAIL_FROM`.
4. Deploy. Render will assign a public URL like `https://society-tracker-api.onrender.com`.
5. (Optional) Seed the database once by running `npm run seed` from a Render shell or locally against the Neon connection string.

### Railway

1. Create a new project, add a service from the GitHub repo with root directory `apps/backend`.
2. Set the same environment variables as above.
3. Set the build command to `npm install && npm run prisma:generate && npm run build` and start command to `npm run prisma:deploy && npm run start`.
4. Deploy and copy the generated public URL.

## 3. Frontend — Vercel

1. Import the repository into Vercel.
2. Set **Root Directory** to `apps/frontend`.
3. Framework preset: **Next.js** (auto-detected).
4. Add environment variable `NEXT_PUBLIC_API_URL` = `https://<your-backend-url>/api`.
5. Deploy.
6. Once deployed, go back to your backend environment variables and set `CLIENT_URL` to the Vercel URL (e.g. `https://society-tracker.vercel.app`) so CORS and cookie settings work correctly, then redeploy the backend.

## 4. Post-Deployment Checklist

- [ ] Visit `<backend-url>/api/health` — should return `{ "success": true }`
- [ ] Register a resident account from the deployed frontend
- [ ] Log in as the seeded admin (`admin@societytracker.com` / `Password@123`) — **change this password immediately in production**
- [ ] Create a test complaint with an image upload and confirm it appears in Cloudinary
- [ ] Confirm emails are sent (or gracefully skipped with a log entry if SMTP isn't configured)
- [ ] Confirm the overdue cron job log line appears in backend logs after an hour, or test manually by setting a short threshold

## 5. Local Development

```bash
# 1. Install dependencies (from repo root)
npm install

# 2. Configure environment variables
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env

# 3. Set up the database
cd apps/backend
npm run prisma:generate
npm run prisma:migrate
npm run seed

# 4. Run both apps (from repo root, in two terminals)
npm run dev:backend
npm run dev:frontend
```

Frontend runs at `http://localhost:3000`, backend at `http://localhost:5000`.
