import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { AuthRepository } from '../repositories/auth.repository';
import { RegisterDto } from '../dtos/register.dto';
import { LoginDto } from '../dtos/login.dto';
import { AppError } from '../../../shared/errors/AppError';
import { env } from '../../../config/env';
import { SessionDetails } from '../types/session.types';
import { TokenPair } from '../types/auth.types';
import { prisma } from '../../../config/database';

const BCRYPT_SALT_ROUNDS = 12;
const REFRESH_TOKEN_BYTES = 40;
const REFRESH_TOKEN_EXPIRY_DAYS = 7;
// Note: In real setup, JWT_SECRET should be a valid RS256 private key and public key should be stored
// For simplicity, using it as symmetric secretly but you would sign with RS256 using private key.
const JWT_PRIVATE_KEY = env.JWT_SECRET;

export class AuthService {
  private repo = new AuthRepository();

  async register(dto: RegisterDto, sessionInfo?: SessionDetails): Promise<{ user: any, tokens: TokenPair }> {
    const existing = await this.repo.findUserByEmail(dto.email);
    if (existing) {
      throw new AppError('Email already in use', 400);
    }

    const passwordHash = await bcrypt.hash(dto.password, BCRYPT_SALT_ROUNDS);
    const role = dto.role || 'STUDENT';
    const isAdmin = role === 'ADMIN';
    if (role === 'PARENT' && dto.childEmail) {
      const childQuery: any = { email: dto.childEmail, role: 'STUDENT', deletedAt: null };
      const child = await (prisma as any).user.findFirst({ where: childQuery });
      if (!child) {
        throw new AppError('No student account found with that email. The student must register first.', 400);
      }
      if (dto.childName && child.name.toLowerCase() !== dto.childName.toLowerCase()) {
        throw new AppError('Student name does not match the provided email.', 400);
      }
    }

    const user = await this.repo.createUser({
      email: dto.email,
      name: dto.name,
      role,
      secret: {
        create: {
          passwordHash
        }
      },
      profile: {
        create: {
          gradeLevel: dto.gradeLevel,
          parentEmail: dto.parentEmail,
          onboardingCompleted: isAdmin,
        }
      }
    });

    if (role === 'PARENT' && dto.childEmail) {
      const child = await (prisma as any).user.findFirst({
        where: { email: dto.childEmail, role: 'STUDENT', deletedAt: null },
      });
      if (child) {
        await (prisma as any).parentChildLink.create({
          data: { parentId: user.id, childId: child.id },
        });
      }
    }

    return this.generateAuthPayload(user, sessionInfo);
  }

  async login(dto: LoginDto, sessionInfo?: SessionDetails): Promise<{ user: any, tokens: TokenPair }> {
    const user = await this.repo.findUserByEmail(dto.email);
    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      const minutesLeft = Math.ceil((new Date(user.lockedUntil).getTime() - Date.now()) / 60000);
      throw new AppError(`Account locked. Try again in ${minutesLeft} minutes.`, 423);
    }
    if (user.lockedUntil) {
      await this.repo.unlockUser(user.id);
    }

    if (user.deletedAt) {
      throw new AppError('Account is deactivated. Contact support.', 403);
    }

    if (!user.secret || !user.secret.passwordHash) {
      throw new AppError('No password set for this account.', 401);
    }

    const isValid = await bcrypt.compare(dto.password, user.secret.passwordHash);
    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }

    if (user.failedLoginAttempts > 0) {
      await this.repo.resetFailedAttempts(user.id);
    }

    return this.generateAuthPayload(user, sessionInfo);
  }

  async refresh(token: string): Promise<{ tokens: TokenPair }> {
    const storedToken = await this.repo.findRefreshToken(token);
    if (!storedToken || storedToken.expiresAt < new Date()) {
      if (storedToken) await this.repo.deleteRefreshToken(token);
      throw new AppError('Invalid or expired refresh token', 401);
    }

    const user = await this.repo.findUserById(storedToken.userId);
    if (!user) throw new AppError('User not found', 401);

    await this.repo.deleteRefreshToken(token);
    const payload = await this.generateAuthPayload(user);
    return { tokens: payload.tokens };
  }

  async logout(refreshToken: string): Promise<void> {
    await this.repo.deleteRefreshToken(refreshToken);
  }

  async getMe(userId: string): Promise<any> {
    const user = await this.repo.findUserById(userId);
    if (!user) throw new AppError('User not found', 404);
    
    // Reuse flattening logic
    const { secret, profile, ...userWithoutRelations } = user;
    return {
      ...userWithoutRelations,
      ...(profile || {}),
      onboardingCompleted: profile?.onboardingCompleted || false
    };
  }

  private async generateAuthPayload(user: any, sessionInfo?: SessionDetails) {
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      JWT_PRIVATE_KEY,
      { algorithm: 'HS256', expiresIn: env.JWT_EXPIRES_IN } as jwt.SignOptions
    );

    const refreshToken = crypto.randomBytes(REFRESH_TOKEN_BYTES).toString('hex');
    const refreshExpires = new Date();
    refreshExpires.setDate(refreshExpires.getDate() + REFRESH_TOKEN_EXPIRY_DAYS);

    await this.repo.createRefreshToken({
      token: refreshToken,
      userId: user.id,
      expiresAt: refreshExpires,
    });

    if (sessionInfo) {
      await this.repo.createSession({
        userId: user.id,
        ipAddress: sessionInfo.ipAddress,
        userAgent: sessionInfo.userAgent
      });
    }

    const { secret, profile, ...userWithoutRelations } = user;
    const userSafe = {
      ...userWithoutRelations,
      ...(profile || {}),
      onboardingCompleted: profile?.onboardingCompleted || false
    };
    return { user: userSafe, tokens: { accessToken, refreshToken } };
  }
}
