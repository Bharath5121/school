'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HeroSection = ({ count }: { count?: number }) => {
  return (
    <section className="relative pt-28 pb-10 overflow-hidden">
      {/* Multi-color gradient blobs for a cheerful backdrop */}
      <div className="absolute top-0 left-1/3 -translate-x-1/2 w-[500px] h-[400px] bg-emerald-400/[0.07] dark:bg-emerald-500/[0.03] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-10 right-1/4 w-[400px] h-[350px] bg-blue-400/[0.06] dark:bg-blue-500/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -top-20 left-1/2 w-[300px] h-[300px] bg-violet-400/[0.05] dark:bg-violet-500/[0.02] rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-500/[0.08] border border-emerald-200 dark:border-emerald-500/20 mb-6">
            <Sparkles size={13} className="text-emerald-500 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 tracking-wide">Powered by AI Intelligence</span>
          </div>

          <h1 className="text-3xl md:text-[2.75rem] lg:text-5xl font-extrabold tracking-tight leading-[1.15] mb-4 text-gray-900 dark:text-white">
            AI World, Filtered{' '}
            <span className="bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-500 bg-clip-text text-transparent">
              for Your Future
            </span>
          </h1>

          <p className="text-base text-gray-500 dark:text-slate-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Personalized insights and daily tool updates across {count ?? 'multiple'} distinct industries. Stay ahead in your career.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="#explore"
              className="group flex items-center gap-2 bg-emerald-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm hover:bg-emerald-400 transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30"
            >
              Explore Industries
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 bg-white dark:bg-slate-800/60 border border-gray-200 dark:border-slate-600/40 text-gray-700 dark:text-slate-200 shadow-sm dark:shadow-none font-medium px-6 py-2.5 rounded-xl text-sm hover:bg-gray-50 dark:hover:bg-slate-700/60 hover:border-gray-300 dark:hover:border-slate-500/50 hover:shadow-md dark:hover:shadow-none transition-all duration-200"
            >
              Create Free Account
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
