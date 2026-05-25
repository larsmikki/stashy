import { useState } from 'react';
import { bulkFavorite, bulkDownloadUrl } from '@/api/client';
import { getErrorMessage } from '@/utils/errors';
import { useToast, Button, Surface } from '@/components/ui';
import type { MediaFile } from '@/types';

interface Props {
  ids: Set<number>;
  items: MediaFile[];
  onClear: () => void;
  onMutate?: (updated: MediaFile) => void;
}

export default function SelectionBar({ ids, items, onClear, onMutate }: Props) {
  const { addToast } = useToast();
  const [busy, setBusy] = useState(false);

  if (!ids.size) return null;

  const idArray = Array.from(ids);

  const setFavoriteAll = async (favorite: boolean) => {
    if (busy) return;
    setBusy(true);
    try {
      await bulkFavorite(idArray, favorite);
      if (onMutate) {
        for (const item of items) {
          if (ids.has(item.id)) onMutate({ ...item, is_favorite: favorite ? 1 : 0 });
        }
      }
      addToast(`${favorite ? 'Favorited' : 'Unfavorited'} ${idArray.length} item${idArray.length === 1 ? '' : 's'}`, 'success');
      onClear();
    } catch (err) {
      addToast(getErrorMessage(err, 'Bulk update failed'), 'error');
    } finally {
      setBusy(false);
    }
  };

  const download = () => {
    window.location.href = bulkDownloadUrl(idArray);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
      <Surface className="flex items-center gap-2 p-2">
        <span className="text-sm font-medium pr-2 text-text">
          {ids.size} selected
        </span>
        <Button size="sm" variant="secondary" disabled={busy} onClick={() => setFavoriteAll(true)}>★ Favorite</Button>
        <Button size="sm" variant="secondary" disabled={busy} onClick={() => setFavoriteAll(false)}>Unfavorite</Button>
        <Button size="sm" variant="secondary" disabled={busy} onClick={download}>Download zip</Button>
        <Button size="sm" variant="ghost" onClick={onClear}>Cancel</Button>
      </Surface>
    </div>
  );
}