import { AppError } from './AppError';
import { ErrorCode } from './error-codes';

export class NotFoundError extends AppError {
  public readonly code = ErrorCode.NOT_FOUND;
  public readonly resource: string;

  constructor(resource: string, id?: string) {
    super(id ? `${resource} with id '${id}' not found` : `${resource} not found`, 404);
    this.resource = resource;
  }
}
