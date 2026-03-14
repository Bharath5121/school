'use client';

import React from 'react';

interface PageShellProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  children: React.ReactNode;
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 bg-slate-100 dark:bg-slate-800/60 rounded-lg w-48" />
      <div className="h-4 bg-slate-100 dark:bg-slate-800/40 rounded w-72" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-40 bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl border border-slate-200 dark:border-slate-800/40" />
        ))}
      </div>
    </div>
  );
}

function ErrorDisplay({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="max-w-5xl mx-auto py-12 text-center">
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8">
        <p className="text-red-400 text-lg font-medium">Something went wrong</p>
        <p className="text-slate-500 dark:text-slate-400 mt-2">{message}</p>
        <button
          onClick={onRetry || (() => window.location.reload())}
          className="mt-4 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-600 rounded-lg text-gray-900 dark:text-white transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export function PageShell({
  title,
  subtitle,
  actions,
  loading,
  error,
  onRetry,
  children,
}: PageShellProps) {
  if (error) return <ErrorDisplay message={error} onRetry={onRetry} />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">{title}</h1>
          {subtitle && <p className="text-slate-600 dark:text-slate-500 text-sm mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
      </div>

      {loading ? <LoadingSkeleton /> : children}
    </div>
  );
}
