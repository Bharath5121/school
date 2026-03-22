'use client';

import { useParams } from 'next/navigation';
import { DiscoveryDetailPage } from '@/features/discoveries/components/DiscoveryDetailPage';

export default function DiscoveryPage() {
  const params = useParams();
  const slug = params.slug as string;

  return (
    <div className="min-h-screen pt-8 pb-20">
      <DiscoveryDetailPage slug={slug} />
    </div>
  );
}
