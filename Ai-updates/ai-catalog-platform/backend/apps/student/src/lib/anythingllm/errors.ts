import { AppError } from '../../shared/errors/AppError';

export class AnythingLLMError extends AppError {
  public readonly service = 'AnythingLLM';

  constructor(message: string, statusCode = 502) {
    super(`AnythingLLM: ${message}`, statusCode, true);
  }
}

export class AnythingLLMConnectionError extends AnythingLLMError {
  constructor() {
    super('Service unavailable - unable to connect', 503);
  }
}

export class AnythingLLMTimeoutError extends AnythingLLMError {
  constructor(timeoutMs: number) {
    super(`Request timed out after ${timeoutMs}ms`, 504);
  }
}

export class AnythingLLMRateLimitError extends AnythingLLMError {
  constructor() {
    super('Rate limit exceeded', 429);
  }
}
