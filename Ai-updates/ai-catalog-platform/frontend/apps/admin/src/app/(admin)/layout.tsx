'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/app.store';
import { initApiClient } from '@/lib/api-client';
import { supabase } from '@/lib/supabase';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminNavbar } from '@/components/layout/AdminNavbar';

let _apiInitialized = false;
if (typeof window !== 'undefined' && !_apiInitialized) {
  initApiClient(
    () => useAppStore.getState().accessToken,
    async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        useAppStore.getState().setAccessToken(session.access_token);
        return session.access_token;
      }
      return null;
    }
  );
  _apiInitialized = true;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isHydrated, user } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) router.replace('/login');
    if (isHydrated && isAuthenticated && user?.role !== 'ADMIN') router.replace('/login');
  }, [isHydrated, isAuthenticated, user?.role, router]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== 'ADMIN') return null;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-[#080C14]">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
