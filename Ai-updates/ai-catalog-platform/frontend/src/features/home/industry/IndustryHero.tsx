'use client';
import { motion } from 'framer-motion';
import { Industry } from '../types/industry.types';
import { IndustryDetail } from '../types/content.types';
import { Brain, Bot, AppWindow } from 'lucide-react';

const statConfig = [
  { key: 'models' as const, label: 'Models', icon: Brain, color: 'from-amber-400 to-orange-500', textColor: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/[0.08]', border: 'border-amber-100 dark:border-amber-500/20' },
  { key: 'agents' as const, label: 'Agents', icon: Bot, color: 'from-violet-400 to-purple-500', textColor: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/[0.08]', border: 'border-violet-100 dark:border-violet-500/20' },
  { key: 'apps' as const, label: 'Apps', icon: AppWindow, color: 'from-emerald-400 to-teal-500', textColor: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/[0.08]', border: 'border-emerald-100 dark:border-emerald-500/20' },
];

export const IndustryHero = ({ metadata, detail }: { metadata: Industry; detail: IndustryDetail | null }) => {
  const counts = {
    models: detail?.models.length ?? metadata._count?.models ?? 0,
    agents: detail?.agents.length ?? metadata._count?.agents ?? 0,
    apps: detail?.apps.length ?? metadata._count?.apps ?? 0,
  };

  return (
    <section className="relative pt-28 pb-14 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50/30 to-violet-50/20 dark:from-[#0B0F19] dark:via-[#0B0F19] dark:to-[#0B0F19] -z-10" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-200/20 via-rose-200/10 to-transparent dark:from-emerald-400/[0.03] dark:via-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-tr from-blue-200/20 via-violet-200/10 to-transparent dark:from-blue-400/[0.03] dark:via-transparent rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-r from-emerald-200/10 via-teal-200/10 to-cyan-200/10 dark:from-transparent dark:to-transparent rounded-full blur-3xl -z-10" />

      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-8"
        >
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="px-3 py-1.5 rounded-full border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50 dark:bg-emerald-500/[0.06] flex items-center gap-2">
                <span className="text-emerald-500 dark:text-emerald-400 text-xs">✦</span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide uppercase">Industry Portal</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 dark:from-white dark:via-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                {metadata.name}
              </span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              {metadata.description}
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {statConfig.map(({ key, label, icon: Icon, textColor, bg, border }) => (
              <div key={key} className={`flex flex-col items-center px-5 py-3.5 rounded-xl ${bg} border ${border} min-w-[90px]`}>
                <Icon className={`w-4 h-4 ${textColor} mb-1.5`} />
                <span className={`text-xl font-bold ${textColor}`}>{counts[key]}</span>
                <span className="text-[11px] font-medium text-gray-500 dark:text-slate-500 mt-0.5">{label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-200 dark:via-slate-700/40 to-transparent" />
    </section>
  );
};
