import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { restoreSession as restoreSessionService } from '@/features/auth/services/session.service';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
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
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isHydrated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      setAccessToken: (token) => set({ accessToken: token }),
      setAuth: (user, token) => set({ user, accessToken: token, isAuthenticated: true }),

      logout: async () => {
        set({ user: null, accessToken: null, isAuthenticated: false });
        if (typeof window !== 'undefined') localStorage.removeItem('ai-catalog-admin-auth');
        try {
          const { supabase } = await import('@/lib/supabase');
          await supabase.auth.signOut();
        } catch {}
      },

      restoreSession: async () => {
        const result = await restoreSessionService();
        if (result.success && result.user && result.accessToken) {
          set({ user: result.user, accessToken: result.accessToken, isAuthenticated: true, isHydrated: true });
        } else {
          set({ user: null, accessToken: null, isAuthenticated: false, isHydrated: true });
        }
      },
    }),
    {
      name: 'ai-catalog-admin-auth',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined' ? localStorage : { getItem: () => null, setItem: () => {}, removeItem: () => {} }
      ),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) state.restoreSession();
      },
    }
  )
);
