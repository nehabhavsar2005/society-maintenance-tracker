import { api } from '../api';
import { ApiResponse, Notification } from '../types';

export const notificationApi = {
  list: (params: { page?: number; limit?: number; unreadOnly?: boolean }) =>
    api
      .get<ApiResponse<{ items: Notification[]; unreadCount: number }>>('/notifications', { params })
      .then((r) => ({ ...r.data.data, meta: r.data.meta! })),

  unreadCount: () => api.get<ApiResponse<{ count: number }>>('/notifications/unread-count').then((r) => r.data.data.count),

  markAsRead: (id: string) => api.patch<ApiResponse<null>>(`/notifications/${id}/read`).then((r) => r.data),

  markAllAsRead: () => api.patch<ApiResponse<null>>('/notifications/read-all').then((r) => r.data),
};
