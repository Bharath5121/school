'use client';
import { AIApp } from '../../types/content.types';
import { AppCard } from '../cards/AppCard';

export const AppsTab = ({ apps }: { apps: AIApp[] }) => {
  if (apps.length === 0) return <div className="text-center py-20 text-black/40 dark:text-white/40">No apps found for this field.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {apps.map((app, idx) => (
        <AppCard key={app.id} app={app} index={idx} />
      ))}
    </div>
  );
};
