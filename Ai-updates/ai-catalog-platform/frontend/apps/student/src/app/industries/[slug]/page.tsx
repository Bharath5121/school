'use client';

import { useParams } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { IndustryDetailPage } from '@/features/industries/components/IndustryDetailPage';

export default function IndustryPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100">
      <Navbar />
      <div className="pt-16">
        <IndustryDetailPage slug={slug} />
      </div>
      <Footer />
    </div>
  );
}
