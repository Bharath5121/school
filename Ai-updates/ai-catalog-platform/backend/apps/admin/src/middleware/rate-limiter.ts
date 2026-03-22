import rateLimit from 'express-rate-limit';
import { APP_CONSTANTS } from '../config/constants';

export const apiLimiter = rateLimit({
  windowMs: APP_CONSTANTS.RATE_LIMITS.GLOBAL.windowMs,
  max: APP_CONSTANTS.RATE_LIMITS.GLOBAL.max,
  message: { success: false, message: 'Too many requests, please try again later' },
});

export const authLimiter = rateLimit({
  windowMs: APP_CONSTANTS.RATE_LIMITS.AUTH.windowMs,
  max: APP_CONSTANTS.RATE_LIMITS.AUTH.max,
  message: { success: false, message: 'Too many auth attempts, please try again later' },
});

export const adminLimiter = rateLimit({
  windowMs: APP_CONSTANTS.RATE_LIMITS.ADMIN.windowMs,
  max: APP_CONSTANTS.RATE_LIMITS.ADMIN.max,
  keyGenerator: (req) => (req as any).user?.id || req.ip || 'unknown',
  message: { success: false, message: 'Too many admin requests, please try again later' },
});
