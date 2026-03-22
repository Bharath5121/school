import { ApiResponse, Meta } from './ApiResponse';

export interface PaginationMeta extends Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export class PaginatedResponse<T> {
  readonly success: boolean;
  readonly message: string;
  readonly data: T[];
  readonly meta: PaginationMeta;

  private constructor(data: T[], total: number, page: number, limit: number, message = 'Success') {
    this.success = true;
    this.message = message;
    this.data = data;
    const totalPages = Math.ceil(total / limit);
    this.meta = { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 };
  }

  static create<T>(data: T[], total: number, page: number, limit: number, message?: string): PaginatedResponse<T> {
    return new PaginatedResponse(data, total, page, limit, message);
  }
}
