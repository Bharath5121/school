import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { API_URL } from '@/lib/config';
import axios from 'axios';

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
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isHydrated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),
      setAccessToken: (token) => set({ accessToken: token }),
      setAuth: (user, token) =>
        set({ user, accessToken: token, isAuthenticated: true }),

      logout: async () => {
        const { accessToken } = get();
        set({ user: null, accessToken: null, isAuthenticated: false });
        if (typeof window !== 'undefined') {
          localStorage.removeItem('ai-catalog-auth');
        }
        if (accessToken) {
          try {
            await fetch(`${API_URL}/auth/logout`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${accessToken}` },
              credentials: 'include',
            });
          } catch {
            // Backend logout is best-effort; local state is already cleared
          }
        }
      },

      restoreSession: async () => {
        const { accessToken } = get();
        if (!accessToken) {
          set({ isHydrated: true });
          return;
        }

        try {
          const res = await fetch(`${API_URL}/auth/me`, {
            headers: { Authorization: `Bearer ${accessToken}` },
          });

          if (res.ok) {
            const json = await res.json();
            const user = json.data?.user || json.data;
            set({ user, isAuthenticated: true, isHydrated: true });
            return;
          }

          if (res.status === 401) {
            try {
              const refreshRes = await axios.post(
                `${API_URL}/auth/refresh`,
                {},
                { withCredentials: true }
              );
              const newToken = refreshRes.data?.data?.accessToken;
              if (newToken) {
                set({ accessToken: newToken });
                const retryRes = await fetch(`${API_URL}/auth/me`, {
                  headers: { Authorization: `Bearer ${newToken}` },
                });
                if (retryRes.ok) {
                  const json = await retryRes.json();
                  const user = json.data?.user || json.data;
                  set({ user, isAuthenticated: true, isHydrated: true });
                  return;
                }
              }
            } catch {
              // Refresh failed — clear session
            }
          }

          set({ user: null, accessToken: null, isAuthenticated: false, isHydrated: true });
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
        accessToken: state.accessToken,
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
