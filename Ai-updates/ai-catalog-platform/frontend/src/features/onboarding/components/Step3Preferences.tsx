import { OnboardingStepProps } from '@/features/onboarding/types/onboarding.types';

export const Step3Preferences = ({ data, update }: OnboardingStepProps) => {
  const togglePreference = (pref: string) => {
    const fresh = data.learningStyle.contentPreference.includes(pref)
      ? data.learningStyle.contentPreference.filter((p: string) => p !== pref)
      : [...data.learningStyle.contentPreference, pref];
    update({ learningStyle: { ...data.learningStyle, contentPreference: fresh } });
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500">
      <h1 className="text-3xl font-heading font-bold mb-2">How do you learn?</h1>
      <p className="text-black/60 dark:text-white/60 mb-8">Personalize your content delivery and learning pace.</p>

      <div className="space-y-8">
        <div>
          <label className="text-sm font-medium text-black/70 dark:text-white/70 block mb-4">How much time per day?</label>
          <div className="flex gap-4">
            {['5 min', '15 min', '30 min+'].map((time) => (
              <button
                key={time}
                onClick={() => update({ learningStyle: { ...data.learningStyle, dailyTime: time } })}
                className={`flex-1 py-4 rounded-xl border transition-all font-medium ${
                  data.learningStyle.dailyTime === time
                    ? 'border-primary bg-primary text-black'
                    : 'border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none hover:bg-slate-50 dark:hover:bg-white/10'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-black/70 dark:text-white/70 block mb-4">What kind of content do you prefer?</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              'Quick updates',
              'Deep dives',
              'Hands-on guides',
              'Career advice',
              'All of the above'
            ].map((pref) => (
              <button
                key={pref}
                onClick={() => togglePreference(pref)}
                className={`py-3 px-4 rounded-xl border text-left text-sm transition-all ${
                  data.learningStyle.contentPreference.includes(pref)
                    ? 'border-primary bg-primary/20 ring-1 ring-primary'
                    : 'border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:border-gray-200 dark:hover:border-white/20'
                }`}
              >
                {pref}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-white/10">
          <div>
            <h3 className="font-bold">Weekly digest emails</h3>
            <p className="text-xs text-black/40 dark:text-white/40">We&apos;ll send you a summary of the best tools every Sunday.</p>
          </div>
          <button 
            onClick={() => update({ learningStyle: { ...data.learningStyle, emailDigest: !data.learningStyle.emailDigest } })}
            className={`w-14 h-8 rounded-full transition-colors relative ${data.learningStyle.emailDigest ? 'bg-primary' : 'bg-white/20'}`}
          >
            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${data.learningStyle.emailDigest ? 'right-1' : 'left-1'}`} />
          </button>
        </div>
      </div>
    </div>
  );
};
