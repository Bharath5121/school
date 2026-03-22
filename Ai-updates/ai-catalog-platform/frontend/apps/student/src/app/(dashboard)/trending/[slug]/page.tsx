'use client';

import { useParams } from 'next/navigation';
import { TrendingAppDetailPage } from '@/features/trending/components/TrendingAppDetailPage';

export default function Page() {
  const { slug } = useParams<{ slug: string }>();
  return <TrendingAppDetailPage slug={slug} />;
}
