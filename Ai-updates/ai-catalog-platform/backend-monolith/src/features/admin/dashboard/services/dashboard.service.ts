import { prisma } from '../../../../config/database';

export class DashboardService {
  async getAdminSummary() {
    const [totalUsers, roleBreakdown, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({ by: ['role'], _count: { id: true } }),
      prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10,
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
    ]);

    const roles: Record<string, number> = {};
    for (const r of roleBreakdown) {
      roles[r.role] = r._count.id;
    }

    return {
      platformHealth: 'All services operational',
      totalUsers,
      roles,
      recentUsers,
    };
  }
}
