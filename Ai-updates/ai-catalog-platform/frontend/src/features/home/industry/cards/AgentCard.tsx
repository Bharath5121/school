'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { AIAgent } from '../../types/content.types';
import { BookOpen, Bookmark, ArrowRight, ExternalLink } from 'lucide-react';
import { safeExternalUrl } from '@/lib/url';
import { useContentBookmark } from '@/hooks/useContentBookmark';
import { getPalette } from '@/lib/card-palettes';

export const AgentCard = ({ agent, index = 0 }: { agent: AIAgent; index?: number }) => {
  const { isSaved, loading: saveLoading, toggle } = useContentBookmark('AGENT', agent.id);
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
          <Link href={`/agents/${agent.id}`}>
            <h3 className={`text-base font-semibold text-gray-900 dark:text-white mb-1 ${p.hover} transition-colors`}>{agent.name}</h3>
          </Link>
          <p className="text-xs text-gray-500 dark:text-slate-500 font-medium">by {agent.builtBy}</p>
        </div>
        <button
          onClick={() => toggle({ title: agent.name, metadata: { builtBy: agent.builtBy, industrySlug: agent.industrySlug } })}
          disabled={saveLoading}
          className={`p-1.5 rounded-lg transition-all ${isSaved ? p.save : 'text-gray-400 dark:text-slate-600 hover:text-indigo-500'}`}
          title={isSaved ? 'Remove from saved' : 'Save'}
        >
          <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
      </div>

      <p className="text-sm text-gray-500 dark:text-slate-400 mb-4 leading-relaxed line-clamp-2 relative">
        {agent.description}
      </p>

      <div className="space-y-3 mb-4 flex-grow relative">
        <div>
          <div className={`text-xs font-semibold ${p.accentText} mb-1.5`}>Automates</div>
          <p className={`text-sm text-gray-600 dark:text-slate-300 ${p.accent} p-3 rounded-xl border leading-relaxed`}>
            {agent.whatItDoes}
          </p>
        </div>
        <div>
          <div className={`text-xs font-semibold ${p.accentText} mb-1.5`}>Human Partnership</div>
          <p className={`text-sm text-gray-600 dark:text-slate-300 ${p.accent} p-3 rounded-xl border leading-relaxed`}>
            {agent.humanJobItHelps}
          </p>
        </div>
      </div>

      <div className="mb-5 relative">
        <div className="text-xs font-semibold text-gray-500 dark:text-slate-500 mb-2">Skills Needed</div>
        <div className="flex flex-wrap gap-1.5">
          {agent.skillsNeeded.map(skill => (
            <span key={skill} className={`text-xs ${p.tag} px-2.5 py-0.5 rounded-full font-medium`}>{skill}</span>
          ))}
        </div>
      </div>

      <div className="flex gap-2.5 mt-auto relative">
        {agent.tryUrl && (
          <a href={safeExternalUrl(agent.tryUrl)} target="_blank" rel="noopener noreferrer" className="flex-1">
            <button className="w-full h-9 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-400 transition-all flex items-center justify-center gap-1.5">
              Try It <ExternalLink size={13} />
            </button>
          </a>
        )}
        <Link href={`/agents/${agent.id}`} className="flex-1">
          <button className={`w-full h-9 ${p.btn} text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5`}>
            Details <ArrowRight size={13} />
          </button>
        </Link>
        {agent.notebookLmUrl && (
          <a href={agent.notebookLmUrl} target="_blank" rel="noopener noreferrer"
            className="h-9 px-3 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400 text-sm font-medium rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-1.5">
            <BookOpen size={13} />
          </a>
        )}
      </div>
    </motion.div>
  );
};
