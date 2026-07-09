import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import { dashboardService } from './dashboard.service';
import { ApiError } from '../../utils/ApiError';

export const dashboardController = {
  getStats: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const stats =
      req.user.role === Role.ADMIN
        ? await dashboardService.getAdminStats()
        : await dashboardService.getResidentStats(req.user.id);
    sendSuccess(res, stats, 'Dashboard stats fetched');
  }),
};
