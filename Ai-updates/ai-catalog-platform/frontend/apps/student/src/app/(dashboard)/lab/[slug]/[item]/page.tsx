'use client';

import { useParams } from 'next/navigation';
import { LabItemPage } from '@/features/lab/components/LabItemPage';

export default function Page() {
  const { slug, item } = useParams<{ slug: string; item: string }>();
  return <LabItemPage categorySlug={slug} itemSlug={item} />;
}
