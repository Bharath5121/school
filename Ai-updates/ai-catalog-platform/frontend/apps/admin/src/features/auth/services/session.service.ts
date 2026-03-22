import { useAppStore } from '@/store/app.store';
import { supabase } from '@/lib/supabase';

interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

export interface SessionResult {
  success: boolean;
  user: SessionUser | null;
  accessToken: string | null;
}

export async function restoreSession(): Promise<SessionResult> {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.user) {
      return { success: false, user: null, accessToken: null };
    }

    const role = session.user.user_metadata?.role || 'STUDENT';
    if (role !== 'ADMIN') {
      return { success: false, user: null, accessToken: null };
    }

    return {
      success: true,
      user: {
        id: session.user.id,
        email: session.user.email || '',
        name: session.user.user_metadata?.full_name || session.user.email || '',
        role,
      },
      accessToken: session.access_token,
    };
  } catch {
    return { success: false, user: null, accessToken: null };
  }
}

export const sessionService = {
  getSession: async (): Promise<SessionUser | null> => {
    const result = await restoreSession();
    return result.user;
  },

  isAuthenticated: (): boolean => {
    return !!useAppStore.getState().accessToken;
  },

  clearSession: async () => {
    useAppStore.getState().logout();
    await supabase.auth.signOut();
  },
};
