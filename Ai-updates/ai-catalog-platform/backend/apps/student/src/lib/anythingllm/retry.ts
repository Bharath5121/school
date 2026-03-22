import { logger } from '../../shared/logger/logger';
import { AnythingLLMError } from './errors';

class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'closed' | 'open' | 'half-open' = 'closed';

  constructor(
    private readonly threshold: number = 5,
    private readonly resetTimeoutMs: number = 60000
  ) {}

  canExecute(): boolean {
    if (this.state === 'closed') return true;
    if (this.state === 'open') {
      if (Date.now() - this.lastFailureTime >= this.resetTimeoutMs) {
        this.state = 'half-open';
        return true;
      }
      return false;
    }
    return true; // half-open allows one request
  }

  onSuccess(): void {
    this.failures = 0;
    this.state = 'closed';
  }

  onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    if (this.failures >= this.threshold) {
      this.state = 'open';
    }
  }

  getState() {
    return this.state;
  }
}

export const llmCircuitBreaker = new CircuitBreaker();

export interface RetryOptions {
  maxRetries: number;
  baseDelayMs: number;
  maxDelayMs: number;
  retryOn?: (error: unknown) => boolean;
}

const DEFAULT_OPTIONS: RetryOptions = {
  maxRetries: 3,
  baseDelayMs: 500,
  maxDelayMs: 5000,
  retryOn: (err) => {
    if (err instanceof AnythingLLMError) {
      return [502, 503, 504, 429].includes(err.statusCode);
    }
    return false;
  },
};

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: Partial<RetryOptions> = {}
): Promise<T> {
  if (!llmCircuitBreaker.canExecute()) {
    throw new AnythingLLMError('Service temporarily unavailable (circuit open)', 503);
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };
  let lastError: unknown;

  for (let attempt = 0; attempt <= opts.maxRetries; attempt++) {
    try {
      const result = await fn();
      llmCircuitBreaker.onSuccess();
      return result;
    } catch (err) {
      lastError = err;
      if (attempt === opts.maxRetries || !opts.retryOn?.(err)) {
        llmCircuitBreaker.onFailure();
        throw err;
      }

      const delay = Math.min(opts.baseDelayMs * Math.pow(2, attempt), opts.maxDelayMs);
      const jitter = delay * (0.5 + Math.random() * 0.5);
      logger.warn(`Retry attempt ${attempt + 1}/${opts.maxRetries} after ${Math.round(jitter)}ms`);
      await new Promise((resolve) => setTimeout(resolve, jitter));
    }
  }
  llmCircuitBreaker.onFailure();
  throw lastError;
}
