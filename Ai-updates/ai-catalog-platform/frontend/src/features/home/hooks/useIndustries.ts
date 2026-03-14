import { useState, useEffect } from 'react';
import { homeApi } from '../services/home.api';
import { Industry, PlatformStats } from '../types/industry.types';

export const useIndustries = () => {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [indRes, statsRes] = await Promise.all([
          homeApi.getIndustries(),
          homeApi.getStats()
        ]);
        setIndustries(indRes);
        setStats(statsRes);
      } catch (err) {
        setError('Failed to load platform data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { industries, stats, loading, error };
};
