'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { noticeApi } from '@/lib/services/notice.service';
import { getErrorMessage } from '@/lib/utils';

export function useNotices(params: { page?: number; limit?: number; search?: string }) {
  return useQuery({
    queryKey: ['notices', params],
    queryFn: () => noticeApi.list(params),
    placeholderData: (prev) => prev,
  });
}

export function useCreateNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: noticeApi.create,
    onSuccess: () => {
      toast.success('Notice published successfully');
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateNotice(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof noticeApi.update>[1]) => noticeApi.update(id, payload),
    onSuccess: () => {
      toast.success('Notice updated successfully');
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: noticeApi.delete,
    onSuccess: () => {
      toast.success('Notice deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useTogglePinNotice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: noticeApi.togglePin,
    onSuccess: (notice) => {
      toast.success(notice.isPinned ? 'Notice pinned to top' : 'Notice unpinned');
      queryClient.invalidateQueries({ queryKey: ['notices'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
