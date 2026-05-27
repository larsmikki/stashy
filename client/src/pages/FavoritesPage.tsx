import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import { getFavorites } from '@/api';
import MediaGrid from '@/components/MediaGrid';
import SkeletonGrid from '@/components/SkeletonGrid';
import MediaViewer from '@/components/MediaViewer';
import SortControls from '@/components/SortControls';
import SelectionBar from '@/components/SelectionBar';
import { useSelection } from '@/hooks/useSelection';
import { useToast } from '@/components/ui';
import { getErrorMessage } from '@/utils/errors';
import { queryKeys } from '@/queryKeys';
import type { MediaFile, PaginatedResponse } from '@/types';

const PAGE_SIZE = 100;

export default function FavoritesPage() {
  const { addToast } = useToast();
  const queryClient = useQueryClient();
  const [sort, setSort] = useState('date');
  const [order, setOrder] = useState('desc');
  const [viewerMedia, setViewerMedia] = useState<MediaFile | null>(null);
  const [viewerIndex, setViewerIndex] = useState(0);
  const selection = useSelection();
  const queryKey = queryKeys.favorites(sort, order, PAGE_SIZE);
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => getFavorites({ sort, order, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
  });
  const items = useMemo(
    () => query.data?.pages.flatMap(page => page.items) ?? [],
    [query.data],
  );
  const total = query.data?.pages[0]?.total ?? 0;
  const loading = query.isLoading || query.isFetchingNextPage;
  const hasMore = query.hasNextPage;

  useEffect(() => {
    if (query.error) {
      addToast(getErrorMessage(query.error, 'Failed to load favorites'), 'error');
    }
  }, [addToast, query.error]);

  const loadMore = useCallback(async () => {
    if (!query.hasNextPage || query.isFetchingNextPage) return;
    await query.fetchNextPage();
  }, [query]);

  const handleMediaClick = (_media: MediaFile, index: number) => {
    setViewerIndex(index);
    setViewerMedia(items[index]);
  };

  const handleFavoriteToggle = (updated: MediaFile) => {
    queryClient.setQueryData<InfiniteData<PaginatedResponse<MediaFile>, number>>(queryKey, (current) => {
      if (!current) return current;
      return {
        ...current,
        pages: current.pages.map(page => ({
          ...page,
          total: updated.is_favorite ? page.total : Math.max(0, page.total - 1),
          items: updated.is_favorite
            ? page.items.map(item => item.id === updated.id ? updated : item)
            : page.items.filter(item => item.id !== updated.id),
        })),
      };
    });
    if (!updated.is_favorite && viewerMedia?.id === updated.id) setViewerMedia(null);
    if (updated.is_favorite && viewerMedia?.id === updated.id) setViewerMedia(updated);
  };

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-extrabold tracking-tight text-text">Favorites</h1>
          {!loading && <span className="text-sm text-text2">{total} items</span>}
        </div>
        <SortControls sort={sort} order={order} onSortChange={setSort} onOrderChange={setOrder} />
      </div>

      {loading && items.length === 0 ? (
        <SkeletonGrid count={24} />
      ) : (
        <MediaGrid
          items={items}
          onMediaClick={handleMediaClick}
          onFavoriteToggle={handleFavoriteToggle}
          emptyMessage="No favorites yet. Click ★ on any image or video to add it."
          selection={selection}
          onEndReached={hasMore ? loadMore : undefined}
          loadingMore={loading && items.length > 0}
        />
      )}

      {viewerMedia && (
        <MediaViewer
          media={viewerMedia}
          items={items}
          currentIndex={viewerIndex}
          onClose={() => setViewerMedia(null)}
          onNavigate={(idx) => {
            setViewerIndex(idx);
            setViewerMedia(items[idx]);
          }}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}

      <SelectionBar ids={selection.ids} items={items} onClear={selection.clear} onMutate={handleFavoriteToggle} />
    </>
  );
}
