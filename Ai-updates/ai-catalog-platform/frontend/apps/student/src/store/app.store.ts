import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { supabase } from '@/lib/supabase';
import { API_URL } from '@/lib/config';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  gradeLevel?: string;
  onboardingCompleted?: boolean;
  profile?: {
    onboardingCompleted: boolean;
    gradeLevel?: string;
  };
}

interface AppState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  restoreSession: () => Promise<void>;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isHydrated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      setAccessToken: (token) => void set({ accessToken: token }),
      setAuth: (user, token) =>
        set({ user, accessToken: token, isAuthenticated: true }),

      logout: async () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('ai-catalog-auth');
        }
        await supabase.auth.signOut();
      },

      restoreSession: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            let profile = null;
            try {
              const res = await fetch(`${API_URL}/auth/me`, {
                headers: { Authorization: `Bearer ${session.access_token}` },
              });
              if (res.ok) {
                const json = await res.json();
                profile = json.data;
              }
            } catch { /* profile fetch is best-effort */ }

            const user: User = {
              id: session.user.id,
              name: profile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
              email: session.user.email || '',
              role: profile?.role || 'STUDENT',
              onboardingCompleted: profile?.onboardingCompleted || false,
              profile: {
                onboardingCompleted: profile?.onboardingCompleted || false,
                gradeLevel: profile?.gradeLevel,
              },
            };
            set({ user, accessToken: session.access_token, isAuthenticated: true, isHydrated: true });
          } else {
            set({ user: null, accessToken: null, isAuthenticated: false, isHydrated: true });
          }
        } catch {
          set({ user: null, accessToken: null, isAuthenticated: false, isHydrated: true });
        }
      },
    }),
    {
      name: 'ai-catalog-auth',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        }
      ),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.restoreSession();
        }
      },
    }
  )
);
