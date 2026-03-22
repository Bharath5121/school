import { AppError } from './AppError';
import { ErrorCode } from './error-codes';

export class ValidationError extends AppError {
  public readonly code = ErrorCode.VALIDATION_ERROR;
  public readonly errors: Record<string, string[]>;

  constructor(message = 'Validation failed', errors: Record<string, string[]> = {}) {
    super(message, 400);
    this.errors = errors;
  }
}
