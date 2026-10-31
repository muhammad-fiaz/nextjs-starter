import type {
  InfiniteData,
  QueryKey,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

export type BaseQueryOptions<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
> = Omit<UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>, "queryKey" | "queryFn">;

export type BaseMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown,
> = UseMutationOptions<TData, TError, TVariables, TContext>;

export interface PaginatedQueryData<TItem = unknown> {
  readonly items: readonly TItem[];
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly hasMore: boolean;
}

export type InfiniteQueryData<TItem = unknown> = InfiniteData<PaginatedQueryData<TItem>>;

export type QueryKeyFactory<TRoot extends string> = {
  readonly all: readonly [TRoot];
  readonly lists: () => readonly [TRoot, "list"];
  readonly list: (params?: unknown) => readonly [TRoot, "list", unknown];
  readonly details: () => readonly [TRoot, "detail"];
  readonly detail: (id: string | number) => readonly [TRoot, "detail", string | number];
};
