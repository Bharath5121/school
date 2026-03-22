import { logger } from '../../shared/logger/logger';

const BASE_URL = process.env.ANYTHINGLLM_BASE_URL || 'http://anythingllm:3001';
const API_KEY = () => process.env.ANYTHINGLLM_API_KEY || '';

interface RequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
  isFormData?: boolean;
}

export async function anythingllmFetch<T = any>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const url = `${BASE_URL}/api/v1${path}`;
  const { method = 'GET', body, headers = {}, isFormData = false } = options;

  const fetchHeaders: Record<string, string> = {
    Authorization: `Bearer ${API_KEY()}`,
    ...headers,
  };

  if (!isFormData && body) {
    fetchHeaders['Content-Type'] = 'application/json';
  }

  const fetchOptions: RequestInit = {
    method,
    headers: fetchHeaders,
    body: isFormData ? body : body ? JSON.stringify(body) : undefined,
  };

  logger.info(`AnythingLLM ${method} ${path}`);

  const res = await fetch(url, fetchOptions);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    logger.error(`AnythingLLM error: ${res.status} ${text}`);
    throw new Error(`AnythingLLM API error: ${res.status} ${text}`);
  }

  const json = await res.json();
  return json as T;
}

export async function isAnythingLLMHealthy(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/auth`, {
      headers: { Authorization: `Bearer ${API_KEY()}` },
    });
    return res.ok;
  } catch {
    return false;
  }
}
