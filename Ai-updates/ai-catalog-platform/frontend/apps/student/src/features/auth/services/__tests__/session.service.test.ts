import { describe, it, expect, vi, beforeEach } from 'vitest';
import { restoreSession } from '../session.service';

vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
    },
  },
}));

import { supabase } from '@/lib/supabase';

const mockFetch = vi.fn();
globalThis.fetch = mockFetch as unknown as typeof fetch;

const MOCK_SUPABASE_USER = {
  id: 'u1',
  email: 'test@example.com',
  user_metadata: { name: 'Meta Name', role: 'STUDENT' },
};

const MOCK_SESSION = {
  access_token: 'mock-access-token',
  user: MOCK_SUPABASE_USER,
};

beforeEach(() => {
  vi.mocked(supabase.auth.getSession).mockReset();
  mockFetch.mockReset();
});

describe('restoreSession', () => {
  it('returns success: false when there is no session', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: null },
      error: null,
    });
    const result = await restoreSession();
    expect(result).toEqual({ success: false });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it('returns user and token when session + /me succeed', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: MOCK_SESSION },
      error: null,
    });
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          name: 'Profile Name',
          role: 'STUDENT',
          onboardingCompleted: true,
          gradeLevel: '10',
        },
      }),
    });

    const result = await restoreSession();
    expect(result.success).toBe(true);
    expect(result.accessToken).toBe('mock-access-token');
    expect(result.user).toMatchObject({
      id: 'u1',
      email: 'test@example.com',
      name: 'Profile Name',
      role: 'STUDENT',
      onboardingCompleted: true,
      profile: { onboardingCompleted: true, gradeLevel: '10' },
    });
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('/auth/me'),
      expect.objectContaining({
        headers: { Authorization: 'Bearer mock-access-token' },
      })
    );
  });

  it('falls back to user_metadata when /me is not ok', async () => {
    vi.mocked(supabase.auth.getSession).mockResolvedValue({
      data: { session: MOCK_SESSION },
      error: null,
    });
    mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

    const result = await restoreSession();
    expect(result.success).toBe(true);
    expect(result.user?.name).toBe('Meta Name');
    expect(result.user?.role).toBe('STUDENT');
  });

  it('returns success: false when getSession throws', async () => {
    vi.mocked(supabase.auth.getSession).mockRejectedValueOnce(new Error('network'));
    const result = await restoreSession();
    expect(result).toEqual({ success: false });
  });
});
