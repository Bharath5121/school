'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/app.store';
import { supabase } from '@/lib/supabase';

interface LoginPayload {
  email: string;
  password: string;
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
        const { data, error: authError } = await supabase.auth.signInWithPassword({
          email: payload.email,
          password: payload.password,
        });

        if (authError || !data.user || !data.session) {
          throw new Error(authError?.message || 'Login failed');
        }

        const role = data.user.user_metadata?.role || 'STUDENT';
        if (role !== 'ADMIN') {
          await supabase.auth.signOut();
          throw new Error('Admin access required');
        }

        setAuth(
          {
            id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.full_name || data.user.email || '',
            role,
          },
          data.session.access_token
        );
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
    async (payload: Record<string, string>) => {
      setError(null);
      setLoading(true);
      try {
        const { data, error: authError } = await supabase.auth.signUp({
          email: payload.email!,
          password: payload.password!,
          options: {
            data: { full_name: payload.name || '', role: 'ADMIN' },
          },
        });

        if (authError || !data.user || !data.session) {
          throw new Error(authError?.message || 'Registration failed');
        }

        setAuth(
          {
            id: data.user.id,
            email: data.user.email || '',
            name: payload.name || data.user.email || '',
            role: 'ADMIN',
          },
          data.session.access_token
        );
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
