import { IndustryPage } from '@/features/home/industry/IndustryPage';

export default function IndustryDetailPage({ params }: { params: { field: string } }) {
  return <IndustryPage slug={params.field} />;
}
