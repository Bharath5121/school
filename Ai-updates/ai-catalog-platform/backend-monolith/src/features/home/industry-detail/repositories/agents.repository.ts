import { prisma } from '../../../../config/database';

export class AgentsRepository {
  async getByIndustry(slug: string) {
    return prisma.aIAgent.findMany({
      where: { industrySlug: slug, isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    });
  }
}
