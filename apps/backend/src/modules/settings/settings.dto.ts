import { z } from 'zod';

export const updatePrioritySettingsSchema = z.object({
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  overdueThresholdDays: z.number().int().min(1).max(90),
});
