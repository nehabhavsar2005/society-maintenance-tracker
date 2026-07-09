import { Request, Response } from 'express';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import { complaintService } from './complaint.service';
import { ApiError } from '../../utils/ApiError';
import { recordAudit } from '../../utils/auditLog';
import {
  AdminUpdateComplaintDto,
  BulkActionDto,
  ComplaintQueryDto,
  CreateComplaintDto,
  UpdateComplaintDto,
} from './complaint.dto';

function getActor(req: Request) {
  if (!req.user) throw ApiError.unauthorized();
  return req.user;
}

export const complaintController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const actor = getActor(req);
    const files = (req.files as Express.Multer.File[]) ?? [];
    const complaint = await complaintService.create(actor.id, req.body as CreateComplaintDto, files);
    sendSuccess(res, complaint, 'Complaint created successfully', 201);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const actor = getActor(req);
    const { items, meta } = await complaintService.list(actor, req.query as unknown as ComplaintQueryDto);
    sendSuccess(res, items, 'Complaints fetched', 200, meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const actor = getActor(req);
    const complaint = await complaintService.getById(actor, req.params.id);
    sendSuccess(res, complaint, 'Complaint fetched');
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const actor = getActor(req);
    const files = (req.files as Express.Multer.File[]) ?? [];
    const complaint = await complaintService.update(actor, req.params.id, req.body as UpdateComplaintDto, files);
    sendSuccess(res, complaint, 'Complaint updated successfully');
  }),

  delete: asyncHandler(async (req: Request, res: Response) => {
    const actor = getActor(req);
    await complaintService.delete(actor, req.params.id);
    await recordAudit({ userId: actor.id, action: 'DELETE', entityType: 'Complaint', entityId: req.params.id, ipAddress: req.ip });
    sendSuccess(res, null, 'Complaint deleted successfully');
  }),

  adminUpdate: asyncHandler(async (req: Request, res: Response) => {
    const actor = getActor(req);
    const complaint = await complaintService.adminUpdate(actor, req.params.id, req.body as AdminUpdateComplaintDto);
    await recordAudit({
      userId: actor.id,
      action: 'ADMIN_UPDATE',
      entityType: 'Complaint',
      entityId: req.params.id,
      metadata: req.body as Record<string, unknown>,
      ipAddress: req.ip,
    });
    sendSuccess(res, complaint, 'Complaint updated successfully');
  }),

  bulkAction: asyncHandler(async (req: Request, res: Response) => {
    const actor = getActor(req);
    const result = await complaintService.bulkAction(actor, req.body as BulkActionDto);
    await recordAudit({
      userId: actor.id,
      action: 'BULK_ACTION',
      entityType: 'Complaint',
      metadata: req.body as Record<string, unknown>,
      ipAddress: req.ip,
    });
    sendSuccess(res, result, 'Bulk action completed successfully');
  }),
};
