import { API_URL } from './config';

let getToken: (() => string | null) | null = null;
let refreshTokenFn: (() => Promise<string | null>) | null = null;
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

export function initApiClient(
  tokenGetter: () => string | null,
  tokenRefresher: () => Promise<string | null>
) {
  getToken = tokenGetter;
  refreshTokenFn = tokenRefresher;
}

class ApiError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (res.ok) return res.json();
  
  let body: any;
  try { body = await res.json(); } catch { body = null; }
  
  throw new ApiError(
    res.status,
    body?.message || `Request failed: ${res.status}`,
    body?.code
  );
}

interface RequestOptions extends Omit<RequestInit, 'headers'> {
  token?: string;
  timeout?: number;
  skipAuth?: boolean;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { token: explicitToken, timeout = 30000, skipAuth = false, ...fetchOpts } = options;

  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  const authToken = explicitToken || (skipAuth ? null : getToken?.());
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  if (options.signal) {
    options.signal.addEventListener('abort', () => controller.abort());
  }

  try {
    const res = await fetch(`${API_URL}${path}`, {
      credentials: 'include',
      headers,
      signal: controller.signal,
      ...fetchOpts,
    });

    if (res.status === 401 && !skipAuth && refreshTokenFn) {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshTokenFn().finally(() => { isRefreshing = false; });
      }

      const newToken = await refreshPromise;
      if (newToken) {
        headers['Authorization'] = `Bearer ${newToken}`;
        const retryRes = await fetch(`${API_URL}${path}`, {
          credentials: 'include',
          headers,
          signal: controller.signal,
          ...fetchOpts,
        });
        return handleResponse<T>(retryRes);
      }

      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
      throw new ApiError(401, 'Session expired. Redirecting to login.', 'SESSION_EXPIRED');
    }

    return handleResponse<T>(res);
  } finally {
    clearTimeout(timeoutId);
  }
}

export const apiClient = {
  get<T>(path: string, opts?: RequestOptions) {
    return request<T>(path, { method: 'GET', ...opts });
  },
  post<T>(path: string, data?: unknown, opts?: RequestOptions) {
    return request<T>(path, { method: 'POST', body: data ? JSON.stringify(data) : undefined, ...opts });
  },
  put<T>(path: string, data?: unknown, opts?: RequestOptions) {
    return request<T>(path, { method: 'PUT', body: data ? JSON.stringify(data) : undefined, ...opts });
  },
  patch<T>(path: string, data?: unknown, opts?: RequestOptions) {
    return request<T>(path, { method: 'PATCH', body: data ? JSON.stringify(data) : undefined, ...opts });
  },
  delete<T>(path: string, opts?: RequestOptions) {
    return request<T>(path, { method: 'DELETE', ...opts });
  },
};

export { ApiError };
