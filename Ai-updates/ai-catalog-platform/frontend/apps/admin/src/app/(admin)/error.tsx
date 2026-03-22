'use client';
import Link from 'next/link';
import { useEffect } from 'react';

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">Something went wrong</h2>
      <p className="text-sm text-gray-500 dark:text-white/50 mb-6">{error.message}</p>
      <div className="flex items-center justify-center gap-4">
        <button onClick={reset} className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-400">Try Again</button>
        <Link href="/dashboard" className="px-5 py-2.5 border border-gray-200 dark:border-white/10 text-sm rounded-xl">Back to Dashboard</Link>
      </div>
    </div>
  );
}
