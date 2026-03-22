'use client';

import { useState, useEffect } from 'react';
import { onboardingApi } from '../services/onboarding.api';
import type { OnboardingIndustry, OnboardingStatus } from '../services/onboarding.api';

export function useOnboardingStatus() {
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onboardingApi.getStatus()
      .then(setStatus)
      .catch(() => setStatus(null))
      .finally(() => setLoading(false));
  }, []);

  return { status, loading, refresh: () => onboardingApi.getStatus().then(setStatus) };
}

export function useOnboardingIndustries() {
  const [industries, setIndustries] = useState<OnboardingIndustry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onboardingApi.getIndustries()
      .then(setIndustries)
      .catch(() => setIndustries([]))
      .finally(() => setLoading(false));
  }, []);

  return { industries, loading };
}
