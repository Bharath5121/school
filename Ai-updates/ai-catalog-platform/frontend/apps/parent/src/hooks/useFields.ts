'use client';
import { useState, useEffect } from 'react';

interface FieldOption {
  slug: string;
  name: string;
  icon?: string;
}

export function useFields() {
  const [fields, setFields] = useState<FieldOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const fetchFields = async () => {
      try {
        const res = await fetch('/api/industries');
        if (res.ok) {
          const data = await res.json();
          if (!cancelled) setFields(data.data || []);
        }
      } catch {
        // silent
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchFields();
    return () => { cancelled = true; };
  }, []);

  return { fields, loading };
}
