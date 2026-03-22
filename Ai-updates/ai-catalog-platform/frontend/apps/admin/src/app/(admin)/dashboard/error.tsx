'use client';
import Link from 'next/link';
import { useEffect } from 'react';

export default function PageError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="text-center py-16">
      <h2 className="text-lg font-bold mb-2 text-gray-900 dark:text-white">Failed to load this page</h2>
      <p className="text-sm text-gray-500 dark:text-white/50 mb-6">{error.message || 'Something went wrong.'}</p>
      <div className="flex items-center justify-center gap-4">
        <button onClick={reset} className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-400">Try Again</button>
        <Link href="/dashboard" className="px-5 py-2.5 border border-gray-200 dark:border-white/10 text-sm rounded-xl">Back to Dashboard</Link>
      </div>
    </div>
  );
}
