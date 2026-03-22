'use client';

import { useEffect, useState } from 'react';
import { skillsApi } from '../services/skills.api';
import type { SkillSummary, MySkillsResponse } from '../types/skills.types';

export function useMySkills() {
  const [data, setData] = useState<MySkillsResponse>({ industries: [], skills: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    skillsApi.getMySkills()
      .then(setData)
      .catch(() => setData({ industries: [], skills: [] }))
      .finally(() => setLoading(false));
  }, []);

  return { ...data, loading };
}

export function useSkillDetail(id: string) {
  const [skill, setSkill] = useState<SkillSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    skillsApi.getSkillDetail(id)
      .then(setSkill)
      .catch(() => setSkill(null))
      .finally(() => setLoading(false));
  }, [id]);

  return { skill, loading };
}
