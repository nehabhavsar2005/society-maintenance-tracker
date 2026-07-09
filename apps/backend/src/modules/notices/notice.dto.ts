import { z } from 'zod';

export const createNoticeSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(150),
  content: z.string().trim().min(5, 'Content must be at least 5 characters').max(5000),
  isPinned: z.boolean().optional().default(false),
  isImportant: z.boolean().optional().default(false),
});

export const updateNoticeSchema = createNoticeSchema.partial();

export const noticeQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
});

export type CreateNoticeDto = z.infer<typeof createNoticeSchema>;
export type UpdateNoticeDto = z.infer<typeof updateNoticeSchema>;
