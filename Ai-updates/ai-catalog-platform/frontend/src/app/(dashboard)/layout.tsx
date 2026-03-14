'use client';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Sidebar } from '@/components/layout/sidebar/Sidebar';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { isAuthenticated, isHydrated } = useAuth();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isHydrated, router]);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);
  const toggleSidebar = useCallback(() => setSidebarOpen(prev => !prev), []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B0F19] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100">
      <Navbar onMenuToggle={toggleSidebar} />
      <Sidebar open={sidebarOpen} onClose={closeSidebar} />
      <div className="pt-16">
        <main className="max-w-5xl mx-auto px-6 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
