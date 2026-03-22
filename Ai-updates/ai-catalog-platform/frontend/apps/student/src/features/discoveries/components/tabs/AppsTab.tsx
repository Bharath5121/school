'use client';

import type { DiscoveryDetail } from '../../types';

interface Props {
  discovery: DiscoveryDetail;
}

export function AppsTab({ discovery }: Props) {
  const apps = discovery.links.filter(l => l.type === 'APP');

  if (apps.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-white/30">
        <p className="text-4xl mb-3 opacity-40">📱</p>
        <p className="font-medium">No apps linked to this discovery</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {apps.map(app => (
        <a
          key={app.id}
          href={app.redirectUrl || '#'}
          target={app.redirectUrl ? '_blank' : undefined}
          rel="noopener noreferrer"
          className="group bg-blue-50/50 dark:bg-blue-500/5 rounded-xl p-5 border border-blue-100 dark:border-blue-500/10 hover:shadow-md hover:shadow-blue-500/5 hover:border-blue-200 dark:hover:border-blue-500/20 transition-all"
        >
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center text-lg">
              📱
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 dark:text-white text-sm group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors truncate">
                {app.name}
              </p>
              {app.description && (
                <p className="text-xs text-gray-600 dark:text-white/50 mt-1.5 leading-relaxed">{app.description}</p>
              )}
              {app.redirectUrl && (
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mt-2 group-hover:underline">
                  Open app →
                </p>
              )}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}
