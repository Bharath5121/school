import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../shared/errors/AppError';
import { prisma } from '../config/database';

export interface JwtPayload {
  userId: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Not authorized, no token', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
      algorithms: ['HS256'],
    }) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    return next(new AppError('Token invalid or expired', 401));
  }
};

export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return next(new AppError('Admin access required', 403));
  }
  next();
};

export const requireParent = (req: Request, _res: Response, next: NextFunction) => {
  if (req.user?.role !== 'PARENT') {
    return next(new AppError('Parent access required', 403));
  }
  next();
};

export const verifyParentChildLink = async (req: Request, _res: Response, next: NextFunction) => {
  const parentId = req.user?.userId;
  const childId = req.params.childId;

  if (!parentId || !childId) {
    return next(new AppError('Missing parent or child identifier', 400));
  }

  const link = await (prisma as any).parentChildLink.findUnique({
    where: { parentId_childId: { parentId, childId } },
  });

  if (!link) {
    return next(new AppError('You do not have access to this student', 403));
  }

  next();
};
