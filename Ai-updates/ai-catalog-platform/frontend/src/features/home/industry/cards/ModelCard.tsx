'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AIModel } from '../../types/content.types';
import { ExternalLink, BookOpen, Bookmark, ArrowRight } from 'lucide-react';
import { safeExternalUrl } from '@/lib/url';
import { useContentBookmark } from '@/hooks/useContentBookmark';
import { getPalette } from '@/lib/card-palettes';

export const ModelCard = ({ model, index = 0 }: { model: AIModel; index?: number }) => {
  const { isSaved, loading: saveLoading, toggle } = useContentBookmark('MODEL', model.id);
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
          <Link href={`/models/${model.id}`}>
            <h3 className={`text-base font-semibold text-gray-900 dark:text-white mb-1 ${p.hover} transition-colors`}>{model.name}</h3>
          </Link>
          <p className="text-xs text-gray-500 dark:text-slate-500 font-medium">by {model.builtBy}</p>
        </div>
        <div className="flex items-center gap-2">
          {model.isFree && (
            <span className="text-xs bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20 font-semibold">Free</span>
          )}
          <button
            onClick={() => toggle({ title: model.name, url: model.tryUrl, metadata: { builtBy: model.builtBy, industrySlug: model.industrySlug } })}
            disabled={saveLoading}
            className={`p-1.5 rounded-lg transition-all ${isSaved ? p.save : 'text-gray-400 dark:text-slate-600 hover:text-indigo-500'}`}
            title={isSaved ? 'Remove from saved' : 'Save'}
          >
            <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 leading-relaxed flex-grow line-clamp-3 relative">
        {model.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-4 relative">
        {model.tags.slice(0, 3).map(tag => (
          <span key={tag} className={`text-xs ${p.tag} px-2.5 py-0.5 rounded-full font-medium`}>{tag}</span>
        ))}
      </div>

      <div className={`p-3.5 rounded-xl ${p.accent} border mb-4 relative`}>
        <p className={`text-xs font-semibold ${p.accentText} mb-1`}>Career Impact</p>
        <p className="text-sm text-gray-600 dark:text-slate-300 leading-relaxed">
          {model.careerImpact.split(':').slice(1).join(':').trim() || model.careerImpact}
        </p>
      </div>

      <div className="flex gap-2.5 mt-auto relative">
        {model.tryUrl && (
          <a href={safeExternalUrl(model.tryUrl)} target="_blank" rel="noopener noreferrer" className="flex-1">
            <button className="w-full h-9 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-400 transition-all flex items-center justify-center gap-1.5">
              Try It <ExternalLink size={13} />
            </button>
          </a>
        )}
        <Link href={`/models/${model.id}`} className="flex-1">
          <button className={`w-full h-9 ${p.btn} text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5`}>
            Details <ArrowRight size={13} />
          </button>
        </Link>
        {model.notebookLmUrl && (
          <a href={model.notebookLmUrl} target="_blank" rel="noopener noreferrer"
            className="h-9 px-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-1.5">
            <BookOpen size={13} />
          </a>
        )}
      </div>
    </motion.div>
  );
};
