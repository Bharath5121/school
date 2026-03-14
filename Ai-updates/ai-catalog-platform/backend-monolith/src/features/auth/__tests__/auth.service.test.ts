jest.mock('../repositories/auth.repository');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');
jest.mock('crypto', () => ({
  randomBytes: jest.fn(() => ({ toString: () => 'mock-refresh-token' })),
}));
jest.mock('../../../config/env', () => ({
  env: {
    JWT_SECRET: 'test-jwt-secret-that-is-32-chars-long',
    JWT_EXPIRES_IN: '15m',
    NODE_ENV: 'test',
  },
}));

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AuthService } from '../services/auth.service';
import { AuthRepository } from '../repositories/auth.repository';
import { AppError } from '../../../shared/errors/AppError';

const mockRepo = AuthRepository.prototype as jest.Mocked<AuthRepository>;

describe('AuthService', () => {
  let service: AuthService;

  const mockUser = {
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    role: 'STUDENT',
    status: 'ACTIVE',
    failedLoginAttempts: 0,
    lockedUntil: null,
    secret: { passwordHash: 'hashed-password' },
    profile: { gradeLevel: '10', parentEmail: null, onboardingCompleted: false },
  };

  const mockSessionInfo = { ipAddress: '127.0.0.1', userAgent: 'jest' };

  beforeEach(() => {
    service = new AuthService();
    (jwt.sign as jest.Mock).mockReturnValue('mock-access-token');
    mockRepo.createRefreshToken.mockResolvedValue({});
    mockRepo.createSession.mockResolvedValue({});
  });

  // ─── register ──────────────────────────────────────────────────────

  describe('register', () => {
    const registerDto = {
      email: 'new@example.com',
      password: 'Password1',
      name: 'New User',
    };

    it('should register a new user and return user + tokens', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed-pw');
      mockRepo.createUser.mockResolvedValue({ ...mockUser, email: registerDto.email });

      const result = await service.register(registerDto, mockSessionInfo);

      expect(mockRepo.findUserByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
      expect(mockRepo.createUser).toHaveBeenCalledWith(
        expect.objectContaining({ email: registerDto.email, role: 'STUDENT' }),
      );
      expect(result.user).toBeDefined();
      expect(result.tokens.accessToken).toBe('mock-access-token');
      expect(result.tokens.refreshToken).toBe('mock-refresh-token');
    });

    it('should throw 400 when email already in use', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(AppError);
      await expect(service.register(registerDto)).rejects.toMatchObject({
        statusCode: 400,
        message: 'Email already in use',
      });
    });

    it('should hash the password with bcrypt salt rounds 12', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockRepo.createUser.mockResolvedValue(mockUser);

      await service.register(registerDto);

      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
    });

    it('should use provided role when specified', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockRepo.createUser.mockResolvedValue({ ...mockUser, role: 'TEACHER' });

      await service.register({ ...registerDto, role: 'TEACHER' as any });

      expect(mockRepo.createUser).toHaveBeenCalledWith(
        expect.objectContaining({ role: 'TEACHER' }),
      );
    });

    it('should set onboardingCompleted true for ADMIN role', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockRepo.createUser.mockResolvedValue({ ...mockUser, role: 'ADMIN' });

      await service.register({ ...registerDto, role: 'ADMIN' as any });

      expect(mockRepo.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          profile: expect.objectContaining({
            create: expect.objectContaining({ onboardingCompleted: true }),
          }),
        }),
      );
    });

    it('should create a session when sessionInfo is provided', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockRepo.createUser.mockResolvedValue(mockUser);

      await service.register(registerDto, mockSessionInfo);

      expect(mockRepo.createSession).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: mockUser.id,
          ipAddress: mockSessionInfo.ipAddress,
          userAgent: mockSessionInfo.userAgent,
        }),
      );
    });

    it('should not create a session when sessionInfo is omitted', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockRepo.createUser.mockResolvedValue(mockUser);

      await service.register(registerDto);

      expect(mockRepo.createSession).not.toHaveBeenCalled();
    });

    it('should strip secret from returned user', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashed');
      mockRepo.createUser.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(result.user).not.toHaveProperty('secret');
    });
  });

  // ─── login ─────────────────────────────────────────────────────────

  describe('login', () => {
    const loginDto = { email: 'test@example.com', password: 'Password1' };

    it('should login and return user + tokens on valid credentials', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto, mockSessionInfo);

      expect(result.user).toBeDefined();
      expect(result.user).not.toHaveProperty('secret');
      expect(result.tokens.accessToken).toBe('mock-access-token');
      expect(result.tokens.refreshToken).toBe('mock-refresh-token');
    });

    it('should throw 401 when email is not found', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(AppError);
      await expect(service.login(loginDto)).rejects.toMatchObject({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    });

    it('should throw 401 when password is invalid', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(service.login(loginDto)).rejects.toMatchObject({
        statusCode: 401,
        message: 'Invalid credentials',
      });
    });

    it('should throw 423 when account is locked and lockout has not expired', async () => {
      const lockedUser = {
        ...mockUser,
        status: 'SUSPENDED',
        lockedUntil: new Date(Date.now() + 600_000),
      };
      mockRepo.findUserByEmail.mockResolvedValue(lockedUser);

      await expect(service.login(loginDto)).rejects.toThrow(AppError);
      await expect(service.login(loginDto)).rejects.toMatchObject({
        statusCode: 423,
      });
    });

    it('should unlock and proceed when lockout has expired', async () => {
      const expiredLockUser = {
        ...mockUser,
        status: 'SUSPENDED',
        lockedUntil: new Date(Date.now() - 1000),
      };
      mockRepo.findUserByEmail.mockResolvedValue(expiredLockUser);
      mockRepo.unlockUser.mockResolvedValue(undefined);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.login(loginDto);

      expect(mockRepo.unlockUser).toHaveBeenCalledWith(expiredLockUser.id);
      expect(result.tokens).toBeDefined();
    });

    it('should throw 403 when account is INACTIVE', async () => {
      const inactiveUser = { ...mockUser, status: 'INACTIVE' };
      mockRepo.findUserByEmail.mockResolvedValue(inactiveUser);

      await expect(service.login(loginDto)).rejects.toMatchObject({
        statusCode: 403,
        message: 'Account is deactivated. Contact support.',
      });
    });

    it('should throw 401 when user has no secret (Google account)', async () => {
      const googleUser = { ...mockUser, secret: null };
      mockRepo.findUserByEmail.mockResolvedValue(googleUser);

      await expect(service.login(loginDto)).rejects.toMatchObject({
        statusCode: 401,
        message: expect.stringContaining('Google'),
      });
    });

    it('should reset failed login attempts on successful login', async () => {
      const userWithFailedAttempts = { ...mockUser, failedLoginAttempts: 3 };
      mockRepo.findUserByEmail.mockResolvedValue(userWithFailedAttempts);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockRepo.resetFailedAttempts.mockResolvedValue(undefined);

      await service.login(loginDto);

      expect(mockRepo.resetFailedAttempts).toHaveBeenCalledWith(mockUser.id);
    });

    it('should not reset failed attempts when they are already zero', async () => {
      mockRepo.findUserByEmail.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await service.login(loginDto);

      expect(mockRepo.resetFailedAttempts).not.toHaveBeenCalled();
    });
  });

  // ─── refresh ───────────────────────────────────────────────────────

  describe('refresh', () => {
    it('should return new token pair for a valid refresh token', async () => {
      const storedToken = {
        token: 'valid-refresh',
        userId: mockUser.id,
        expiresAt: new Date(Date.now() + 86_400_000),
      };
      mockRepo.findRefreshToken.mockResolvedValue(storedToken);
      mockRepo.findUserById.mockResolvedValue(mockUser);
      mockRepo.deleteRefreshToken.mockResolvedValue(undefined);

      const result = await service.refresh('valid-refresh');

      expect(mockRepo.deleteRefreshToken).toHaveBeenCalledWith('valid-refresh');
      expect(result.tokens.accessToken).toBe('mock-access-token');
      expect(result.tokens.refreshToken).toBe('mock-refresh-token');
    });

    it('should throw 401 when refresh token does not exist', async () => {
      mockRepo.findRefreshToken.mockResolvedValue(null);

      await expect(service.refresh('nonexistent')).rejects.toMatchObject({
        statusCode: 401,
        message: 'Invalid or expired refresh token',
      });
    });

    it('should delete and throw 401 when refresh token is expired', async () => {
      const expiredToken = {
        token: 'expired-refresh',
        userId: mockUser.id,
        expiresAt: new Date(Date.now() - 1000),
      };
      mockRepo.findRefreshToken.mockResolvedValue(expiredToken);
      mockRepo.deleteRefreshToken.mockResolvedValue(undefined);

      await expect(service.refresh('expired-refresh')).rejects.toMatchObject({
        statusCode: 401,
      });
      expect(mockRepo.deleteRefreshToken).toHaveBeenCalledWith('expired-refresh');
    });

    it('should throw 401 when user no longer exists', async () => {
      const storedToken = {
        token: 'valid-refresh',
        userId: 'deleted-user',
        expiresAt: new Date(Date.now() + 86_400_000),
      };
      mockRepo.findRefreshToken.mockResolvedValue(storedToken);
      mockRepo.findUserById.mockResolvedValue(null);
      mockRepo.deleteRefreshToken.mockResolvedValue(undefined);

      await expect(service.refresh('valid-refresh')).rejects.toMatchObject({
        statusCode: 401,
        message: 'User not found',
      });
    });
  });

  // ─── logout ────────────────────────────────────────────────────────

  describe('logout', () => {
    it('should delete the refresh token', async () => {
      mockRepo.deleteRefreshToken.mockResolvedValue(undefined);

      await service.logout('some-token');

      expect(mockRepo.deleteRefreshToken).toHaveBeenCalledWith('some-token');
    });
  });

  // ─── getMe ─────────────────────────────────────────────────────────

  describe('getMe', () => {
    it('should return user data without secret', async () => {
      mockRepo.findUserById.mockResolvedValue(mockUser);

      const result = await service.getMe('user-1');

      expect(result).not.toHaveProperty('secret');
      expect(result).not.toHaveProperty('profile');
      expect(result.email).toBe(mockUser.email);
      expect(result.onboardingCompleted).toBe(false);
    });

    it('should throw 404 when user is not found', async () => {
      mockRepo.findUserById.mockResolvedValue(null);

      await expect(service.getMe('nonexistent')).rejects.toThrow(AppError);
      await expect(service.getMe('nonexistent')).rejects.toMatchObject({
        statusCode: 404,
        message: 'User not found',
      });
    });

    it('should default onboardingCompleted to false when profile is null', async () => {
      mockRepo.findUserById.mockResolvedValue({ ...mockUser, profile: null });

      const result = await service.getMe('user-1');

      expect(result.onboardingCompleted).toBe(false);
    });
  });
});
