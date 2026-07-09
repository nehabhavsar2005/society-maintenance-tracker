# System Design — Society Maintenance Tracker

## 1. Overview

Society Maintenance Tracker is a multi-tenant-ready complaint management system for apartment societies. It follows a classic three-tier architecture: a Next.js 15 frontend, an Express/TypeScript REST API, and a PostgreSQL database managed through Prisma ORM. The system is designed around a single core domain object — the **Complaint** — surrounded by supporting subsystems for notifications, email, auditing, and configuration.

## 2. Complaint Lifecycle

A complaint moves through a well-defined state machine: `OPEN → IN_PROGRESS → RESOLVED → CLOSED`, with `OVERDUE` as an orthogonal flag that can apply to any non-terminal state. When a resident submits a complaint, the API generates a unique ticket number (`SMT-<year>-<random>`), calculates a `dueDate` based on the complaint's priority and the configurable overdue threshold, and persists the record inside a single service-layer transaction alongside its first `ComplaintHistory` entry. Residents may edit or delete a complaint only while it remains `OPEN` — the moment an admin changes its status or priority, the resident's mutation rights are revoked at the service layer (`complaint.service.ts`), not just hidden in the UI, so the rule is enforced regardless of client behavior.

## 3. Status History Model

Every transition — status change, priority change, or edit — is captured as an immutable row in `ComplaintHistory`, storing the old and new status/priority, the acting user (nullable for system-driven changes), a free-text note, and a timestamp. This event-sourcing-lite approach means the complaint's current state is always a derived value, while the full audit trail is reconstructable independently. The frontend renders this as a vertical timeline component, which doubles as the primary UX for transparency between residents and management.

## 4. Overdue Detection

Overdue detection is handled by a `node-cron` job (`jobs/overdue.job.ts`) running hourly inside the API process. It queries all complaints that are not `RESOLVED`/`CLOSED`/already `OVERDUE` whose `dueDate` has passed, flips `isOverdue` and `status` to `OVERDUE`, and writes a system-attributed history entry. The threshold itself is not hard-coded: the `PrioritySettings` table maps each `ComplaintPriority` to a configurable number of days, editable by admins through `/api/settings/priority`. This decouples business policy from code — changing the SLA for "HIGH" priority complaints from 3 to 2 days requires no deployment.

## 5. Notification & Email Architecture

The system uses a dual-channel notification strategy. **In-app notifications** are simple rows in a `Notification` table, polled by the frontend every 20–30 seconds via TanStack Query — a pragmatic choice over WebSockets given the moderate update frequency and the operational simplicity of avoiding a persistent connection layer. **Email notifications** are dispatched through a dedicated `email.service.ts` wrapping Nodemailer, with every attempt (sent, failed, or skipped when SMTP is unconfigured) logged to an `EmailLog` table for observability. HTML templates are generated server-side via composable template functions (`emailTemplates.ts` + a shared `emailLayout.ts` wrapper) rather than a templating engine dependency, keeping the email pipeline dependency-free while still producing branded, responsive HTML emails. Both channels are triggered from the same service-layer events (complaint created, status changed, resolved, notice posted, password reset), ensuring the two stay in sync by construction rather than convention.

## 6. Photo Upload Architecture

Images are uploaded as `multipart/form-data` and held in memory via Multer (`memoryStorage`), validated for MIME type and size (5MB, 5 files max), then streamed directly to Cloudinary using `upload_stream` — the API never writes files to local disk, which keeps the deployment stateless and horizontally scalable. Cloudinary transformations (`limit` resize to 1600px, `auto:good` quality, `auto` format) provide compression without a separate image-processing dependency. Each uploaded asset is persisted as a `ComplaintImage` row referencing both the secure URL and the Cloudinary `publicId`, the latter enabling clean deletion when a resident removes a photo or an admin deletes a complaint.

## 7. Authentication & Authorization

Authentication uses short-lived JWT access tokens (15 min) kept in memory/sessionStorage on the client, paired with a long-lived refresh token (7–30 days depending on "remember me") stored in an `httpOnly`, `sameSite` cookie. An Axios response interceptor transparently retries any `401` by calling `/auth/refresh` once, so the frontend never surfaces a session expiry unless the refresh token itself is invalid. Passwords are hashed with bcrypt (12 rounds). Role-based access control is enforced via Express middleware (`requireRole`) checked against the JWT payload on every protected route — never trusted from client-supplied data.

## 8. Database Schema & API Design

The schema is fully normalized: `User`, `Complaint`, `ComplaintImage`, `ComplaintHistory`, `Notice`, `Notification`, `EmailLog`, `PrioritySettings`, `SystemSetting`, and `AuditLog`, connected via foreign keys with indexes on frequently filtered columns (`status`, `priority`, `category`, `isOverdue`, `residentId`). The API follows a layered structure per module — `routes → controller → service → repository` — with Zod schemas as DTOs for both request validation and TypeScript type inference, keeping validation and typing as a single source of truth.

## 9. Scalability, Security & Deployment

Because uploads go straight to Cloudinary and the API is stateless (JWT-based, no server-side sessions), the Express app can scale horizontally behind a load balancer with zero sticky-session requirements; the overdue cron would move to a dedicated worker or scheduled job at higher scale to avoid duplicate runs across replicas. Security is layered: Helmet for HTTP headers, `express-rate-limit` on all routes (tighter on auth endpoints), CORS restricted to the configured client origin with credentials, Prisma's parameterized queries eliminating SQL injection, and Zod validation sanitizing all inputs at the boundary. The monorepo (`apps/frontend`, `apps/backend`) deploys independently — frontend to Vercel, backend to Render/Railway, database to Neon — connected purely through environment variables and a versioned REST contract.
