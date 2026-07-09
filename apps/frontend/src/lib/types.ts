export type Role = 'RESIDENT' | 'ADMIN';

export type ComplaintCategory =
  | 'ELECTRICAL'
  | 'WATER'
  | 'PLUMBING'
  | 'SECURITY'
  | 'PARKING'
  | 'LIFT'
  | 'CLEANING'
  | 'GARDEN'
  | 'NOISE'
  | 'OTHER';

export type ComplaintPriority = 'LOW' | 'MEDIUM' | 'HIGH';
export type ComplaintStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED' | 'OVERDUE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string | null;
  flatNumber?: string | null;
  block?: string | null;
  avatarUrl?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ComplaintImage {
  id: string;
  url: string;
  publicId?: string | null;
  createdAt: string;
}

export interface ComplaintHistoryEntry {
  id: string;
  complaintId: string;
  actorId?: string | null;
  actor?: { id: string; name: string; role: Role } | null;
  oldStatus?: ComplaintStatus | null;
  newStatus?: ComplaintStatus | null;
  oldPriority?: ComplaintPriority | null;
  newPriority?: ComplaintPriority | null;
  notes?: string | null;
  createdAt: string;
}

export interface Complaint {
  id: string;
  ticketNumber: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  residentId: string;
  resident?: { id: string; name: string; email: string; flatNumber?: string | null; block?: string | null; avatarUrl?: string | null };
  assignedToId?: string | null;
  assignedTo?: { id: string; name: string; email: string } | null;
  internalNotes?: string | null;
  isOverdue: boolean;
  dueDate?: string | null;
  resolvedAt?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  images: ComplaintImage[];
  history?: ComplaintHistoryEntry[];
  _count?: { history: number };
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  isImportant: boolean;
  authorId: string;
  author?: { id: string; name: string; role: Role };
  createdAt: string;
  updatedAt: string;
}

export type NotificationType =
  | 'COMPLAINT_CREATED'
  | 'COMPLAINT_STATUS_CHANGED'
  | 'COMPLAINT_RESOLVED'
  | 'COMPLAINT_OVERDUE'
  | 'NOTICE_POSTED'
  | 'PASSWORD_RESET'
  | 'SYSTEM';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  complaintId?: string | null;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: PaginationMeta;
}

export const CATEGORY_LABELS: Record<ComplaintCategory, string> = {
  ELECTRICAL: 'Electrical',
  WATER: 'Water',
  PLUMBING: 'Plumbing',
  SECURITY: 'Security',
  PARKING: 'Parking',
  LIFT: 'Lift',
  CLEANING: 'Cleaning',
  GARDEN: 'Garden',
  NOISE: 'Noise',
  OTHER: 'Other',
};

export const STATUS_LABELS: Record<ComplaintStatus, string> = {
  OPEN: 'Open',
  IN_PROGRESS: 'In Progress',
  RESOLVED: 'Resolved',
  CLOSED: 'Closed',
  OVERDUE: 'Overdue',
};

export const PRIORITY_LABELS: Record<ComplaintPriority, string> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};
