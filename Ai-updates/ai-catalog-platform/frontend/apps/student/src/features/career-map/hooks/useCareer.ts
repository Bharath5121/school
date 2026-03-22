'use client';

import { useState, useEffect } from 'react';
import { careerApi } from '../services/career.api';
import type { MyCareerResponse, CareerJobDetail } from '../types/career.types';

export function useMyCareerPaths() {
  const [data, setData] = useState<MyCareerResponse>({ industries: [], paths: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    careerApi.getMyPaths()
      .then(setData)
      .catch(() => setData({ industries: [], paths: [] }))
      .finally(() => setLoading(false));
  }, []);

  return { ...data, loading };
}

export function useJobDetail(id: string) {
  const [job, setJob] = useState<CareerJobDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    careerApi.getJobDetail(id)
      .then(setJob)
      .catch(() => setJob(null))
      .finally(() => setLoading(false));
  }, [id]);

  return { job, loading };
}
