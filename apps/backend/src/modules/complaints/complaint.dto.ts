import { z } from 'zod';

export const complaintCategoryEnum = z.enum([
  'ELECTRICAL',
  'WATER',
  'PLUMBING',
  'SECURITY',
  'PARKING',
  'LIFT',
  'CLEANING',
  'GARDEN',
  'NOISE',
  'OTHER',
]);

export const complaintPriorityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH']);
export const complaintStatusEnum = z.enum(['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'OVERDUE']);

export const createComplaintSchema = z.object({
  title: z.string().trim().min(5, 'Title must be at least 5 characters').max(150),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(2000),
  category: complaintCategoryEnum,
  priority: complaintPriorityEnum.optional().default('MEDIUM'),
});

export const updateComplaintSchema = z.object({
  title: z.string().trim().min(5).max(150).optional(),
  description: z.string().trim().min(10).max(2000).optional(),
  category: complaintCategoryEnum.optional(),
  priority: complaintPriorityEnum.optional(),
  removedImageIds: z.array(z.string().uuid()).optional(),
});

export const adminUpdateComplaintSchema = z.object({
  status: complaintStatusEnum.optional(),
  priority: complaintPriorityEnum.optional(),
  assignedToId: z.string().uuid().nullable().optional(),
  internalNotes: z.string().trim().max(2000).optional(),
  notes: z.string().trim().max(1000).optional(),
});

export const bulkActionSchema = z.object({
  complaintIds: z.array(z.string().uuid()).min(1, 'Select at least one complaint'),
  action: z.enum(['DELETE', 'SET_STATUS', 'SET_PRIORITY']),
  status: complaintStatusEnum.optional(),
  priority: complaintPriorityEnum.optional(),
});

export const complaintQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  category: complaintCategoryEnum.optional(),
  priority: complaintPriorityEnum.optional(),
  status: complaintStatusEnum.optional(),
  residentId: z.string().uuid().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sortBy: z.enum(['newest', 'oldest', 'priority', 'status']).optional().default('newest'),
});

export type CreateComplaintDto = z.infer<typeof createComplaintSchema>;
export type UpdateComplaintDto = z.infer<typeof updateComplaintSchema>;
export type AdminUpdateComplaintDto = z.infer<typeof adminUpdateComplaintSchema>;
export type BulkActionDto = z.infer<typeof bulkActionSchema>;
export type ComplaintQueryDto = z.infer<typeof complaintQuerySchema>;
