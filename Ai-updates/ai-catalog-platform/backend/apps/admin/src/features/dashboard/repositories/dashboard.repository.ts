import { prisma } from '../../../config/database';

export class DashboardRepository {
  async getStats() {
    const [
      totalUsers, totalIndustries, totalModels, totalAgents,
      totalApps, totalGuides, totalSkills, totalFeedItems,
      totalNotebooks, totalQuestions, totalBasicsTopics,
      totalBasicsVideos, totalBasicsArticles, totalCareerPaths,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.industry.count(),
      prisma.aIModel.count(),
      prisma.aIAgent.count(),
      prisma.aIApp.count(),
      prisma.guide.count(),
      prisma.skill.count(),
      prisma.feedItem.count(),
      prisma.masterNotebook.count(),
      prisma.predefinedQuestion.count(),
      prisma.basicsTopic.count(),
      prisma.basicsVideo.count(),
      prisma.basicsArticle.count(),
      prisma.careerPath.count(),
    ]);

    return {
      totalUsers, totalIndustries, totalModels, totalAgents,
      totalApps, totalGuides, totalSkills, totalFeedItems,
      totalNotebooks, totalQuestions, totalBasicsTopics,
      totalBasicsVideos, totalBasicsArticles, totalCareerPaths,
    };
  }

  async getRecentUsers(take = 10) {
    return prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      select: { id: true, name: true, email: true, role: true, createdAt: true },
    });
  }

  async getRoleBreakdown() {
    return prisma.user.groupBy({ by: ['role'], _count: { id: true } });
  }
}

export const dashboardRepository = new DashboardRepository();
