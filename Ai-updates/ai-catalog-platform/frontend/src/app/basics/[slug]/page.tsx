'use client';
import { BasicsDetailPage } from '@/features/basics/components/BasicsDetailPage';

export default function BasicsTopicPage({ params }: { params: { slug: string } }) {
  return <BasicsDetailPage slug={params.slug} />;
}
