export interface CursorPaginationParams {
  cursor?: string;
  limit: number;
  direction: 'forward' | 'backward';
}

export interface CursorPaginationResult<T> {
  data: T[];
  nextCursor: string | null;
  prevCursor: string | null;
  hasMore: boolean;
}

export function parseCursorPagination(
  cursor?: string,
  limit?: number | string,
  direction: 'forward' | 'backward' = 'forward'
): CursorPaginationParams {
  return {
    cursor: cursor || undefined,
    limit: Math.min(100, Math.max(1, Number(limit) || 20)),
    direction,
  };
}

export function buildCursorResult<T extends { id: string }>(
  items: T[],
  limit: number,
  hasMore: boolean
): CursorPaginationResult<T> {
  const data = hasMore ? items.slice(0, limit) : items;
  return {
    data,
    nextCursor: data.length > 0 ? data[data.length - 1].id : null,
    prevCursor: data.length > 0 ? data[0].id : null,
    hasMore,
  };
}
