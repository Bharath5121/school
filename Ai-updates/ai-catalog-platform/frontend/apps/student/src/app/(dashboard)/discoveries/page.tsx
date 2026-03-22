'use client';

import { Suspense } from 'react';
import { DiscoveriesPage } from '@/features/discoveries/components/DiscoveriesPage';

export default function Page() {
  return (
    <Suspense fallback={<div className="animate-pulse py-12 text-center text-gray-400">Loading...</div>}>
      <DiscoveriesPage />
    </Suspense>
  );
}
