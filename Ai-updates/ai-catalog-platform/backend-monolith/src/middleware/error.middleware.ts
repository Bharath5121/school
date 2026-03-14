import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../shared/errors/AppError';
import { ApiResponse } from '../shared/response/ApiResponse';
import { logger } from '../shared/logger/logger';

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error(err.message, { stack: err.stack });

  if (err instanceof ZodError) {
    const messages = err.errors.map((e) => e.message).join(', ');
    return res.status(400).json(ApiResponse.error(`Validation Error: ${messages}`));
  }

  if (err instanceof AppError) {
    return res.status(err.statusCode).json(ApiResponse.error(err.message));
  }

  if (err.code === 'P2002') {
    const target = err.meta?.target;
    return res.status(409).json(ApiResponse.error(
      `A record with this ${Array.isArray(target) ? target.join(', ') : 'value'} already exists`
    ));
  }

  if (err.code === 'P2025') {
    return res.status(404).json(ApiResponse.error('Record not found'));
  }

  if (err.code === 'P2003') {
    return res.status(400).json(ApiResponse.error(
      'Cannot complete operation: related record not found or would violate a constraint'
    ));
  }

  if (err.type === 'entity.parse.failed') {
    return res.status(400).json(ApiResponse.error('Invalid JSON in request body'));
  }

  const isProd = process.env.NODE_ENV === 'production';
  return res
    .status(500)
    .json(ApiResponse.error(isProd ? 'Internal Server Error' : err.message));
};
