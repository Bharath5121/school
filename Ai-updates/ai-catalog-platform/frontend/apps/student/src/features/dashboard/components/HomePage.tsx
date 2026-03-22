'use client';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { IndustryGrid } from '@/features/industries/components/IndustryGrid';
import { useIndustries } from '@/features/industries/hooks/useIndustries';
import { Compass, BookOpen, FlaskConical, Sparkles, ArrowRight } from 'lucide-react';
import { TrendingPreview } from '@/features/trending/components/TrendingPreview';

export const HomePage = () => {
  const { industries, loading } = useIndustries();

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100">
      <Navbar />

      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden pt-10 pb-8 text-center">
          <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent dark:from-emerald-500/[0.03]" />
          <div className="relative max-w-[700px] mx-auto px-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold mb-4">
              <Sparkles size={11} />
              AI Learning Platform
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3">
              AI World, Filtered{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
                for Your Future
              </span>
            </h1>
            <p className="text-sm text-gray-500 dark:text-slate-400 max-w-lg mx-auto mb-5">
              Personalized insights and daily tool updates across {industries.length || '12'} industries.
              Stay ahead in your career.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/register">
                <button className="h-10 px-6 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2">
                  Explore Industries
                  <ArrowRight size={14} />
                </button>
              </Link>
              <Link href="/login">
                <button className="h-10 px-6 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-white/60 text-sm font-semibold rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                  Sign In
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Industries */}
        <section className="max-w-[1200px] mx-auto px-6 pt-2 pb-12">
          <div className="text-center mb-6">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-1">Choose Your Field</h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">
              Explore AI breakthroughs across {industries.length || 'multiple'} industries
            </p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <IndustryGrid industries={industries} />
          )}
        </section>

        {/* Trending Apps */}
        <section className="max-w-[1200px] mx-auto px-6 pb-12">
          <TrendingPreview />
        </section>

        {/* How It Works */}
        <section className="border-t border-gray-100 dark:border-white/5">
          <div className="max-w-[1200px] mx-auto px-6 py-12">
            <div className="text-center mb-8">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight mb-1">How It Works</h2>
              <p className="text-xs sm:text-sm text-gray-500 dark:text-slate-400">Three simple steps to start your AI journey</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="relative p-5 rounded-2xl border border-blue-200 dark:border-blue-500/20 bg-blue-50/50 dark:bg-blue-500/[0.04]">
                <div className="absolute -top-3 -left-1 w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px] font-bold shadow-md shadow-blue-500/30">1</div>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md shadow-blue-500/20 mb-3 mt-1">
                  <Compass size={16} className="text-white" />
                </div>
                <h3 className="text-sm font-bold mb-1">Discover</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                  Browse real-world AI use cases across industries. See how AI is transforming every field.
                </p>
              </div>
              <div className="relative p-5 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/[0.04]">
                <div className="absolute -top-3 -left-1 w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] font-bold shadow-md shadow-emerald-500/30">2</div>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/20 mb-3 mt-1">
                  <BookOpen size={16} className="text-white" />
                </div>
                <h3 className="text-sm font-bold mb-1">Learn</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                  Master the fundamentals with structured AI Basics curriculum. Videos, articles, and interactive content.
                </p>
              </div>
              <div className="relative p-5 rounded-2xl border border-violet-200 dark:border-violet-500/20 bg-violet-50/50 dark:bg-violet-500/[0.04]">
                <div className="absolute -top-3 -left-1 w-7 h-7 rounded-full bg-violet-500 flex items-center justify-center text-white text-[10px] font-bold shadow-md shadow-violet-500/30">3</div>
                <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md shadow-violet-500/20 mb-3 mt-1">
                  <FlaskConical size={16} className="text-white" />
                </div>
                <h3 className="text-sm font-bold mb-1">Explore</h3>
                <p className="text-xs text-gray-500 dark:text-slate-400 leading-relaxed">
                  Get hands-on in the AI Lab. Try models, agents, and tools — learn by doing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-[1200px] mx-auto px-6 py-10 pb-16">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 px-8 py-10 sm:px-12 sm:py-12 text-center shadow-2xl shadow-emerald-500/15">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-60" />
            <div className="relative">
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mb-2">
                Ready to start your AI journey?
              </h2>
              <p className="text-emerald-100 text-sm max-w-lg mx-auto mb-5">
                Join thousands of learners exploring the future of AI across {industries.length || 'multiple'} industries.
              </p>
              <Link href="/register">
                <button className="h-10 px-7 bg-white text-emerald-600 text-sm font-bold rounded-xl hover:bg-emerald-50 transition-all shadow-lg">
                  Get Started for Free
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
