'use client';

import { useParams } from 'next/navigation';
import { CareerJobDetailPage } from '@/features/career-map/components/CareerJobDetailPage';

export default function Page() {
  const { id } = useParams<{ id: string }>();
  return <CareerJobDetailPage id={id} />;
}
