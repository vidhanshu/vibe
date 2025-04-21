import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo } from "react";

const useInfinite = ({
  fetcher,
  queryKey,
  filters,
  enabled = true,
}: {
  fetcher: Function;
  filters?: Record<string, any>;
  queryKey: string[];
  enabled?: boolean;
}) => {
  const {
    data: d,
    isFetching,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    status,
    isRefetching,
    refetch,
  } = useInfiniteQuery<any>({
    queryKey: [...queryKey, ...(filters ? [filters] : [])],
    queryFn: async ({ pageParam = 1 }: any) => {
      const result = (await fetcher({ page: pageParam.toString(), ...filters }))
        ?.data;
      return result?.items?.length === 0 ? undefined : result;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages, currentPage) => {
      return lastPage?.metadata?.totalPages > (currentPage as number)
        ? (currentPage as number) + 1
        : undefined;
    },
    enabled,
  });

  const data = useMemo(() => d?.pages?.map((p) => p.items).flat() ?? [], [d]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return {
    data,
    isLoading,
    isFetching,
    status,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage: loadMore,
    refetch,
    isRefetching,
  };
};

export default useInfinite;
