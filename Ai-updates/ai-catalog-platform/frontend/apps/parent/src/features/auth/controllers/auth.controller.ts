'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/app.store';
import { API_URL } from '@/lib/config';

interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  [key: string]: string;
}

export function useAuthController() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const setAuth = useAppStore((s) => s.setAuth);
  const router = useRouter();

  const handleLogin = useCallback(
    async (payload: LoginPayload) => {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Login failed');

        const { user, accessToken } = json.data;
        setAuth(user, accessToken);
        router.push('/dashboard');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Login failed');
      } finally {
        setLoading(false);
      }
    },
    [setAuth, router],
  );

  const handleRegister = useCallback(
    async (payload: RegisterPayload) => {
      setError(null);
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.message || 'Registration failed');

        const { user, accessToken } = json.data;
        setAuth(user, accessToken);
        router.push('/dashboard');
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Registration failed');
      } finally {
        setLoading(false);
      }
    },
    [setAuth, router],
  );

  return { handleLogin, handleRegister, error, loading };
}
