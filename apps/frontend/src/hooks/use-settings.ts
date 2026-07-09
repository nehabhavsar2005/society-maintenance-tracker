'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { settingsApi } from '@/lib/services/settings.service';
import { getErrorMessage } from '@/lib/utils';
import { ComplaintPriority } from '@/lib/types';

export function usePrioritySettings() {
  return useQuery({
    queryKey: ['priority-settings'],
    queryFn: settingsApi.getPrioritySettings,
  });
}

export function useUpdatePrioritySettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ priority, days }: { priority: ComplaintPriority; days: number }) => settingsApi.updatePrioritySettings(priority, days),
    onSuccess: () => {
      toast.success('Overdue threshold updated');
      queryClient.invalidateQueries({ queryKey: ['priority-settings'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
