'use client';

import React from 'react';
import Link from 'next/link';
import { safeExternalUrl } from '@/lib/url';

const TYPE_COLORS: Record<string, string> = {
  MODEL: 'bg-blue-500/10 text-blue-400',
  AGENT: 'bg-purple-500/10 text-purple-400',
  APP: 'bg-emerald-500/10 text-emerald-400',
  GUIDE: 'bg-cyan-500/10 text-cyan-400',
  LEARNING: 'bg-indigo-500/10 text-indigo-400',
  CAREER: 'bg-rose-500/10 text-rose-400',
};

interface ContentCardProps {
  title: string;
  description?: string;
  type?: string;
  fieldIcon?: string;
  fieldName?: string;
  fieldSlug?: string;
  isFree?: boolean;
  tags?: string[];
  href?: string;
  tryUrl?: string | null;
  meta?: string;
  actions?: React.ReactNode;
}

export function ContentCard({
  title,
  description,
  type,
  fieldIcon,
  fieldName,
  fieldSlug,
  isFree,
  tags,
  href,
  tryUrl,
  meta,
  actions,
}: ContentCardProps) {
  const Card = (
    <div className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none hover:border-emerald-500/20 transition-all">
      <div className="flex items-center gap-2 mb-3">
        {fieldIcon && <span className="text-base">{fieldIcon}</span>}
        <h3 className="text-sm font-bold text-gray-900 dark:text-white group-hover:text-emerald-400 transition-colors truncate flex-1">
          {title}
        </h3>
        {type && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[type] || 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
            {type}
          </span>
        )}
        {typeof isFree === 'boolean' && (
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isFree ? 'bg-emerald-500/10 text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
            {isFree ? 'Free' : 'Paid'}
          </span>
        )}
      </div>

      {meta && <p className="text-xs text-slate-600 dark:text-slate-500 mb-2">{meta}</p>}

      {description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 mb-3">{description}</p>
      )}

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {tags.slice(0, 4).map((t) => (
            <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-500">
              {t}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        {tryUrl && (
          <a
            href={safeExternalUrl(tryUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Try It &rarr;
          </a>
        )}
        {fieldSlug && (
          <Link
            href={`/explore/${fieldSlug}`}
            className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            Learn More
          </Link>
        )}
        {actions}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{Card}</Link>;
  }

  return Card;
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-20 text-slate-600">{message}</div>
  );
}
