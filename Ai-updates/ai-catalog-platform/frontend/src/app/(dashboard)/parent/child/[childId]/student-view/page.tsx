'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/store/app.store';

interface StudentDashData {
  user: { name: string; interests: string[]; gradeLevel: string | null };
  topStory: { id: string; title: string; field: string; type: string; summary: string | null } | null;
  trending: { id: string; title: string; views: number }[];
  fieldFeeds: Record<string, { id: string; title: string; type: string; field: string; summary: string | null }[]>;
  recentFeed: { id: string; title: string; type: string; field: string; summary: string | null; publishedAt: string }[];
}

export default function StudentViewPage() {
  const params = useParams();
  const childId = params.childId as string;
  const { accessToken } = useAppStore();
  const [data, setData] = useState<StudentDashData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!accessToken || !childId) return;
    (async () => {
      try {
        const res = await fetch(`/api/parent/child/${childId}/student-dashboard`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        if (!res.ok) throw new Error('Failed');
        const json = await res.json();
        setData(json.data);
      } catch {
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [accessToken, childId]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-16 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
        <div className="h-64 bg-slate-100 dark:bg-slate-800/50 rounded-2xl" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Unable to load student view.</p>
        <Link href={`/parent/child/${childId}`} className="text-blue-500 text-sm mt-2 inline-block">Back to Overview</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Parent Mode Banner */}
      <div className="p-4 rounded-2xl bg-amber-100/60 dark:bg-amber-500/[0.06] border border-amber-200 dark:border-amber-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-lg">👁️</span>
          <div>
            <p className="text-sm font-bold text-amber-800 dark:text-amber-300">
              Viewing as {data.user.name} &mdash; Parent Mode
            </p>
            <p className="text-[10px] text-amber-600/60">This is a read-only view of what your child sees</p>
          </div>
        </div>
        <Link href={`/parent/child/${childId}`}
          className="px-4 py-2 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 transition-all">
          Back to Overview
        </Link>
      </div>

      {/* Student Dashboard Content */}
      <div className="p-6 rounded-2xl bg-blue-100/60 dark:bg-blue-500/[0.06] border border-blue-200 dark:border-blue-500/20">
        <h1 className="text-xl font-black text-gray-900 dark:text-white mb-1">{data.user.name}&apos;s Dashboard</h1>
        {data.user.gradeLevel && <p className="text-xs text-slate-500 mb-2">Field: {data.user.gradeLevel}</p>}
        {data.user.interests.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {data.user.interests.map(i => (
              <span key={i} className="px-2 py-0.5 rounded-full bg-blue-200/40 dark:bg-blue-500/10 text-[10px] font-bold text-blue-700 dark:text-blue-400">
                {i}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Top Story */}
      {data.topStory && (
        <div className="p-5 rounded-2xl bg-emerald-100/60 dark:bg-emerald-500/[0.06] border border-emerald-200 dark:border-emerald-500/20">
          <div className="flex gap-2 mb-2">
            <span className="text-[9px] font-black uppercase text-emerald-600/60 tracking-widest">{data.topStory.type}</span>
            <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{data.topStory.field}</span>
          </div>
          <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1">{data.topStory.title}</h3>
          {data.topStory.summary && <p className="text-xs text-slate-500 line-clamp-2">{data.topStory.summary}</p>}
        </div>
      )}

      {/* Trending */}
      {data.trending.length > 0 && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Trending</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.trending.map(item => (
              <div key={item.id} className="p-4 rounded-xl bg-amber-100/60 dark:bg-amber-500/[0.06] border border-amber-200 dark:border-amber-500/20">
                <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{item.title}</p>
                <p className="text-[10px] text-slate-400 mt-1">{item.views} views</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Field Feeds */}
      {Object.entries(data.fieldFeeds).map(([field, items]) => (
        items.length > 0 && (
          <section key={field}>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">{field}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {items.map(item => (
                <div key={item.id} className="p-4 rounded-xl bg-cyan-100/60 dark:bg-cyan-500/[0.06] border border-cyan-200 dark:border-cyan-500/20">
                  <div className="flex gap-2 mb-1">
                    <span className="text-[9px] font-black uppercase text-cyan-600/60 tracking-widest">{item.type}</span>
                  </div>
                  <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{item.title}</p>
                  {item.summary && <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">{item.summary}</p>}
                </div>
              ))}
            </div>
          </section>
        )
      ))}

      {/* Recent Feed */}
      {data.recentFeed.length > 0 && (
        <section>
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-3">Recent Content</h3>
          <div className="space-y-2">
            {data.recentFeed.map(item => (
              <div key={item.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-700/30 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">{item.title}</p>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-[10px] text-slate-400 uppercase">{item.type}</span>
                    <span className="text-[10px] text-slate-400">{item.field}</span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(item.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
