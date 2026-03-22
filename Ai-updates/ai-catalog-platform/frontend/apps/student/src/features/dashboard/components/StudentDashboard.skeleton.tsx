import { Skeleton } from '@/components/ui/Skeleton';

export const StudentDashboardSkeleton = () => (
  <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
    <div>
      <Skeleton className="h-10 w-48 mb-2" />
      <Skeleton className="h-5 w-72" />
    </div>
    <Skeleton className="h-64 w-full rounded-3xl" />
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-2xl border border-gray-100 dark:border-white/10 p-4 space-y-3">
          <Skeleton className="h-32 w-full rounded-xl" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  </div>
);
