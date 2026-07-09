import { api } from '../api';
import { ApiResponse, ComplaintPriority } from '../types';

export interface PrioritySetting {
  id: string;
  priority: ComplaintPriority;
  overdueThresholdDays: number;
}

export const settingsApi = {
  getPrioritySettings: () => api.get<ApiResponse<PrioritySetting[]>>('/settings/priority').then((r) => r.data.data),

  updatePrioritySettings: (priority: ComplaintPriority, overdueThresholdDays: number) =>
    api.put<ApiResponse<PrioritySetting>>('/settings/priority', { priority, overdueThresholdDays }).then((r) => r.data.data),
};
