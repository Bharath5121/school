'use client';

import type { DiscoveryDetail } from '../../types';

interface Props {
  discovery: DiscoveryDetail;
}

const TYPE_META = {
  MODEL: { label: 'AI Model', emoji: '🧠' },
  AGENT: { label: 'AI Agent', emoji: '🤖' },
} as const;

export function ModelsAgentsTab({ discovery }: Props) {
  const links = discovery.links.filter(l => l.type === 'MODEL' || l.type === 'AGENT');

  if (links.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-white/30">
        <p className="text-4xl mb-3 opacity-40">🤖</p>
        <p className="font-medium">No AI models or agents linked to this discovery</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {links.map(link => {
        const meta = TYPE_META[link.type as keyof typeof TYPE_META];
        return (
          <div key={link.id} className="bg-blue-50/50 dark:bg-blue-500/5 rounded-xl p-5 border border-blue-100 dark:border-blue-500/10 hover:shadow-md hover:shadow-blue-500/5 transition-all">
            <div className="flex items-start gap-3 mb-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-lg">
                {meta.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{link.name}</p>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300">{meta.label}</span>
              </div>
            </div>
            {link.description && (
              <p className="text-xs text-gray-600 dark:text-white/50 mb-3 leading-relaxed">{link.description}</p>
            )}
            {link.redirectUrl && (
              <a href={link.redirectUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                Learn more →
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
}
