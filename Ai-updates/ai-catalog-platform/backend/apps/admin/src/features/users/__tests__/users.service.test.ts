import { AppError } from '../../../../shared/errors/AppError';

const prismaMock = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    count: jest.fn(),
  },
};

jest.mock('../../../../config/database', () => ({
  prisma: prismaMock,
}));

import { UsersService } from '../services/users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    service = new UsersService();
  });

  // ── listUsers ───────────────────────────────────────────────────────────────

  describe('listUsers', () => {
    it('returns paginated users with defaults', async () => {
      const users = [
        { id: '1', name: 'Alice', email: 'alice@test.com', role: 'STUDENT' },
        { id: '2', name: 'Bob', email: 'bob@test.com', role: 'TEACHER' },
      ];

      prismaMock.user.findMany.mockResolvedValue(users);
      prismaMock.user.count.mockResolvedValue(50);

      const result = await service.listUsers();

      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
          skip: 0,
          take: 20,
          orderBy: { createdAt: 'desc' },
        }),
      );
      expect(prismaMock.user.count).toHaveBeenCalledWith({ where: {} });
      expect(result).toEqual({ users, total: 50, page: 1, limit: 20 });
    });

    it('applies custom page and limit', async () => {
      prismaMock.user.findMany.mockResolvedValue([]);
      prismaMock.user.count.mockResolvedValue(0);

      await service.listUsers(3, 10);

      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ skip: 20, take: 10 }),
      );
    });

    it('filters users by role', async () => {
      prismaMock.user.findMany.mockResolvedValue([]);
      prismaMock.user.count.mockResolvedValue(0);

      await service.listUsers(1, 20, 'ADMIN');

      expect(prismaMock.user.findMany).toHaveBeenCalledWith(
        expect.objectContaining({ where: { role: 'ADMIN' } }),
      );
      expect(prismaMock.user.count).toHaveBeenCalledWith({ where: { role: 'ADMIN' } });
    });
  });

  // ── getUserById ─────────────────────────────────────────────────────────────

  describe('getUserById', () => {
    it('returns user when found', async () => {
      const user = { id: 'uuid-1', name: 'Alice', email: 'alice@test.com', role: 'STUDENT' };
      prismaMock.user.findUnique.mockResolvedValue(user);

      const result = await service.getUserById('uuid-1');

      expect(prismaMock.user.findUnique).toHaveBeenCalledWith(
        expect.objectContaining({ where: { id: 'uuid-1' } }),
      );
      expect(result).toEqual(user);
    });

    it('throws 404 when user is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.getUserById('missing-id'))
        .rejects
        .toThrow(AppError);

      await expect(service.getUserById('missing-id'))
        .rejects
        .toMatchObject({ statusCode: 404, message: 'User not found' });
    });
  });

  // ── updateUserRole ──────────────────────────────────────────────────────────

  describe('updateUserRole', () => {
    it('updates role for an existing user', async () => {
      const user = { id: 'uuid-1', name: 'Alice', email: 'alice@test.com', role: 'STUDENT' };
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.user.update.mockResolvedValue({ ...user, role: 'TEACHER' });

      const result = await service.updateUserRole('uuid-1', 'TEACHER');

      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'uuid-1' },
          data: { role: 'TEACHER' },
        }),
      );
      expect(result.role).toBe('TEACHER');
    });

    it('throws 400 for an invalid role', async () => {
      await expect(service.updateUserRole('uuid-1', 'SUPERUSER'))
        .rejects
        .toThrow(AppError);

      await expect(service.updateUserRole('uuid-1', 'SUPERUSER'))
        .rejects
        .toMatchObject({ statusCode: 400 });
    });

    it('throws 400 with message listing valid roles', async () => {
      await expect(service.updateUserRole('uuid-1', 'INVALID'))
        .rejects
        .toThrow(/STUDENT, PARENT, TEACHER, ADMIN/);
    });

    it('throws 404 when user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.updateUserRole('missing-id', 'ADMIN'))
        .rejects
        .toMatchObject({ statusCode: 404, message: 'User not found' });
    });
  });

  // ── deleteUser ──────────────────────────────────────────────────────────────

  describe('deleteUser', () => {
    it('soft-deletes an existing user by setting deletedAt', async () => {
      const user = { id: 'uuid-1', name: 'Alice', email: 'alice@test.com', role: 'STUDENT' };
      prismaMock.user.findUnique.mockResolvedValue(user);
      prismaMock.user.update.mockResolvedValue({ id: 'uuid-1', name: 'Alice', email: 'alice@test.com' });

      const result = await service.deleteUser('uuid-1');

      expect(prismaMock.user.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 'uuid-1' },
          data: { deletedAt: expect.any(Date) },
        }),
      );
      expect(result.id).toBe('uuid-1');
    });

    it('throws 404 when user does not exist', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      await expect(service.deleteUser('missing-id'))
        .rejects
        .toThrow(AppError);

      await expect(service.deleteUser('missing-id'))
        .rejects
        .toMatchObject({ statusCode: 404 });
    });
  });
});
