export interface Meta {
  page?: number;
  limit?: number;
  total?: number;
}

export class ApiResponse<T> {
  readonly success: boolean;
  readonly message: string;
  readonly data: T | null;
  readonly meta?: Meta;

  private constructor(success: boolean, message: string, data: T | null = null, meta?: Meta) {
    this.success = success;
    this.message = message;
    this.data = data;
    if (meta) this.meta = meta;
  }

  static success<T>(data: T, message = 'Success', meta?: Meta): ApiResponse<T> {
    return new ApiResponse(true, message, data, meta);
  }

  static error(message: string): ApiResponse<null> {
    return new ApiResponse(false, message, null);
  }
}
