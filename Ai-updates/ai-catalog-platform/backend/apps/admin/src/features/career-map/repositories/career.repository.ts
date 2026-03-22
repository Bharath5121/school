import { prisma } from '../../../config/database';
import type { CreatePathDto, UpdatePathDto, CreateJobDto, UpdateJobDto } from '../dtos/career.dto';

const PATH_SELECT = {
  id: true, title: true, description: true, aiImpactSummary: true,
  industrySlug: true, sortOrder: true, createdAt: true, updatedAt: true,
} as const;

const JOB_SELECT = {
  id: true, careerPathId: true, title: true, salaryRangeMin: true, salaryRangeMax: true,
  currency: true, demand: true, requiredDegree: true, requiredSkills: true,
  futureSkills: true, howAiChanges: true, timeline: true,
  googleUrl: true, notebookLmUrl: true, sortOrder: true,
  createdAt: true, updatedAt: true,
} as const;

export class CareerRepository {
  async findAllPaths() {
    return prisma.careerPath.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        ...PATH_SELECT,
        industry: { select: { name: true, slug: true, icon: true } },
        _count: { select: { jobs: true } },
      },
    });
  }

  async findPathById(id: string) {
    return prisma.careerPath.findUnique({
      where: { id },
      select: {
        ...PATH_SELECT,
        industry: { select: { name: true, slug: true, icon: true } },
        jobs: {
          orderBy: { sortOrder: 'asc' },
          select: { id: true, title: true, demand: true, timeline: true, salaryRangeMin: true, salaryRangeMax: true, currency: true, sortOrder: true },
        },
      },
    });
  }

  async createPath(data: CreatePathDto) {
    return prisma.careerPath.create({ data: data as any, select: { ...PATH_SELECT, industry: { select: { name: true, slug: true, icon: true } } } });
  }

  async updatePath(id: string, data: UpdatePathDto) {
    return prisma.careerPath.update({ where: { id }, data: data as any, select: { ...PATH_SELECT, industry: { select: { name: true, slug: true, icon: true } } } });
  }

  async deletePath(id: string) {
    return prisma.careerPath.delete({ where: { id }, select: { id: true, title: true } });
  }

  async findAllJobs() {
    return prisma.careerJob.findMany({
      orderBy: { sortOrder: 'asc' },
      select: { ...JOB_SELECT, careerPath: { select: { id: true, title: true, industrySlug: true } } },
    });
  }

  async findJobById(id: string) {
    return prisma.careerJob.findUnique({
      where: { id },
      select: { ...JOB_SELECT, careerPath: { select: { id: true, title: true, industrySlug: true } } },
    });
  }

  async createJob(data: CreateJobDto) {
    const payload: any = { ...data };
    if (payload.googleUrl === '') payload.googleUrl = null;
    if (payload.notebookLmUrl === '') payload.notebookLmUrl = null;
    return prisma.careerJob.create({
      data: payload,
      select: { ...JOB_SELECT, careerPath: { select: { id: true, title: true, industrySlug: true } } },
    });
  }

  async updateJob(id: string, data: UpdateJobDto) {
    const payload: any = { ...data };
    if (payload.googleUrl === '') payload.googleUrl = null;
    if (payload.notebookLmUrl === '') payload.notebookLmUrl = null;
    return prisma.careerJob.update({
      where: { id },
      data: payload,
      select: { ...JOB_SELECT, careerPath: { select: { id: true, title: true, industrySlug: true } } },
    });
  }

  async deleteJob(id: string) {
    return prisma.careerJob.delete({ where: { id }, select: { id: true, title: true } });
  }
}
