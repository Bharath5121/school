import { AppError } from '../errors/AppError';

describe('AppError', () => {
  it('should create an error with message and status code', () => {
    const error = new AppError('Not found', 404);

    expect(error.message).toBe('Not found');
    expect(error.statusCode).toBe(404);
    expect(error.isOperational).toBe(true);
  });

  it('should default isOperational to true', () => {
    const error = new AppError('Bad request', 400);

    expect(error.isOperational).toBe(true);
  });

  it('should allow isOperational to be set to false', () => {
    const error = new AppError('Internal error', 500, false);

    expect(error.isOperational).toBe(false);
  });

  it('should be an instance of Error', () => {
    const error = new AppError('Test', 400);

    expect(error).toBeInstanceOf(Error);
  });

  it('should be an instance of AppError', () => {
    const error = new AppError('Test', 400);

    expect(error).toBeInstanceOf(AppError);
  });

  it('should have a stack trace', () => {
    const error = new AppError('Stack test', 500);

    expect(error.stack).toBeDefined();
    expect(error.stack).toContain('AppError');
  });

  it('should inherit Error name', () => {
    const error = new AppError('Named error', 422);

    expect(error.name).toBe('Error');
  });

  it('should preserve statusCode as a readonly number', () => {
    const error = new AppError('Unauthorized', 401);

    expect(typeof error.statusCode).toBe('number');
    expect(error.statusCode).toBe(401);
  });

  it('should work with common HTTP status codes', () => {
    const cases = [
      { message: 'Bad Request', code: 400 },
      { message: 'Unauthorized', code: 401 },
      { message: 'Forbidden', code: 403 },
      { message: 'Not Found', code: 404 },
      { message: 'Conflict', code: 409 },
      { message: 'Locked', code: 423 },
      { message: 'Internal Server Error', code: 500 },
    ];

    for (const { message, code } of cases) {
      const error = new AppError(message, code);
      expect(error.statusCode).toBe(code);
      expect(error.message).toBe(message);
    }
  });
});
