import { useState, useEffect } from 'react';
import { homeApi } from '../services/home.api';
import { IndustryDetail } from '../types/content.types';
import { Industry } from '../types/industry.types';

export const useIndustryDetail = (slug: string) => {
  const [detail, setDetail] = useState<IndustryDetail | null>(null);
  const [metadata, setMetadata] = useState<Industry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    
    const fetchData = async () => {
      setLoading(true);
      try {
        const [detailRes, metaRes] = await Promise.all([
          homeApi.getIndustryDetail(slug),
          homeApi.getIndustryMetadata(slug)
        ]);
        setDetail(detailRes);
        setMetadata(metaRes);
      } catch (err) {
        setError('Failed to load industry details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  return { detail, metadata, loading, error };
};
