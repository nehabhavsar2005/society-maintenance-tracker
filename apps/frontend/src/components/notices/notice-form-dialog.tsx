'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { noticeFormSchema, NoticeFormValues } from '@/lib/validators/complaint.validator';
import { Notice } from '@/lib/types';
import { useCreateNotice, useUpdateNotice } from '@/hooks/use-notices';

export function NoticeFormDialog({ open, onOpenChange, notice }: { open: boolean; onOpenChange: (open: boolean) => void; notice?: Notice | null }) {
  const isEdit = Boolean(notice);
  const createNotice = useCreateNotice();
  const updateNotice = useUpdateNotice(notice?.id ?? '');

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NoticeFormValues>({
    resolver: zodResolver(noticeFormSchema),
    defaultValues: { title: '', content: '', isPinned: false, isImportant: false },
  });

  React.useEffect(() => {
    if (open) {
      reset(
        notice
          ? { title: notice.title, content: notice.content, isPinned: notice.isPinned, isImportant: notice.isImportant }
          : { title: '', content: '', isPinned: false, isImportant: false }
      );
    }
  }, [open, notice, reset]);

  const onSubmit = async (values: NoticeFormValues) => {
    if (isEdit) {
      await updateNotice.mutateAsync(values);
    } else {
      await createNotice.mutateAsync(values);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Notice' : 'Publish New Notice'}</DialogTitle>
          <DialogDescription>{isEdit ? 'Update the notice details below.' : 'This will be visible to all residents immediately.'}</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g. Water Supply Maintenance" {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="content">Content</Label>
            <Textarea id="content" rows={5} placeholder="Write the notice details..." {...register('content')} />
            {errors.content && <p className="text-xs text-destructive">{errors.content.message}</p>}
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label htmlFor="isPinned">Pin to top</Label>
              <p className="text-xs text-muted-foreground">Pinned notices always appear first.</p>
            </div>
            <Switch id="isPinned" checked={watch('isPinned')} onCheckedChange={(v) => setValue('isPinned', v)} />
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label htmlFor="isImportant">Mark as important</Label>
              <p className="text-xs text-muted-foreground">Highlights the notice and sends priority email.</p>
            </div>
            <Switch id="isImportant" checked={watch('isImportant')} onCheckedChange={(v) => setValue('isImportant', v)} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="gradient" loading={isSubmitting}>
              {isEdit ? 'Save Changes' : 'Publish Notice'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
