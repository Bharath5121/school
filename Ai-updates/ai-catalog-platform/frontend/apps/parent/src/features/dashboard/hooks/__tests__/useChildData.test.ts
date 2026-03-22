import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useChildData } from '../useChildData';

const mockAccessToken = 'test-token-123';

vi.mock('@/store/app.store', () => ({
  useAppStore: vi.fn(() => ({ accessToken: mockAccessToken })),
}));

function mockFetchResponse(data: unknown, ok = true) {
  return vi.fn().mockResolvedValue({
    ok,
    json: () => Promise.resolve({ data }),
  });
}

describe('useChildData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it('starts in a loading state', () => {
    global.fetch = vi.fn().mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() =>
      useChildData<string[]>('child-1', 'grades')
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('fetches data successfully and clears loading', async () => {
    const mockData = [{ subject: 'Math', grade: 'A' }];
    global.fetch = mockFetchResponse(mockData);

    const { result } = renderHook(() =>
      useChildData<typeof mockData>('child-1', 'grades')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBeNull();
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/parent/child/child-1/grades',
      { headers: { Authorization: `Bearer ${mockAccessToken}` } }
    );
  });

  it('appends query params when provided', async () => {
    global.fetch = mockFetchResponse([]);

    const { result } = renderHook(() =>
      useChildData<unknown[]>('child-1', 'grades', { semester: 'fall' })
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/parent/child/child-1/grades?semester=fall',
      expect.any(Object)
    );
  });

  it('sets error on fetch failure', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false });

    const { result } = renderHook(() =>
      useChildData<unknown>('child-1', 'grades')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Failed to fetch');
    expect(result.current.data).toBeNull();
  });

  it('sets error on network exception', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() =>
      useChildData<unknown>('child-1', 'grades')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.data).toBeNull();
  });

  it('does not fetch when childId is empty', async () => {
    global.fetch = vi.fn();

    const { result } = renderHook(() =>
      useChildData<unknown>('', 'grades')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('exposes a refetch function', async () => {
    const mockData = { score: 95 };
    global.fetch = mockFetchResponse(mockData);

    const { result } = renderHook(() =>
      useChildData<typeof mockData>('child-1', 'score')
    );

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.refetch).toBeTypeOf('function');
  });
});
