import { api } from '../api';
import { ApiResponse, Complaint, ComplaintCategory, ComplaintPriority, Notice } from '../types';

export interface AdminDashboardStats {
  totals: {
    total: number;
    open: number;
    inProgress: number;
    resolved: number;
    closed: number;
    overdue: number;
    totalResidents: number;
  };
  byCategory: { category: ComplaintCategory; count: number }[];
  byPriority: { priority: ComplaintPriority; count: number }[];
  recentComplaints: Complaint[];
  recentNotices: Notice[];
  monthlyTrend: { month: string; created: number; resolved: number }[];
}

export interface ResidentDashboardStats {
  totals: { total: number; open: number; inProgress: number; resolved: number; overdue: number };
  recentComplaints: Complaint[];
  recentNotices: Notice[];
}

export const dashboardApi = {
  getStats: () => api.get<ApiResponse<AdminDashboardStats | ResidentDashboardStats>>('/dashboard/stats').then((r) => r.data.data),
};
