export interface ApiPaginationParams {
  readonly page?: number;
  readonly limit?: number;
  readonly sort?: string;
  readonly order?: "asc" | "desc";
  readonly search?: string;
}
