import { api } from '../api';
import { ApiResponse } from '../types';

export interface AuditLogEntry {
  id: string;
  userId?: string | null;
  user?: { name: string; email: string; role: string } | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  metadata?: string | null;
  ipAddress?: string | null;
  createdAt: string;
}

export const auditApi = {
  list: (params: { page?: number; limit?: number }) =>
    api.get<ApiResponse<AuditLogEntry[]>>('/audit-logs', { params }).then((r) => ({ items: r.data.data, meta: r.data.meta! })),
};
