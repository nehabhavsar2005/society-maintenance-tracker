import { Request, Response } from 'express';
import { Role } from '@prisma/client';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import { prisma } from '../../config/db';
import { parsePagination, buildMeta } from '../../utils/pagination';

export const userController = {
  listResidents: asyncHandler(async (req: Request, res: Response) => {
    const { search } = req.query as { search?: string };
    const residents = await prisma.user.findMany({
      where: {
        role: Role.RESIDENT,
        ...(search
          ? { OR: [{ name: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }] }
          : {}),
      },
      select: { id: true, name: true, email: true, flatNumber: true, block: true, isActive: true, createdAt: true, avatarUrl: true },
      orderBy: { createdAt: 'desc' },
    });
    sendSuccess(res, residents, 'Residents fetched');
  }),

  listAdmins: asyncHandler(async (_req: Request, res: Response) => {
    const admins = await prisma.user.findMany({
      where: { role: Role.ADMIN },
      select: { id: true, name: true, email: true },
      orderBy: { name: 'asc' },
    });
    sendSuccess(res, admins, 'Admins fetched');
  }),

  listAll: asyncHandler(async (req: Request, res: Response) => {
    const { page, limit, skip } = parsePagination(req.query as never);
    const [items, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          flatNumber: true,
          block: true,
          isActive: true,
          createdAt: true,
          _count: { select: { complaints: true } },
        },
      }),
      prisma.user.count(),
    ]);
    sendSuccess(res, items, 'Users fetched', 200, buildMeta(total, page, limit));
  }),

  toggleActive: asyncHandler(async (req: Request, res: Response) => {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return sendSuccess(res, null, 'User not found', 404);
    const updated = await prisma.user.update({ where: { id: req.params.id }, data: { isActive: !user.isActive } });
    sendSuccess(res, { id: updated.id, isActive: updated.isActive }, 'User status updated');
  }),
};
