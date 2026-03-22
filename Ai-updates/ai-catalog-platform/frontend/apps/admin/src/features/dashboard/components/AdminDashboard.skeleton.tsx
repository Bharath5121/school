import { Skeleton } from '@/components/ui/Skeleton';

export const AdminDashboardSkeleton = () => (
  <div className="space-y-6">
    <Skeleton className="h-10 w-64" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)}
    </div>
    <Skeleton className="h-64 w-full" />
  </div>
);
