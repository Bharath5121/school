'use client';

import { useParams } from 'next/navigation';
import { CareerGuideDetailPage } from '@/features/career-guide/components/CareerGuideDetailPage';

export default function CareerGuideDetailRoutePage() {
  const { id } = useParams<{ id: string }>();
  return <CareerGuideDetailPage id={id} />;
}
