import { ComplaintStatus, Role } from '@prisma/client';
import { prisma } from '../../config/db';

export const dashboardService = {
  async getAdminStats() {
    const [total, open, inProgress, resolved, closed, overdue, byCategory, byPriority, recentComplaints, recentNotices, totalResidents, monthly] =
      await Promise.all([
        prisma.complaint.count(),
        prisma.complaint.count({ where: { status: ComplaintStatus.OPEN } }),
        prisma.complaint.count({ where: { status: ComplaintStatus.IN_PROGRESS } }),
        prisma.complaint.count({ where: { status: ComplaintStatus.RESOLVED } }),
        prisma.complaint.count({ where: { status: ComplaintStatus.CLOSED } }),
        prisma.complaint.count({ where: { isOverdue: true } }),
        prisma.complaint.groupBy({ by: ['category'], _count: { _all: true } }),
        prisma.complaint.groupBy({ by: ['priority'], _count: { _all: true } }),
        prisma.complaint.findMany({
          take: 5,
          orderBy: { createdAt: 'desc' },
          include: { resident: { select: { name: true, flatNumber: true } } },
        }),
        prisma.notice.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
        prisma.user.count({ where: { role: Role.RESIDENT } }),
        getMonthlyTrend(),
      ]);

    return {
      totals: { total, open, inProgress, resolved, closed, overdue, totalResidents },
      byCategory: byCategory.map((c) => ({ category: c.category, count: c._count._all })),
      byPriority: byPriority.map((p) => ({ priority: p.priority, count: p._count._all })),
      recentComplaints,
      recentNotices,
      monthlyTrend: monthly,
    };
  },

  async getResidentStats(residentId: string) {
    const [total, open, inProgress, resolved, overdue, recentComplaints, recentNotices] = await Promise.all([
      prisma.complaint.count({ where: { residentId } }),
      prisma.complaint.count({ where: { residentId, status: ComplaintStatus.OPEN } }),
      prisma.complaint.count({ where: { residentId, status: ComplaintStatus.IN_PROGRESS } }),
      prisma.complaint.count({ where: { residentId, status: ComplaintStatus.RESOLVED } }),
      prisma.complaint.count({ where: { residentId, isOverdue: true } }),
      prisma.complaint.findMany({ where: { residentId }, take: 5, orderBy: { createdAt: 'desc' } }),
      prisma.notice.findMany({ take: 5, orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }] }),
    ]);

    return {
      totals: { total, open, inProgress, resolved, overdue },
      recentComplaints,
      recentNotices,
    };
  },
};

async function getMonthlyTrend() {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const complaints = await prisma.complaint.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true, status: true },
  });

  const buckets = new Map<string, { month: string; created: number; resolved: number }>();
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    buckets.set(key, { month: d.toLocaleString('en-US', { month: 'short', year: '2-digit' }), created: 0, resolved: 0 });
  }

  for (const complaint of complaints) {
    const key = `${complaint.createdAt.getFullYear()}-${String(complaint.createdAt.getMonth() + 1).padStart(2, '0')}`;
    const bucket = buckets.get(key);
    if (bucket) {
      bucket.created += 1;
      if (complaint.status === ComplaintStatus.RESOLVED || complaint.status === ComplaintStatus.CLOSED) bucket.resolved += 1;
    }
  }

  return Array.from(buckets.values());
}
