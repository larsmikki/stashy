import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { browsePath } from '@/api';
import { getErrorMessage } from '@/utils/errors';
import { Button, Modal } from '@/components/ui';
import { useTheme } from '@/contexts/ThemeContext';
import { queryKeys } from '@/queryKeys';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (path: string) => void;
  initialPath?: string;
}

export default function FileBrowser({ isOpen, onClose, onSelect, initialPath }: Props) {
  const { theme } = useTheme();
  const [selectedPath, setSelectedPath] = useState<string | undefined>();
  const browseTarget = selectedPath ?? initialPath;
  const { data: result = null, isFetching: loading, error } = useQuery({
    queryKey: queryKeys.browsePath(browseTarget),
    queryFn: () => browsePath(browseTarget),
    enabled: isOpen,
  });
  const errorMessage = error ? getErrorMessage(error, 'Failed to browse') : null;

  const loadPath = (path?: string) => {
    setSelectedPath(path);
  };

  if (!isOpen) return null;

  const handleClose = () => {
    setSelectedPath(undefined);
    onClose();
  };

  const currentPath = result?.currentPath || '';
  const isWindows = /^[A-Z]:\\/i.test(currentPath);
  const pathSegments = currentPath
    ? currentPath.split(/[\\/]/).filter(Boolean)
    : [];

  return (
    <Modal title="Select folder" onClose={handleClose} maxWidth={560}>
      <div className="max-h-[70vh] flex flex-col">
        {/* Breadcrumb */}
        <div
          className="px-4 py-2 border-b text-sm flex items-center gap-1 overflow-x-auto"
          style={{ background: theme.surface2, borderColor: theme.border }}
        >
          <button
            onClick={() => loadPath()}
            className="flex-shrink-0 font-medium transition-opacity hover:opacity-80"
            style={{ color: theme.accent }}
          >
            Root
          </button>
          {pathSegments.map((segment, idx) => {
            const parts = pathSegments.slice(0, idx + 1);
            const fullPath = isWindows
              ? parts.join('\\') + '\\'
              : '/' + parts.join('/');
            return (
              <span key={idx} className="flex items-center gap-1 flex-shrink-0">
                <span style={{ color: theme.text2 }}>/</span>
                <button
                  onClick={() => loadPath(fullPath)}
                  className="font-medium transition-opacity hover:opacity-80"
                  style={{ color: theme.accent }}
                >
                  {segment}
                </button>
              </span>
            );
          })}
        </div>

        {/* Directory list */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="p-8 text-center text-text2">Loading...</div>
          ) : errorMessage ? (
            <div className="p-4 text-sm text-danger">{errorMessage}</div>
          ) : result ? (
            <>
              {result.parent !== null && (
                <button
                  onClick={() => loadPath(result.parent!)}
                  className="w-full px-4 py-2 text-left flex items-center gap-2 border-b transition-opacity hover:opacity-80"
                  style={{ color: theme.text2, borderColor: theme.border }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  ..
                </button>
              )}
              {result.directories.length === 0 && (
                <div className="p-4 text-text2 text-sm text-center">No subdirectories</div>
              )}
              {result.directories.map(dir => (
                <button
                  key={dir.path}
                  onClick={() => loadPath(dir.path)}
                  className="w-full px-4 py-2 text-left flex items-center gap-2 border-b transition-opacity hover:opacity-80"
                  style={{ borderColor: theme.border }}
                >
                  <svg className="w-5 h-5 flex-shrink-0" style={{ color: theme.accent }} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  <span className="text-sm text-text truncate">{dir.name}</span>
                  {dir.hasChildren && (
                    <svg className="w-4 h-4 ml-auto flex-shrink-0" style={{ color: theme.text2 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              ))}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div
          className="px-4 py-3 border-t flex items-center justify-between gap-3"
          style={{ background: theme.surface2, borderColor: theme.border }}
        >
          <div className="text-xs text-text2 truncate max-w-[60%]">
            {result?.currentPath || 'Select a folder'}
          </div>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              size="sm"
              variant="primary"
              onClick={() => {
                if (!result?.currentPath) return;
                setSelectedPath(undefined);
                onSelect(result.currentPath);
              }}
              disabled={!result?.currentPath}
            >
              Select
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
