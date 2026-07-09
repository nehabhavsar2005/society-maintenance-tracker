import { api } from '../api';
import { ApiResponse, User } from '../types';

export interface AuthResult {
  user: User;
  accessToken: string;
}

export const authApi = {
  register: (payload: { name: string; email: string; password: string; phone?: string; flatNumber?: string; block?: string }) =>
    api.post<ApiResponse<AuthResult>>('/auth/register', payload).then((r) => r.data.data),

  login: (payload: { email: string; password: string; rememberMe?: boolean }) =>
    api.post<ApiResponse<AuthResult>>('/auth/login', payload).then((r) => r.data.data),

  logout: () => api.post('/auth/logout'),

  forgotPassword: (email: string) => api.post<ApiResponse<null>>('/auth/forgot-password', { email }).then((r) => r.data),

  resetPassword: (token: string, password: string) =>
    api.post<ApiResponse<null>>('/auth/reset-password', { token, password }).then((r) => r.data),

  me: () => api.get<ApiResponse<User>>('/auth/me').then((r) => r.data.data),
};
