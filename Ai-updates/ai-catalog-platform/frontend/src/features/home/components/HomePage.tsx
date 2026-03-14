'use client';
import { Navbar } from '@/components/layout/Navbar';
import { HeroSection } from './HeroSection';
import { IndustryGrid } from './IndustryGrid';
import { HowItWorks } from './HowItWorks';
import { BasicsSection } from '@/features/basics/components/BasicsSection';
import { CTASection } from './CTASection';
import { Footer } from '@/components/layout/Footer';
import { useIndustries } from '../hooks/useIndustries';

export const HomePage = () => {
  const { industries, loading } = useIndustries();

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B0F19] flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100 scroll-smooth selection:bg-emerald-500/20">
      <Navbar />
      <main>
        <HeroSection count={industries.length} />
        <IndustryGrid industries={industries} />
        <BasicsSection />
        <HowItWorks industryCount={industries.length} />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};
