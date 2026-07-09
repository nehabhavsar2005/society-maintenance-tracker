import { api } from '../api';
import { ApiResponse, Complaint, ComplaintCategory, ComplaintPriority, ComplaintStatus } from '../types';

export interface ComplaintFilters {
  page?: number;
  limit?: number;
  search?: string;
  category?: ComplaintCategory;
  priority?: ComplaintPriority;
  status?: ComplaintStatus;
  residentId?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'newest' | 'oldest' | 'priority' | 'status';
}

export interface CreateComplaintPayload {
  title: string;
  description: string;
  category: ComplaintCategory;
  priority?: ComplaintPriority;
  images?: File[];
}

function buildFormData(payload: Record<string, unknown>, images?: File[]) {
  const formData = new FormData();
  Object.entries(payload).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, String(value));
  });
  images?.forEach((file) => formData.append('images', file));
  return formData;
}

export const complaintApi = {
  list: (filters: ComplaintFilters) =>
    api.get<ApiResponse<Complaint[]>>('/complaints', { params: filters }).then((r) => ({ items: r.data.data, meta: r.data.meta! })),

  getById: (id: string) => api.get<ApiResponse<Complaint>>(`/complaints/${id}`).then((r) => r.data.data),

  create: (payload: CreateComplaintPayload) => {
    const { images, ...rest } = payload;
    return api
      .post<ApiResponse<Complaint>>('/complaints', buildFormData(rest, images), { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((r) => r.data.data);
  },

  update: (
    id: string,
    payload: Partial<{ title: string; description: string; category: ComplaintCategory; priority: ComplaintPriority; removedImageIds: string[] }>,
    newImages?: File[]
  ) => {
    const { removedImageIds, ...rest } = payload;
    const formData = new FormData();
    Object.entries(rest).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, String(value));
    });
    removedImageIds?.forEach((id) => formData.append('removedImageIds[]', id));
    newImages?.forEach((file) => formData.append('images', file));
    return api.patch<ApiResponse<Complaint>>(`/complaints/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data.data);
  },

  delete: (id: string) => api.delete<ApiResponse<null>>(`/complaints/${id}`).then((r) => r.data),

  adminUpdate: (
    id: string,
    payload: Partial<{ status: ComplaintStatus; priority: ComplaintPriority; assignedToId: string | null; internalNotes: string; notes: string }>
  ) => api.patch<ApiResponse<Complaint>>(`/complaints/${id}/admin`, payload).then((r) => r.data.data),

  bulkAction: (payload: { complaintIds: string[]; action: 'DELETE' | 'SET_STATUS' | 'SET_PRIORITY'; status?: ComplaintStatus; priority?: ComplaintPriority }) =>
    api.post<ApiResponse<{ affected: number }>>('/complaints/bulk', payload).then((r) => r.data.data),
};
