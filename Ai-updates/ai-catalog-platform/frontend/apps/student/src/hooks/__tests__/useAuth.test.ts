import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAuth } from '../useAuth';
import { useAppStore } from '../../store/app.store';

vi.mock('../../store/app.store');

const mockLogout = vi.fn();

const mockUser = {
  id: '1',
  name: 'Test Student',
  email: 'student@test.com',
  role: 'student',
};

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns expected shape with all properties', () => {
    vi.mocked(useAppStore).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isHydrated: true,
      logout: mockLogout,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current).toHaveProperty('user');
    expect(result.current).toHaveProperty('isAuthenticated');
    expect(result.current).toHaveProperty('isHydrated');
    expect(result.current).toHaveProperty('logout');
  });

  it('returns null user and isAuthenticated false when logged out', () => {
    vi.mocked(useAppStore).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isHydrated: true,
      logout: mockLogout,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
  });

  it('returns user data when authenticated', () => {
    vi.mocked(useAppStore).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isHydrated: true,
      logout: mockLogout,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.name).toBe('Test Student');
  });

  it('calls logout from the store', () => {
    vi.mocked(useAppStore).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isHydrated: true,
      logout: mockLogout,
    });

    const { result } = renderHook(() => useAuth());
    result.current.logout();

    expect(mockLogout).toHaveBeenCalledOnce();
  });

  it('reflects hydration state', () => {
    vi.mocked(useAppStore).mockReturnValue({
      user: null,
      isAuthenticated: false,
      isHydrated: false,
      logout: mockLogout,
    });

    const { result } = renderHook(() => useAuth());
    expect(result.current.isHydrated).toBe(false);
  });
});
