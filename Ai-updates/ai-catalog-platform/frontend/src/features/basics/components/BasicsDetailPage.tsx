'use client';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';
import { ArrowLeft, Play, ExternalLink, Lightbulb, BookOpen, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { safeExternalUrl } from '@/lib/url';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useBasicsDetail } from '../hooks/useBasics';

const colorClasses: Record<string, { accent: string; bg: string; border: string; badge: string }> = {
  violet: { accent: 'text-violet-400', bg: 'bg-violet-500/[0.08]', border: 'border-violet-500/[0.15]', badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20' },
  blue: { accent: 'text-blue-400', bg: 'bg-blue-500/[0.08]', border: 'border-blue-500/[0.15]', badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
  emerald: { accent: 'text-emerald-400', bg: 'bg-emerald-500/[0.08]', border: 'border-emerald-500/[0.15]', badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
  amber: { accent: 'text-amber-400', bg: 'bg-amber-500/[0.08]', border: 'border-amber-500/[0.15]', badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
  rose: { accent: 'text-rose-400', bg: 'bg-rose-500/[0.08]', border: 'border-rose-500/[0.15]', badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20' },
  cyan: { accent: 'text-cyan-400', bg: 'bg-cyan-500/[0.08]', border: 'border-cyan-500/[0.15]', badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' },
  pink: { accent: 'text-pink-400', bg: 'bg-pink-500/[0.08]', border: 'border-pink-500/[0.15]', badge: 'bg-pink-500/10 text-pink-400 border-pink-500/20' },
  orange: { accent: 'text-orange-400', bg: 'bg-orange-500/[0.08]', border: 'border-orange-500/[0.15]', badge: 'bg-orange-500/10 text-orange-400 border-orange-500/20' },
};

export const BasicsDetailPage = ({ slug }: { slug: string }) => {
  const { topic, loading } = useBasicsDetail(slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B0F19] flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!topic) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B0F19] flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Topic Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">This basics topic doesn&apos;t exist yet.</p>
        <Link href="/" className="text-emerald-400 hover:text-emerald-300 font-medium text-sm">&larr; Back to Home</Link>
      </div>
    );
  }

  const colors = colorClasses[topic.color] || colorClasses.emerald;
  //@ts-ignore
  const Icon = LucideIcons[topic.icon] || LucideIcons.Circle;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="max-w-[900px] mx-auto px-6">
          {/* Back link */}
          <Link href="/#basics" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors mb-8">
            <ArrowLeft size={15} /> Back to Basics
          </Link>

          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-14 h-14 rounded-2xl ${colors.bg} ${colors.border} border flex items-center justify-center shrink-0`}>
                <Icon size={28} className={colors.accent} strokeWidth={1.6} />
              </div>
              <div>
                <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full border ${colors.badge} mb-2`}>
                  Basics
                </span>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">{topic.title}</h1>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{topic.tagline}</p>
              </div>
            </div>

            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed mb-10">
              {topic.description}
            </p>
          </motion.div>

          {/* Key Concepts */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Lightbulb size={18} className="text-amber-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Key Concepts</h2>
            </div>
            <div className="bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-slate-700/40 rounded-2xl p-5">
              <ul className="space-y-2.5">
                {topic.concepts.map((concept, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-emerald-400 mt-0.5 shrink-0"><CheckCircle2 size={16} /></span>
                    <span className="text-sm text-slate-600 dark:text-slate-300">{concept}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>

          {/* Videos */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <Play size={18} className="text-rose-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Watch & Learn</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {topic.videos.map((video, i) => (
                <a key={i} href={safeExternalUrl(video.url)} target="_blank" rel="noopener noreferrer" className="group block">
                  <div className="bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-slate-700/40 rounded-xl p-4 hover:border-gray-200 dark:hover:border-slate-500/50 hover:bg-slate-100 dark:hover:bg-[#151C2C] transition-all duration-200">
                    <div className="w-full h-28 bg-slate-100 dark:bg-slate-800/60 rounded-lg mb-3 flex items-center justify-center group-hover:bg-slate-200 dark:group-hover:bg-slate-700/60 transition-colors">
                      <Play size={28} className="text-slate-600 dark:text-slate-500 group-hover:text-red-400 transition-colors" />
                    </div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-1 line-clamp-2 group-hover:text-emerald-400 transition-colors">{video.title}</h3>
                    <div className="flex items-center justify-between text-xs text-slate-600 dark:text-slate-500">
                      <span>{video.channel}</span>
                      <span>{video.duration}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </motion.section>

          {/* Articles & Documentation */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-blue-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Read & Explore</h2>
            </div>
            <div className="space-y-2">
              {topic.articles.map((article, i) => (
                <a key={i} href={safeExternalUrl(article.url)} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between p-4 bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-slate-700/40 rounded-xl hover:border-gray-200 dark:hover:border-slate-500/50 hover:bg-slate-100 dark:hover:bg-[#151C2C] transition-all duration-200">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-emerald-400 transition-colors">{article.title}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-500 mt-0.5">{article.source}</p>
                  </div>
                  <ExternalLink size={15} className="text-slate-600 group-hover:text-slate-300 transition-colors shrink-0" />
                </a>
              ))}
            </div>
          </motion.section>

          {/* Key Takeaways */}
          <motion.section initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }}>
            <div className="bg-emerald-500/[0.04] border border-emerald-500/[0.1] rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle2 size={18} className="text-emerald-400" /> Key Takeaways
              </h2>
              <ul className="space-y-3">
                {topic.keyTakeaways.map((takeaway, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-emerald-400 font-bold text-sm mt-0.5">{i + 1}.</span>
                    <span className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{takeaway}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.section>
        </div>
      </main>

      <Footer />
    </div>
  );
};
