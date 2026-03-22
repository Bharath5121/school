import { AppError } from './AppError';
import { ErrorCode } from './error-codes';

export class UnauthorizedError extends AppError {
  public readonly code = ErrorCode.UNAUTHORIZED;

  constructor(message = 'Authentication required') {
    super(message, 401);
  }
}
