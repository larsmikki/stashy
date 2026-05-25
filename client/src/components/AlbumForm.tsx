import { useState } from 'react';
import FileBrowser from '@/components/FileBrowser';
import { Button, Input } from '@/components/ui';

interface Props {
  initialName?: string;
  initialPath?: string;
  onSubmit: (name: string, path: string) => void;
  onCancel: () => void;
  submitLabel?: string;
}

export default function AlbumForm({ initialName = '', initialPath = '', onSubmit, onCancel, submitLabel = 'Create' }: Props) {
  const [name, setName] = useState(initialName);
  const [path, setPath] = useState(initialPath);
  const [showBrowser, setShowBrowser] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && path.trim()) {
      onSubmit(name.trim(), path.trim());
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-text2 mb-1">Album name</label>
          <Input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="My Photos"
            required
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider font-semibold text-text2 mb-1">Folder path</label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={path}
              onChange={e => setPath(e.target.value)}
              placeholder="/path/to/media"
              className="flex-1"
              required
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowBrowser(true)}
            >
              Browse
            </Button>
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!name.trim() || !path.trim()}
          >
            {submitLabel}
          </Button>
        </div>
      </form>

      <FileBrowser
        isOpen={showBrowser}
        onClose={() => setShowBrowser(false)}
        onSelect={(selectedPath) => {
          setPath(selectedPath);
          setShowBrowser(false);
        }}
        initialPath={path || undefined}
      />
    </>
  );
}
