'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function DashboardError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('[DashboardError]', error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 mb-6">
        <span className="text-2xl">!</span>
      </div>
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Something went wrong</h2>
      <p className="text-black/50 dark:text-white/50 mb-8 max-w-md mx-auto">
        {error.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-400 transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/discoveries"
          className="px-6 py-3 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-white/70 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
