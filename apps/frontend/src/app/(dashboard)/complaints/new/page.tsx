'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/shared/page-header';
import { ComplaintForm } from '@/components/complaints/complaint-form';
import { useCreateComplaint } from '@/hooks/use-complaints';
import { ComplaintFormValues } from '@/lib/validators/complaint.validator';

export default function NewComplaintPage() {
  const router = useRouter();
  const createComplaint = useCreateComplaint();

  const handleSubmit = async (values: ComplaintFormValues, images: File[]) => {
    const complaint = await createComplaint.mutateAsync({ ...values, images });
    router.push(`/complaints/${complaint.id}`);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="Raise a Complaint" description="Fill in the details below and our team will get right on it." />
      <ComplaintForm onSubmit={handleSubmit} isSubmitting={createComplaint.isPending} submitLabel="Submit Complaint" />
    </div>
  );
}
