jest.mock('../../shared/logger/logger', () => ({
  logger: { error: jest.fn(), info: jest.fn(), warn: jest.fn() },
}));

import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodIssue } from 'zod';
import { errorHandler } from '../error.middleware';
import { AppError } from '../../shared/errors/AppError';

function mockRes() {
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  return res;
}

const req = {} as Request;
const next = jest.fn() as NextFunction;

describe('errorHandler middleware', () => {
  it('should return 400 with validation messages for ZodError', () => {
    const issues: ZodIssue[] = [
      { code: 'invalid_type', expected: 'string', received: 'number', path: ['email'], message: 'Expected string' },
      { code: 'too_small', minimum: 8, type: 'string', inclusive: true, exact: false, path: ['password'], message: 'Too short' },
    ];
    const zodErr = new ZodError(issues);
    const res = mockRes();

    errorHandler(zodErr, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('Validation Error'),
      }),
    );
    const body = (res.json as jest.Mock).mock.calls[0][0];
    expect(body.message).toContain('Expected string');
    expect(body.message).toContain('Too short');
  });

  it('should return the correct status code for AppError', () => {
    const res = mockRes();
    const appErr = new AppError('Not found', 404);

    errorHandler(appErr, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Not found' }),
    );
  });

  it('should return 409 for Prisma P2002 unique constraint violation', () => {
    const res = mockRes();
    const prismaErr = { code: 'P2002', meta: { target: ['email'] }, message: 'Unique constraint' };

    errorHandler(prismaErr, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('email'),
      }),
    );
  });

  it('should handle P2002 when meta.target is a string', () => {
    const res = mockRes();
    const prismaErr = { code: 'P2002', meta: { target: 'email_unique' }, message: 'Unique constraint' };

    errorHandler(prismaErr, req, res, next);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('value'),
      }),
    );
  });

  it('should return 404 for Prisma P2025 record not found', () => {
    const res = mockRes();
    const prismaErr = { code: 'P2025', message: 'Record not found' };

    errorHandler(prismaErr, req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Record not found' }),
    );
  });

  it('should return 400 for Prisma P2003 foreign key constraint', () => {
    const res = mockRes();
    const prismaErr = { code: 'P2003', message: 'Foreign key constraint' };

    errorHandler(prismaErr, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: expect.stringContaining('related record'),
      }),
    );
  });

  it('should return 400 for entity.parse.failed (malformed JSON)', () => {
    const res = mockRes();
    const parseErr = { type: 'entity.parse.failed', message: 'Bad JSON' };

    errorHandler(parseErr, req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Invalid JSON in request body',
      }),
    );
  });

  it('should return 500 with generic message in production for unknown errors', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';
    const res = mockRes();
    const unknownErr = new Error('something broke internally');

    errorHandler(unknownErr, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'Internal Server Error',
      }),
    );
    process.env.NODE_ENV = originalEnv;
  });

  it('should return 500 with actual message in non-production for unknown errors', () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';
    const res = mockRes();
    const unknownErr = new Error('debug info for devs');

    errorHandler(unknownErr, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        message: 'debug info for devs',
      }),
    );
    process.env.NODE_ENV = originalEnv;
  });

  it('should handle AppError with various status codes', () => {
    const cases = [
      { message: 'Bad request', code: 400 },
      { message: 'Unauthorized', code: 401 },
      { message: 'Forbidden', code: 403 },
      { message: 'Conflict', code: 409 },
      { message: 'Locked', code: 423 },
    ];

    for (const { message, code } of cases) {
      const res = mockRes();
      errorHandler(new AppError(message, code), req, res, next);
      expect(res.status).toHaveBeenCalledWith(code);
    }
  });
});
