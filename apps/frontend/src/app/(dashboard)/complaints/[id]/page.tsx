'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Pencil, Trash2, MapPin, Mail, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/shared/page-header';
import { ErrorState } from '@/components/shared/error-state';
import { ConfirmDialog } from '@/components/shared/confirm-dialog';
import { StatusBadge, PriorityBadge } from '@/components/shared/status-badge';
import { CategoryIcon } from '@/components/shared/category-icon';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { ImageGallery } from '@/components/complaints/image-gallery';
import { ComplaintTimeline } from '@/components/complaints/complaint-timeline';
import { AdminActionsPanel } from '@/components/complaints/admin-actions-panel';
import { useComplaint, useDeleteComplaint } from '@/hooks/use-complaints';
import { useAuth } from '@/providers/auth-provider';
import { CATEGORY_LABELS, PRIORITY_LABELS } from '@/lib/types';
import { formatDate, initials } from '@/lib/utils';

export default function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { data: complaint, isLoading, isError, refetch } = useComplaint(id);
  const deleteComplaint = useDeleteComplaint();
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  if (isLoading) return <DetailSkeleton />;
  if (isError || !complaint) return <ErrorState message="This complaint could not be found or you don't have access to it." onRetry={() => refetch()} />;

  const isOwner = user?.id === complaint.residentId;
  const isAdmin = user?.role === 'ADMIN';
  const canEdit = isOwner && complaint.status === 'OPEN';

  return (
    <div className="space-y-6">
      <Link href="/complaints" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to complaints
      </Link>

      <PageHeader
        title={complaint.title}
        description={`Ticket #${complaint.ticketNumber} · Submitted ${formatDate(complaint.createdAt)}`}
        actions={
          canEdit && (
            <div className="flex gap-2">
              <Link href={`/complaints/${complaint.id}/edit`}>
                <Button variant="outline" size="sm">
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </Button>
              </Link>
              <Button variant="destructive" size="sm" onClick={() => setConfirmDelete(true)}>
                <Trash2 className="h-3.5 w-3.5" />
                Delete
              </Button>
            </div>
          )
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={complaint.status} />
        <PriorityBadge priority={complaint.priority} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardHeader className="flex-row items-center gap-3 space-y-0">
                <CategoryIcon category={complaint.category} className="h-10 w-10" />
                <div>
                  <CardTitle className="text-base">{CATEGORY_LABELS[complaint.category]}</CardTitle>
                  <p className="text-xs text-muted-foreground">{PRIORITY_LABELS[complaint.priority]} priority</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{complaint.description}</p>
                <ImageGallery images={complaint.images} />
              </CardContent>
            </Card>
          </motion.div>

          <ComplaintTimeline history={complaint.history ?? []} />
        </div>

        <div className="space-y-6">
          {isAdmin && <AdminActionsPanel complaint={complaint} />}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resident Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>{complaint.resident ? initials(complaint.resident.name) : '?'}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{complaint.resident?.name}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" /> {complaint.resident?.email}
                  </p>
                </div>
              </div>
              {complaint.resident?.flatNumber && (
                <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  Flat {complaint.resident.flatNumber}
                  {complaint.resident.block && `, Block ${complaint.resident.block}`}
                </p>
              )}
              <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                Due by {complaint.dueDate ? formatDate(complaint.dueDate) : 'Not set'}
              </p>
              {complaint.assignedTo && (
                <div className="rounded-lg bg-muted/60 p-3">
                  <p className="text-xs text-muted-foreground">Assigned to</p>
                  <p className="text-sm font-medium">{complaint.assignedTo.name}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmDelete}
        onOpenChange={setConfirmDelete}
        title="Delete this complaint?"
        description="This action cannot be undone. All associated images and history will be permanently removed."
        confirmLabel="Delete Complaint"
        loading={deleteComplaint.isPending}
        onConfirm={() =>
          deleteComplaint.mutate(complaint.id, {
            onSuccess: () => router.push('/complaints'),
          })
        }
      />
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-8 w-2/3" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    </div>
  );
}
