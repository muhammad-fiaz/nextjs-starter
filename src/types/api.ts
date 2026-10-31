export interface ApiResponse<T = unknown> {
  readonly success: boolean;
  readonly data?: T;
  readonly error?: ApiErrorResponse;
  readonly meta?: ApiPaginationMeta;
}

export interface ApiErrorResponse {
  readonly code: string;
  readonly message: string;
  readonly details?: unknown;
}

export interface ApiPaginationMeta {
  readonly page: number;
  readonly limit: number;
  readonly totalItems: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

export interface ApiPaginationParams {
  readonly page?: number;
  readonly limit?: number;
  readonly sort?: string;
  readonly order?: "asc" | "desc";
  readonly search?: string;
}
