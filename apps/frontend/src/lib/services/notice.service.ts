import { api } from '../api';
import { ApiResponse, Notice } from '../types';

export const noticeApi = {
  list: (params: { page?: number; limit?: number; search?: string }) =>
    api.get<ApiResponse<Notice[]>>('/notices', { params }).then((r) => ({ items: r.data.data, meta: r.data.meta! })),

  getById: (id: string) => api.get<ApiResponse<Notice>>(`/notices/${id}`).then((r) => r.data.data),

  create: (payload: { title: string; content: string; isPinned?: boolean; isImportant?: boolean }) =>
    api.post<ApiResponse<Notice>>('/notices', payload).then((r) => r.data.data),

  update: (id: string, payload: Partial<{ title: string; content: string; isPinned: boolean; isImportant: boolean }>) =>
    api.patch<ApiResponse<Notice>>(`/notices/${id}`, payload).then((r) => r.data.data),

  delete: (id: string) => api.delete<ApiResponse<null>>(`/notices/${id}`).then((r) => r.data),

  togglePin: (id: string) => api.patch<ApiResponse<Notice>>(`/notices/${id}/pin`).then((r) => r.data.data),
};
