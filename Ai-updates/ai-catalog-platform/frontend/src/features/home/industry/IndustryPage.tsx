'use client';
import { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { IndustryHero } from './IndustryHero';
import { IndustryTabs } from './IndustryTabs';
import { ModelsTab } from './tabs/ModelsTab';
import { AgentsTab } from './tabs/AgentsTab';
import { AppsTab } from './tabs/AppsTab';
import { AskAIPanel } from './AskAI/AskAIPanel';
import { useIndustryDetail } from '../hooks/useIndustryDetail';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export const IndustryPage = ({ slug }: { slug: string }) => {
  const [activeTab, setActiveTab] = useState('models');
  const { detail, metadata, loading, error } = useIndustryDetail(slug);

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B0F19] flex items-center justify-center">
        <div className="w-7 h-7 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !metadata) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B0F19] flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Field Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm">The industry you&apos;re looking for doesn&apos;t exist or is currently offline.</p>
        <Link href="/">
          <button className="px-6 py-2.5 bg-emerald-500 text-white font-semibold rounded-xl text-sm hover:bg-emerald-400 transition-all">Return Home</button>
        </Link>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'models': return <ModelsTab models={detail?.models || []} />;
      case 'agents': return <AgentsTab agents={detail?.agents || []} />;
      case 'apps': return <AppsTab apps={detail?.apps || []} />;
      case 'ask': return <AskAIPanel fieldSlug={slug} industryName={metadata.name} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100">
      <Navbar />
      <main className="flex flex-col">
        <IndustryHero metadata={metadata} detail={detail} />
        <div className="sticky top-[64px] z-40">
          <IndustryTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
        <div className="max-w-[1200px] mx-auto px-6 py-10 w-full mb-12">
          {renderContent()}
        </div>
      </main>
      <Footer />
    </div>
  );
};
