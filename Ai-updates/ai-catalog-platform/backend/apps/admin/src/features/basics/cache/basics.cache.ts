import { BASICS_CACHE_PREFIX } from '../constants/basics.constants';

export const BasicsCacheKeys = {
  list: () => `${BASICS_CACHE_PREFIX}:list`,
  byId: (id: string) => `${BASICS_CACHE_PREFIX}:${id}`,
  chapterList: () => `${BASICS_CACHE_PREFIX}:chapters`,
  chapterById: (id: string) => `${BASICS_CACHE_PREFIX}:chapter:${id}`,
  pattern: () => `${BASICS_CACHE_PREFIX}:*`,
};
