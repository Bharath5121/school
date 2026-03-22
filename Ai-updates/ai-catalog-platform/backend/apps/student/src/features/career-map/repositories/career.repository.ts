import { prisma } from '../../../config/database';

const JOB_CARD_SELECT = {
  id: true, title: true, salaryRangeMin: true, salaryRangeMax: true,
  currency: true, demand: true, timeline: true, requiredDegree: true,
  sortOrder: true,
} as const;

const JOB_DETAIL_SELECT = {
  ...JOB_CARD_SELECT,
  requiredSkills: true, futureSkills: true, howAiChanges: true,
  googleUrl: true, notebookLmUrl: true,
  careerPath: { select: { id: true, title: true, description: true, aiImpactSummary: true, industrySlug: true, industry: { select: { name: true, slug: true, icon: true } } } },
} as const;

export class CareerRepository {
  async findPathsByIndustries(industrySlugs: string[]) {
    return prisma.careerPath.findMany({
      where: { industrySlug: { in: industrySlugs } },
      orderBy: { sortOrder: 'asc' },
      select: {
        id: true, title: true, description: true, aiImpactSummary: true,
        industrySlug: true,
        industry: { select: { name: true, slug: true, icon: true } },
        jobs: {
          orderBy: { sortOrder: 'asc' },
          select: JOB_CARD_SELECT,
        },
      },
    });
  }

  async findJobById(id: string) {
    return prisma.careerJob.findUnique({
      where: { id },
      select: JOB_DETAIL_SELECT,
    });
  }

  async getUserIndustries(userId: string) {
    const selections = await prisma.userIndustrySelection.findMany({
      where: { userId },
      select: { industrySlug: true, industry: { select: { name: true, slug: true, icon: true } } },
      orderBy: { createdAt: 'asc' },
    });
    return selections;
  }
}
