'use client';

import { useFeedController } from '../controllers/feed.controller';
import { FeedCard } from './FeedCard';
import { LoadingSpinner } from '../../../components/shared/LoadingSpinner';

export const FeedList = ({ field }: { field?: string }) => {
  const { data, isLoading, error } = useFeedController({ field });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div className="text-red-400 p-4">Error loading feed...</div>;
  if (!data?.data?.length) return <div className="text-black/50 dark:text-white/50 p-8 glass text-center rounded-xl">No AI content available for this field yet.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {data.data.map((item: any) => (
        <FeedCard key={item.id} item={item} />
      ))}
    </div>
  );
};
