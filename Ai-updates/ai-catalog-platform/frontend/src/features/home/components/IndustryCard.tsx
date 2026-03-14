'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { Industry } from '../types/industry.types';

const iconMap: Record<string, string> = {
  'medicine': 'Heart',
  'engineering': 'Wrench',
  'art': 'Palette',
  'gaming': 'Gamepad2',
  'law': 'Scale',
  'finance': 'TrendingUp',
  'education': 'GraduationCap',
  'marketing': 'Megaphone',
  'media': 'Film',
  'science': 'FlaskConical',
  'retail': 'ShoppingBag',
  'agriculture': 'Sprout',
  'space': 'Rocket',
  'music': 'Music',
  'architecture': 'Building2',
};

const colorMap: Record<string, {
  accent: string; iconBg: string; iconBorder: string; glow: string;
  cardBg: string; cardHover: string; cardBorder: string; cardBorderHover: string;
}> = {
  'medicine':     { accent: 'text-rose-500 dark:text-rose-400',     iconBg: 'bg-rose-100 dark:bg-rose-500/[0.08]',       iconBorder: 'border-rose-200 dark:border-rose-500/[0.12]',       glow: 'group-hover:shadow-rose-500/10',    cardBg: 'bg-rose-50/60 dark:bg-[#111827]',    cardHover: 'hover:bg-rose-100/60 dark:hover:bg-[#151C2C]',    cardBorder: 'border-rose-100 dark:border-slate-700/40',    cardBorderHover: 'hover:border-rose-200 dark:hover:border-slate-500/50' },
  'finance':      { accent: 'text-amber-500 dark:text-amber-400',   iconBg: 'bg-amber-100 dark:bg-amber-500/[0.08]',     iconBorder: 'border-amber-200 dark:border-amber-500/[0.12]',     glow: 'group-hover:shadow-amber-500/10',   cardBg: 'bg-amber-50/60 dark:bg-[#111827]',   cardHover: 'hover:bg-amber-100/60 dark:hover:bg-[#151C2C]',   cardBorder: 'border-amber-100 dark:border-slate-700/40',   cardBorderHover: 'hover:border-amber-200 dark:hover:border-slate-500/50' },
  'education':    { accent: 'text-blue-500 dark:text-blue-400',     iconBg: 'bg-blue-100 dark:bg-blue-500/[0.08]',       iconBorder: 'border-blue-200 dark:border-blue-500/[0.12]',       glow: 'group-hover:shadow-blue-500/10',    cardBg: 'bg-blue-50/60 dark:bg-[#111827]',    cardHover: 'hover:bg-blue-100/60 dark:hover:bg-[#151C2C]',    cardBorder: 'border-blue-100 dark:border-slate-700/40',    cardBorderHover: 'hover:border-blue-200 dark:hover:border-slate-500/50' },
  'science':      { accent: 'text-violet-500 dark:text-violet-400', iconBg: 'bg-violet-100 dark:bg-violet-500/[0.08]',   iconBorder: 'border-violet-200 dark:border-violet-500/[0.12]',   glow: 'group-hover:shadow-violet-500/10',  cardBg: 'bg-violet-50/60 dark:bg-[#111827]',  cardHover: 'hover:bg-violet-100/60 dark:hover:bg-[#151C2C]',  cardBorder: 'border-violet-100 dark:border-slate-700/40',  cardBorderHover: 'hover:border-violet-200 dark:hover:border-slate-500/50' },
  'engineering':  { accent: 'text-orange-500 dark:text-orange-400', iconBg: 'bg-orange-100 dark:bg-orange-500/[0.08]',   iconBorder: 'border-orange-200 dark:border-orange-500/[0.12]',   glow: 'group-hover:shadow-orange-500/10',  cardBg: 'bg-orange-50/60 dark:bg-[#111827]',  cardHover: 'hover:bg-orange-100/60 dark:hover:bg-[#151C2C]',  cardBorder: 'border-orange-100 dark:border-slate-700/40',  cardBorderHover: 'hover:border-orange-200 dark:hover:border-slate-500/50' },
  'space':        { accent: 'text-cyan-500 dark:text-cyan-400',     iconBg: 'bg-cyan-100 dark:bg-cyan-500/[0.08]',       iconBorder: 'border-cyan-200 dark:border-cyan-500/[0.12]',       glow: 'group-hover:shadow-cyan-500/10',    cardBg: 'bg-cyan-50/60 dark:bg-[#111827]',    cardHover: 'hover:bg-cyan-100/60 dark:hover:bg-[#151C2C]',    cardBorder: 'border-cyan-100 dark:border-slate-700/40',    cardBorderHover: 'hover:border-cyan-200 dark:hover:border-slate-500/50' },
  'music':        { accent: 'text-pink-500 dark:text-pink-400',     iconBg: 'bg-pink-100 dark:bg-pink-500/[0.08]',       iconBorder: 'border-pink-200 dark:border-pink-500/[0.12]',       glow: 'group-hover:shadow-pink-500/10',    cardBg: 'bg-pink-50/60 dark:bg-[#111827]',    cardHover: 'hover:bg-pink-100/60 dark:hover:bg-[#151C2C]',    cardBorder: 'border-pink-100 dark:border-slate-700/40',    cardBorderHover: 'hover:border-pink-200 dark:hover:border-slate-500/50' },
  'architecture': { accent: 'text-teal-500 dark:text-teal-400',     iconBg: 'bg-teal-100 dark:bg-teal-500/[0.08]',       iconBorder: 'border-teal-200 dark:border-teal-500/[0.12]',       glow: 'group-hover:shadow-teal-500/10',    cardBg: 'bg-teal-50/60 dark:bg-[#111827]',    cardHover: 'hover:bg-teal-100/60 dark:hover:bg-[#151C2C]',    cardBorder: 'border-teal-100 dark:border-slate-700/40',    cardBorderHover: 'hover:border-teal-200 dark:hover:border-slate-500/50' },
  'agriculture':  { accent: 'text-lime-500 dark:text-lime-400',     iconBg: 'bg-lime-100 dark:bg-lime-500/[0.08]',       iconBorder: 'border-lime-200 dark:border-lime-500/[0.12]',       glow: 'group-hover:shadow-lime-500/10',    cardBg: 'bg-lime-50/60 dark:bg-[#111827]',    cardHover: 'hover:bg-lime-100/60 dark:hover:bg-[#151C2C]',    cardBorder: 'border-lime-100 dark:border-slate-700/40',    cardBorderHover: 'hover:border-lime-200 dark:hover:border-slate-500/50' },
  'art':          { accent: 'text-fuchsia-500 dark:text-fuchsia-400', iconBg: 'bg-fuchsia-100 dark:bg-fuchsia-500/[0.08]', iconBorder: 'border-fuchsia-200 dark:border-fuchsia-500/[0.12]', glow: 'group-hover:shadow-fuchsia-500/10', cardBg: 'bg-fuchsia-50/60 dark:bg-[#111827]', cardHover: 'hover:bg-fuchsia-100/60 dark:hover:bg-[#151C2C]', cardBorder: 'border-fuchsia-100 dark:border-slate-700/40', cardBorderHover: 'hover:border-fuchsia-200 dark:hover:border-slate-500/50' },
  'law':          { accent: 'text-sky-500 dark:text-sky-400',       iconBg: 'bg-sky-100 dark:bg-sky-500/[0.08]',         iconBorder: 'border-sky-200 dark:border-sky-500/[0.12]',         glow: 'group-hover:shadow-sky-500/10',     cardBg: 'bg-sky-50/60 dark:bg-[#111827]',     cardHover: 'hover:bg-sky-100/60 dark:hover:bg-[#151C2C]',     cardBorder: 'border-sky-100 dark:border-slate-700/40',     cardBorderHover: 'hover:border-sky-200 dark:hover:border-slate-500/50' },
  'gaming':       { accent: 'text-indigo-500 dark:text-indigo-400', iconBg: 'bg-indigo-100 dark:bg-indigo-500/[0.08]',   iconBorder: 'border-indigo-200 dark:border-indigo-500/[0.12]',   glow: 'group-hover:shadow-indigo-500/10',  cardBg: 'bg-indigo-50/60 dark:bg-[#111827]',  cardHover: 'hover:bg-indigo-100/60 dark:hover:bg-[#151C2C]',  cardBorder: 'border-indigo-100 dark:border-slate-700/40',  cardBorderHover: 'hover:border-indigo-200 dark:hover:border-slate-500/50' },
};

const defaultColor = {
  accent: 'text-emerald-500 dark:text-emerald-400', iconBg: 'bg-emerald-100 dark:bg-emerald-500/[0.08]', iconBorder: 'border-emerald-200 dark:border-emerald-500/[0.12]',
  glow: 'group-hover:shadow-emerald-500/10', cardBg: 'bg-emerald-50/60 dark:bg-[#111827]', cardHover: 'hover:bg-emerald-100/60 dark:hover:bg-[#151C2C]',
  cardBorder: 'border-emerald-100 dark:border-slate-700/40', cardBorderHover: 'hover:border-emerald-200 dark:hover:border-slate-500/50',
};

export const IndustryCard = ({ industry, index }: { industry: Industry; index: number }) => {
  const IconName = iconMap[industry.slug.toLowerCase()] || 'Circle';
  //@ts-ignore
  const Icon = LucideIcons[IconName] || LucideIcons.Circle;
  const c = colorMap[industry.slug.toLowerCase()] || defaultColor;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link href={`/explore/${industry.slug}`} className="block group">
        <div className={`${c.cardBg} border ${c.cardBorder} rounded-2xl p-6 h-full flex flex-col items-center text-center transition-all duration-300 ${c.cardBorderHover} ${c.cardHover} hover:-translate-y-1 hover:shadow-lg ${c.glow}`}>
          <div className={`w-12 h-12 rounded-xl ${c.iconBg} ${c.iconBorder} border flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
            <Icon size={22} className={c.accent} strokeWidth={1.8} />
          </div>

          <h3 className="text-sm font-semibold tracking-wide mb-1.5 text-gray-800 dark:text-slate-200 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
            {industry.name}
          </h3>

          {industry.description && (
            <p className="text-xs text-gray-500 dark:text-slate-500 leading-relaxed line-clamp-2">
              {industry.description}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
};
