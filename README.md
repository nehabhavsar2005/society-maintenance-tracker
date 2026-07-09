# 🏢 Society Maintenance Tracker

A production-grade, full-stack SaaS platform for apartment/society maintenance complaint management — built with **Next.js 15**, **Express + TypeScript**, **PostgreSQL + Prisma**, JWT authentication, Cloudinary image uploads, and email notifications.

> Modern SaaS-grade UI (dark/light mode, animations, charts, skeleton loaders) inspired by Linear, Notion, and Vercel Dashboard.

---

## ✨ Features

- **Authentication** — Register/login, JWT access + refresh tokens (httpOnly cookie), forgot/reset password, "remember me", role-based access control (Resident / Admin), protected routes.
- **Complaint Management** — Create/edit/delete (before admin action), category & priority selection, multi-image upload with Cloudinary, search/filter/sort/pagination, full status-history timeline.
- **Admin Panel** — View/search/filter/sort all complaints, assign priority & staff, update status, internal notes, bulk actions (delete / set status / set priority), delete complaints.
- **Automatic Overdue Detection** — Configurable per-priority thresholds (days), hourly cron job flags overdue complaints, highlighted in the UI.
- **Notice Board** — Create/edit/delete/pin/mark-important notices, always-pinned-on-top sorting, resident view.
- **Notifications** — In-app notification center with unread badge, mark-as-read, polling-based updates.
- **Email Notifications** — Branded HTML emails for complaint created/status changed/resolved, notice posted, password reset (via Nodemailer/SMTP or Resend).
- **Dashboard & Analytics** — Stat cards, pie/bar/area charts (category, priority, monthly trend), recent activity feeds — role-aware for Admin vs Resident.
- **Audit Logs** — Every administrative action (status change, delete, bulk action) is recorded with actor, IP, and metadata.
- **Premium UI/UX** — Dark/light themes, Framer Motion animations, skeleton loaders, empty/error states, toast notifications, confirmation dialogs, responsive design (mobile/tablet/desktop), custom 404/error pages.

Full feature checklist: see [`docs/FEATURES.md`](./docs/FEATURES.md).

---

## 🧱 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 (App Router), React 18, TypeScript, Tailwind CSS, shadcn-style components, Framer Motion, React Hook Form, Zod, TanStack Query, Axios, Recharts, Lucide Icons |
| Backend | Node.js, Express.js, TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Auth | JWT (access + refresh), bcrypt password hashing, RBAC |
| Image Upload | Cloudinary |
| Email | Nodemailer (SMTP) — pluggable for Resend |
| Deployment | Frontend → Vercel · Backend → Render/Railway · Database → Neon PostgreSQL |

---

## 📁 Folder Structure

```
society-maintenance-tracker/
├── apps/
│   ├── backend/                 # Express + TypeScript API
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # Database schema
│   │   │   └── seed.ts          # Seed script
│   │   └── src/
│   │       ├── config/          # env, db, cloudinary, logger
│   │       ├── middlewares/     # auth, roles, validation, rate-limit, errors, upload
│   │       ├── modules/         # auth, complaints, notices, notifications, dashboard, users, settings, audit
│   │       │   └── <module>/    # *.routes.ts, *.controller.ts, *.service.ts, *.repository.ts, *.dto.ts
│   │       ├── services/        # email, cloudinary, token services
│   │       ├── templates/       # HTML email templates
│   │       ├── jobs/            # overdue-detection cron
│   │       ├── utils/           # ApiError, ApiResponse, pagination, audit log
│   │       ├── routes/          # root router
│   │       ├── app.ts
│   │       └── server.ts
│   └── frontend/                # Next.js 15 App Router
│       └── src/
│           ├── app/             # routes ((auth) and (dashboard) route groups)
│           ├── components/      # ui/, layout/, complaints/, notices/, dashboard/, shared/
│           ├── hooks/           # TanStack Query hooks
│           ├── lib/             # api client, services, validators, types, utils
│           └── providers/       # theme, query, auth providers
├── docs/                        # API docs, ER diagram, architecture, deployment, system design
├── package.json                 # npm workspaces root
└── .gitignore
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js ≥ 18.18
- A PostgreSQL database (local, Docker, or [Neon](https://neon.tech) free tier)
- (Optional) Cloudinary account for image uploads
- (Optional) SMTP credentials (e.g. Gmail App Password) for emails

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

Edit `apps/backend/.env` with your `DATABASE_URL`, JWT secrets, Cloudinary and SMTP credentials. See [Environment Variables](#-environment-variables) below.

### 3. Set up the database

```bash
cd apps/backend
npm run prisma:generate
npm run prisma:migrate
npm run seed
cd ../..
```

The seed script creates:
- 1 admin (`admin@societytracker.com`)
- 10 residents (`resident1@societytracker.com` … `resident10@societytracker.com`)
- 50 complaints across all categories/priorities/statuses
- 20 notices (some pinned, some marked important)
- All seeded users share the password: **`Password@123`**

### 4. Run the app

```bash
# Terminal 1
npm run dev:backend     # http://localhost:5000

# Terminal 2
npm run dev:frontend    # http://localhost:3000
```

Open `http://localhost:3000` and log in with the seeded admin or resident credentials above.

---

## 🔐 Environment Variables

### Backend (`apps/backend/.env`)

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Long random secrets for signing tokens |
| `JWT_ACCESS_EXPIRES_IN` / `JWT_REFRESH_EXPIRES_IN` | Token lifetimes (default `15m` / `7d`) |
| `CLIENT_URL` | Frontend origin, used for CORS + email links |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | Cloudinary credentials |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` / `EMAIL_FROM` | SMTP credentials for Nodemailer |
| `DEFAULT_OVERDUE_DAYS` | Fallback overdue threshold if not configured in DB |

See full list in [`apps/backend/.env.example`](./apps/backend/.env.example).

### Frontend (`apps/frontend/.env`)

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL, e.g. `http://localhost:5000/api` |

---

## 📚 Documentation

- [API Documentation](./docs/API_DOCUMENTATION.md) — every endpoint, params, and a [Postman collection](./docs/postman_collection.json)
- [Database Schema / ER Diagram](./docs/ER_DIAGRAM.md)
- [Architecture Overview](./docs/ARCHITECTURE.md)
- [System Design Write-up](./docs/SYSTEM_DESIGN.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)
- [Feature Checklist](./docs/FEATURES.md)
- [Screenshots](./docs/SCREENSHOTS.md)

---

## 🧪 Testing the App

- **Auth**: register a new resident, log in as admin/resident, test forgot/reset password.
- **Complaints**: create a complaint with photos, edit/delete while `OPEN`, watch it become locked after an admin action.
- **Admin**: change status/priority, assign, add internal notes, try bulk actions, delete a complaint.
- **Overdue**: lower a priority's threshold to a small number of days in **Admin → Settings**, wait for the hourly cron (or temporarily adjust the cron schedule) to see complaints flip to `OVERDUE`.
- **Notices**: publish, pin, mark important, edit, delete as admin; view as resident.
- **Notifications**: trigger any of the above and check the bell icon dropdown.
- **Dashboard**: verify stat cards and charts update as data changes.

---

## 🏗️ Production Build

```bash
npm run build:backend
npm run build:frontend
```

Both are verified to build and lint cleanly with zero errors/warnings.

---

## ☁️ Deployment

See the full [Deployment Guide](./docs/DEPLOYMENT.md) for step-by-step instructions:

- **Frontend** → [Vercel](https://vercel.com)
- **Backend** → [Render](https://render.com) or [Railway](https://railway.app)
- **Database** → [Neon PostgreSQL](https://neon.tech)

---

## 📦 GitHub Submission Checklist

- [x] Repository uses `main` as the default branch
- [x] `.env` files are excluded via `.gitignore` (only `.env.example` is committed)
- [x] `node_modules`, `.next`, `dist`, `build`, `coverage`, logs, and `uploads` are excluded
- [x] `npm run build:backend` and `npm run build:frontend` succeed with zero errors
- [x] `README.md` includes setup, API docs, deployment guide
- [x] `.env.example` provided for both apps
- [x] No secrets committed

### Git commands to publish this repository

```bash
git init
git branch -M main
git add .
git commit -m "Initial commit - Society Maintenance Tracker"
git remote add origin https://github.com/YOUR_USERNAME/society-maintenance-tracker.git
git push -u origin main
```

---

## 📄 License

This project is provided as-is for educational and evaluation purposes.
