'use client';

import { useParams } from 'next/navigation';
import { LabCategoryPage } from '@/features/lab/components/LabCategoryPage';

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  return <LabCategoryPage slug={slug} />;
}
