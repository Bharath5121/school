import { prisma } from '../../../../config/database';

export class DashboardService {
  async getStudentSummary(userId: string) {
    const [user, trending, recentFeed] = await Promise.all([
      prisma.user.findUnique({
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
      }),
      prisma.feedItem.findMany({
        where: { targetRole: 'STUDENT' },
        orderBy: { views: 'desc' },
        take: 5,
        select: { id: true, title: true, views: true },
      }),
      prisma.feedItem.findMany({
        where: { targetRole: 'STUDENT' },
        orderBy: { publishedAt: 'desc' },
        take: 10,
        select: { id: true, title: true, contentType: true, fieldSlug: true, summary: true, careerImpactText: true, publishedAt: true },
      }),
    ]);

    const interests = user?.profile?.interests?.map((i) => i.fieldName) ?? [];

    const fieldFeeds: Record<string, { id: string; title: string; contentType: string; fieldSlug: string }[]> = {};
    for (const slug of interests) {
      const items = await prisma.feedItem.findMany({
        where: { fieldSlug: slug, targetRole: 'STUDENT' },
        orderBy: { publishedAt: 'desc' },
        take: 3,
        select: { id: true, title: true, contentType: true, fieldSlug: true },
      });
      if (items.length > 0) fieldFeeds[slug] = items;
    }

    const topStory = recentFeed[0] ?? null;

    return {
      user: {
        name: user?.name ?? 'Student',
        interests,
        gradeLevel: user?.profile?.gradeLevel ?? null,
      },
      topStory: topStory
        ? { id: topStory.id, title: topStory.title, field: topStory.fieldSlug, type: topStory.contentType, summary: topStory.summary }
        : null,
      trending: trending.map((t) => ({ id: t.id, title: t.title, views: t.views })),
      fieldFeeds,
      recentFeed: recentFeed.map((f) => ({
        id: f.id,
        title: f.title,
        type: f.contentType,
        field: f.fieldSlug,
      })),
    };
  }
}
