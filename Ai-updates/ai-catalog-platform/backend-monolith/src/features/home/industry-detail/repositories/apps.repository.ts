import { prisma } from '../../../../config/database';

export class AppsRepository {
  async getByIndustry(slug: string) {
    return prisma.aIApp.findMany({
      where: { industrySlug: slug, isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    });
  }
}
