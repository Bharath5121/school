'use client';

import type { DiscoveryDetail } from '../../types';

interface Props {
  discovery: DiscoveryDetail;
}

export function ArchitectureTab({ discovery }: Props) {
  if (!discovery.architectureDescription && !discovery.architectureDiagramUrl) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-white/30">
        <p className="text-4xl mb-3 opacity-40">🏗️</p>
        <p className="font-medium">No architecture available for this discovery</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {discovery.architectureDiagramUrl && (
        <div className="rounded-xl overflow-hidden border border-blue-100 dark:border-blue-500/10">
          <img src={discovery.architectureDiagramUrl} alt="Architecture diagram" className="w-full" />
        </div>
      )}

      {discovery.architectureDescription && (
        <div className="space-y-1">
          {discovery.architectureDescription.split('\n').map((line, i) => {
            const t = line.trim();
            if (t.startsWith('## ')) {
              return <h2 key={i} className="text-xl font-extrabold text-gray-900 dark:text-white mt-6 mb-3 first:mt-0 pb-2 border-b border-blue-100 dark:border-blue-500/10">{t.replace('## ', '')}</h2>;
            }
            if (t.startsWith('**') && t.endsWith('**')) {
              return <p key={i} className="font-bold text-gray-800 dark:text-white/90 mt-5 mb-1.5 text-sm">{t.replace(/\*\*/g, '')}</p>;
            }
            if (t.startsWith('- ')) {
              return (
                <div key={i} className="flex gap-2.5 ml-1 my-1 items-start">
                  <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5" />
                  <p className="text-sm text-gray-600 dark:text-white/60 leading-relaxed">{t.replace('- ', '')}</p>
                </div>
              );
            }
            if (t === '') return <div key={i} className="h-2" />;
            const rendered = t.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-gray-800 dark:text-white/80">$1</strong>');
            return <p key={i} className="text-sm text-gray-600 dark:text-white/60 leading-relaxed" dangerouslySetInnerHTML={{ __html: rendered }} />;
          })}
        </div>
      )}
    </div>
  );
}
