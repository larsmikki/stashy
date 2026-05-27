import { useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getAlbums } from '@/api';
import { getErrorMessage } from '@/utils/errors';
import { queryKeys } from '@/queryKeys';

export function useAlbums() {
  const queryClient = useQueryClient();
  const { data: albums = [], isLoading, error } = useQuery({
    queryKey: queryKeys.albums,
    queryFn: getAlbums,
  });

  const refresh = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.albums });
  }, [queryClient]);

  return {
    albums,
    loading: isLoading,
    error: error ? getErrorMessage(error, 'Failed to load albums') : null,
    refresh,
  };
}
