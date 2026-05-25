import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getHome } from '@/api/client';
import { getErrorMessage } from '@/utils/errors';
import AlbumRow from '@/components/AlbumRow';
import MediaViewer from '@/components/MediaViewer';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui';
import type { HomeAlbum, MediaFile } from '@/types';

export default function FrontPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [albums, setAlbums] = useState<HomeAlbum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerMedia, setViewerMedia] = useState<MediaFile | null>(null);
  const [viewerItems, setViewerItems] = useState<MediaFile[]>([]);
  const [viewerIndex, setViewerIndex] = useState(0);

  useEffect(() => {
    getHome()
      .then(data => setAlbums(data.albums))
      .catch(err => setError(getErrorMessage(err, 'Failed to load home')))
      .finally(() => setLoading(false));
  }, []);

  const handleMediaClick = (media: MediaFile, allMedia: MediaFile[]) => {
    const idx = allMedia.findIndex(m => m.id === media.id);
    setViewerMedia(media);
    setViewerItems(allMedia);
    setViewerIndex(idx >= 0 ? idx : 0);
  };

  const handleFavoriteToggle = (updated: MediaFile) => {
    setAlbums(prev => prev.map(album => ({
      ...album,
      media: album.media.map(m => m.id === updated.id ? updated : m),
    })));
    if (viewerMedia?.id === updated.id) setViewerMedia(updated);
  };

  const albumsWithMedia = albums.filter(a => a.media.length > 0);

  return (
    <>
      {error && (
        <div className="mb-4 p-3 rounded-lg text-sm" style={{ background: '#fee2e2', border: '1px solid #fecaca', color: '#dc2626' }}>
          {error}
        </div>
      )}
      {loading ? (
        <div className="text-center py-16" style={{ color: theme.text2 }}>Loading...</div>
      ) : albumsWithMedia.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold mb-2" style={{ color: theme.text }}>Welcome to Stashy</h2>
          <p className="mb-4" style={{ color: theme.text2 }}>
            No albums configured yet, or albums haven't been scanned.
          </p>
          <Button variant="primary" onClick={() => navigate('/settings')}>
            Add album
          </Button>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-extrabold tracking-tight" style={{ color: theme.text }}>
              Your Collection
            </h1>
            <p className="text-sm mt-0.5" style={{ color: theme.text2 }}>
              {albumsWithMedia.length} {albumsWithMedia.length === 1 ? 'album' : 'albums'} added
            </p>
          </div>
          {albumsWithMedia.map(album => (
            <AlbumRow
              key={album.id}
              album={album}
              onMediaClick={handleMediaClick}
              onFavoriteToggle={handleFavoriteToggle}
            />
          ))}
        </div>
      )}

      {viewerMedia && (
        <MediaViewer
          media={viewerMedia}
          items={viewerItems}
          currentIndex={viewerIndex}
          onClose={() => setViewerMedia(null)}
          onNavigate={(idx) => {
            setViewerIndex(idx);
            setViewerMedia(viewerItems[idx]);
          }}
          onFavoriteToggle={handleFavoriteToggle}
        />
      )}
    </>
  );
}
