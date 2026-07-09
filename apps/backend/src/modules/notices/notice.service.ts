import { Prisma } from '@prisma/client';
import { prisma } from '../../config/db';
import { ApiError } from '../../utils/ApiError';
import { parsePagination, buildMeta } from '../../utils/pagination';
import { notificationService } from '../notifications/notification.service';
import { sendEmail } from '../../services/email.service';
import { noticePostedTemplate } from '../../templates/emailTemplates';
import { env } from '../../config/env';
import { CreateNoticeDto, UpdateNoticeDto } from './notice.dto';

const noticeInclude = { author: { select: { id: true, name: true, role: true } } } satisfies Prisma.NoticeInclude;

export const noticeService = {
  async create(authorId: string, dto: CreateNoticeDto) {
    const notice = await prisma.notice.create({ data: { ...dto, authorId }, include: noticeInclude });

    const residents = await prisma.user.findMany({ where: { role: 'RESIDENT', isActive: true }, select: { id: true, email: true, name: true } });

    await notificationService.createMany(
      residents.map((r) => r.id),
      'NOTICE_POSTED',
      dto.isImportant ? 'Important Notice Posted' : 'New Notice Posted',
      notice.title
    );

    await Promise.all(
      residents.map((r) =>
        sendEmail({
          to: r.email,
          subject: `📢 New Notice: ${notice.title}`,
          html: noticePostedTemplate(r.name, notice.title, notice.content, `${env.CLIENT_URL}/notices`),
          template: 'notice-posted',
          userId: r.id,
        })
      )
    );

    return notice;
  },

  async list(query: { page?: string; limit?: string; search?: string }) {
    const { page, limit, skip } = parsePagination(query);
    const where: Prisma.NoticeWhereInput = query.search
      ? { OR: [{ title: { contains: query.search, mode: 'insensitive' } }, { content: { contains: query.search, mode: 'insensitive' } }] }
      : {};

    const [items, total] = await Promise.all([
      prisma.notice.findMany({
        where,
        include: noticeInclude,
        orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.notice.count({ where }),
    ]);

    return { items, meta: buildMeta(total, page, limit) };
  },

  async getById(id: string) {
    const notice = await prisma.notice.findUnique({ where: { id }, include: noticeInclude });
    if (!notice) throw ApiError.notFound('Notice not found');
    return notice;
  },

  async update(id: string, dto: UpdateNoticeDto) {
    await this.getById(id);
    return prisma.notice.update({ where: { id }, data: dto, include: noticeInclude });
  },

  async delete(id: string) {
    await this.getById(id);
    await prisma.notice.delete({ where: { id } });
    return { id };
  },

  async togglePin(id: string) {
    const notice = await this.getById(id);
    return prisma.notice.update({ where: { id }, data: { isPinned: !notice.isPinned }, include: noticeInclude });
  },
};
