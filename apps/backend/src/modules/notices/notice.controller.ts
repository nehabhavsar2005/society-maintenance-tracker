import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import { noticeService } from './notice.service';
import { ApiError } from '../../utils/ApiError';

export const noticeController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) throw ApiError.unauthorized();
    const notice = await noticeService.create(req.user.id, req.body);
    sendSuccess(res, notice, 'Notice published successfully', 201);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const { items, meta } = await noticeService.list(req.query as never);
    sendSuccess(res, items, 'Notices fetched', 200, meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const notice = await noticeService.getById(req.params.id);
    sendSuccess(res, notice, 'Notice fetched');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const notice = await noticeService.update(req.params.id, req.body);
    sendSuccess(res, notice, 'Notice updated successfully');
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    await noticeService.delete(req.params.id);
    sendSuccess(res, null, 'Notice deleted successfully');
  }),

  togglePin: asyncHandler(async (req: Request, res: Response) => {
    const notice = await noticeService.togglePin(req.params.id);
    sendSuccess(res, notice, notice.isPinned ? 'Notice pinned' : 'Notice unpinned');
  }),
};
