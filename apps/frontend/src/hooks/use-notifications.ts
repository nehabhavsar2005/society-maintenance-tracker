'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/lib/services/notification.service';
import { useAuth } from '@/providers/auth-provider';

export function useNotifications(params: { page?: number; limit?: number; unreadOnly?: boolean } = {}) {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['notifications', params],
    queryFn: () => notificationApi.list(params),
    enabled: isAuthenticated,
    refetchInterval: 30_000,
  });
}

export function useUnreadCount() {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['notifications-unread-count'],
    queryFn: () => notificationApi.unreadCount(),
    enabled: isAuthenticated,
    refetchInterval: 20_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      queryClient.invalidateQueries({ queryKey: ['notifications-unread-count'] });
    },
  });
}
