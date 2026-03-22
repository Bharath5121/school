import { prisma } from '../../../config/database';

const LIST_SELECT = {
  id: true, name: true, email: true, role: true,
  createdAt: true, updatedAt: true, deletedAt: true,
  profile: {
    select: { gradeLevel: true, stream: true, onboardingCompleted: true },
  },
} as const;

const DETAIL_SELECT = {
  id: true, name: true, email: true, role: true,
  createdAt: true, updatedAt: true, deletedAt: true,
  profile: true,
} as const;

export class UsersRepository {
  async findMany(params: { skip: number; take: number; where?: any }) {
    return prisma.user.findMany({
      ...params,
      orderBy: { createdAt: 'desc' },
      select: LIST_SELECT,
    });
  }

  async findById(id: string) {
    return prisma.user.findUnique({ where: { id }, select: DETAIL_SELECT });
  }

  async updateRole(id: string, role: any) {
    return prisma.user.update({
      where: { id },
      data: { role },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async softDelete(id: string) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: { id: true, name: true, email: true },
    });
  }

  async count(where?: any) {
    return prisma.user.count({ where });
  }
}

export const usersRepository = new UsersRepository();
