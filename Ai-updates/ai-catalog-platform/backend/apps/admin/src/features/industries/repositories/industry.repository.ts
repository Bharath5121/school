import { prisma } from '../../../config/database';

const LIST_SELECT = {
  id: true, name: true, slug: true, description: true, icon: true, color: true,
  gradient: true, sortOrder: true, isActive: true, createdAt: true,
  _count: { select: { models: true, agents: true, apps: true, questions: true } },
};

const DETAIL_SELECT = { ...LIST_SELECT, updatedAt: true };

export class IndustryRepository {
  async findAll() {
    return prisma.industry.findMany({ orderBy: { sortOrder: 'asc' }, select: LIST_SELECT });
  }

  async findById(id: string) {
    return prisma.industry.findUnique({ where: { id }, select: DETAIL_SELECT });
  }

  async create(data: any) {
    return prisma.industry.create({ data, select: DETAIL_SELECT });
  }

  async update(id: string, data: any) {
    return prisma.industry.update({ where: { id }, data, select: DETAIL_SELECT });
  }

  async delete(id: string) {
    return prisma.industry.delete({ where: { id } });
  }

  async count() {
    return prisma.industry.count();
  }
}

export const industryRepository = new IndustryRepository();
