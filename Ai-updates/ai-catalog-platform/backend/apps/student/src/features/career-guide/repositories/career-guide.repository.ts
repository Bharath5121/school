import { prisma } from '../../../config/database';

const GUIDE_SELECT = {
  id: true,
  title: true,
  description: true,
  difficulty: true,
  timeRequired: true,
  toolsNeeded: true,
  industrySlug: true,
  whatYouLearn: true,
  steps: true,
  sortOrder: true,
  isPublished: true,
  createdAt: true,
  updatedAt: true,
  industry: { select: { name: true, slug: true, icon: true } },
} as const;

export class CareerGuideRepository {
  async getUserIndustries(userId: string) {
    return prisma.userIndustrySelection.findMany({
      where: { userId },
      select: { industrySlug: true, industry: { select: { name: true, slug: true, icon: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByIndustries(industrySlugs: string[]) {
    return prisma.guide.findMany({
      where: { industrySlug: { in: industrySlugs }, isPublished: true },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      select: GUIDE_SELECT,
    });
  }

  async findById(id: string) {
    return prisma.guide.findUnique({
      where: { id },
      select: GUIDE_SELECT,
    });
  }
}
