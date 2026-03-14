import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../../../shared/response/ApiResponse';
import { AppError } from '../../../shared/errors/AppError';
import { asyncHandler } from '../../../shared/utils/asyncHandler';
import { env } from '../../../config/env';

const service = new AuthService();

export class AuthController {
  register = asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await service.register(req.body, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    res.status(201).json(ApiResponse.success({ user, accessToken: tokens.accessToken }));
  });

  login = asyncHandler(async (req: Request, res: Response) => {
    const { user, tokens } = await service.login(req.body, {
      ipAddress: req.ip,
      userAgent: req.headers['user-agent'],
    });
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    res.status(200).json(ApiResponse.success({ user, accessToken: tokens.accessToken }));
  });

  refresh = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new AppError('Refresh token required', 401);
    const { tokens } = await service.refresh(refreshToken);
    this.setRefreshTokenCookie(res, tokens.refreshToken);
    res.status(200).json(ApiResponse.success({ accessToken: tokens.accessToken }));
  });

  logout = asyncHandler(async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
      await service.logout(refreshToken);
    }
    res.clearCookie('refreshToken');
    res.status(200).json(ApiResponse.success(null, 'Logged out successfully'));
  });

  me = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user?.userId) throw new AppError('Not authenticated', 401);
    const user = await service.getMe(req.user.userId);
    res.status(200).json(ApiResponse.success(user));
  });

  private setRefreshTokenCookie(res: Response, token: string): void {
    res.cookie('refreshToken', token, {
      httpOnly: true,
      secure: env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
  }
}
