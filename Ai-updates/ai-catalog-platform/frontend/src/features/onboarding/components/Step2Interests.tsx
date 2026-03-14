import { useFields } from '@/hooks/useFields';
import { OnboardingStepProps } from '@/features/onboarding/types/onboarding.types';

export const Step2Interests = ({ data, update }: OnboardingStepProps) => {
  const { fields } = useFields();
  const toggleInterest = (slug: string) => {
    const fresh = data.interests.includes(slug)
      ? data.interests.filter((i: string) => i !== slug)
      : data.interests.length < 3 
        ? [...data.interests, slug]
        : data.interests;
    update({ interests: fresh });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h1 className="text-3xl font-heading font-bold mb-2">What excites you?</h1>
      <p className="text-black/60 dark:text-white/60 mb-8">Pick up to 3 fields that you want to explore. We&apos;ll curate your feed based on these.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {fields.map((field) => (
          <button
            key={field.slug}
            onClick={() => toggleInterest(field.slug)}
            className={`p-4 rounded-2xl border transition-all text-left flex flex-col gap-3 relative group ${
              data.interests.includes(field.slug)
                ? 'border-primary bg-primary/10 ring-1 ring-primary'
                : 'border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none hover:border-gray-200 dark:hover:border-white/30 hover:bg-slate-50 dark:hover:bg-white/10'
            }`}
          >
            <div className="text-3xl bg-black/5 dark:bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center group-hover:bg-white/10 transition-colors">
              {field.icon}
            </div>
            <div>
              <h3 className="font-bold text-sm">{field.name}</h3>
              <p className="text-[10px] text-black/40 dark:text-white/40 leading-tight mt-1">Discover AI trends in this industry.</p>
            </div>
            
            {data.interests.includes(field.slug) && (
              <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center animate-in zoom-in duration-200">
                <svg className="w-4 h-4 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
      
      <div className="mt-6 flex items-center justify-center text-xs text-black/40 dark:text-white/40">
        {data.interests.length}/3 selected
      </div>
    </div>
  );
};
