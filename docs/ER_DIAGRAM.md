# Entity Relationship Diagram

```mermaid
erDiagram
    USER ||--o{ COMPLAINT : "raises (resident)"
    USER ||--o{ COMPLAINT : "assigned to (admin)"
    USER ||--o{ COMPLAINT_HISTORY : "acts on"
    USER ||--o{ NOTICE : "authors"
    USER ||--o{ NOTIFICATION : "receives"
    USER ||--o{ AUDIT_LOG : "performs"
    USER ||--o{ EMAIL_LOG : "receives"

    COMPLAINT ||--o{ COMPLAINT_IMAGE : "has"
    COMPLAINT ||--o{ COMPLAINT_HISTORY : "has"
    COMPLAINT ||--o{ NOTIFICATION : "triggers"

    USER {
        string id PK
        string name
        string email
        string password
        string phone
        Role role
        string flatNumber
        string block
        string avatarUrl
        boolean isActive
        boolean emailVerified
        string refreshToken
        string passwordResetToken
        datetime passwordResetExpires
        datetime createdAt
        datetime updatedAt
    }

    COMPLAINT {
        string id PK
        string ticketNumber
        string title
        string description
        ComplaintCategory category
        ComplaintPriority priority
        ComplaintStatus status
        string residentId FK
        string assignedToId FK
        string internalNotes
        boolean isOverdue
        datetime dueDate
        datetime resolvedAt
        datetime closedAt
        datetime createdAt
        datetime updatedAt
    }

    COMPLAINT_IMAGE {
        string id PK
        string complaintId FK
        string url
        string publicId
        datetime createdAt
    }

    COMPLAINT_HISTORY {
        string id PK
        string complaintId FK
        string actorId FK
        ComplaintStatus oldStatus
        ComplaintStatus newStatus
        ComplaintPriority oldPriority
        ComplaintPriority newPriority
        string notes
        datetime createdAt
    }

    NOTICE {
        string id PK
        string title
        string content
        boolean isPinned
        boolean isImportant
        string authorId FK
        datetime createdAt
        datetime updatedAt
    }

    NOTIFICATION {
        string id PK
        string userId FK
        NotificationType type
        string title
        string message
        boolean isRead
        string complaintId FK
        datetime createdAt
    }

    EMAIL_LOG {
        string id PK
        string userId FK
        string toEmail
        string subject
        string template
        EmailStatus status
        string error
        datetime createdAt
    }

    PRIORITY_SETTINGS {
        string id PK
        ComplaintPriority priority
        int overdueThresholdDays
        datetime updatedAt
    }

    SYSTEM_SETTING {
        string id PK
        string key
        string value
        datetime updatedAt
    }

    AUDIT_LOG {
        string id PK
        string userId FK
        string action
        string entityType
        string entityId
        string metadata
        string ipAddress
        datetime createdAt
    }
```

## Notes

- `Role` enum: `RESIDENT`, `ADMIN`
- `ComplaintCategory` enum: `ELECTRICAL`, `WATER`, `PLUMBING`, `SECURITY`, `PARKING`, `LIFT`, `CLEANING`, `GARDEN`, `NOISE`, `OTHER`
- `ComplaintPriority` enum: `LOW`, `MEDIUM`, `HIGH`
- `ComplaintStatus` enum: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`, `OVERDUE`
- `NotificationType` enum: `COMPLAINT_CREATED`, `COMPLAINT_STATUS_CHANGED`, `COMPLAINT_RESOLVED`, `COMPLAINT_OVERDUE`, `NOTICE_POSTED`, `PASSWORD_RESET`, `SYSTEM`
- `EmailStatus` enum: `SENT`, `FAILED`, `PENDING`
- All foreign keys are indexed; `Complaint.status`, `.priority`, `.category`, and `.isOverdue` carry additional indexes to support fast filtering on the complaints list.
