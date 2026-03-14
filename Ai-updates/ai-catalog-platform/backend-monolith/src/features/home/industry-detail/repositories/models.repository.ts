import { prisma } from '../../../../config/database';

export class ModelsRepository {
  async getByIndustry(slug: string) {
    return prisma.aIModel.findMany({
      where: { industrySlug: slug, isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }]
    });
  }
}
