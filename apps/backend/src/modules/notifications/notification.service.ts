import { NotificationType } from '@prisma/client';
import { prisma } from '../../config/db';
import { parsePagination, buildMeta } from '../../utils/pagination';

export const notificationService = {
  async create(userId: string, type: NotificationType, title: string, message: string, complaintId?: string) {
    return prisma.notification.create({ data: { userId, type, title, message, complaintId } });
  },

  async createMany(userIds: string[], type: NotificationType, title: string, message: string, complaintId?: string) {
    if (!userIds.length) return;
    return prisma.notification.createMany({
      data: userIds.map((userId) => ({ userId, type, title, message, complaintId })),
    });
  },

  async list(userId: string, query: { page?: string; limit?: string; unreadOnly?: string }) {
    const { page, limit, skip } = parsePagination(query);
    const where = { userId, ...(query.unreadOnly === 'true' ? { isRead: false } : {}) };

    const [items, total, unreadCount] = await Promise.all([
      prisma.notification.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take: limit }),
      prisma.notification.count({ where }),
      prisma.notification.count({ where: { userId, isRead: false } }),
    ]);

    return { items, meta: buildMeta(total, page, limit), unreadCount };
  },

  async markAsRead(userId: string, id: string) {
    return prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });
  },

  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
  },

  async unreadCount(userId: string) {
    return prisma.notification.count({ where: { userId, isRead: false } });
  },
};
