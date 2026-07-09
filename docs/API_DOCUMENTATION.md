# API Documentation

Base URL: `http://localhost:5000/api` (development) — all responses follow this envelope:

```json
{
  "success": true,
  "message": "Human readable message",
  "data": { },
  "meta": { "page": 1, "limit": 10, "total": 42, "totalPages": 5 }
}
```

Errors follow:

```json
{ "success": false, "message": "Error message", "details": { } }
```

Authenticated routes require `Authorization: Bearer <accessToken>`. The refresh token is sent automatically via an `httpOnly` cookie (`withCredentials: true`).

---

## Auth — `/api/auth`

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new resident. Body: `name, email, password, phone?, flatNumber?, block?` |
| POST | `/login` | Public | Login. Body: `email, password, rememberMe?` |
| POST | `/refresh` | Cookie | Issues a new access token using the refresh cookie |
| POST | `/logout` | Bearer | Revokes the refresh token and clears the cookie |
| POST | `/forgot-password` | Public | Body: `email`. Always returns success to avoid email enumeration |
| POST | `/reset-password` | Public | Body: `token, password` |
| GET | `/me` | Bearer | Returns the current authenticated user's profile |

## Complaints — `/api/complaints`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Bearer | List complaints. Residents see only their own. Query: `page, limit, search, category, priority, status, residentId, dateFrom, dateTo, sortBy` |
| POST | `/` | Bearer | Create complaint. `multipart/form-data`: `title, description, category, priority?, images[]` |
| GET | `/:id` | Bearer | Get complaint by ID or ticket number, with full history and images |
| PATCH | `/:id` | Bearer (owner) | Edit complaint — only while `status = OPEN`. Supports new `images[]` and `removedImageIds[]` |
| DELETE | `/:id` | Bearer (owner or admin) | Delete complaint — residents only while `OPEN` |
| PATCH | `/:id/admin` | Admin | Update `status, priority, assignedToId, internalNotes, notes` |
| POST | `/bulk` | Admin | Bulk action. Body: `complaintIds[], action: DELETE\|SET_STATUS\|SET_PRIORITY, status?, priority?` |

## Notices — `/api/notices`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Bearer | List notices (pinned first). Query: `page, limit, search` |
| POST | `/` | Admin | Create notice. Body: `title, content, isPinned?, isImportant?` |
| GET | `/:id` | Bearer | Get single notice |
| PATCH | `/:id` | Admin | Update notice |
| PATCH | `/:id/pin` | Admin | Toggle pinned state |
| DELETE | `/:id` | Admin | Delete notice |

## Notifications — `/api/notifications`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/` | Bearer | List current user's notifications. Query: `page, limit, unreadOnly` |
| GET | `/unread-count` | Bearer | Unread notification count |
| PATCH | `/:id/read` | Bearer | Mark one notification as read |
| PATCH | `/read-all` | Bearer | Mark all notifications as read |

## Dashboard — `/api/dashboard`

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/stats` | Bearer | Role-aware dashboard statistics (admin sees society-wide stats + charts; resident sees personal stats) |

## Users — `/api/users` (Admin only)

| Method | Path | Description |
|---|---|---|
| GET | `/` | Paginated list of all users |
| GET | `/residents` | List all residents (for search/autocomplete) |
| GET | `/admins` | List all admins (for complaint assignment) |
| PATCH | `/:id/toggle-active` | Suspend/activate a user account |

## Settings — `/api/settings` (Admin only)

| Method | Path | Description |
|---|---|---|
| GET | `/priority` | Get overdue thresholds per priority |
| PUT | `/priority` | Update threshold. Body: `priority, overdueThresholdDays` |

## Audit Logs — `/api/audit-logs` (Admin only)

| Method | Path | Description |
|---|---|---|
| GET | `/` | Paginated audit trail of admin actions |

## Health

| Method | Path | Description |
|---|---|---|
| GET | `/api/health` | Health check, returns `200 OK` |

---

## Postman Collection

A ready-to-import Postman collection is available at [`docs/postman_collection.json`](./postman_collection.json). It includes pre-configured requests for every endpoint above with a `{{baseUrl}}` and `{{accessToken}}` variable.
