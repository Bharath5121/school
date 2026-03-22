'use client';

import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { useBasicsChapters } from '../hooks/useBasics';
import { SaveButton } from '@/features/my-stuff/components/SaveButton';
import type { BasicsTopicSummary } from '../types/basics.types';

function TopicCard({ topic }: { topic: BasicsTopicSummary }) {
  const hasVideos = topic._count?.videos > 0 || !!topic.videoUrl;
  const hasNotebook = !!topic.notebookLmUrl;
  const hasArchitecture = !!topic.architectureDescription;
  const linkedCount = topic._count?.links || 0;

  return (
    <Link href={`/basics/${topic.slug}`}>
      <div className="group relative rounded-2xl border border-emerald-100/80 dark:border-emerald-500/15 bg-gradient-to-br from-emerald-50/70 via-green-50/40 to-white dark:from-emerald-500/[0.06] dark:via-green-500/[0.03] dark:to-transparent p-5 hover:shadow-lg hover:shadow-emerald-100/50 dark:hover:shadow-none hover:border-emerald-200 dark:hover:border-emerald-500/25 transition-all duration-200 overflow-hidden h-full">
        <div className="relative space-y-3">
          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 capitalize">
              {topic.difficulty}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
              +{topic.xp} XP
            </span>
            <div className="ml-auto">
              <SaveButton contentType="basic" contentId={topic.id} title={topic.title} metadata={{ slug: topic.slug }} />
            </div>
          </div>

          {/* Title */}
          <h3 className="text-[15px] font-bold text-gray-900 dark:text-white leading-snug line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
            {topic.title}
          </h3>

          {/* Summary */}
          <p className="text-xs text-gray-500 dark:text-white/50 leading-relaxed line-clamp-2">
            {topic.tagline}
          </p>

          {/* Content badges */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            {hasVideos && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200/50 dark:border-red-500/20">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                Watch
              </span>
            )}
            {hasNotebook && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg bg-violet-50 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-200/50 dark:border-violet-500/20">
                📓 Notebook
              </span>
            )}
            {hasArchitecture && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-200/50 dark:border-purple-500/20">
                🏗️ Architecture
              </span>
            )}
            {linkedCount > 0 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20">
                🔗 {linkedCount} linked
              </span>
            )}
          </div>

          {/* Open CTA */}
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

export const BasicsSection = () => {
  const { chapters, loading } = useBasicsChapters();

  if (loading) {
    return (
      <div className="space-y-5">
        <div className="text-center space-y-2">
          <div className="h-8 w-40 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg mx-auto animate-pulse" />
          <div className="h-4 w-72 bg-gray-100 dark:bg-slate-800 rounded mx-auto animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-52 rounded-2xl bg-gray-50 dark:bg-white/[0.02] border border-gray-200/80 dark:border-white/10 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-5 shadow-lg shadow-emerald-500/15">
        <div className="flex items-center gap-3">
          <BookOpen size={20} className="text-white/90" />
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight">AI Basics</h1>
            <p className="text-emerald-100 text-[11px] mt-0.5">Learn AI from the ground up &mdash; chapter by chapter, at your own pace.</p>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-emerald-50/60 dark:bg-emerald-500/[0.06] border border-emerald-100/70 dark:border-emerald-500/15 rounded-xl px-4 py-2.5">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
            0 of {chapters.length} chapters completed
          </span>
          <span className="text-emerald-600/60 dark:text-emerald-400/60 font-medium">0%</span>
        </div>
        <div className="h-1.5 bg-emerald-100 dark:bg-emerald-500/20 rounded-full overflow-hidden">
          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '0%' }} />
        </div>
      </div>

      {/* Chapters */}
      {chapters.map((chapter, chIdx) => (
        <section key={chapter.id} className="space-y-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              {chIdx + 1}
            </div>
            <div>
              <h2 className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                Chapter {chIdx + 1}: {chapter.title}
              </h2>
              {chapter.description && (
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{chapter.description}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chapter.topics.map((topic) => (
              <TopicCard key={topic.id} topic={topic} />
            ))}
          </div>
        </section>
      ))}

      {chapters.length === 0 && (
        <div className="text-center py-16 bg-gray-50/50 dark:bg-white/[0.02] rounded-2xl border border-gray-200/80 dark:border-white/10">
          <p className="text-4xl mb-3">📚</p>
          <h3 className="text-lg font-semibold text-gray-700 dark:text-white/60 mb-1">No chapters available yet</h3>
          <p className="text-sm text-gray-500 dark:text-white/40">Check back soon for new learning content!</p>
        </div>
      )}
    </div>
  );
};
