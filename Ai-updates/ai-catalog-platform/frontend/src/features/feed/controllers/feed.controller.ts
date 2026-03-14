import { useQuery } from '@tanstack/react-query';
import { feedService } from '../services/feed.service';
import { QueryFeedRequestDto } from '../dtos/feed.dto';

export const useFeedController = (params: QueryFeedRequestDto) => {
  return useQuery({
    queryKey: ['feed', params],
    queryFn: () => feedService.getPaginatedFeed(params)
  });
};

export const useTrendingController = () => {
  return useQuery({
    queryKey: ['trending'],
    queryFn: () => feedService.getTrendingFeed()
  });
};
