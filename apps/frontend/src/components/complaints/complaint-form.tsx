'use client';

import * as React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ImageUploader } from './image-uploader';
import { complaintFormSchema, ComplaintFormValues } from '@/lib/validators/complaint.validator';
import { CATEGORY_LABELS, Complaint, PRIORITY_LABELS } from '@/lib/types';
import { CategoryIcon } from '@/components/shared/category-icon';

interface ComplaintFormProps {
  defaultValues?: Partial<ComplaintFormValues>;
  existingImages?: Complaint['images'];
  onRemoveExistingImage?: (id: string) => void;
  onSubmit: (values: ComplaintFormValues, images: File[]) => Promise<void>;
  submitLabel?: string;
  isSubmitting?: boolean;
}

export function ComplaintForm({
  defaultValues,
  existingImages = [],
  onRemoveExistingImage,
  onSubmit,
  submitLabel = 'Submit Complaint',
  isSubmitting = false,
}: ComplaintFormProps) {
  const [images, setImages] = React.useState<File[]>([]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintFormSchema),
    defaultValues: { priority: 'MEDIUM', ...defaultValues },
  });

  const categories = Object.entries(CATEGORY_LABELS) as [keyof typeof CATEGORY_LABELS, string][];
  const priorities = Object.entries(PRIORITY_LABELS) as [keyof typeof PRIORITY_LABELS, string][];

  return (
    <motion.form
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit((values) => onSubmit(values, images))}
      className="space-y-6"
    >
      <Card>
        <CardHeader>
          <CardTitle>Complaint Details</CardTitle>
          <CardDescription>Provide clear details so our team can resolve your issue quickly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" placeholder="e.g. Water leakage in bathroom ceiling" {...register('title')} />
            {errors.title && <p className="text-xs text-destructive">{errors.title.message}</p>}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          <span className="flex items-center gap-2">
                            <CategoryIcon category={value as never} className="h-6 w-6 p-1" />
                            {label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-xs text-destructive">{errors.category.message}</p>}
            </div>

            <div className="space-y-1.5">
              <Label>Priority</Label>
              <Controller
                control={control}
                name="priority"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" rows={5} placeholder="Describe the issue in detail..." {...register('description')} />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label>Photos (optional)</Label>
            <ImageUploader files={images} onChange={setImages} existingImages={existingImages} onRemoveExisting={onRemoveExistingImage} />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button type="submit" variant="gradient" size="lg" loading={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </motion.form>
  );
}
