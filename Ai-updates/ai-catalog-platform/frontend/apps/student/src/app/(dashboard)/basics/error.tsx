'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function PageError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-500/10 mb-6">
        <span className="text-2xl">!</span>
      </div>
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Failed to load this page</h2>
      <p className="text-black/50 dark:text-white/50 mb-8 max-w-md mx-auto text-sm">
        {error.message || 'Something went wrong. Please try again.'}
      </p>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={reset}
          className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-400 transition-colors"
        >
          Try Again
        </button>
        <Link
          href="/discoveries"
          className="px-5 py-2.5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 text-sm font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
