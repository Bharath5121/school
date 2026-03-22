'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/app.store';
import { supabase } from '@/lib/supabase';
import { API_URL } from '@/lib/config';

interface LoginPayload {
  email: string;
  password: string;
}

export function useAuthController() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAppStore();
  const router = useRouter();

  const handleLogin = async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });

      if (authError) throw new Error(authError.message);
      if (!data.user || !data.session) throw new Error('Login failed');

      const profileRes = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${data.session.access_token}` },
      });
      
      let profile = null;
      if (profileRes.ok) {
        const profileData = await profileRes.json();
        profile = profileData.data;
      }

      const user = {
        id: data.user.id,
        name: profile?.name || data.user.user_metadata?.name || data.user.email?.split('@')[0] || '',
        email: data.user.email || '',
        role: profile?.role || data.user.user_metadata?.role || 'STUDENT',
        onboardingCompleted: profile?.onboardingCompleted || false,
        profile: { onboardingCompleted: profile?.onboardingCompleted || false, gradeLevel: profile?.gradeLevel },
      };

      setAuth(user, data.session.access_token);

      router.push('/discoveries');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (payload: Record<string, string>) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: authError } = await supabase.auth.signUp({
        email: payload.email,
        password: payload.password,
        options: {
          data: {
            name: payload.name,
            role: payload.role || 'STUDENT',
            gradeLevel: payload.gradeLevel || '',
          },
        },
      });

      if (authError) throw new Error(authError.message);
      if (!data.user) throw new Error('Registration failed');

      if (data.session) {
        const user = {
          id: data.user.id,
          name: payload.name,
          email: data.user.email || '',
          role: payload.role || 'STUDENT',
          onboardingCompleted: false,
          profile: { onboardingCompleted: false, gradeLevel: payload.gradeLevel },
        };
        setAuth(user, data.session.access_token);

        router.push('/discoveries');
      } else {
        router.push('/login?message=Check your email to confirm your account');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return { handleLogin, handleRegister, error, loading };
}
