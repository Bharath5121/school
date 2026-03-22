'use client';

import { useParams } from 'next/navigation';
import { SkillDetailPage } from '@/features/skills/components/SkillDetailPage';

export default function SkillDetailRoutePage() {
  const { id } = useParams<{ id: string }>();
  return <SkillDetailPage id={id} />;
}
