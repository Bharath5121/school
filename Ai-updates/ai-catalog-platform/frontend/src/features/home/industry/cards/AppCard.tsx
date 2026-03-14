'use client';
import { motion } from 'framer-motion';
import { AIApp } from '../../types/content.types';
import { ExternalLink, Bookmark } from 'lucide-react';
import { safeExternalUrl } from '@/lib/url';
import { useContentBookmark } from '@/hooks/useContentBookmark';
import { getPalette } from '@/lib/card-palettes';

export const AppCard = ({ app, index = 0 }: { app: AIApp; index?: number }) => {
  const { isSaved, loading: saveLoading, toggle } = useContentBookmark('APP', app.id);
  const p = getPalette(index);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`${p.bg} shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border ${p.border} rounded-2xl p-6 hover:shadow-lg transition-all duration-300 group flex flex-col h-full relative overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-28 h-28 rounded-full opacity-15 group-hover:opacity-25 transition-opacity blur-2xl" style={{ background: p.glow }} />

      <div className="relative flex justify-between items-start mb-3">
        <div>
          <h3 className={`text-base font-semibold text-gray-900 dark:text-white mb-1 ${p.hover} transition-colors`}>{app.name}</h3>
          <p className="text-xs text-gray-500 dark:text-slate-500 font-medium">by {app.builtBy} &middot; {app.builtByRole}</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold ${
            app.isFree
              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
              : 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/20'
          }`}>
            {app.isFree ? 'Free' : 'Premium'}
          </span>
          <button
            onClick={() => toggle({ title: app.name, url: app.tryUrl, metadata: { builtBy: app.builtBy, industrySlug: app.industrySlug } })}
            disabled={saveLoading}
            className={`p-1.5 rounded-lg transition-all ${isSaved ? p.save : 'text-gray-400 dark:text-slate-600 hover:text-indigo-500'}`}
            title={isSaved ? 'Remove from saved' : 'Save'}
          >
            <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-slate-400 mb-3 leading-relaxed line-clamp-2 flex-grow relative">
        {app.description}
      </p>

      <div className="space-y-3 mb-5 relative">
        <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-slate-400">
          <span>Used by: <span className="font-medium text-gray-700 dark:text-slate-300">{app.whoUsesIt}</span></span>
        </div>
        {app.careerImpact && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{app.careerImpact}</p>
        )}
      </div>

      <div className="mt-auto relative">
        {app.tryUrl && (
          <a href={safeExternalUrl(app.tryUrl)} target="_blank" rel="noopener noreferrer" className="block">
            <button className="w-full h-9 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-400 transition-all flex items-center justify-center gap-1.5">
              Try It <ExternalLink size={13} />
            </button>
          </a>
        )}
      </div>
    </motion.div>
  );
};
