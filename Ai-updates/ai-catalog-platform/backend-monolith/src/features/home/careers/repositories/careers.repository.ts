import { prisma } from '../../../../config/database';

export class CareersRepository {
  async getCareerPaths(industrySlug: string) {
    return prisma.careerPath.findMany({
      where: { industrySlug },
      include: {
        jobs: { orderBy: { sortOrder: 'asc' } },
        industry: { select: { name: true, slug: true, icon: true, color: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getJobs(industrySlug: string) {
    return prisma.careerJob.findMany({
      where: { careerPath: { industrySlug } },
      include: {
        careerPath: { select: { title: true, industrySlug: true } },
      },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getJobById(id: string) {
    return prisma.careerJob.findUnique({
      where: { id },
      include: {
        careerPath: {
          select: { title: true, industrySlug: true, industry: { select: { name: true, icon: true } } },
        },
      },
    });
  }

  async getSkills(industrySlug: string) {
    return prisma.skill.findMany({
      where: { industrySlug },
      include: { industry: { select: { name: true, slug: true, icon: true } } },
      orderBy: [{ level: 'asc' }, { sortOrder: 'asc' }],
    });
  }
}
