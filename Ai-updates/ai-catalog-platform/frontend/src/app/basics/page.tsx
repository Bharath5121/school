'use client';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { BasicsSection } from '@/features/basics/components/BasicsSection';

export default function BasicsIndexPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100">
      <Navbar />
      <main className="pt-24 pb-16">
        <BasicsSection />
      </main>
      <Footer />
    </div>
  );
}
