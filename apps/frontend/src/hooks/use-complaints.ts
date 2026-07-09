'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { complaintApi, ComplaintFilters, CreateComplaintPayload } from '@/lib/services/complaint.service';
import { getErrorMessage } from '@/lib/utils';
import { ComplaintCategory, ComplaintPriority, ComplaintStatus } from '@/lib/types';

export function useComplaints(filters: ComplaintFilters) {
  return useQuery({
    queryKey: ['complaints', filters],
    queryFn: () => complaintApi.list(filters),
    placeholderData: (prev) => prev,
  });
}

export function useComplaint(id: string | undefined) {
  return useQuery({
    queryKey: ['complaint', id],
    queryFn: () => complaintApi.getById(id as string),
    enabled: Boolean(id),
  });
}

export function useCreateComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateComplaintPayload) => complaintApi.create(payload),
    onSuccess: () => {
      toast.success('Complaint submitted successfully');
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useUpdateComplaint(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      payload,
      newImages,
    }: {
      payload: Partial<{ title: string; description: string; category: ComplaintCategory; priority: ComplaintPriority; removedImageIds: string[] }>;
      newImages?: File[];
    }) => complaintApi.update(id, payload, newImages),
    onSuccess: () => {
      toast.success('Complaint updated successfully');
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaint', id] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useDeleteComplaint() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => complaintApi.delete(id),
    onSuccess: () => {
      toast.success('Complaint deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useAdminUpdateComplaint(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<{ status: ComplaintStatus; priority: ComplaintPriority; assignedToId: string | null; internalNotes: string; notes: string }>) =>
      complaintApi.adminUpdate(id, payload),
    onSuccess: () => {
      toast.success('Complaint updated successfully');
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['complaint', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}

export function useBulkComplaintAction() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: complaintApi.bulkAction,
    onSuccess: (result) => {
      toast.success(`Bulk action applied to ${result.affected} complaint(s)`);
      queryClient.invalidateQueries({ queryKey: ['complaints'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
}
