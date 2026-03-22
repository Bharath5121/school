import { prisma } from '../../../config/database';
import type { CreateGuideDto, UpdateGuideDto } from '../dtos/career-guide.dto';

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
} as const;

export class CareerGuideRepository {
  async findAll() {
    return prisma.guide.findMany({
      orderBy: { sortOrder: 'asc' },
      select: {
        ...GUIDE_SELECT,
        industry: { select: { name: true, slug: true, icon: true } },
      },
    });
  }

  async findById(id: string) {
    return prisma.guide.findUnique({
      where: { id },
      select: {
        ...GUIDE_SELECT,
        industry: { select: { name: true, slug: true, icon: true } },
      },
    });
  }

  async create(data: CreateGuideDto) {
    return prisma.guide.create({
      data: data as any,
      select: {
        ...GUIDE_SELECT,
        industry: { select: { name: true, slug: true, icon: true } },
      },
    });
  }

  async update(id: string, data: UpdateGuideDto) {
    return prisma.guide.update({
      where: { id },
      data: data as any,
      select: {
        ...GUIDE_SELECT,
        industry: { select: { name: true, slug: true, icon: true } },
      },
    });
  }

  async delete(id: string) {
    return prisma.guide.delete({
      where: { id },
      select: { id: true, title: true },
    });
  }
}
