'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { useBasicsTopics } from '../hooks/useBasics';
import { ArrowRight } from 'lucide-react';

const colorMap: Record<string, { accent: string; bg: string; border: string; glow: string; cardBg: string; cardBorder: string; cardHover: string }> = {
  violet:  { accent: 'text-violet-500 dark:text-violet-400',   bg: 'bg-violet-100 dark:bg-violet-500/[0.08]',   border: 'border-violet-200 dark:border-violet-500/[0.12]',   glow: 'group-hover:shadow-violet-500/10',  cardBg: 'bg-violet-50/50 dark:bg-[#111827]',  cardBorder: 'border-violet-100 dark:border-slate-700/40',  cardHover: 'hover:bg-violet-100/50 dark:hover:bg-[#151C2C]' },
  blue:    { accent: 'text-blue-500 dark:text-blue-400',       bg: 'bg-blue-100 dark:bg-blue-500/[0.08]',       border: 'border-blue-200 dark:border-blue-500/[0.12]',       glow: 'group-hover:shadow-blue-500/10',    cardBg: 'bg-blue-50/50 dark:bg-[#111827]',    cardBorder: 'border-blue-100 dark:border-slate-700/40',    cardHover: 'hover:bg-blue-100/50 dark:hover:bg-[#151C2C]' },
  emerald: { accent: 'text-emerald-500 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/[0.08]', border: 'border-emerald-200 dark:border-emerald-500/[0.12]', glow: 'group-hover:shadow-emerald-500/10', cardBg: 'bg-emerald-50/50 dark:bg-[#111827]', cardBorder: 'border-emerald-100 dark:border-slate-700/40', cardHover: 'hover:bg-emerald-100/50 dark:hover:bg-[#151C2C]' },
  amber:   { accent: 'text-amber-500 dark:text-amber-400',     bg: 'bg-amber-100 dark:bg-amber-500/[0.08]',     border: 'border-amber-200 dark:border-amber-500/[0.12]',     glow: 'group-hover:shadow-amber-500/10',   cardBg: 'bg-amber-50/50 dark:bg-[#111827]',   cardBorder: 'border-amber-100 dark:border-slate-700/40',   cardHover: 'hover:bg-amber-100/50 dark:hover:bg-[#151C2C]' },
  rose:    { accent: 'text-rose-500 dark:text-rose-400',       bg: 'bg-rose-100 dark:bg-rose-500/[0.08]',       border: 'border-rose-200 dark:border-rose-500/[0.12]',       glow: 'group-hover:shadow-rose-500/10',    cardBg: 'bg-rose-50/50 dark:bg-[#111827]',    cardBorder: 'border-rose-100 dark:border-slate-700/40',    cardHover: 'hover:bg-rose-100/50 dark:hover:bg-[#151C2C]' },
  cyan:    { accent: 'text-cyan-500 dark:text-cyan-400',       bg: 'bg-cyan-100 dark:bg-cyan-500/[0.08]',       border: 'border-cyan-200 dark:border-cyan-500/[0.12]',       glow: 'group-hover:shadow-cyan-500/10',    cardBg: 'bg-cyan-50/50 dark:bg-[#111827]',    cardBorder: 'border-cyan-100 dark:border-slate-700/40',    cardHover: 'hover:bg-cyan-100/50 dark:hover:bg-[#151C2C]' },
  pink:    { accent: 'text-pink-500 dark:text-pink-400',       bg: 'bg-pink-100 dark:bg-pink-500/[0.08]',       border: 'border-pink-200 dark:border-pink-500/[0.12]',       glow: 'group-hover:shadow-pink-500/10',    cardBg: 'bg-pink-50/50 dark:bg-[#111827]',    cardBorder: 'border-pink-100 dark:border-slate-700/40',    cardHover: 'hover:bg-pink-100/50 dark:hover:bg-[#151C2C]' },
  orange:  { accent: 'text-orange-500 dark:text-orange-400',   bg: 'bg-orange-100 dark:bg-orange-500/[0.08]',   border: 'border-orange-200 dark:border-orange-500/[0.12]',   glow: 'group-hover:shadow-orange-500/10',  cardBg: 'bg-orange-50/50 dark:bg-[#111827]',  cardBorder: 'border-orange-100 dark:border-slate-700/40',  cardHover: 'hover:bg-orange-100/50 dark:hover:bg-[#151C2C]' },
};

export const BasicsSection = () => {
  const { topics, loading } = useBasicsTopics();

  if (loading || topics.length === 0) return null;

  return (
    <section className="py-10 border-t border-gray-100 dark:border-slate-800/50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">
            Basics to AI
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-lg mx-auto">
            New to AI? Start here. Learn the fundamentals with curated videos, articles, and simple explanations.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {topics.map((topic, idx) => {
            const colors = colorMap[topic.color] || colorMap.emerald;
            //@ts-ignore
            const Icon = LucideIcons[topic.icon] || LucideIcons.Circle;

            return (
              <motion.div
                key={topic.slug}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.04, duration: 0.35 }}
              >
                <Link href={`/basics/${topic.slug}`} className="block group">
                  <div className={`${colors.cardBg} border ${colors.cardBorder} rounded-2xl p-5 h-full flex flex-col transition-all duration-300 hover:border-gray-200 dark:hover:border-slate-500/50 ${colors.cardHover} hover:-translate-y-0.5 hover:shadow-xl ${colors.glow}`}>
                    <div className={`w-10 h-10 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300`}>
                      <Icon size={20} className={colors.accent} strokeWidth={1.8} />
                    </div>
                    <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-1 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{topic.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-500 leading-relaxed mb-3 flex-grow">{topic.tagline}</p>
                    <div className="flex items-center gap-1 text-xs font-medium text-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      Learn more <ArrowRight size={12} />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
