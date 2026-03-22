export interface CursorPaginationParams {
  cursor?: string;
  take: number;
}

export function parseCursorPagination(cursor?: string, limit?: number): CursorPaginationParams {
  return {
    cursor: cursor || undefined,
    take: Math.min(100, Math.max(1, Number(limit) || 20)),
  };
}
