import { AppError } from './AppError';
import { ErrorCode } from './error-codes';

export class ConflictError extends AppError {
  public readonly code = ErrorCode.CONFLICT;

  constructor(resource: string, field?: string) {
    super(field ? `${resource} with this ${field} already exists` : `${resource} already exists`, 409);
  }
}
