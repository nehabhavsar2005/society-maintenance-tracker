import { z } from 'zod';

export const complaintFormSchema = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters').max(150, 'Title is too long'),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(2000, 'Description is too long'),
  category: z.enum(['ELECTRICAL', 'WATER', 'PLUMBING', 'SECURITY', 'PARKING', 'LIFT', 'CLEANING', 'GARDEN', 'NOISE', 'OTHER'], {
    required_error: 'Please select a category',
  }),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
});

export type ComplaintFormValues = z.infer<typeof complaintFormSchema>;

export const noticeFormSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(150),
  content: z.string().trim().min(5, 'Content must be at least 5 characters').max(5000),
  isPinned: z.boolean().default(false),
  isImportant: z.boolean().default(false),
});

export type NoticeFormValues = z.infer<typeof noticeFormSchema>;
