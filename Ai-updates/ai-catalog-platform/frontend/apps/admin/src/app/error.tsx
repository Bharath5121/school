'use client';
import Link from 'next/link';
export default function RootError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center">
      <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
      <p className="text-sm text-gray-500 mb-4">{error.message}</p>
      <div className="flex gap-3">
        <button onClick={reset} className="px-4 py-2 bg-emerald-500 text-white text-sm rounded-xl">Try Again</button>
        <Link href="/dashboard" className="px-4 py-2 border border-gray-200 text-sm rounded-xl">Dashboard</Link>
      </div>
    </div>
  );
}
