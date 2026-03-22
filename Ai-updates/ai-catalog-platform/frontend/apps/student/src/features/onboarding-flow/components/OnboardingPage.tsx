'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Check, ArrowRight } from 'lucide-react';
import { useOnboardingIndustries } from '../hooks/useOnboarding';
import { onboardingApi } from '../services/onboarding.api';

export function OnboardingPage() {
  const router = useRouter();
  const { industries, loading } = useOnboardingIndustries();
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggle = (slug: string) => {
    setSelected(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handleSubmit = async () => {
    if (selected.length === 0) return;
    setSaving(true);
    try {
      await onboardingApi.complete(selected);
      router.push('/discoveries');
    } catch {
      alert('Something went wrong. Please try again.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B0F19] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-emerald-50/30 to-white dark:from-[#0B0F19] dark:via-emerald-900/5 dark:to-[#0B0F19] text-gray-900 dark:text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-4">
            <Sparkles size={12} />
            Welcome aboard
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-3">
            What industries interest you?
          </h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 max-w-md mx-auto">
            Select the fields you want to explore. We&apos;ll personalize your trending apps and recommendations.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-10">
          {industries.map(ind => {
            const isSelected = selected.includes(ind.slug);
            return (
              <button
                key={ind.slug}
                onClick={() => toggle(ind.slug)}
                className={`relative group p-5 rounded-2xl border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/80 dark:bg-emerald-500/10 shadow-lg shadow-emerald-500/10'
                    : 'border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/20 hover:shadow-md'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Check size={12} className="text-white" strokeWidth={3} />
                  </div>
                )}
                <span className="text-2xl mb-2 block">{ind.icon}</span>
                <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-1">{ind.name}</h3>
                <p className="text-[11px] text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                  {ind.description}
                </p>
              </button>
            );
          })}
        </div>

        <div className="text-center">
          <p className="text-xs text-gray-400 dark:text-slate-500 mb-4">
            {selected.length === 0
              ? 'Select at least one industry to continue'
              : `${selected.length} ${selected.length === 1 ? 'industry' : 'industries'} selected`}
          </p>
          <button
            onClick={handleSubmit}
            disabled={selected.length === 0 || saving}
            className="inline-flex items-center gap-2 h-12 px-8 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-500/20"
          >
            {saving ? 'Saving...' : 'Continue'}
            {!saving && <ArrowRight size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}
