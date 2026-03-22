import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../shared/errors/AppError';
import { ValidationError } from '../shared/errors/ValidationError';
import { ErrorCode } from '../shared/errors/error-codes';
import { logger } from '../shared/logger/logger';

export const errorHandler = (
  err: Error & { code?: string; meta?: { target?: string[] }; type?: string; statusCode?: number },
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err.message, { stack: err.stack });

  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => e.message).join(', ');
    return res.status(400).json({
      success: false,
      message: `Validation Error: ${messages}`,
      code: ErrorCode.VALIDATION_ERROR,
    });
  }

  if (err instanceof AppError) {
    const errorCode = (err as AppError & { code?: string }).code || ErrorCode.INTERNAL_ERROR;
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      code: errorCode,
      ...(err instanceof ValidationError ? { errors: err.errors } : {}),
    });
  }

  if (err.code === 'P2002') {
    const target = err.meta?.target;
    return res.status(409).json({
      success: false,
      message: `A record with this ${Array.isArray(target) ? target.join(', ') : 'value'} already exists`,
      code: ErrorCode.CONFLICT,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found', code: ErrorCode.NOT_FOUND });
  }

  if (err.code === 'P2003') {
    return res.status(400).json({
      success: false,
      message: 'Cannot complete operation: related record not found or would violate a constraint',
      code: ErrorCode.BAD_REQUEST,
    });
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ success: false, message: 'Invalid JSON in request body', code: ErrorCode.VALIDATION_ERROR });
  }

  const isProd = process.env.NODE_ENV === 'production';
  return res.status(500).json({ success: false, message: isProd ? 'Internal Server Error' : err.message, code: ErrorCode.INTERNAL_ERROR });
};
