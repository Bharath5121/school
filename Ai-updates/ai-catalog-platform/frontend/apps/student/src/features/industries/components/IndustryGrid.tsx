'use client';

import { IndustryCard } from './IndustryCard';
import type { Industry } from '../types/industry.types';

interface IndustryGridProps {
  industries: Industry[];
}

export function IndustryGrid({ industries }: IndustryGridProps) {
  if (industries.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 dark:text-slate-500 text-sm">No industries available yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {industries.map((industry, index) => (
        <IndustryCard key={industry.id} industry={industry} index={index} />
      ))}
    </div>
  );
}
