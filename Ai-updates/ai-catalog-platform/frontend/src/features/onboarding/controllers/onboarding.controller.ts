import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '../../../store/app.store';
import { onboardingService } from '../services/onboarding.service';
import { OnboardingData } from '../types/onboarding.types';
import { logger } from '@/lib/logger';

export const useOnboardingController = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser, user } = useAppStore();

  const [formData, setFormData] = useState<OnboardingData>({
    role: (user?.role as 'STUDENT' | 'PARENT' | 'TEACHER') || 'STUDENT',
    gradeLevel: '',
    stream: '',
    interests: [],
    learningStyle: {
      dailyTime: '15 min',
      contentPreference: ['All of the above'],
      emailDigest: true
    }
  });

  const nextStep = () => setStep(s => Math.min(s + 1, 3));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const updateFormData = (data: Partial<OnboardingData>) => {
    setFormData(prev => ({ ...prev, ...data }));
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await onboardingService.completeOnboarding(formData);
      if (user) {
        setUser({ 
          ...user, 
          onboardingCompleted: true, 
          role: formData.role 
        });
      }
      router.push('/feed');
    } catch (error) {
      logger.error('Onboarding failed', error);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const isStepValid = () => {
    if (step === 1) {
      if (formData.role === 'STUDENT') {
        return !!formData.gradeLevel && !!formData.stream;
      }
      return !!formData.role;
    }
    if (step === 2) return formData.interests.length > 0;
    return true;
  };

  return {
    step,
    loading,
    formData,
    nextStep,
    prevStep,
    updateFormData,
    handleComplete,
    isStepValid: isStepValid()
  };
};
