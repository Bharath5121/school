import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase';
import { AppError } from '../shared/errors/AppError';
import { prisma } from '../config/database';

export interface AuthUser {
  userId: string;
  role: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

export const authenticate = async (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Not authorized, no token', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return next(new AppError('Token invalid or expired', 401));
    }

    const dbUser = await (prisma as any).user.findUnique({
      where: { id: user.id },
      select: { id: true, role: true, email: true },
    });

    req.user = {
      userId: user.id,
      role: dbUser?.role || 'STUDENT',
      email: dbUser?.email || user.email || '',
    };

    next();
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown auth error';
    if (message.includes('connect') || message.includes('timeout')) {
      return next(new AppError('Authentication service unavailable', 503));
    }
    return next(new AppError('Token invalid or expired', 401));
  }
};

export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return next(new AppError('Admin access required', 403));
  }
  next();
};

