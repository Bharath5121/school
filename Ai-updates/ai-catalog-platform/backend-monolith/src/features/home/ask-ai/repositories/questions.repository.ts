import { prisma } from '../../../../config/database';

export class QuestionsRepository {
  async getByIndustry(slug: string) {
    return prisma.predefinedQuestion.findMany({
      where: { industrySlug: slug, isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
  }
}
