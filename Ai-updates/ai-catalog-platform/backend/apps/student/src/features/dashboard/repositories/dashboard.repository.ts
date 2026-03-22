import { prisma } from '../../../config/database';

export class DashboardRepository {
  async getUser(userId: string) {
    return prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        profile: {
          select: {
            gradeLevel: true,
            interests: { select: { fieldName: true } },
          },
        },
      },
    });
  }

  async getTrending(take = 5) {
    return prisma.feedItem.findMany({
      where: { targetRole: 'STUDENT' },
      orderBy: { views: 'desc' },
      take,
      select: { id: true, title: true, views: true },
    });
  }

  async getRecentFeed(take = 10) {
    return prisma.feedItem.findMany({
      where: { targetRole: 'STUDENT' },
      orderBy: { publishedAt: 'desc' },
      take,
      select: {
        id: true,
        title: true,
        contentType: true,
        fieldSlug: true,
        summary: true,
        careerImpactText: true,
        publishedAt: true,
      },
    });
  }

  async getFieldFeed(slug: string, take = 3) {
    return prisma.feedItem.findMany({
      where: { fieldSlug: slug, targetRole: 'STUDENT' },
      orderBy: { publishedAt: 'desc' },
      take,
      select: { id: true, title: true, contentType: true, fieldSlug: true },
    });
  }
}
