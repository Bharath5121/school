'use client';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/sidebar/Sidebar';
import { useAuth } from '@/hooks/useAuth';
import { onboardingApi } from '@/features/onboarding-flow/services/onboarding.api';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [onboardingChecked, setOnboardingChecked] = useState(false);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isHydrated, router]);

  useEffect(() => {
    if (!isHydrated || !isAuthenticated) return;
    onboardingApi.getStatus().then(status => {
      if (status && !status.onboardingCompleted) {
        router.push('/onboarding');
      } else {
        setOnboardingChecked(true);
      }
    }).catch(() => setOnboardingChecked(true));
  }, [isHydrated, isAuthenticated, router]);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);

  if (!isHydrated || !onboardingChecked) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B0F19] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100">
      <Navbar />
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      <div className="pt-16">
        <div className="pl-3 py-2">
          <button
            onClick={toggleSidebar}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
            Menu
          </button>
        </div>
        <main className="max-w-[1200px] mx-auto px-6 pb-4">
          {children}
        </main>
      </div>
    </div>
  );
}
