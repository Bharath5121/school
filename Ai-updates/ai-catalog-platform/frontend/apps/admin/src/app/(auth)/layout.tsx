'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/app.store';

function getRedirectForRole(role?: string): string {
  switch (role) {
    case 'ADMIN': return '/dashboard';
    case 'STUDENT': return '/today';
    case 'PARENT': return '/parent/today';
    default: return '/dashboard';
  }
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isHydrated, user } = useAppStore();
  const router = useRouter();

  useEffect(() => {
    if (isHydrated && isAuthenticated) {
      router.replace(getRedirectForRole(user?.role));
    }
  }, [isHydrated, isAuthenticated, user?.role, router]);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) return null;
  return <>{children}</>;
}
