import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '../utils/asyncHandler';

describe('asyncHandler', () => {
  const req = {} as Request;
  const res = {} as Response;
  let next: jest.Mock;

  beforeEach(() => {
    next = jest.fn();
  });

  it('should call the wrapped async function', async () => {
    const fn = jest.fn().mockResolvedValue(undefined);
    const handler = asyncHandler(fn);

    await handler(req, res, next);

    expect(fn).toHaveBeenCalledWith(req, res, next);
  });

  it('should pass rejected errors to next()', async () => {
    const error = new Error('async failure');
    const fn = jest.fn().mockRejectedValue(error);
    const handler = asyncHandler(fn);

    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('should pass thrown errors to next()', async () => {
    const error = new Error('thrown error');
    const fn = jest.fn().mockImplementation(async () => {
      throw error;
    });
    const handler = asyncHandler(fn);

    await handler(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('should not call next with an error on success', async () => {
    const fn = jest.fn().mockResolvedValue(undefined);
    const handler = asyncHandler(fn);

    await handler(req, res, next);

    expect(next).not.toHaveBeenCalledWith(expect.any(Error));
  });

  it('should return a function (RequestHandler)', () => {
    const fn = jest.fn().mockResolvedValue(undefined);
    const handler = asyncHandler(fn);

    expect(typeof handler).toBe('function');
  });
});
