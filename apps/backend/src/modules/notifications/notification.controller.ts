import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import { notificationService } from './notification.service';
import { ApiError } from '../../utils/ApiError';

export const notificationController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const { items, meta, unreadCount } = await notificationService.list(req.user.id, req.query as never);
    sendSuccess(res, { items, unreadCount }, 'Notifications fetched', 200, meta);
  }),

  markAsRead: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    await notificationService.markAsRead(req.user.id, req.params.id);
    sendSuccess(res, null, 'Notification marked as read');
  }),

  markAllAsRead: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    await notificationService.markAllAsRead(req.user.id);
    sendSuccess(res, null, 'All notifications marked as read');
  }),

  unreadCount: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const count = await notificationService.unreadCount(req.user.id);
    sendSuccess(res, { count }, 'Unread count fetched');
  }),
};
