import { prisma } from '../../../config/database';

export class AuthRepository {
  /** @returns User with secret and profile relations, or null */
  async findUserByEmail(email: string): Promise<any> {
    return (prisma as any).user.findUnique({ 
      where: { email },
      include: { secret: true, profile: true }
    });
  }

  /** @returns User with secret and profile relations, or null */
  async findUserById(id: string): Promise<any> {
    return (prisma as any).user.findUnique({ 
      where: { id },
      include: { secret: true, profile: true }
    });
  }

  /** @returns Created user with secret and profile relations */
  async createUser(data: any): Promise<any> {
    return (prisma as any).user.create({ 
      data,
      include: { secret: true, profile: true }
    });
  }

  /** @returns Created session record */
  async createSession(data: any): Promise<any> {
    return (prisma as any).session.create({ data });
  }

  /** @returns Created refresh token record */
  async createRefreshToken(data: any): Promise<any> {
    return (prisma as any).refreshToken.create({ data });
  }

  /** @returns Refresh token record with userId and expiresAt, or null */
  async findRefreshToken(token: string): Promise<any> {
    return (prisma as any).refreshToken.findUnique({ where: { token } });
  }

  async deleteRefreshToken(token: string): Promise<void> {
    await (prisma as any).refreshToken.deleteMany({ where: { token } });
  }

  async revokeAllUserSessions(userId: string): Promise<void> {
    await (prisma as any).session.deleteMany({ where: { userId } });
    await (prisma as any).refreshToken.deleteMany({ where: { userId } });
  }

  async unlockUser(userId: string): Promise<void> {
    await (prisma as any).user.update({
      where: { id: userId },
      data: { failedLoginAttempts: 0, lockedUntil: null },
    });
  }

  async resetFailedAttempts(userId: string): Promise<void> {
    await (prisma as any).user.update({
      where: { id: userId },
      data: { failedLoginAttempts: 0 },
    });
  }
}
