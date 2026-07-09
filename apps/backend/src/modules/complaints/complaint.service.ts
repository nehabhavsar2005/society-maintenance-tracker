import { ComplaintStatus, Prisma, Role } from '@prisma/client';
import { complaintRepository } from './complaint.repository';
import { ApiError } from '../../utils/ApiError';
import { generateTicketNumber } from '../../utils/generateTicketNumber';
import { parsePagination, buildMeta } from '../../utils/pagination';
import { settingsService } from '../settings/settings.service';
import { notificationService } from '../notifications/notification.service';
import { sendEmail } from '../../services/email.service';
import { complaintCreatedTemplate, complaintResolvedTemplate, statusChangedTemplate } from '../../templates/emailTemplates';
import { uploadImageBuffer, deleteImage } from '../../services/cloudinary.service';
import { env } from '../../config/env';
import { AdminUpdateComplaintDto, BulkActionDto, ComplaintQueryDto, CreateComplaintDto, UpdateComplaintDto } from './complaint.dto';
import { prisma } from '../../config/db';

interface Actor {
  id: string;
  role: Role;
  name: string;
}

function complaintUrl(id: string) {
  return `${env.CLIENT_URL}/complaints/${id}`;
}

export const complaintService = {
  async create(residentId: string, dto: CreateComplaintDto, files: Express.Multer.File[]) {
    const thresholdDays = await settingsService.getThresholdDaysFor(dto.priority ?? 'MEDIUM');
    const dueDate = new Date(Date.now() + thresholdDays * 24 * 60 * 60 * 1000);

    const uploaded = files.length ? await Promise.all(files.map((f) => uploadImageBuffer(f.buffer))) : [];

    const complaint = await complaintRepository.create({
      ticketNumber: generateTicketNumber(),
      title: dto.title,
      description: dto.description,
      category: dto.category,
      priority: dto.priority ?? 'MEDIUM',
      residentId,
      dueDate,
      images: uploaded.length ? { create: uploaded.map((img) => ({ url: img.url, publicId: img.publicId })) } : undefined,
    });

    await complaintRepository.addHistory({
      complaintId: complaint.id,
      actorId: residentId,
      newStatus: ComplaintStatus.OPEN,
      notes: 'Complaint created',
    });

    const resident = await prisma.user.findUnique({ where: { id: residentId } });
    if (resident) {
      await notificationService.create(
        residentId,
        'COMPLAINT_CREATED',
        'Complaint submitted',
        `Your complaint "${complaint.title}" (${complaint.ticketNumber}) has been submitted.`,
        complaint.id
      );

      await sendEmail({
        to: resident.email,
        subject: `Complaint Received - ${complaint.ticketNumber}`,
        html: complaintCreatedTemplate(resident.name, complaint.ticketNumber, complaint.title, complaintUrl(complaint.id)),
        template: 'complaint-created',
        userId: resident.id,
      });

      const admins = await prisma.user.findMany({ where: { role: 'ADMIN' }, select: { id: true } });
      await notificationService.createMany(
        admins.map((a) => a.id),
        'COMPLAINT_CREATED',
        'New complaint submitted',
        `${resident.name} submitted a new complaint: "${complaint.title}" (${complaint.ticketNumber}).`,
        complaint.id
      );
    }

    return complaint;
  },

  async list(actor: Actor, query: ComplaintQueryDto) {
    const { page, limit, skip } = parsePagination(query);

    const where: Prisma.ComplaintWhereInput = {};

    if (actor.role === Role.RESIDENT) {
      where.residentId = actor.id;
    } else if (query.residentId) {
      where.residentId = query.residentId;
    }

    if (query.category) where.category = query.category;
    if (query.priority) where.priority = query.priority;
    if (query.status) where.status = query.status;

    if (query.dateFrom || query.dateTo) {
      where.createdAt = {
        ...(query.dateFrom ? { gte: new Date(query.dateFrom) } : {}),
        ...(query.dateTo ? { lte: new Date(query.dateTo) } : {}),
      };
    }

    if (query.search) {
      where.OR = [
        { title: { contains: query.search, mode: 'insensitive' } },
        { ticketNumber: { contains: query.search, mode: 'insensitive' } },
        { description: { contains: query.search, mode: 'insensitive' } },
        { resident: { name: { contains: query.search, mode: 'insensitive' } } },
      ];
    }

    const orderBy: Prisma.ComplaintOrderByWithRelationInput[] = [{ isOverdue: 'desc' }];
    switch (query.sortBy) {
      case 'oldest':
        orderBy.push({ createdAt: 'asc' });
        break;
      case 'priority':
        orderBy.push({ priority: 'desc' }, { createdAt: 'desc' });
        break;
      case 'status':
        orderBy.push({ status: 'asc' }, { createdAt: 'desc' });
        break;
      default:
        orderBy.push({ createdAt: 'desc' });
    }

    const [items, total] = await Promise.all([
      complaintRepository.findMany(where, orderBy, skip, limit),
      complaintRepository.count(where),
    ]);

    return { items, meta: buildMeta(total, page, limit) };
  },

  async getById(actor: Actor, idOrTicket: string) {
    const complaint = await complaintRepository.findByTicketOrId(idOrTicket);
    if (!complaint) throw ApiError.notFound('Complaint not found');

    if (actor.role === Role.RESIDENT && complaint.residentId !== actor.id) {
      throw ApiError.forbidden('You do not have access to this complaint');
    }

    return complaint;
  },

  async update(actor: Actor, id: string, dto: UpdateComplaintDto, newFiles: Express.Multer.File[]) {
    const complaint = await complaintRepository.findById(id);
    if (!complaint) throw ApiError.notFound('Complaint not found');
    if (complaint.residentId !== actor.id) throw ApiError.forbidden('You can only edit your own complaints');
    if (complaint.status !== ComplaintStatus.OPEN) {
      throw ApiError.badRequest('Complaint can no longer be edited once it has been actioned by admin');
    }

    if (dto.removedImageIds?.length) {
      const images = await complaintRepository.removeImages(dto.removedImageIds);
      await Promise.all(images.filter((img) => img.publicId).map((img) => deleteImage(img.publicId as string)));
      await complaintRepository.deleteImagesByIds(dto.removedImageIds);
    }

    const uploaded = newFiles.length ? await Promise.all(newFiles.map((f) => uploadImageBuffer(f.buffer))) : [];

    const updated = await complaintRepository.update(id, {
      title: dto.title,
      description: dto.description,
      category: dto.category,
      priority: dto.priority,
      images: uploaded.length ? { create: uploaded.map((img) => ({ url: img.url, publicId: img.publicId })) } : undefined,
    });

    await complaintRepository.addHistory({
      complaintId: id,
      actorId: actor.id,
      notes: 'Complaint details updated by resident',
    });

    return updated;
  },

  async delete(actor: Actor, id: string) {
    const complaint = await complaintRepository.findById(id);
    if (!complaint) throw ApiError.notFound('Complaint not found');

    if (actor.role === Role.RESIDENT) {
      if (complaint.residentId !== actor.id) throw ApiError.forbidden('You can only delete your own complaints');
      if (complaint.status !== ComplaintStatus.OPEN) {
        throw ApiError.badRequest('Complaint can no longer be deleted once it has been processed');
      }
    }

    await Promise.all(complaint.images.filter((img) => img.publicId).map((img) => deleteImage(img.publicId as string)));
    await complaintRepository.delete(id);
    return { id };
  },

  async adminUpdate(actor: Actor, id: string, dto: AdminUpdateComplaintDto) {
    const complaint = await complaintRepository.findById(id);
    if (!complaint) throw ApiError.notFound('Complaint not found');

    const updateData: Prisma.ComplaintUpdateInput = {};
    let thresholdDays: number | undefined;

    if (dto.priority && dto.priority !== complaint.priority) {
      updateData.priority = dto.priority;
      thresholdDays = await settingsService.getThresholdDaysFor(dto.priority);
      updateData.dueDate = new Date(Date.now() + thresholdDays * 24 * 60 * 60 * 1000);
    }

    if (dto.status && dto.status !== complaint.status) {
      updateData.status = dto.status;
      updateData.isOverdue = dto.status === ComplaintStatus.OVERDUE;
      if (dto.status === ComplaintStatus.RESOLVED) updateData.resolvedAt = new Date();
      if (dto.status === ComplaintStatus.CLOSED) updateData.closedAt = new Date();
    }

    if (dto.assignedToId !== undefined) updateData.assignedTo = dto.assignedToId ? { connect: { id: dto.assignedToId } } : { disconnect: true };
    if (dto.internalNotes !== undefined) updateData.internalNotes = dto.internalNotes;

    const updated = await complaintRepository.update(id, updateData);

    if (dto.status && dto.status !== complaint.status || (dto.priority && dto.priority !== complaint.priority)) {
      await complaintRepository.addHistory({
        complaintId: id,
        actorId: actor.id,
        oldStatus: complaint.status,
        newStatus: dto.status ?? complaint.status,
        oldPriority: complaint.priority,
        newPriority: dto.priority ?? complaint.priority,
        notes: dto.notes ?? null,
      });
    }

    const resident = await prisma.user.findUnique({ where: { id: complaint.residentId } });
    if (resident && dto.status && dto.status !== complaint.status) {
      const isResolved = dto.status === ComplaintStatus.RESOLVED;

      await notificationService.create(
        resident.id,
        isResolved ? 'COMPLAINT_RESOLVED' : 'COMPLAINT_STATUS_CHANGED',
        isResolved ? 'Complaint resolved' : 'Complaint status updated',
        `Your complaint "${complaint.title}" (${complaint.ticketNumber}) is now ${dto.status.replace('_', ' ')}.`,
        complaint.id
      );

      await sendEmail({
        to: resident.email,
        subject: isResolved
          ? `Complaint Resolved - ${complaint.ticketNumber}`
          : `Complaint Status Update - ${complaint.ticketNumber}`,
        html: isResolved
          ? complaintResolvedTemplate(resident.name, complaint.ticketNumber, complaint.title, complaintUrl(complaint.id))
          : statusChangedTemplate(
              resident.name,
              complaint.ticketNumber,
              complaint.title,
              complaint.status,
              dto.status,
              complaintUrl(complaint.id)
            ),
        template: isResolved ? 'complaint-resolved' : 'complaint-status-changed',
        userId: resident.id,
      });
    }

    return updated;
  },

  async bulkAction(actor: Actor, dto: BulkActionDto) {
    if (dto.action === 'DELETE') {
      const complaints = await prisma.complaint.findMany({ where: { id: { in: dto.complaintIds } }, include: { images: true } });
      await Promise.all(
        complaints.flatMap((c) => c.images.filter((img) => img.publicId).map((img) => deleteImage(img.publicId as string)))
      );
      await prisma.complaint.deleteMany({ where: { id: { in: dto.complaintIds } } });
      return { affected: complaints.length };
    }

    if (dto.action === 'SET_STATUS' && dto.status) {
      const result = await prisma.complaint.updateMany({ where: { id: { in: dto.complaintIds } }, data: { status: dto.status } });
      await Promise.all(
        dto.complaintIds.map((id) =>
          complaintRepository.addHistory({ complaintId: id, actorId: actor.id, newStatus: dto.status, notes: 'Bulk status update' })
        )
      );
      return { affected: result.count };
    }

    if (dto.action === 'SET_PRIORITY' && dto.priority) {
      const result = await prisma.complaint.updateMany({ where: { id: { in: dto.complaintIds } }, data: { priority: dto.priority } });
      await Promise.all(
        dto.complaintIds.map((id) =>
          complaintRepository.addHistory({ complaintId: id, actorId: actor.id, newPriority: dto.priority, notes: 'Bulk priority update' })
        )
      );
      return { affected: result.count };
    }

    throw ApiError.badRequest('Invalid bulk action payload');
  },

  async runOverdueDetection() {
    const candidates = await complaintRepository.findOverdueCandidates();
    if (!candidates.length) return { markedOverdue: 0 };

    await complaintRepository.markOverdue(candidates.map((c) => c.id));

    await Promise.all(
      candidates.map((c) =>
        complaintRepository.addHistory({
          complaintId: c.id,
          newStatus: ComplaintStatus.OVERDUE,
          oldStatus: c.status,
          notes: 'Automatically marked overdue by system',
        })
      )
    );

    return { markedOverdue: candidates.length };
  },
};
