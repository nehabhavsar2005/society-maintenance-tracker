'use client';

import * as React from 'react';
import Link from 'next/link';
import { Plus, Inbox, Trash2, X } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { ComplaintCard } from '@/components/complaints/complaint-card';
import { ComplaintFiltersBar } from '@/components/complaints/complaint-filters';
import { ComplaintsSkeleton } from '@/components/complaints/complaints-skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBulkComplaintAction, useComplaints } from '@/hooks/use-complaints';
import { useAuth } from '@/providers/auth-provider';
import { ComplaintFilters } from '@/lib/services/complaint.service';
import { ComplaintStatus, STATUS_LABELS } from '@/lib/types';
import { AnimatePresence, motion } from 'framer-motion';

export default function ComplaintsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [filters, setFilters] = React.useState<ComplaintFilters>({ page: 1, limit: 10, sortBy: 'newest' });
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [confirmBulkDelete, setConfirmBulkDelete] = React.useState(false);

  const { data, isLoading, isError, refetch } = useComplaints(filters);
  const bulkAction = useBulkComplaintAction();

  const toggleSelect = (id: string, checked: boolean) => {
    setSelectedIds((prev) => (checked ? [...prev, id] : prev.filter((x) => x !== id)));
  };

  const clearSelection = () => setSelectedIds([]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={isAdmin ? 'All Complaints' : 'My Complaints'}
        description={isAdmin ? 'Manage and resolve resident complaints across the society.' : 'Track the complaints you have submitted.'}
        actions={
          !isAdmin && (
            <Link href="/complaints/new">
              <Button variant="gradient">
                <Plus className="h-4 w-4" />
                New Complaint
              </Button>
            </Link>
          )
        }
      />

      <ComplaintFiltersBar filters={filters} onChange={setFilters} />

      {isLoading && <ComplaintsSkeleton />}
      {isError && <ErrorState onRetry={() => refetch()} />}

      {!isLoading && !isError && data && (
        <>
          {data.items.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="No complaints found"
              description={isAdmin ? 'No complaints match your current filters.' : "You haven't raised any complaints yet."}
              actionLabel={!isAdmin ? 'Raise a Complaint' : undefined}
              onAction={!isAdmin ? () => (window.location.href = '/complaints/new') : undefined}
            />
          ) : (
            <div className="space-y-3 pb-16">
              {data.items.map((complaint, index) => (
                <ComplaintCard
                  key={complaint.id}
                  complaint={complaint}
                  showResident={isAdmin}
                  index={index}
                  selectable={isAdmin}
                  selected={selectedIds.includes(complaint.id)}
                  onSelectChange={(checked) => toggleSelect(complaint.id, checked)}
                />
              ))}
            </div>
          )}

          <PaginationControls meta={data.meta} onPageChange={(page) => setFilters((f) => ({ ...f, page }))} />
        </>
      )}

      <AnimatePresence>
        {isAdmin && selectedIds.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            className="fixed bottom-6 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-border bg-card px-4 py-2.5 shadow-2xl"
          >
            <span className="text-sm font-medium">{selectedIds.length} selected</span>
            <Select onValueChange={(status) => bulkAction.mutate({ complaintIds: selectedIds, action: 'SET_STATUS', status: status as ComplaintStatus }, { onSuccess: clearSelection })}>
              <SelectTrigger className="h-8 w-[150px]">
                <SelectValue placeholder="Set status..." />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="destructive" size="sm" onClick={() => setConfirmBulkDelete(true)}>
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={clearSelection}>
              <X className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        open={confirmBulkDelete}
        onOpenChange={setConfirmBulkDelete}
        title={`Delete ${selectedIds.length} complaint(s)?`}
        description="This action cannot be undone. All selected complaints and their history will be permanently removed."
        confirmLabel="Delete Selected"
        loading={bulkAction.isPending}
        onConfirm={() =>
          bulkAction.mutate(
            { complaintIds: selectedIds, action: 'DELETE' },
            {
              onSuccess: () => {
                clearSelection();
                setConfirmBulkDelete(false);
              },
            }
          )
        }
      />
    </div>
  );
}
