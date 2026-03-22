'use client';

import Link from 'next/link';
import { SaveButton } from '@/features/my-stuff/components/SaveButton';
import type { DiscoveryCard as DiscoveryCardType } from '../types';

interface Props {
  discovery: DiscoveryCardType;
  variant?: 'featured' | 'default';
}

export function DiscoveryCard({ discovery }: Props) {
  const hasVideo = !!discovery.videoUrl;
  const hasNotebook = !!discovery.notebookLmUrl;
  const hasArchitecture = !!discovery.architectureDescription;
  const linkCount = discovery._count?.links ?? 0;

  return (
    <Link href={`/discoveries/${discovery.slug}`}>
      <div className="group relative rounded-2xl border border-emerald-100/80 dark:border-emerald-500/15 bg-gradient-to-br from-emerald-50/70 via-green-50/40 to-white dark:from-emerald-500/[0.06] dark:via-green-500/[0.03] dark:to-transparent p-5 hover:shadow-lg hover:shadow-emerald-100/50 dark:hover:shadow-none hover:border-emerald-200 dark:hover:border-emerald-500/25 transition-all duration-200 overflow-hidden h-full">
        <div className="relative space-y-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {discovery.industry && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200/50 dark:border-emerald-500/20">
                {discovery.industry.icon} {discovery.industry.name}
              </span>
            )}
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              +{discovery.xp} XP
            </span>
            <div className="ml-auto">
              <SaveButton contentType="discovery" contentId={discovery.id} title={discovery.title} metadata={{ slug: discovery.slug }} />
            </div>
          </div>

          <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
            {discovery.title}
          </h3>

          <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed line-clamp-2">
            {discovery.summary}
          </p>

          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {hasVideo && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-500/20">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Watch
              </span>
            )}
            {hasNotebook && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200/50 dark:border-emerald-500/20">
                📓 Notebook
              </span>
            )}
            {hasArchitecture && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg bg-teal-50 dark:bg-teal-500/10 text-teal-600 dark:text-teal-400 border border-teal-200/50 dark:border-teal-500/20">
                🏗️ Architecture
              </span>
            )}
            {linkCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200/50 dark:border-green-500/20">
                🔗 {linkCount} linked
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 pt-1 group-hover:gap-2 transition-all">
            Open
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
