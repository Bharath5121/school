import { Skeleton } from '@/components/ui/Skeleton';

export const UserTableSkeleton = () => (
  <div className="space-y-2">
    <Skeleton className="h-10 w-full" />
    {[...Array(5)].map((_, i) => <Skeleton key={i} className="h-14 w-full" />)}
  </div>
);
