import { prisma } from '../../../../config/database';

export class DashboardService {
  async getTeacherSummary(userId: string) {
    const [teacher, studentCount, topContent] = await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { name: true, profile: { select: { gradeLevel: true } } },
      }),
      prisma.user.count({ where: { role: 'STUDENT', deletedAt: null } }),
      prisma.feedItem.findMany({
        orderBy: { publishedAt: 'desc' },
        take: 5,
        select: { id: true, title: true, fieldSlug: true, contentType: true },
      }),
    ]);

    const interestAgg = await prisma.interest.groupBy({
      by: ['fieldName'],
      _count: { fieldName: true },
      orderBy: { _count: { fieldName: 'desc' } },
      take: 10,
    });

    const classInterests = interestAgg.map((i) => ({
      field: i.fieldName,
      count: i._count.fieldName,
      percentage: studentCount > 0 ? Math.round((i._count.fieldName / studentCount) * 100) : 0,
    }));

    return {
      teacher: {
        name: teacher?.name ?? 'Teacher',
        gradeLevel: teacher?.profile?.gradeLevel ?? null,
        studentCount,
      },
      classInterests,
      topContent: topContent.map((c) => ({
        id: c.id,
        title: c.title,
        field: c.fieldSlug,
        type: c.contentType,
      })),
    };
  }
}
