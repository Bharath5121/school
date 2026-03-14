'use client';
import { useOnboardingController } from '@/features/onboarding/controllers/onboarding.controller';
import { Step1Who } from '@/features/onboarding/components/Step1Who';
import { Step2Interests } from '@/features/onboarding/components/Step2Interests';
import { Step3Preferences } from '@/features/onboarding/components/Step3Preferences';
import { Button } from '@/components/ui/Button';

export const OnboardingFlow = () => {
  const {
    step,
    loading,
    formData,
    nextStep,
    prevStep,
    updateFormData,
    handleComplete,
    isStepValid
  } = useOnboardingController();

  return (
    <div className="w-full max-w-2xl mx-auto py-12 px-4">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex space-x-2">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-2 w-12 rounded-full transition-colors ${step >= i ? 'bg-primary' : 'bg-black/5 dark:bg-white/10'}`} />
          ))}
        </div>
        <span className="text-sm text-black/50 dark:text-white/50 font-medium">Step {step} of 3</span>
      </div>

      <div className="min-h-[400px]">
        {step === 1 && <Step1Who data={formData} update={updateFormData} />}
        {step === 2 && <Step2Interests data={formData} update={updateFormData} />}
        {step === 3 && <Step3Preferences data={formData} update={updateFormData} />}
      </div>

      <div className="mt-12 flex justify-between">
        {step > 1 ? (
          <Button variant="outline" onClick={prevStep} disabled={loading}>Back</Button>
        ) : <div />}
        
        {step < 3 ? (
          <Button onClick={nextStep} disabled={!isStepValid}>Next Screen</Button>
        ) : (
          <Button onClick={handleComplete} disabled={loading}>{loading ? 'Finalizing...' : 'Take me to my Dashboard'}</Button>
        )}
      </div>
    </div>
  );
};
