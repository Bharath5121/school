import { prisma } from '../../../../config/database';

export class ChildActivityRepository {
  async getChildProfile(childId: string) {
    return (prisma as any).user.findUnique({
      where: { id: childId },
      select: {
        id: true,
        name: true,
        profile: {
          select: {
            gradeLevel: true,
            avatarUrl: true,
            interests: { select: { fieldName: true } },
          },
        },
      },
    });
  }

  async getReadingHistory(childId: string, since?: Date) {
    const where: any = { userId: childId };
    if (since) where.lastReadAt = { gte: since };

    return (prisma as any).readingHistory.findMany({
      where,
      include: {
        feedItem: {
          select: { id: true, title: true, contentType: true, fieldSlug: true },
        },
      },
      orderBy: { lastReadAt: 'desc' },
      take: 50,
    });
  }

  async getNotebookAccessLogs(childId: string, since?: Date) {
    const where: any = { userId: childId };
    if (since) where.accessedAt = { gte: since };

    return (prisma as any).notebookAccessLog.findMany({
      where,
      include: {
        notebook: {
          select: { id: true, title: true, category: true, industrySlug: true, notebookLmUrl: true },
        },
      },
      orderBy: { accessedAt: 'desc' },
      take: 50,
    });
  }

  async getContentBookmarks(childId: string) {
    return (prisma as any).contentBookmark.findMany({
      where: { userId: childId },
      orderBy: { createdAt: 'desc' },
      take: 30,
    });
  }

  async getSkillProgress(childId: string) {
    return (prisma as any).userSkillProgress.findMany({
      where: { userId: childId },
    });
  }

  async getSkillSummary(childId: string) {
    const all = await (prisma as any).userSkillProgress.findMany({
      where: { userId: childId },
    });
    const total = all.length;
    const learned = all.filter((s: any) => s.status === 'LEARNED').length;
    const exploring = all.filter((s: any) => s.status === 'EXPLORING').length;
    const notStarted = all.filter((s: any) => s.status === 'NOT_STARTED').length;
    return { total, learned, exploring, notStarted };
  }

  async getCareerExplored(childId: string) {
    return (prisma as any).userCareerExplored.findMany({
      where: { userId: childId },
      orderBy: { exploredAt: 'desc' },
    });
  }

  async getCareerExploredCount(childId: string): Promise<number> {
    return (prisma as any).userCareerExplored.count({
      where: { userId: childId },
    });
  }

  async getTimeSpent(childId: string, since?: Date) {
    const where: any = { userId: childId };
    if (since) where.lastReadAt = { gte: since };

    const entries = await (prisma as any).readingHistory.findMany({
      where,
      select: { timeSpentSeconds: true, lastReadAt: true },
    });

    return entries;
  }

  async getCompletedReading(childId: string) {
    return (prisma as any).readingHistory.findMany({
      where: { userId: childId, completed: true },
      include: {
        feedItem: {
          select: { id: true, title: true, contentType: true, fieldSlug: true },
        },
      },
      orderBy: { lastReadAt: 'desc' },
    });
  }

  async getSkillsByIds(skillIds: string[]) {
    return (prisma as any).skill.findMany({
      where: { id: { in: skillIds } },
      select: { id: true, name: true, level: true, industrySlug: true, category: true },
    });
  }

  async getAllSkills() {
    return (prisma as any).skill.findMany({
      select: { id: true, name: true, level: true, industrySlug: true, category: true },
      orderBy: [{ industrySlug: 'asc' }, { sortOrder: 'asc' }],
    });
  }

  async getCareerJobsByIds(jobIds: string[]) {
    return (prisma as any).careerJob.findMany({
      where: { id: { in: jobIds } },
      include: {
        careerPath: {
          select: { title: true, industrySlug: true },
        },
      },
    });
  }

  async getAllCareerJobs() {
    return (prisma as any).careerJob.findMany({
      include: {
        careerPath: {
          select: { title: true, industrySlug: true },
        },
      },
      orderBy: [{ sortOrder: 'asc' }],
    });
  }

  async getUnexploredContent(childId: string, interestSlugs: string[], limit = 10) {
    const readItemIds = await (prisma as any).readingHistory.findMany({
      where: { userId: childId },
      select: { feedItemId: true },
    });
    const readIds = readItemIds.map((r: any) => r.feedItemId);

    return (prisma as any).feedItem.findMany({
      where: {
        fieldSlug: { in: interestSlugs },
        targetRole: 'STUDENT',
        ...(readIds.length > 0 ? { id: { notIn: readIds } } : {}),
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
      select: {
        id: true,
        title: true,
        contentType: true,
        fieldSlug: true,
        summary: true,
      },
    });
  }

  async getStudentDashboardData(childId: string) {
    const [user, trending, recentFeed] = await Promise.all([
      (prisma as any).user.findUnique({
        where: { id: childId },
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
      (prisma as any).feedItem.findMany({
        where: { targetRole: 'STUDENT' },
        orderBy: { views: 'desc' },
        take: 5,
        select: { id: true, title: true, views: true },
      }),
      (prisma as any).feedItem.findMany({
        where: { targetRole: 'STUDENT' },
        orderBy: { publishedAt: 'desc' },
        take: 10,
        select: {
          id: true, title: true, contentType: true, fieldSlug: true,
          summary: true, careerImpactText: true, publishedAt: true,
        },
      }),
    ]);

    const interests = user?.profile?.interests?.map((i: any) => i.fieldName) ?? [];

    const fieldFeedPromises = interests.slice(0, 5).map((field: string) =>
      (prisma as any).feedItem.findMany({
        where: { fieldSlug: field, targetRole: 'STUDENT' },
        orderBy: { publishedAt: 'desc' },
        take: 3,
        select: {
          id: true, title: true, contentType: true, fieldSlug: true,
          summary: true, careerImpactText: true,
        },
      })
    );
    const fieldResults = await Promise.all(fieldFeedPromises);
    const fieldFeeds: Record<string, any[]> = {};
    interests.slice(0, 5).forEach((field: string, idx: number) => {
      fieldFeeds[field] = fieldResults[idx];
    });

    const topStory = recentFeed[0] || null;

    return {
      user: {
        name: user?.name ?? '',
        interests,
        gradeLevel: user?.profile?.gradeLevel ?? null,
      },
      topStory: topStory
        ? {
            id: topStory.id,
            title: topStory.title,
            field: topStory.fieldSlug,
            type: topStory.contentType,
            summary: topStory.summary,
          }
        : null,
      trending: trending.map((t: any) => ({ id: t.id, title: t.title, views: t.views })),
      fieldFeeds,
      recentFeed: recentFeed.map((f: any) => ({
        id: f.id,
        title: f.title,
        type: f.contentType,
        field: f.fieldSlug,
        summary: f.summary,
        careerImpact: f.careerImpactText,
        publishedAt: f.publishedAt,
      })),
    };
  }
}
