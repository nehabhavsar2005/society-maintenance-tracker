'use client';

import * as React from 'react';
import { Plus, Megaphone, Search } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/shared/empty-state';
import { ErrorState } from '@/components/shared/error-state';
import { PaginationControls } from '@/components/shared/pagination-controls';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { NoticeCard } from '@/components/notices/notice-card';
import { NoticeFormDialog } from '@/components/notices/notice-form-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useDeleteNotice, useNotices, useTogglePinNotice } from '@/hooks/use-notices';
import { useAuth } from '@/providers/auth-provider';
import { Notice } from '@/lib/types';

export default function NoticesPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [page, setPage] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [formOpen, setFormOpen] = React.useState(false);
  const [editingNotice, setEditingNotice] = React.useState<Notice | null>(null);
  const [deletingNotice, setDeletingNotice] = React.useState<Notice | null>(null);

  const { data, isLoading, isError, refetch } = useNotices({ page, limit: 9, search: search || undefined });
  const togglePin = useTogglePinNotice();
  const deleteNotice = useDeleteNotice();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notice Board"
        description={isAdmin ? 'Publish and manage society-wide announcements.' : 'Stay updated with the latest society announcements.'}
        actions={
          isAdmin && (
            <Button
              variant="gradient"
              onClick={() => {
                setEditingNotice(null);
                setFormOpen(true);
              }}
            >
              <Plus className="h-4 w-4" />
              New Notice
            </Button>
          )
        }
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search notices..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-xl" />
          ))}
        </div>
      )}

      {isError && <ErrorState onRetry={() => refetch()} />}

      {!isLoading && !isError && data && (
        <>
          {data.items.length === 0 ? (
            <EmptyState icon={Megaphone} title="No notices yet" description="Society announcements will appear here once published." />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {data.items.map((notice, index) => (
                <NoticeCard
                  key={notice.id}
                  notice={notice}
                  isAdmin={isAdmin}
                  index={index}
                  onTogglePin={(n) => togglePin.mutate(n.id)}
                  onEdit={(n) => {
                    setEditingNotice(n);
                    setFormOpen(true);
                  }}
                  onDelete={(n) => setDeletingNotice(n)}
                />
              ))}
            </div>
          )}

          <PaginationControls meta={data.meta} onPageChange={setPage} />
        </>
      )}

      <NoticeFormDialog open={formOpen} onOpenChange={setFormOpen} notice={editingNotice} />

      <ConfirmDialog
        open={Boolean(deletingNotice)}
        onOpenChange={(open) => !open && setDeletingNotice(null)}
        title="Delete this notice?"
        description="This notice will be permanently removed from the notice board."
        confirmLabel="Delete Notice"
        loading={deleteNotice.isPending}
        onConfirm={() => {
          if (deletingNotice) deleteNotice.mutate(deletingNotice.id, { onSuccess: () => setDeletingNotice(null) });
        }}
      />
    </div>
  );
}
