jest.mock('jsonwebtoken');

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { authenticate, requireAdmin } from '../auth.middleware';
import { AppError } from '../../shared/errors/AppError';

function mockReqResNext(overrides: Partial<Request> = {}) {
  const req = { headers: {}, ...overrides } as Request;
  const res = {} as Response;
  const next = jest.fn() as NextFunction;
  return { req, res, next };
}

describe('authenticate middleware', () => {
  const validPayload = { userId: 'user-1', role: 'STUDENT' };

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret-key-that-is-at-least-32-characters-long';
  });

  it('should set req.user and call next for a valid token', () => {
    (jwt.verify as jest.Mock).mockReturnValue(validPayload);
    const { req, res, next } = mockReqResNext({
      headers: { authorization: 'Bearer valid-token' } as any,
    });

    authenticate(req, res, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid-token', process.env.JWT_SECRET, {
      algorithms: ['HS256'],
    });
    expect(req.user).toEqual(validPayload);
    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with 401 AppError when authorization header is missing', () => {
    const { req, res, next } = mockReqResNext();

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = (next as jest.Mock).mock.calls[0][0] as AppError;
    expect(error.statusCode).toBe(401);
    expect(error.message).toContain('no token');
  });

  it('should call next with 401 AppError when header does not start with Bearer', () => {
    const { req, res, next } = mockReqResNext({
      headers: { authorization: 'Basic abc123' } as any,
    });

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = (next as jest.Mock).mock.calls[0][0] as AppError;
    expect(error.statusCode).toBe(401);
  });

  it('should call next with 401 AppError when token verification fails', () => {
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('jwt expired');
    });
    const { req, res, next } = mockReqResNext({
      headers: { authorization: 'Bearer expired-token' } as any,
    });

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = (next as jest.Mock).mock.calls[0][0] as AppError;
    expect(error.statusCode).toBe(401);
    expect(error.message).toContain('invalid or expired');
  });

  it('should call next with 401 when authorization header is empty string', () => {
    const { req, res, next } = mockReqResNext({
      headers: { authorization: '' } as any,
    });

    authenticate(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = (next as jest.Mock).mock.calls[0][0] as AppError;
    expect(error.statusCode).toBe(401);
  });
});

describe('requireAdmin middleware', () => {
  it('should call next() when user has ADMIN role', () => {
    const { req, res, next } = mockReqResNext();
    req.user = { userId: 'admin-1', role: 'ADMIN' };

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalledWith();
  });

  it('should call next with 403 AppError when user is not ADMIN', () => {
    const { req, res, next } = mockReqResNext();
    req.user = { userId: 'user-1', role: 'STUDENT' };

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = (next as jest.Mock).mock.calls[0][0] as AppError;
    expect(error.statusCode).toBe(403);
    expect(error.message).toContain('Admin');
  });

  it('should call next with 403 AppError when req.user is undefined', () => {
    const { req, res, next } = mockReqResNext();

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
    const error = (next as jest.Mock).mock.calls[0][0] as AppError;
    expect(error.statusCode).toBe(403);
  });

  it('should call next with 403 for TEACHER role', () => {
    const { req, res, next } = mockReqResNext();
    req.user = { userId: 'teacher-1', role: 'TEACHER' };

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });

  it('should call next with 403 for PARENT role', () => {
    const { req, res, next } = mockReqResNext();
    req.user = { userId: 'parent-1', role: 'PARENT' };

    requireAdmin(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(AppError));
  });
});
