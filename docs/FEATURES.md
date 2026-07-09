# Feature Checklist

## Authentication
- [x] Resident registration with validation
- [x] Resident & Admin login
- [x] Forgot password / reset password with expiring token
- [x] JWT access + refresh tokens
- [x] Refresh token rotation via `httpOnly` cookie
- [x] Role-based access control (Resident / Admin)
- [x] Protected routes (frontend + backend)
- [x] "Remember me" (30-day vs 7-day refresh token)
- [x] Logout (revokes refresh token)
- [x] Password hashing with bcrypt

## Complaints
- [x] Create complaint with title, description, category, priority
- [x] Upload multiple photos (Cloudinary, compressed, up to 5 per complaint)
- [x] Edit complaint — only while status is `OPEN`
- [x] Delete complaint — only while status is `OPEN` (residents); admins can always delete
- [x] View all complaints (role-aware)
- [x] Search by title / ticket number / description / resident name
- [x] Filter by category, priority, status, resident, date range
- [x] Sort by newest, oldest, priority, status
- [x] Pagination
- [x] Complaint detail page with full timeline
- [x] Image gallery with lightbox preview

## Admin Panel
- [x] Dashboard with statistics & charts
- [x] View/search/filter/sort/paginate all complaints
- [x] Assign priority & staff member
- [x] Update status with recorded history
- [x] Add internal notes (admin-only, not visible to residents)
- [x] View complete complaint history/timeline
- [x] View uploaded photos
- [x] Delete any complaint
- [x] Bulk actions (delete, set status, set priority)
- [x] Manage residents/users (activate/suspend)
- [x] Audit log viewer

## Overdue Detection
- [x] Configurable threshold per priority (Low/Medium/High), in days
- [x] Hourly automated cron job flags overdue complaints
- [x] Overdue complaints sorted to top of list
- [x] Highlighted with red styling + pulsing badge
- [x] Dashboard "Overdue" counter

## Notice Board
- [x] Create / edit / delete notices (admin)
- [x] Pin / unpin notices
- [x] Mark as important (triggers priority email)
- [x] Pinned notices always sort first
- [x] Resident notice board view

## Notifications
- [x] In-app notification center with unread badge
- [x] Mark one / mark all as read
- [x] Notification dropdown with type-specific icons
- [x] Notifications for both residents and admins

## Email
- [x] Complaint created
- [x] Complaint status changed
- [x] Complaint resolved
- [x] Important notice posted
- [x] Password reset
- [x] Branded, responsive HTML templates
- [x] Delivery logging (sent/failed/pending) in `EmailLog`

## Dashboard & Analytics
- [x] Total / open / in-progress / resolved / closed / overdue counters
- [x] By-category pie chart
- [x] By-priority bar chart
- [x] Monthly created-vs-resolved trend area chart
- [x] Latest complaints & notices feed
- [x] Role-aware (Admin sees society-wide stats, Resident sees personal stats)

## UI / UX
- [x] Dark mode / light mode (system-aware)
- [x] Framer Motion animations & page transitions
- [x] Skeleton loaders for every data view
- [x] Toast notifications (success/error)
- [x] Confirmation dialogs for destructive actions
- [x] Empty states with contextual CTAs
- [x] Error states with retry
- [x] Custom 404 page
- [x] Custom global error boundary
- [x] Fully responsive (mobile, tablet, desktop)
- [x] Accessible form labels, focus states, semantic HTML

## Security
- [x] Helmet HTTP headers
- [x] Rate limiting (global + stricter on auth routes)
- [x] CORS restricted to configured client origin
- [x] Zod input validation on every mutating endpoint
- [x] Prisma parameterized queries (SQL injection safe)
- [x] Password hashing (bcrypt, 12 rounds)
- [x] httpOnly refresh cookie
- [x] Environment-variable-based secrets (never committed)
