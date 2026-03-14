import { prisma } from '../../../../config/database';

export class HistoryRepository {
  async findByUser(userId: string, page: number, limit: number, since?: Date) {
    const where: any = { userId };
    if (since) {
      where.lastReadAt = { gte: since };
    }

    const [items, total] = await Promise.all([
      prisma.readingHistory.findMany({
        where,
        include: {
          feedItem: {
            select: {
              id: true,
              title: true,
              summary: true,
              contentType: true,
              fieldSlug: true,
              publishedAt: true,
            },
          },
        },
        orderBy: { lastReadAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.readingHistory.count({ where }),
    ]);

    return { items, total };
  }

  async upsert(userId: string, feedItemId: string, timeSpentSeconds: number) {
    return prisma.readingHistory.upsert({
      where: { userId_feedItemId: { userId, feedItemId } },
      create: { userId, feedItemId, timeSpentSeconds, lastReadAt: new Date() },
      update: {
        timeSpentSeconds: { increment: timeSpentSeconds },
        lastReadAt: new Date(),
      },
    });
  }

  async getStats(userId: string) {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const [weeklyItems, totalTime, fieldCounts] = await Promise.all([
      prisma.readingHistory.count({
        where: { userId, lastReadAt: { gte: weekAgo } },
      }),
      prisma.readingHistory.aggregate({
        where: { userId, lastReadAt: { gte: weekAgo } },
        _sum: { timeSpentSeconds: true },
      }),
      prisma.readingHistory.findMany({
        where: { userId, lastReadAt: { gte: weekAgo } },
        include: { feedItem: { select: { fieldSlug: true } } },
      }),
    ]);

    const fieldMap: Record<string, number> = {};
    for (const entry of fieldCounts) {
      const slug = entry.feedItem.fieldSlug;
      fieldMap[slug] = (fieldMap[slug] || 0) + 1;
    }
    const mostExplored = Object.entries(fieldMap)
      .sort((a, b) => b[1] - a[1])
      .map(([field, count]) => ({ field, count }));

    return {
      itemsThisWeek: weeklyItems,
      totalTimeSeconds: totalTime._sum.timeSpentSeconds || 0,
      mostExplored,
    };
  }

  async clearAll(userId: string) {
    return prisma.readingHistory.deleteMany({ where: { userId } });
  }
}
