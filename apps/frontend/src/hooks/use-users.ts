'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userApi } from '@/lib/services/user.service';
import { getErrorMessage } from '@/lib/utils';

export function useResidents(search?: string) {
  return useQuery({
    queryKey: ['residents', search],
    queryFn: () => userApi.listResidents(search),
  });
}

export function useAdmins() {
  return useQuery({
    queryKey: ['admins'],
    queryFn: () => userApi.listAdmins(),
  });
}

export function useAllUsers(params: { page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['users', params],
    queryFn: () => userApi.listAll(params),
    placeholderData: (prev) => prev,
  });
}

export function useToggleUserActive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.toggleActive,
    onSuccess: () => {
      toast.success('User status updated');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
