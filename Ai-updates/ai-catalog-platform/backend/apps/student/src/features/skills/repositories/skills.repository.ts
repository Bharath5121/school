import { prisma } from '../../../config/database';

const SKILL_SELECT = {
  id: true, name: true, description: true, industrySlug: true,
  level: true, whyItMatters: true, learnUrl: true, notebookLmUrl: true,
  timeToLearn: true, category: true, sortOrder: true,
  createdAt: true, updatedAt: true,
  industry: { select: { name: true, slug: true, icon: true } },
} as const;

export class SkillsRepository {
  async getUserIndustries(userId: string) {
    return prisma.userIndustrySelection.findMany({
      where: { userId },
      select: { industrySlug: true, industry: { select: { name: true, slug: true, icon: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByIndustries(industrySlugs: string[]) {
    return prisma.skill.findMany({
      where: { industrySlug: { in: industrySlugs } },
      orderBy: [{ category: 'asc' }, { sortOrder: 'asc' }],
      select: SKILL_SELECT,
    });
  }

  async findById(id: string) {
    return prisma.skill.findUnique({
      where: { id },
      select: SKILL_SELECT,
    });
  }
}
