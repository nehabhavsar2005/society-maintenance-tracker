'use client';

import * as React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageHeader } from '@/components/shared/page-header';
import { ErrorState } from '@/components/shared/error-state';
import { Skeleton } from '@/components/ui/skeleton';
import { ComplaintForm } from '@/components/complaints/complaint-form';
import { useComplaint, useUpdateComplaint } from '@/hooks/use-complaints';
import { ComplaintFormValues } from '@/lib/validators/complaint.validator';
import { useAuth } from '@/providers/auth-provider';

export default function EditComplaintPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const { data: complaint, isLoading, isError, refetch } = useComplaint(id);
  const updateComplaint = useUpdateComplaint(id);
  const [removedImageIds, setRemovedImageIds] = React.useState<string[]>([]);

  if (isLoading) return <Skeleton className="h-96 rounded-xl" />;
  if (isError || !complaint) return <ErrorState onRetry={() => refetch()} />;

  if (complaint.residentId !== user?.id || complaint.status !== 'OPEN') {
    return <ErrorState message="This complaint can no longer be edited." />;
  }

  const handleSubmit = async (values: ComplaintFormValues, images: File[]) => {
    await updateComplaint.mutateAsync({ payload: { ...values, removedImageIds }, newImages: images });
    toast.success('Complaint updated');
    router.push(`/complaints/${id}`);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Edit Complaint" description="You can edit this complaint until an admin takes action on it." />
      <ComplaintForm
        defaultValues={{
          title: complaint.title,
          description: complaint.description,
          category: complaint.category,
          priority: complaint.priority,
        }}
        existingImages={complaint.images.filter((img) => !removedImageIds.includes(img.id))}
        onRemoveExistingImage={(imgId) => setRemovedImageIds((prev) => [...prev, imgId])}
        onSubmit={handleSubmit}
        isSubmitting={updateComplaint.isPending}
        submitLabel="Save Changes"
      />
    </div>
  );
}
