import { Router } from 'express';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/role.middleware';
import { asyncHandler } from '../../utils/asyncHandler';
import { sendSuccess } from '../../utils/ApiResponse';
import { prisma } from '../../config/db';
import { parsePagination, buildMeta } from '../../utils/pagination';

const router = Router();

router.use(authenticate, requireAdmin);

router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query as never);
    const [items, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true, role: true } } },
      }),
      prisma.auditLog.count(),
    ]);
    sendSuccess(res, items, 'Audit logs fetched', 200, buildMeta(total, page, limit));
  })
);

export default router;
