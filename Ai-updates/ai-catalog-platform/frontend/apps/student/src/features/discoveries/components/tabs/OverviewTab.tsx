'use client';

import type { DiscoveryDetail } from '../../types';

interface Props {
  discovery: DiscoveryDetail;
}

function renderLine(line: string, i: number) {
  const t = line.trim();
  if (t.startsWith('## ')) {
    return <h2 key={i} className="text-xl font-extrabold text-gray-900 dark:text-white mt-8 mb-3 first:mt-0 pb-2 border-b border-blue-100 dark:border-blue-500/10">{t.replace('## ', '')}</h2>;
  }
  if (t.startsWith('### ')) {
    return <h3 key={i} className="text-base font-bold text-gray-800 dark:text-white/90 mt-6 mb-2">{t.replace('### ', '')}</h3>;
  }
  if (/^\*\*\d+\./.test(t)) {
    const text = t.replace(/\*\*/g, '');
    const num = text.match(/(\d+)/)?.[1];
    return (
      <div key={i} className="flex gap-3 mt-4 mb-1 items-start">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center mt-0.5">{num}</span>
        <p className="font-semibold text-gray-800 dark:text-white/90 text-sm">{text.replace(/^\d+\.\s*/, '')}</p>
      </div>
    );
  }
  if (t.startsWith('**') && t.endsWith('**')) {
    return <p key={i} className="font-bold text-gray-800 dark:text-white/90 mt-5 mb-1.5 text-sm">{t.replace(/\*\*/g, '')}</p>;
  }
  if (t.startsWith('- **')) {
    const parts = t.replace(/^- \*\*/, '').split('**');
    return (
      <div key={i} className="flex gap-2.5 ml-1 my-1.5 items-start">
        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
        <p className="text-sm text-gray-600 dark:text-white/60 leading-relaxed"><span className="font-semibold text-gray-800 dark:text-white/80">{parts[0]}</span>{parts.slice(1).join('')}</p>
      </div>
    );
  }
  if (t.startsWith('- ')) {
    return (
      <div key={i} className="flex gap-2.5 ml-1 my-1.5 items-start">
        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
        <p className="text-sm text-gray-600 dark:text-white/60 leading-relaxed">{t.replace('- ', '')}</p>
      </div>
    );
  }
  if (t === '') return <div key={i} className="h-3" />;

  const rendered = t.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-gray-800 dark:text-white/80">$1</strong>');
  return <p key={i} className="text-sm text-gray-600 dark:text-white/60 leading-relaxed" dangerouslySetInnerHTML={{ __html: rendered }} />;
}

export function OverviewTab({ discovery }: Props) {
  return (
    <div className="space-y-1">
      {discovery.description.split('\n').map((line, i) => renderLine(line, i))}

      {/* Tags */}
      <div className="flex flex-wrap gap-2 pt-6 mt-4 border-t border-gray-100 dark:border-white/5">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-white/25 self-center mr-1">Tags</span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/15 capitalize">{discovery.difficulty}</span>
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/15">{discovery.xp} XP</span>
        {discovery.industry && (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/15">{discovery.industry.icon} {discovery.industry.name}</span>
        )}
      </div>
    </div>
  );
}
