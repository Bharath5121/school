'use client';
import { Industry } from '../types/industry.types';
import { IndustryCard } from './IndustryCard';

export const IndustryGrid = ({ industries }: { industries: Industry[] }) => {
  return (
    <section id="explore" className="py-8">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="mb-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-2 text-gray-900 dark:text-white">
            Choose Your Field
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            Dive into AI breakthroughs across {industries.length} industries. Each field has curated models, agents, and tools.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {industries.map((industry, idx) => (
            <IndustryCard key={industry.id} industry={industry} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};
