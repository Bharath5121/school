import { supabase } from '@/lib/supabase';
import { API_URL } from '@/lib/config';

interface SessionResult {
  success: boolean;
  user?: any;
  accessToken?: string;
}

export async function restoreSession(): Promise<SessionResult> {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return { success: false };

    let profile = null;
    try {
      const res = await fetch(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const json = await res.json();
        profile = json.data;
      }
    } catch { /* best-effort */ }

    return {
      success: true,
      user: {
        id: session.user.id,
        name: profile?.name || session.user.user_metadata?.name || session.user.email?.split('@')[0] || '',
        email: session.user.email || '',
        role: profile?.role || session.user.user_metadata?.role || 'STUDENT',
        onboardingCompleted: profile?.onboardingCompleted || false,
        profile: {
          onboardingCompleted: profile?.onboardingCompleted || false,
          gradeLevel: profile?.gradeLevel,
        },
      },
      accessToken: session.access_token,
    };
  } catch {
    return { success: false };
  }
}
