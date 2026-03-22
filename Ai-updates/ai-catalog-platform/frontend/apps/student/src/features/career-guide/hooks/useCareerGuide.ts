'use client';

import { useEffect, useState } from 'react';
import { careerGuideApi } from '../services/career-guide.api';
import type { CareerGuideSummary, MyGuidesResponse } from '../types/career-guide.types';

export function useMyCareerGuides() {
  const [data, setData] = useState<MyGuidesResponse>({ industries: [], guides: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    careerGuideApi.getMyGuides()
      .then(setData)
      .catch(() => setData({ industries: [], guides: [] }))
      .finally(() => setLoading(false));
  }, []);

  return { ...data, loading };
}

export function useCareerGuideDetail(id: string) {
  const [guide, setGuide] = useState<CareerGuideSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    careerGuideApi.getGuideDetail(id)
      .then(setGuide)
      .catch(() => setGuide(null))
      .finally(() => setLoading(false));
  }, [id]);

  return { guide, loading };
}
