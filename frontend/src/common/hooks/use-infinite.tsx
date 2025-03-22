import { useInfiniteQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { useInView } from "react-intersection-observer";

const useInfinite = ({
  fetcher,
  queryKey,
  filters,
  enabled = true,
}: {
  //eslint-disable-next-line
  fetcher: Function;
  //eslint-disable-next-line
  filters?: Record<string, any>;
  queryKey: string[];
  enabled?: boolean;
}) => {
  const { ref, inView } = useInView();
  const {
    data: d,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    status,
    //eslint-disable-next-line
  } = useInfiniteQuery<any>({
    queryKey: [...queryKey, ...(filters ? [filters] : [])],
    queryFn: async (props) => {
      const result = (
        await fetcher({ page: props.pageParam!.toString(), ...filters })
      )?.data;
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

  const data = useMemo(() => d?.pages.filter(Boolean).flat() ?? [], [d]);

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, hasNextPage]);

  return {
    ref,
    data,
    isLoading,
    status,
    hasNextPage,
    isFetchingNextPage,
  };
};

export default useInfinite;
