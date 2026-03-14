'use client';
import { useParams } from 'next/navigation';
import { ChildOverview } from '@/features/user-experience/parent/components/ChildOverview';

export default function ChildOverviewPage() {
  const params = useParams();
  const childId = params.childId as string;

  return <ChildOverview childId={childId} />;
}
