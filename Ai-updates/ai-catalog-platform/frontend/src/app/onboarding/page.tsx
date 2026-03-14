import { OnboardingFlow } from '@/features/onboarding/components/OnboardingFlow';

export default function OnboardingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#0B0F19] relative overflow-hidden flex flex-col items-center justify-center py-20">
      <div className="absolute top-[-15%] left-[-10%] w-[30rem] h-[30rem] bg-emerald-500/[0.05] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[30rem] h-[30rem] bg-blue-500/[0.04] rounded-full blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 w-full">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1.5 rounded-full bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 text-xs font-semibold tracking-wide mb-4">
            Personalization
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Customize your journey
          </h2>
        </div>
        <OnboardingFlow />
      </div>
    </main>
  );
}
