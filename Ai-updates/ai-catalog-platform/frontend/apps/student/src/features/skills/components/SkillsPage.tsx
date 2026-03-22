'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Zap } from 'lucide-react';
import { useMySkills } from '../hooks/useSkills';
import type { SkillSummary } from '../types/skills.types';
import { SaveButton } from '@/features/my-stuff/components/SaveButton';

const LEVEL_STYLE: Record<string, string> = {
  BEGINNER: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  INTERMEDIATE: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  ADVANCED: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300',
};

function SkillCard({ skill }: { skill: SkillSummary }) {
  return (
    <Link href={`/skills/${skill.id}`} className="group">
      <article className="h-full rounded-2xl border border-emerald-100/80 dark:border-emerald-500/15 bg-gradient-to-br from-emerald-50/70 via-green-50/40 to-white dark:from-emerald-500/[0.06] dark:via-green-500/[0.03] dark:to-transparent p-5 hover:shadow-lg hover:shadow-emerald-100/50 dark:hover:shadow-none hover:border-emerald-200 dark:hover:border-emerald-500/25 transition-all duration-200">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-md">
              <Zap size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white line-clamp-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-300 transition-colors">
                {skill.name}
              </h3>
              <p className="text-[11px] text-gray-500 dark:text-slate-400">{skill.industry.icon} {skill.industry.name}</p>
            </div>
          </div>
          <span className={`text-[10px] px-2 py-1 rounded-full font-semibold shrink-0 ${LEVEL_STYLE[skill.level] || LEVEL_STYLE.BEGINNER}`}>
            {skill.level}
          </span>
          <SaveButton contentType="skill" contentId={skill.id} title={skill.name} />
        </div>

        <p className="text-sm text-gray-600 dark:text-slate-300 line-clamp-3 mb-3">{skill.description}</p>

        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-300">
            {skill.timeToLearn}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100/70 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300">
            {skill.category}
          </span>
        </div>
      </article>
    </Link>
  );
}

export function SkillsPage() {
  const { industries, skills, loading } = useMySkills();
  const [activeTab, setActiveTab] = useState<string>('all');

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-56 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg animate-pulse mx-auto" />
        <div className="flex gap-2 justify-center">{[1, 2, 3].map((i) => <div key={i} className="h-10 w-28 rounded-full bg-emerald-50 dark:bg-emerald-500/10 animate-pulse" />)}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1, 2, 3, 4].map((i) => <div key={i} className="h-44 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 animate-pulse" />)}</div>
      </div>
    );
  }

  if (industries.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg">
          <Zap size={28} className="text-white" />
        </div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No Skills Yet</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 max-w-sm mx-auto">
          Skills will appear here based on your selected industries.
        </p>
      </div>
    );
  }

  const filtered = activeTab === 'all' ? skills : skills.filter((s) => s.industrySlug === activeTab);

  const grouped = filtered.reduce<Record<string, SkillSummary[]>>((acc, s) => {
    const cat = s.category || 'General';
    (acc[cat] ??= []).push(s);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-6 py-5 shadow-lg shadow-emerald-500/15">
        <div className="flex items-center gap-3">
          <Zap size={20} className="text-white/90" />
          <div>
            <h1 className="text-lg font-extrabold text-white tracking-tight">Skills</h1>
            <p className="text-emerald-100 text-[11px] mt-0.5">AI & future skills you need to master in your industry</p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 flex-wrap">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
            activeTab === 'all'
              ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
              : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-gray-200 dark:hover:bg-white/10'
          }`}
        >
          All ({skills.length})
        </button>
        {industries.map((ind) => {
          const count = skills.filter((s) => s.industrySlug === ind.slug).length;
          return (
            <button
              key={ind.slug}
              onClick={() => setActiveTab(ind.slug)}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-all flex items-center gap-1.5 ${
                activeTab === ind.slug
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-white/40 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              <span>{ind.icon}</span> {ind.name}
              <span className={`text-[11px] px-1.5 py-0.5 rounded-full ${activeTab === ind.slug ? 'bg-white/25' : 'bg-gray-200 dark:bg-white/10'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-14">
          <p className="text-sm text-gray-400 dark:text-slate-500">No skills in this category yet.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400/70 pl-1">{category}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {items.map((skill) => <SkillCard key={skill.id} skill={skill} />)}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
