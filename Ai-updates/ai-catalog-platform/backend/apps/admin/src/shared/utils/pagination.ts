import { APP_CONSTANTS } from '../../config/constants';

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export function parsePagination(page?: number | string, limit?: number | string): PaginationParams {
  const p = Math.max(1, Number(page) || APP_CONSTANTS.PAGINATION.DEFAULT_PAGE);
  const l = Math.min(
    APP_CONSTANTS.PAGINATION.MAX_LIMIT,
    Math.max(1, Number(limit) || APP_CONSTANTS.PAGINATION.DEFAULT_LIMIT)
  );
  return { page: p, limit: l, skip: (p - 1) * l };
}
