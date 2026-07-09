'use client';

import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '@/lib/services/dashboard.service';

export function useDashboardStats() {
  return useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
    refetchInterval: 60_000,
  });
}
