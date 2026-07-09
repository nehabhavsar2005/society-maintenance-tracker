import { Prisma, ComplaintStatus } from '@prisma/client';
import { prisma } from '../../config/db';

const complaintInclude = {
  resident: { select: { id: true, name: true, email: true, flatNumber: true, block: true, avatarUrl: true } },
  assignedTo: { select: { id: true, name: true, email: true } },
  images: true,
  _count: { select: { history: true } },
} satisfies Prisma.ComplaintInclude;

const complaintDetailInclude = {
  resident: { select: { id: true, name: true, email: true, flatNumber: true, block: true, avatarUrl: true } },
  assignedTo: { select: { id: true, name: true, email: true } },
  images: true,
  history: {
    include: { actor: { select: { id: true, name: true, role: true } } },
    orderBy: { createdAt: 'desc' },
  },
} satisfies Prisma.ComplaintInclude;

export const complaintRepository = {
  include: complaintInclude,
  detailInclude: complaintDetailInclude,

  create(data: Prisma.ComplaintUncheckedCreateInput) {
    return prisma.complaint.create({ data, include: complaintDetailInclude });
  },

  findById(id: string) {
    return prisma.complaint.findUnique({ where: { id }, include: complaintDetailInclude });
  },

  findByTicketOrId(idOrTicket: string) {
    return prisma.complaint.findFirst({
      where: { OR: [{ id: idOrTicket }, { ticketNumber: idOrTicket }] },
      include: complaintDetailInclude,
    });
  },

  findMany(where: Prisma.ComplaintWhereInput, orderBy: Prisma.ComplaintOrderByWithRelationInput[], skip: number, take: number) {
    return prisma.complaint.findMany({ where, orderBy, skip, take, include: complaintInclude });
  },

  count(where: Prisma.ComplaintWhereInput) {
    return prisma.complaint.count({ where });
  },

  update(id: string, data: Prisma.ComplaintUpdateInput) {
    return prisma.complaint.update({ where: { id }, data, include: complaintDetailInclude });
  },

  delete(id: string) {
    return prisma.complaint.delete({ where: { id } });
  },

  addImages(complaintId: string, images: { url: string; publicId: string }[]) {
    return prisma.complaintImage.createMany({
      data: images.map((img) => ({ complaintId, url: img.url, publicId: img.publicId })),
    });
  },

  removeImages(ids: string[]) {
    return prisma.complaintImage.findMany({ where: { id: { in: ids } } });
  },

  deleteImagesByIds(ids: string[]) {
    return prisma.complaintImage.deleteMany({ where: { id: { in: ids } } });
  },

  addHistory(data: Prisma.ComplaintHistoryUncheckedCreateInput) {
    return prisma.complaintHistory.create({ data });
  },

  findOverdueCandidates() {
    return prisma.complaint.findMany({
      where: {
        status: { notIn: [ComplaintStatus.RESOLVED, ComplaintStatus.CLOSED, ComplaintStatus.OVERDUE] },
        isOverdue: false,
        dueDate: { lt: new Date() },
      },
    });
  },

  markOverdue(ids: string[]) {
    return prisma.complaint.updateMany({
      where: { id: { in: ids } },
      data: { isOverdue: true, status: ComplaintStatus.OVERDUE },
    });
  },

  countAll() {
    return prisma.complaint.count();
  },
};
