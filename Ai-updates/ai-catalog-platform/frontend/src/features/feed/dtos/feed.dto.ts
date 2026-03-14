export interface QueryFeedRequestDto {
  page?: number;
  limit?: number;
  field?: string;
  search?: string;
}

export interface PaginatedResponseDto<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
