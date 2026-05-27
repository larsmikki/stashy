import { useCallback, useMemo } from 'react';
import { useInfiniteQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { getMedia } from '@/api';
import { getErrorMessage } from '@/utils/errors';
import { queryKeys } from '@/queryKeys';
import type { MediaFile, PaginatedResponse } from '@/types';

interface UseMediaOptions {
  albumId: number;
  sort: string;
  order: string;
  limit?: number;
}

// Infinite-scroll-friendly media loader. Items accumulate across page fetches;
// the list resets whenever the query key (album/sort/order/limit) changes.
export function useMedia({ albumId, sort, order, limit = 100 }: UseMediaOptions) {
  const queryClient = useQueryClient();
  const queryKey = queryKeys.media(albumId, sort, order, limit);
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => getMedia(albumId, { sort, order, page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });

  const items = useMemo(
    () => query.data?.pages.flatMap(page => page.items) ?? [],
    [query.data],
  );
  const firstPage = query.data?.pages[0];
  const total = firstPage?.total ?? 0;
  const hasMore = query.hasNextPage;

  const loadMore = useCallback(async () => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;
    await query.fetchNextPage();
  }, [query]);

  const mutate = useCallback((updated: MediaFile) => {
    queryClient.setQueryData<InfiniteData<PaginatedResponse<MediaFile>, number>>(queryKey, (current) => {
      if (!current) return current;
      return {
        ...current,
        pages: current.pages.map(page => ({
          ...page,
          items: page.items.map(item => item.id === updated.id ? updated : item),
        })),
      };
    });
  }, [queryClient, queryKey]);

  const remove = useCallback((id: number) => {
    queryClient.setQueryData<InfiniteData<PaginatedResponse<MediaFile>, number>>(queryKey, (current) => {
      if (!current) return current;
      return {
        ...current,
        pages: current.pages.map(page => ({
          ...page,
          total: Math.max(0, page.total - 1),
          items: page.items.filter(item => item.id !== id),
        })),
      };
    });
  }, [queryClient, queryKey]);

  return {
    items,
    total,
    hasMore,
    loading: query.isLoading || query.isFetchingNextPage,
    error: query.error ? getErrorMessage(query.error, 'Failed to load media') : null,
    loadMore,
    mutate,
    remove,
  };
}
