import { Request, Response, NextFunction } from 'express';
import { AppError } from '../shared/errors/AppError';

export const requireAdmin = (req: Request, _res: Response, next: NextFunction) => {
  if (req.user?.role !== 'ADMIN') {
    return next(new AppError('Admin access required', 403));
  }
  next();
};
