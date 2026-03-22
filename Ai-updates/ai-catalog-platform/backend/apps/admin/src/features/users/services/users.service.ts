import { prisma } from '../../../config/database';
import { AppError } from '../../../shared/errors/AppError';
import { cacheDelPattern } from '../../../shared/utils/cache';

export class UsersService {
  async listUsers(page = 1, limit = 20, role?: string, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (role) where.role = role;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          profile: {
            select: {
              gradeLevel: true,
              stream: true,
              onboardingCompleted: true,
            },
          },
        },
      }),
      prisma.user.count({ where }),
    ]);

    return { users, total, page, limit };
  }

  async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        profile: true,
      },
    });
    if (!user) throw new AppError('User not found', 404);
    return user;
  }

  async updateUserRole(id: string, role: string) {
    const validRoles = ['STUDENT', 'PARENT', 'TEACHER', 'ADMIN'];
    if (!validRoles.includes(role)) {
      throw new AppError(`Invalid role. Must be one of: ${validRoles.join(', ')}`, 400);
    }

    await this.getUserById(id);

    const result = await prisma.user.update({
      where: { id },
      data: { role: role as any },
      select: { id: true, name: true, email: true, role: true },
    });
    await cacheDelPattern('admin:users:*');
    return result;
  }

  async deleteUser(id: string) {
    await this.getUserById(id);
    const result = await prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
      select: { id: true, name: true, email: true },
    });
    await cacheDelPattern('admin:users:*');
    return result;
  }
}
