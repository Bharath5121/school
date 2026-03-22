'use client';

import type { DiscoveryDetail } from '../../types';

interface Props {
  discovery: DiscoveryDetail;
}

export function NotebookTab({ discovery }: Props) {
  if (!discovery.notebookLmUrl) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-white/30">
        <p className="text-4xl mb-3 opacity-40">📓</p>
        <p className="font-medium">No notebook available for this discovery</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {discovery.notebookDescription && (
        <div className="bg-blue-50/50 dark:bg-blue-500/5 rounded-xl p-5 border border-blue-100 dark:border-blue-500/10">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-2">About this Notebook</h3>
          <p className="text-sm text-gray-600 dark:text-white/60 leading-relaxed">{discovery.notebookDescription}</p>
        </div>
      )}

      <a
        href={discovery.notebookLmUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-500/10 dark:to-sky-500/10 rounded-xl border border-blue-200 dark:border-blue-500/20 hover:shadow-lg hover:shadow-blue-500/10 transition-all group"
      >
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shadow-sm">
          <span className="text-xl">📓</span>
        </div>
        <div className="flex-1">
          <p className="font-bold text-blue-800 dark:text-blue-300 text-sm">Open in NotebookLM</p>
          <p className="text-xs text-blue-600/70 dark:text-blue-400/50 mt-0.5">Interactive AI-powered notebook experience</p>
        </div>
        <svg className="w-5 h-5 text-blue-500 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </a>
    </div>
  );
}
