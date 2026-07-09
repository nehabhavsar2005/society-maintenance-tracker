import { api } from '../api';
import { ApiResponse, User } from '../types';

export const userApi = {
  listResidents: (search?: string) => api.get<ApiResponse<User[]>>('/users/residents', { params: { search } }).then((r) => r.data.data),

  listAdmins: () => api.get<ApiResponse<{ id: string; name: string; email: string }[]>>('/users/admins').then((r) => r.data.data),

  listAll: (params: { page?: number; limit?: number }) =>
    api.get<ApiResponse<(User & { _count: { complaints: number } })[]>>('/users', { params }).then((r) => ({ items: r.data.data, meta: r.data.meta! })),

  toggleActive: (id: string) => api.patch<ApiResponse<{ id: string; isActive: boolean }>>(`/users/${id}/toggle-active`).then((r) => r.data.data),
};
