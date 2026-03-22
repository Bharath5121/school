import { AppError } from './AppError';
import { ErrorCode } from './error-codes';

export class ForbiddenError extends AppError {
  public readonly code = ErrorCode.FORBIDDEN;

  constructor(message = 'Access denied') {
    super(message, 403);
  }
}
