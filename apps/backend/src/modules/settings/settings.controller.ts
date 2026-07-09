import { Request, Response } from 'express';
import { ComplaintPriority } from '@prisma/client';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import { settingsService } from './settings.service';

export const settingsController = {
  getPrioritySettings: asyncHandler(async (_req: Request, res: Response) => {
    const settings = await settingsService.getPrioritySettings();
    sendSuccess(res, settings, 'Priority settings fetched');
  }),

  updatePrioritySettings: asyncHandler(async (req: Request, res: Response) => {
    const { priority, overdueThresholdDays } = req.body as { priority: ComplaintPriority; overdueThresholdDays: number };
    const updated = await settingsService.updatePrioritySettings(priority, overdueThresholdDays);
    sendSuccess(res, updated, 'Overdue threshold updated successfully');
  }),
};
